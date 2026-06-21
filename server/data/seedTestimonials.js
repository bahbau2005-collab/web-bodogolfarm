import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Testimonial from '../models/Testimonial.js';

dotenv.config({ path: './.env' });

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Peternak Pemula',
    text: 'Program magang di Bodogol sangat membantu saya memahami bisnis peternakan domba dari nol. Sekarang saya punya ternak sendiri!',
    rating: 5,
    image: '/images/testimonials/peternak-pemula-pria.webp',
    isPublished: true,
  },
  {
    name: 'Ibu Siti',
    role: 'Guru Kelas 4 SD',
    text: 'Anak-anak sangat senang dengan program edukasi Bodogol. Mereka jadi tahu asal-usul makanan dan pentingnya pertanian.',
    rating: 5,
    image: '/images/testimonials/guru-wanita.webp',
    isPublished: true,
  },
  {
    name: 'Rudi Hermawan',
    role: 'Business Owner',
    text: 'Saya bawa tim untuk outing day di Bodogol. Selain seru, kami dapat pembelajaran berharga tentang sustainability.',
    rating: 5,
    image: '/images/testimonials/pengusaha-pria.webp',
    isPublished: true,
  },
];

const seedTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding testimonials');
    await Testimonial.deleteMany({});
    const created = await Testimonial.insertMany(testimonials);
    console.log(`✅ Seeded ${created.length} testimonials successfully`);
    process.exit();
  } catch (error) {
    console.error('❌ Seed testimonials failed:', error);
    process.exit(1);
  }
};

seedTestimonials();
