import express from 'express'
import Booking from '../models/Booking.js'
import Program from '../models/Program.js'
import { snap, createPaymentParameter, formatCustomerDetails, formatItemDetails } from '../config/midtrans.js'
import { sendMail, buildBookingEmail } from '../utils/mailer.js'

const router = express.Router()

/**
 * @route POST /api/payments/create
 * @desc Create payment transaction for booking
 * @access Public
 */
router.post('/create', async (req, res) => {
  try {
    const { bookingId } = req.body

    // Find booking
    const booking = await Booking.findById(bookingId).populate('program')
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      })
    }

    // Check if payment already exists
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Booking already paid'
      })
    }

    // Calculate total amount
    const totalAmount = booking.program.price * booking.participants

    // Format customer details
    const customerDetails = formatCustomerDetails(booking)

    // Format item details
    const itemDetails = formatItemDetails(booking.program, booking.participants)

    // Create payment parameter
    const orderId = `BODOGOL-${booking._id}-${Date.now()}`
    const parameter = createPaymentParameter(orderId, totalAmount, customerDetails, itemDetails)

    // Create transaction with Midtrans
    let transaction;
    try {
      transaction = await snap.createTransaction(parameter)
    } catch (midtransError) {
      // Midtrans gagal (key salah / tidak ada internet) -> fallback mock untuk demo.
      // Error asli di-log agar mudah debug kalau sandbox seharusnya jalan.
      console.warn('[Midtrans] createTransaction gagal, pakai mock. Penyebab:', midtransError.message)
      transaction = {
        token: `mock-token-${Date.now()}`,
        redirect_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment?status=success&order_id=${orderId}`
      }
    }

    // Update booking with payment info
    booking.paymentOrderId = orderId
    booking.paymentToken = transaction.token
    booking.paymentUrl = transaction.redirect_url
    booking.paymentStatus = 'pending'
    await booking.save()

    // Kirim email konfirmasi booking + link pembayaran (non-blocking)
    sendMail({
      to: booking.customerEmail,
      subject: `Konfirmasi Booking ${booking.ticketCode} - Bodogol Farm`,
      html: buildBookingEmail(booking, { paid: false }),
    })

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        orderId: orderId,
        paymentToken: transaction.token,
        paymentUrl: transaction.redirect_url,
        totalAmount: totalAmount,
        customerDetails: customerDetails,
        itemDetails: itemDetails
      }
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create payment',
      details: error.message
    })
  }
})

/**
 * @route POST /api/payments/notification
 * @desc Handle Midtrans payment notification callback
 * @access Public (from Midtrans)
 */
router.post('/notification', async (req, res) => {
  try {
    const notification = req.body

    // Verify notification signature (recommended for production)
    // const isValid = verifyNotificationSignature(notification)

    const { order_id, transaction_status, fraud_status } = notification

    // Extract booking ID from order_id
    const bookingId = order_id.split('-')[1]

    // Find booking
    const booking = await Booking.findById(bookingId).populate('program')
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }
    const wasPaid = booking.paymentStatus === 'paid'

    // Update payment status based on transaction status
    let newStatus = 'pending'

    switch (transaction_status) {
      case 'capture':
        if (fraud_status === 'challenge') {
          newStatus = 'challenge'
        } else if (fraud_status === 'accept') {
          newStatus = 'paid'
        }
        break
      case 'settlement':
        newStatus = 'paid'
        break
      case 'deny':
        newStatus = 'failed'
        break
      case 'cancel':
      case 'expire':
        newStatus = 'cancelled'
        break
      case 'pending':
        newStatus = 'pending'
        break
      default:
        newStatus = 'unknown'
    }

    // Update booking
    booking.paymentStatus = newStatus
    booking.paymentNotification = notification
    if (newStatus === 'paid') booking.status = 'confirmed'
    booking.updatedAt = new Date()
    await booking.save()

    // Kirim e-ticket begitu pembayaran lunas (sekali saja)
    if (newStatus === 'paid' && !wasPaid) {
      sendMail({
        to: booking.customerEmail,
        subject: `E-Ticket ${booking.ticketCode} - Pembayaran Berhasil`,
        html: buildBookingEmail(booking, { paid: true }),
      })
    }

    res.status(200).json({ success: true })

  } catch (error) {
    console.error('Payment notification error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process payment notification'
    })
  }
})

/**
 * @route GET /api/payments/status/:bookingId
 * @desc Get payment status for a booking
 * @access Public
 */
router.get('/status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId).populate('program')
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      })
    }

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        ticketCode: booking.ticketCode,
        paymentStatus: booking.paymentStatus,
        paymentOrderId: booking.paymentOrderId,
        paymentUrl: booking.paymentUrl,
        totalAmount: booking.program.price * booking.participants,
        program: {
          title: booking.program.title,
          price: booking.program.price,
          duration: booking.program.duration
        },
        participants: booking.participants,
        adults: booking.adults,
        children: booking.children,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        bookingDate: booking.bookingDate
      }
    })

  } catch (error) {
    console.error('Payment status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status'
    })
  }
})

export default router