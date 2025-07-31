// Improved layout and visual gradient transitions for better UX
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animateScroll as scroll } from 'react-scroll';

const videos = [
  {
    title: 'Podcast: Mental Health & Productivity',
    type: 'Podcast',
    level: 'All Levels',
    duration: '45 min',
    views: '12K+',
    url: 'https://www.youtube.com/embed/Fm8elEvCsvQ'
  },
  {
    title: 'Webinar: AI and the Future',
    type: 'Webinar',
    level: 'Beginner',
    duration: '1 hour',
    views: '9K+',
    url: 'https://www.youtube.com/embed/HqN8baTsmrs'
  },
  {
    title: 'Berita: Tech World 2025',
    type: 'Berita',
    level: 'All Levels',
    duration: '15 min',
    views: '20K+',
    url: 'https://www.youtube.com/embed/ORdOBIAGpRg'
  },
  {
    title: 'Webinar: Startup Launch Guide',
    type: 'Webinar',
    level: 'Intermediate',
    duration: '90 min',
    views: '7K+',
    url: 'https://www.youtube.com/embed/Q4j7JkJK9EM'
  },
];

export default function PembelajaranPage() {
  const dropdownRef = useRef(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const dropdowns = {
    support: ['🗣️ Ruang Curhat', '🤝 Diskusi Komunitas'],
    learning: ['🎧 Podcast & Webinar', '📰 Berita'],
    tools: ['⭐ Kuis Bintang', '🤖 HelpBot', '🚨 Emergency Connect'],
    about: ['🎯 Visi & Misi', '📚 Penelitian', '👥 Tim'],
  };

  const isMenuOpen = (key) => hoveredMenu === key;

  const handleMenuToggle = (key) => setHoveredMenu(isMenuOpen(key) ? null : key);

  useEffect(() => {
    document.title = 'Pembelajaran | TitikRuang';
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <motion.header className="bg-white text-gray-900 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 relative">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo TitikRuang" width={40} height={40} />
            <div className="text-2xl font-bold whitespace-nowrap">TitikRuang</div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm relative z-50" ref={dropdownRef}>
            {Object.entries({ support: 'Pusat Dukungan Anonim', learning: 'Pusat Pembelajaran', tools: 'Alat Pendukung', about: 'Tentang Kami' }).map(([key, label]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setHoveredMenu(key);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setHoveredMenu(null), 200);
                  setHoverTimeout(timeout);
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#F25050] rounded-xl -z-10"></div>
                  <button
                    onClick={() => handleMenuToggle(key)}
                    className="text-white hover:text-[#F2BF27] transition-colors duration-300 px-2 py-1 rounded-xl"
                  >
                    {label}
                  </button>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={isMenuOpen(key) ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute left-0 bg-white text-black rounded-xl mt-2 py-2 px-4 shadow-lg min-w-max z-50 ${isMenuOpen(key) ? 'block' : 'hidden'}`}
                >
                  {dropdowns[key].map((item, i) => {
                    const isDiskusi = item.includes('Diskusi Kelompok');
                    const href = isDiskusi ? '/diskusi' : `/#${item.toLowerCase()}`;
                    return (
                      <Link key={i} href={href} className="block py-1 px-2 hover:bg-[#F2BF27]/20 hover:text-[#F2780C] rounded">
                        {item}
                      </Link>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </nav>
          <div className="hidden md:block">
            <button className="bg-[#F25050] text-white px-4 py-2 rounded-xl hover:bg-[#F2780C]">Masuk</button>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="text-black text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-500 to-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow">Siap Belajar, Mendengar & Bertumbuh?</h1>
        <p className="text-lg text-white/80 mb-6">Jelajahi podcast, ikuti webinar, dan tetap update dengan berita terbaru.</p>
        <button className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-md hover:scale-105 transition">Daftar Gratis →</button>
      </section>

      {/* Video Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
        {videos.map((vid, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-xl hover:scale-105 transition"
            whileHover={{ scale: 1.03 }}
          >
            <div className="aspect-video mb-4">
              <iframe
                src={vid.url}
                className="w-full h-full rounded-md"
                title={vid.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-sm text-blue-500 font-semibold mb-1">{vid.type}</div>
            <h3 className="text-lg font-bold text-black mb-2">{vid.title}</h3>
            <div className="text-xs text-gray-500 flex gap-4">
              <span>{vid.duration}</span>
              <span>{vid.level}</span>
              <span>{vid.views} penayangan</span>
            </div>
          </motion.div>
        ))}
      </section>

{/* Fitur Layanan */}
<section className="bg-white py-14 px-6">
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
    Belajar Seru dengan <span className="text-blue-600">TitikRuang Super App</span>
  </h2>
  <div className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth snap-x snap-mandatory">
    {[
      { title: 'ruangbelajar', desc: 'Video belajar adaptif dan latihan soal', color: 'from-pink-200 to-pink-100' },
      { title: 'Brain Academy Online', desc: 'Bimbel online interaktif dengan Live Teaching seru', color: 'from-yellow-200 to-yellow-100' },
      { title: 'English Academy', desc: 'Kursus Bahasa Inggris berkurikulum Cambridge', color: 'from-purple-200 to-purple-100' },
      { title: 'Roboguru', desc: 'Forum tanya jawab dan diskusi soal', color: 'from-indigo-200 to-indigo-100' },
      { title: 'Ruangguru Privat', desc: 'Les privat dengan tutor terbaik', color: 'from-green-200 to-green-100' },
    ].map((item, i) => (
      <div
        key={i}
        className={`min-w-[220px] snap-start bg-gradient-to-tr ${item.color} rounded-xl p-4 shadow-sm`}
      >
        <div className="h-10 w-10 rounded-full bg-white/40 flex items-center justify-center mb-3">📘</div>
        <h3 className="font-semibold text-md mb-1">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.desc}</p>
        <button className="mt-4 bg-white text-sm px-4 py-1 rounded-full font-medium text-blue-600 hover:bg-blue-100">
          Lihat Detail
        </button>
      </div>
    ))}
  </div>
</section>

{/* Artikel Terbaru */}
<section className="bg-white py-14 px-6">
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
    Artikel <span className="text-blue-600">Terbaru</span>
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
    {[
      {
        image: '/univ-world.jpg',
        title: '100 Universitas Terbaik di Dunia Tahun 2025 versi THE WUR',
        date: 'July 24, 2025',
        time: '13 minutes read',
      },
      {
        image: '/univ-indonesia.webp',
        title: '25 Universitas Terbaik Indonesia Tahun 2025 versi THE WUR',
        date: '',
        time: '3 minutes read',
      },
    ].map((item, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-500 mt-2">
            {item.date && `${item.date} • `}{item.time}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* CTA Section */}
      <section className="bg-gradient-to-b from-white to-[#f3f4f6] text-center py-20">
        <h2 className="text-3xl font-bold text-black mb-4">Bergabunglah bersama ribuan pelajar, pendengar, dan agen perubahan</h2>
        <p className="text-md mb-6 text-gray-700">Dapatkan akses ke podcast, webinar, dan berita terbaru — semuanya dalam satu platform.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">Daftar Gratis →</button>
      </section>

      {/* Footer */}
      <footer className="text-white bg-gradient-to-r from-[#3061F2] via-[#27A4F2] to-[#F2780C] relative pt-0">
        <svg
          className="w-full h-20 md:h-28 block"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M0,64 C480,160 960,0 1440,96 L1440,0 L0,0 Z"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-white/30 pb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/logo.png"
                  alt="TitikRuang Logo"
                  width={40}
                  height={40}
                  className="transition duration-300 hover:drop-shadow-glow"
                />
                <h3 className="text-2xl font-bold">TitikRuang</h3>
              </div>
              <p className="text-sm">Didukung oleh Kemenkes RI. Aman, anonim, dan peduli pulih.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Tentang</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Visi & Misi</a></li>
                <li><a href="#" className="hover:underline">Penelitian</a></li>
                <li><a href="#" className="hover:underline">Tim</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Bantuan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Privasi</a></li>
                <li><a href="#" className="hover:underline">Laporkan Penyalahgunaan</a></li>
                <li><a href="#" className="hover:underline">Kontak</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Ikuti Kami</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" aria-label="Website">🌐</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-white/90">
              <span>📧 help@titikruang.id</span>
              <span>📞 021-0000-0000</span>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
              <span>Dibina oleh</span>
              <img src="/kemenkes-logo.png" alt="Kemenkes" className="h-6" />
            </div>
          </div>
        </div>

        <button
          onClick={() => scroll.scrollToTop()}
          className="fixed bottom-5 right-5 bg-[#F2780C] text-white p-3 rounded-full shadow-lg hover:bg-[#F25050] z-50"
          aria-label="Back to Top"
        >
          ⬆️
        </button>
      </footer>
    </main>
  );
}
