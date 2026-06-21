import midtransClient from 'midtrans-client'

/**
 * Midtrans Payment Configuration
 * Handles payment gateway integration for booking payments
 */

// Midtrans configuration
const midtransConfig = {
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-...', // Sandbox server key
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-...' // Sandbox client key
}

// Create Snap API instance for frontend integration
export const snap = new midtransClient.Snap({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey
})

// Create Core API instance for backend operations
export const core = new midtransClient.CoreApi({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey
})

// Payment configuration
export const paymentConfig = {
  currency: 'IDR',
  paymentType: 'full_payment',
  expiry: {
    duration: 24, // 24 hours
    unit: 'hours'
  }
}

// Helper function to create payment parameter
export function createPaymentParameter(orderId, amount, customerDetails, itemDetails) {
  return {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    customer_details: customerDetails,
    item_details: itemDetails,
    expiry: paymentConfig.expiry,
    callbacks: {
      // Arahkan ke route /payment (Midtrans otomatis menambah &order_id=...).
      // Status asli "lunas" tetap ditentukan webhook + dicek dari backend.
      finish: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment?status=success`,
      error: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment?status=error`,
      pending: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment?status=pending`
    }
  }
}

// Helper function to format customer details for Midtrans
export function formatCustomerDetails(bookingData) {
  return {
    first_name: bookingData.customerName.split(' ')[0],
    last_name: bookingData.customerName.split(' ').slice(1).join(' ') || '',
    email: bookingData.customerEmail,
    phone: bookingData.customerPhone,
    billing_address: {
      first_name: bookingData.customerName.split(' ')[0],
      last_name: bookingData.customerName.split(' ').slice(1).join(' ') || '',
      email: bookingData.customerEmail,
      phone: bookingData.customerPhone,
      address: 'Bodogol Farm',
      city: 'Sukabumi',
      postal_code: '43100',
      country_code: 'IDN'
    },
    shipping_address: {
      first_name: bookingData.customerName.split(' ')[0],
      last_name: bookingData.customerName.split(' ').slice(1).join(' ') || '',
      last_name: bookingData.customerName.split(' ').slice(1).join(' ') || '',
      email: bookingData.customerEmail,
      phone: bookingData.customerPhone,
      address: 'Kp. Kuta RT 03/RW 09, Desa Purwasari, Kec. Cicurug, Kab. Sukabumi',
      city: 'Sukabumi',
      postal_code: '43100',
      country_code: 'IDN'
    }
  }
}

// Helper function to format item details for Midtrans
export function formatItemDetails(program, participants) {
  return [
    {
      id: program._id,
      price: program.price,
      quantity: participants,
      name: program.title,
      category: 'Education Program',
      merchant_name: 'Bodogol Farm'
    }
  ]
}

export default {
  snap,
  core,
  paymentConfig,
  createPaymentParameter,
  formatCustomerDetails,
  formatItemDetails
}