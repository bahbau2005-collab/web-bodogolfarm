// Bodogol Farm Constants & Data

// 6 Pilar Manajemen
export const PILLARS = [
  {
    id: 1,
    title: "Manajemen Kandang Modern",
    description: "Kandang terkoleksi yang memisahkan kotoran dan urine. Kandang menjadi bersih, minim bau, ternak lebih sehat.",
    icon: "🏠",
  },
  {
    id: 2,
    title: "Manajemen Pakan Mandiri",
    description: "Bank Pakan hijauan yang dipanen secara rotasi dan teknik fermentasi pakan mandiri agar stok terjamin.",
    icon: "🌾",
  },
  {
    id: 3,
    title: "Manajemen Pengolahan Limbah",
    description: "Semua limbah diolah menjadi Vermicompost, POC (Pupuk Organik Cair), Kompos padat, hingga Biogas.",
    icon: "♻️",
  },
  {
    id: 4,
    title: "Manajemen Ternak",
    description: "SOP pemeliharaan ketat untuk menghasilkan domba dan kambing yang sehat dan berkualitas tinggi.",
    icon: "🐑",
  },
  {
    id: 5,
    title: "Integrasi Pertanian & Perkebunan",
    description: "Demplot pertanian yang menggunakan pupuk hasil olahan limbah ternak mereka sendiri.",
    icon: "🌱",
  },
  {
    id: 6,
    title: "Wisata Edukasi",
    description: "Peternakan ditata rapi untuk mendukung wisata edukasi agrokultur bagi semua kalangan.",
    icon: "📚",
  },
];

// Program/Kelas yang Ditawarkan
export const PROGRAMS = [
  {
    id: "prog_001",
    name: "Wisata Edukasi Anak PAUD",
    description: "Program khusus untuk anak PAUD (Pendidikan Anak Usia Dini) untuk mengenalkan dunia peternakan sejak dini.",
    duration: "3 jam",
    price: 150000,
    capacity: 20,
    targetAudience: ["PAUD"],
    activities: [
      "Berkunjung ke kandang",
      "Memberi makan domba",
      "Mengenal jenis-jenis domba",
      "Foto bersama",
    ],
    image: "/images/programs/paud.jpg",
    included: ["Snack", "Foto peserta", "Materi edukasi"],
  },
  {
    id: "prog_002",
    name: "Edukasi Sekolah (SD/SMP/SMA)",
    description: "Program edukasi komprehensif untuk siswa sekolah dari SD hingga SMA.",
    duration: "Setengah hari (4 jam)",
    price: 200000,
    capacity: 30,
    targetAudience: ["SD", "SMP", "SMA"],
    activities: [
      "Tour kandang modern",
      "Workshop olah limbah",
      "Pembelajaran langsung SOP peternakan",
      "Sesi tanya jawab",
    ],
    image: "/images/programs/sekolah.jpg",
    included: ["Snack", "Makan siang", "Materi edukasi", "Sertifikat"],
  },
  {
    id: "prog_003",
    name: "Paket Outing Days",
    description: "Paket wisata edukasi dan team building untuk grup/komunitas dengan aktivitas seru.",
    duration: "Full day (7-8 jam)",
    price: 350000,
    capacity: 50,
    targetAudience: ["Group", "Komunitas", "Corporate"],
    activities: [
      "Tour lengkap farm",
      "Workshop membuat pupuk organik",
      "Praktik memberi makan ternak",
      "Sesi sejarah & visi Bodogol",
      "Games edukatif",
      "River tubing (add-on)",
    ],
    image: "/images/programs/outing.jpg",
    included: ["Breakfast", "Makan siang", "Snack", "Materi edukasi"],
  },
  {
    id: "prog_004",
    name: "Program Magang/Training",
    description: "Program intensif untuk calon peternak yang ingin belajar manajemen peternakan profesional.",
    duration: "3 hari - 1 bulan (customizable)",
    price: 5000000,
    capacity: 10,
    targetAudience: ["Calon Peternak", "Profesional", "Entrepreneur"],
    activities: [
      "Hands-on training semua aspek peternakan",
      "Manajemen kandang modern",
      "Pakan dan nutrisi ternak",
      "Pengolahan limbah organik",
      "Business planning",
    ],
    image: "/images/programs/magang.jpg",
    included: ["Akomodasi", "Semua makan", "Materi training", "Sertifikat"],
  },
];

// Blog/Artikel Dummy
export const BLOG_ARTICLES = [
  {
    id: "art_001",
    title: "15 Detik Paham Olah Limbah Ternak",
    category: "Tips Ternak",
    excerpt: "Limbah ternak tidak harus dibuang, bisa diolah menjadi pupuk organik berkualitas...",
    content: "Konten lengkap artikel tentang pengolahan limbah ternak...",
    image: "/images/blog/limbah-ternak.jpg",
    author: "Ahkam",
    date: "2024-04-20",
    readTime: "5 min",
  },
  {
    id: "art_002",
    title: "Fase Kehidupan Saat Beternak Domba",
    category: "Storytelling",
    excerpt: "Perjalanan menjadi peternak domba modern dimulai dari nol menjadi profesional...",
    content: "Cerita inspiratif tentang journey peternak di Bodogol Farm...",
    image: "/images/blog/fase-kehidupan.jpg",
    author: "Ahkam",
    date: "2024-04-18",
    readTime: "8 min",
  },
  {
    id: "art_003",
    title: "Manajemen Kandang Modern: Tips Praktis",
    category: "Tips Ternak",
    excerpt: "Bagaimana membangun kandang yang higienis, efisien, dan menyenangkan untuk ternak...",
    content: "Panduan lengkap manajemen kandang modern...",
    image: "/images/blog/kandang-modern.jpg",
    author: "Ahkam",
    date: "2024-04-15",
    readTime: "6 min",
  },
];

// Testimonial
export const TESTIMONIALS = [
  {
    id: "testi_001",
    name: "Budi Santoso",
    role: "Peternak Pemula",
    text: "Program magang di Bodogol sangat membantu saya memahami bisnis peternakan domba dari nol. Sekarang saya punya ternak sendiri!",
    rating: 5,
    image: "/images/testimonials/budi.jpg",
  },
  {
    id: "testi_002",
    name: "Ibu Siti (Sekolah SD)",
    role: "Guru Kelas 4",
    text: "Anak-anak sangat senang dengan program edukasi Bodogol. Mereka jadi tahu asal-usul makanan dan pentingnya pertanian.",
    rating: 5,
    image: "/images/testimonials/siti.jpg",
  },
  {
    id: "testi_003",
    name: "Rudi Hermawan",
    role: "Business Owner",
    text: "Saya bawa tim untuk outing day di Bodogol. Selain seru, kami dapat pembelajaran berharga tentang sustainability.",
    rating: 5,
    image: "/images/testimonials/rudi.jpg",
  },
];

// Site Configuration
export const SITE_CONFIG = {
  name: "Bodogol Farm",
  tagline: "Kandang Tempat Kamu Belajar",
  description: "Peternakan Domba Modern Terintegrasi & Konsep Wisata Edukasi",
  hashtag: "#SELARASHIDUPDIKANDANG",
  
  // Lokasi
  location: {
    address: "Kp. Kuta RT 03/RW 09, Desa Purwasari, Kec. Cicurug, Kab. Sukabumi, Jawa Barat",
    phone: "0857-5961-6910",
    email: "contact@bodogolfarm.com",
    coords: { lat: -6.9497, lng: 106.9318 }, // Approximate
  },
  
  // Visi & Misi
  vision: "Menjadi pelopor peternakan yang inovatif, inspirasi yang terbuka dalam membangun ketahanan pangan nasional melalui sektor peternakan.",
  missions: [
    "Menjadi peternakan yang penuh dengan inovasi dalam menjawab tantangan dunia peternakan di tengah masyarakat.",
    "Menjadi inspirasi dalam bergerak membangun ketahanan pangan nasional melalui sektor peternakan.",
    "Terbuka dalam menebarkan ilmu serta pengalaman kepada seluruh masyarakat.",
    "Menjadi wadah kolaborasi para peternak Indonesia.",
  ],

  // Social Media
  socialMedia: {
    instagram: "https://www.instagram.com/bodogolfarm/",
    facebook: "https://facebook.com/bodogolfarm",
    youtube: "https://youtube.com/bodogolfarm",
  },

  // Company Info
  company: {
    name: "PT. Agrowisata Prima Bodogol Edu Farm",
    founder: "Nuur Muhammad Ahkam",
    established: 2018,
  },
};
