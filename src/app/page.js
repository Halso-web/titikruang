"use client";

import { motion, useAnimationControls } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import animationData from '../animations/hero-animation.json';
import { animateScroll as scroll } from 'react-scroll';
import Link from 'next/link';
import HelpBot from "../components/HelpBot";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaTiktok } from 'react-icons/fa';


function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dropdownRef = useRef(null);

  const { ref: heroRef, inView: inViewHero } = useInView({ threshold: 0.3 });
  const { ref: supportRef, inView: inViewSupport } = useInView({ threshold: 0.3 });
  const { ref: aboutRef, inView: inViewAbout } = useInView({ threshold: 0.3 });

  const dropdowns = {
    support: ['🗣️ Ruang Curhat', '🤝 Diskusi Komunitas'],
    learning: ['🎧 Podcast & Webinar', '📰 Berita'],
    tools: ['⭐ Kuis Bintang', '🤖 HelpBot', '🚨 Emergency Connect'],
    about: ['🎯 Visi & Misi', '📚 Penelitian', '👥 Tim'],
  };

  const handleMenuToggle = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const isMenuOpen = (key) => activeMenu === key || hoveredMenu === key;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    const handleScroll = () => setScrollY(window.scrollY);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="font-sans text-gray-800 scroll-smooth bg-white">
      {/* Header */}
      <motion.header
        className="bg-white text-gray-900 shadow sticky top-0 z-50"
        initial={{ y: 0 }}
        animate={{ y: scrollY > 100 ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 relative">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="TitikRuang Logo" width={40} height={40} />
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
                    const label = item.split(' ')[1].toLowerCase();
                    const isDiskusi = item.includes('Diskusi');
                    const isCurhat = item.includes('Ruang Curhat');
                    const isBelajar = item.includes('Podcast');
                    const isBerita = item.includes('Berita');
                    const isSimulasi  = item.includes('Kuis Bintang');
                    const href = isDiskusi ? '/groups' : isCurhat ? '/ruang' : isBelajar || isBerita ? '/pembelajaran' : isSimulasi ? '/simulasipinjaman' :`#${label}`;
                    return (
                      <a key={i} href={href} className="block py-1 px-2 hover:bg-[#F2BF27]/20 hover:text-[#F2780C] rounded">
                        {item}
                      </a>
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
        {mobileOpen && (
          <div className="md:hidden bg-white text-black px-4 pb-4 pt-2 space-y-2">
            {Object.entries({ support: 'Pusat Dukungan Anonim', learning: 'Pusat Pembelajaran', tools: 'Alat Pendukung', about: 'Tentang Kami' }).map(([key, label]) => (
              <details key={key} className="border rounded-md overflow-hidden">
                <summary className="px-3 py-2 cursor-pointer font-medium hover:bg-gray-100">{label}</summary>
                <div className="px-4 pb-2 pt-1 text-sm space-y-1">
                  {dropdowns[key].map((item, i) => {
                    const label = item.split(' ')[1].toLowerCase();
                    const isDiskusi = item.includes('Diskusi');
                    const isCurhat = item.includes('Ruang Curhat');
                    const isBelajar = item.includes('Podcast');
                    const isBerita = item.includes('Berita');
                    const href = isDiskusi ? '/diskusi' : isCurhat ? '/ruang' : isBelajar || isBerita ? '/pembelajaran' : `#${label}`;
                    return (
                      <a key={i} href={href} className="block hover:text-[#F2780C] text-black">
                        {item}
                      </a>
                    );
                  })}
                </div>
              </details>
            ))}
            <button className="w-full bg-[#F25050] text-white py-2 rounded-lg hover:bg-[#F2780C]">Masuk</button>
          </div>
        )}
      </motion.header>
 {/* Hero */}
<section
  ref={heroRef}
  id="hero"
  className="bg-[#3061F2] text-white py-20"
>
  <motion.div
    className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-4 items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: inViewHero ? 1 : 0 }}
    transition={{ duration: 0.8 }}
  >
    <div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Platform Aman & Anonim Untuk Pemulihan Psikososial
      </h1>
      <p className="text-lg mb-6">
        Berbagi cerita, akses edukasi, dan pulih bersama komunitas yang memahami."Dengar, Pulih, Bangkit"
      </p>
      <div className="flex gap-4">
        <a href="#support" className="bg-white text-[#3061F2] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100">
          Mulai Sekarang
        </a>
        <a href="#about" className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-[#3061F2]">
          Pelajari Lebih Lanjut
        </a>
      </div>
    </div>
    <Lottie animationData={animationData} loop className="w-full h-full max-w-[400px] mx-auto" />
  </motion.div>
</section>

{/* Hero → Support Gradient Transition */}
<div className="h-20 bg-gradient-to-b from-[#3061F2] to-white" />

 {/* Support Section with animated icons */}
      <section id="support" ref={supportRef} className="py-20 bg-white text-gray-900">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: inViewSupport ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-[#3061F2]">
            Pusat Layanan TitikRuang
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Ruang Curhat', desc: 'Curhat bebas dan anonim.', icon: '🗣️', href: '/ruang' },
              { title: 'Diskusi Komunitas', desc: 'Dukungan teman senasib.', icon: '🤝', href: '/groups' },
              { title: 'Podcast & Webinar', desc: 'Suara ahli dan sesi live.', icon: '🎧', href: '/pembelajaran' },
              { title: 'Berita', desc: 'Update hukum & regulasi.', icon: '📰', href: '/pembelajaran' },
              { title: 'Kuis Bintang', desc: 'Tes interaktif pemulihan.', icon: '⭐' },
              { title: 'HelpBot & Hotline', desc: 'Bantuan cepat & AI.', icon: '🚨' },
            ].map((f, i) => {
              const iconControls = useAnimationControls();
              const handleHoverStart = () => {
                if (f.icon === '🎧') iconControls.start({ rotate: 20 });
                else if (f.icon === '⭐') iconControls.start({ rotate: 360 });
                else if (f.icon === '🤝') iconControls.start({ scale: 1.2 });
                else iconControls.start({ scale: 1.1 });
              };
              const handleHoverEnd = () => iconControls.start({ rotate: 0, scale: 1 });

              const card = (
                <motion.div
                  key={i}
                  className="group bg-gradient-to-br from-[#F2F6FF] to-white p-6 rounded-xl border border-[#3061F2]/20 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                >
                  <motion.span
                    className="text-4xl mb-3 block"
                    animate={iconControls}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    {f.icon}
                  </motion.span>
                  <h3 className="text-xl font-bold mb-2 text-[#F25050]">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </motion.div>
              );
              return f.href ? (
                <Link href={f.href} key={i} className="block">
                  {card}
                </Link>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
        </motion.div>
      </section>

{/* Support → About Gradient Transition */}
<div className="h-20 bg-gradient-to-b from-white to-[#F2BF27]" />

{/* About */}
<section id="about" ref={aboutRef} className="bg-gradient-to-b from-[#F2BF27] via-[#F28907] to-white py-20 -mt-4">
  <motion.div
    className="max-w-5xl mx-auto px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: inViewAbout ? 1 : 0 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-3xl font-bold text-center mb-10 text-white drop-shadow-md">
      Cerita dari Pengguna
    </h2>
    <div className="space-y-6">
      {[
        "Saya merasa tidak sendirian setelah berbagi di TitikRuang.",
        "Kuis bintangnya membantu saya mengenali diri sendiri.",
        "Podcast-nya informatif dan menenangkan.",
      ].map((text, i) => (
        <motion.div
          key={i}
          className="p-6 border border-[#F2BF27] rounded-xl shadow hover:shadow-md bg-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-[#F2BF27] rounded-full"></div>
            <span className="text-sm text-gray-500">Anonim</span>
          </div>
          <p className="text-gray-700 italic">"{text}"</p>
          <div className="flex gap-3 mt-4 text-[#F2780C] text-sm">
            <span>👍</span><span>❤️</span><span>🙌</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
</section>

      {/* Footer */}
      <footer className="text-white bg-gradient-to-r from-[#3061F2] via-[#27A4F2] to-[#F2780C] relative pt-0">
        <svg className="w-full h-20 md:h-28 block" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        </svg>

        <div className="max-w-7xl mx-auto px-4 pb-6 text-white text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 border-b border-white/30 pb-4">
                
                {/* Kolom 1: Logo */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      src="/logo.png"
                      alt="TitikRuang Logo"
                      width={32}
                      height={32}
                      className="transition duration-300 hover:animate-glow"
                    />
                    <h3 className="text-xl font-bold">TitikRuang</h3>
                  </div>
                  <p>AMAN, PEDULI, DAN PULIH</p>
                </div>
        
                {/* Kolom 2: Tentang */}
                <div>
                  <h4 className="text-base font-semibold mb-2">Tentang</h4>
                  <ul className="space-y-1">
                    <li><a href="/tentangkami" className="hover:underline">Visi & Misi</a></li>
                    <li><a href="/KuisBintang" className="hover:underline">Penelitian</a></li>
                    <li><a href="/tentangkami" className="hover:underline">Tim</a></li>
                  </ul>
                </div>
        
                {/* Kolom 3: Bantuan */}
                <div>
                  <h4 className="text-base font-semibold mb-2">Bantuan</h4>
                  <ul className="space-y-1">
                    <li><a href="#" className="hover:underline">Privasi</a></li>
                    <li><a href="#" className="hover:underline">Laporkan Penyalahgunaan</a></li>
                    <li><a href="/Kontakkami" className="hover:underline">Kontak</a></li>
                  </ul>
                </div>
        
                {/* Kolom 4: Hubungi Kami */}
                <div>
                  <h4 className="text-base font-semibold mb-2">Hubungi Kami</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FaEnvelope />
                      <a href="mailto:info@ruangguru.com" className="hover:underline">
                        titikruangofficial@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhoneAlt />
                      <a href="tel:000000000" className="hover:underline">
                        (021) 0000 0000
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaWhatsapp />
                      <a
                        href="https://wa.me/10000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        0815 7441 0000
                      </a>
                    </div>
                  </div>
                </div>
        
                {/* Kolom 5: Ikuti Kami */}
                <div>
                  <h4 className="text-base font-semibold mb-2">Ikuti Kami</h4>
                  <div className="flex gap-3 text-xl">
                    <a href="https://www.instagram.com/officialtitikruang" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="hover:text-pink-500" />
                    </a>
                    <a href="https://www.facebook.com/akunmu" target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="hover:text-blue-600" />
                    </a>
                    <a href="https://twitter.com/akunmu" target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="hover:text-blue-400" />
                    </a>
                    <a href="https://www.youtube.com/@akunmu" target="_blank" rel="noopener noreferrer">
                      <FaYoutube className="hover:text-red-600" />
                    </a>
                    <a href="https://www.linkedin.com/in/akunmu" target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className="hover:text-blue-700" />
                    </a>
                    <a href="https://www.tiktok.com/@akunmu" target="_blank" rel="noopener noreferrer">
                      <FaTiktok className="hover:text-gray-100" />
                    </a>
                  </div>
                </div>
              </div>
        
            {/* Bottom Section */}
            <div className="mt-1 flex flex-col sm:flex-row items-center justify-between text-sm">
              <div className="mt-1 sm:mt-0 flex items-center gap-2">
                <span>Dibina oleh</span>
                <img src="/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.webp"  className="h-10" />
                <img src="/LOGO UNAIR BIRU.png" className="h-10" />
                <img src="/logo Diktisaintek berdampak_horizontal Logo.png" className="h-10" />
                <img src="/Logo PKM - BG.png" className="h-10" />
                <img src="/LOGO Belmawa Bersinergi - Warna.png" className="h-20" />
                <img src="/LOGO fisip.jpg" className="h-10" />
                <img src="/LOGONEW_FTMM_forDarkBG-Colour (1).png" className="h-8" />
              </div>
            </div>
          </div>
        </footer>
       
       
             <button onClick={() => scroll.scrollToTop()} className="fixed bottom-20 right-6 z-[99] bg-[#F2780C] text-white p-3 rounded-full shadow-lg hover:bg-[#F25050] z-50" aria-label="Back to Top">
               ⬆️
             </button>
           </div>
         );
       }

export default LandingPage;
