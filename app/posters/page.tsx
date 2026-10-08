"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const POSTERS = [
  {
    id: "simpro",
    title: "SIMPRO Enterprise",
    subtitle: "Sistem Informasi Manajemen Proyek",
    category: "Enterprise System",
    image: "/images/posters/simpro_poster.jpg",
    repo: "https://github.com/adhitya09/simpro",
    repoLabel: "github.com/adhitya09/simpro",
    tagline: "Platform sentralisasi pelacakan milestone operasional, alokasi anggaran, dan koordinasi proyek terintegrasi secara real-time.",
    features: [
      { name: "Real-time Milestone Tracking", desc: "Monitoring progress tiap fase dan deliverables proyek" },
      { name: "Gantt Chart & Interactive Timeline", desc: "Analitik jadwal, ketergantungan tugas, dan tenggat waktu" },
      { name: "Role-Based Access Control", desc: "Alur persetujuan berjenjang dan batasan hak akses tim" },
      { name: "Budget & Financial Monitoring", desc: "Pengawasan alokasi dan realisasi anggaran operasional" },
      { name: "Manajemen Dokumen & BAST", desc: "Pengarsipan digital terpusat untuk berita acara dan SPK" },
      { name: "Laporan Eksekutif & KPI", desc: "Visualisasi analitik data performa proyek secara akurat" },
    ],
    modules: ["Dashboard Utama", "Gantt Chart", "Manajemen Anggaran", "Dokumen Proyek", "Laporan Eksekutif"],
    audience: ["Project Manager", "Tim Operasional", "Manajemen & Stakeholder", "PT Pertamina Patra Niaga"],
    tech: ["Laravel", "PHP", "MySQL", "Tailwind CSS", "REST API", "Docker"],
  },
  {
    id: "pos",
    title: "Dhian R - Smart POS",
    subtitle: "Sistem Point of Sale & Manajemen Inventaris",
    category: "POS & Inventory",
    image: "/images/posters/pos_poster.jpg",
    repo: "https://github.com/adhitya09/pos-filament",
    repoLabel: "github.com/adhitya09/pos-filament",
    tagline: "Aplikasi kasir modern berbasis Laravel & Filament untuk transaksi cepat, kontrol stok otomatis, dan analitik penjualan akurat.",
    features: [
      { name: "Fast POS Checkout", desc: "Transaksi kasir kilat dengan dukungan barcode scanning" },
      { name: "Real-time Stock & Low Level Alerts", desc: "Peringatan otomatis saat stok barang mencapai batas minimum" },
      { name: "Filament Admin Dashboard", desc: "Panel kelola produk, varian, kategori, dan master data supplier" },
      { name: "Laporan Penjualan & Keuangan", desc: "Analitik omzet, laba kotor, dan rekapitulasi penjualan harian" },
      { name: "Multi-User & Role Management", desc: "Hak akses terpisah antara Kasir, Supervisor Gudang, dan Owner" },
      { name: "Cetak Struk & Faktur PDF", desc: "Dukungan thermal receipt printer dan faktur transaksi digital" },
    ],
    modules: ["Kasir / POS", "Katalog Produk", "Stok Masuk & Keluar", "Laporan Penjualan", "Pengaturan Toko"],
    audience: ["Toko Retail & Grosir", "Kasir & Staff Toko", "Owner & Manager", "UMKM & Warung"],
    tech: ["Laravel", "Filament", "PHP", "MySQL", "Tailwind CSS"],
  },
  {
    id: "tensai",
    title: "Tensai Edutor Platform",
    subtitle: "Platform Tata Kelola & Pendaftaran Bimbingan Belajar",
    category: "EdTech & Education",
    image: "/images/posters/tensai_poster.jpg",
    repo: "https://github.com/adhitya09/Tensai-Edutor",
    repoLabel: "github.com/adhitya09/Tensai-Edutor",
    tagline: "Sistem informasi manajemen bimbel terintegrasi untuk pendaftaran siswa otomatis, penjadwalan tutor, dan portal multi-role.",
    features: [
      { name: "Registrasi Siswa Mandiri & Online", desc: "Formulir pendaftaran kursus online dengan validasi data siswa" },
      { name: "Penjadwalan Kelas & Tutor Interaktif", desc: "Manajemen kalender ruang kelas, sesi belajar, dan tutor" },
      { name: "Portal Multi-Role Berjenjang", desc: "Dashboard mandiri untuk Siswa, Pengajar, Administrator, dan Owner" },
      { name: "Manajemen Pembayaran & Biaya Kursus", desc: "Pencatatan tagihan SPP bulanan dan riwayat pelunasan" },
      { name: "Monitoring Presensi & Evaluasi Belajar", desc: "Rekapitulasi kehadiran per sesi dan buku nilai kemajuan siswa" },
      { name: "Landing Page Informasi Program", desc: "Katalog paket belajar interaktif dan profil tenaga pengajar" },
    ],
    modules: ["Portal Siswa", "Jadwal Kursus", "Data Pengajar", "Pembayaran & Tagihan", "Laporan Akademik"],
    audience: ["Lembaga Bimbingan Belajar", "Kursus Privat & Bahasa", "Siswa & Orang Tua", "Tutor & Pengajar"],
    tech: ["Laravel", "PHP", "MySQL", "JavaScript", "Tailwind CSS"],
  },
  {
    id: "neuromotion",
    title: "NeuroMotion AI",
    subtitle: "Sistem Deteksi Gangguan Motorik & Analisis Gait AI",
    category: "AI & Healthcare",
    image: "/images/posters/neuromotion_poster.jpg",
    repo: "https://github.com/akhzaozy/neuronmotion",
    repoLabel: "github.com/akhzaozy/neuronmotion",
    tagline: "Solusi kesehatan cerdas berbasis Computer Vision & Deep Learning untuk skrining dini tremor, postur, dan gaya berjalan menggunakan YOLO.",
    features: [
      { name: "Real-time Pose & Skeleton Tracking", desc: "Deteksi 33 titik koordinat persendian tubuh secara instan" },
      { name: "Biometric Gait Pattern Diagnostics", desc: "Analisis parameter langkah kaki, simetri ritme, dan postur" },
      { name: "YOLO & Neural Network Confidence", desc: "Klasifikasi risiko tremor dan gejala awal sindrom Parkinson" },
      { name: "Video Assessment & Webcam Input", desc: "Pengujian fleksibel lewat unggah video rekaman maupun kamera langsung" },
      { name: "Interactive Medical Dashboard", desc: "Visualisasi kurva gelombang gerak (gait waves) dan skor klinis" },
      { name: "Ekspor Laporan Diagnostik Medis", desc: "Ringkasan analitik terstruktur untuk rujukan dokter spesialis" },
    ],
    modules: ["Pose Estimation", "Gait Analysis", "YOLO Detector", "Skor Risiko Medis", "Laporan Klinis"],
    audience: ["Fasilitas Kesehatan & Klinik", "Dokter Saraf & Spesialis", "Peneliti Medis & AI", "Terapis Rehabilitasi"],
    tech: ["Python", "OpenCV", "YOLO", "Deep Learning", "Computer Vision"],
  },
  {
    id: "warung",
    title: "Warung Mba Neng",
    subtitle: "Platform E-Commerce Jajanan Tradisional Nusantara",
    category: "E-Commerce & Food",
    image: "/images/posters/warung_poster.jpg",
    repo: "https://warung-mbaneng.netlify.app/",
    repoLabel: "warung-mbaneng.netlify.app",
    tagline: "Web app pemesanan aneka kue basah, kue kering, gorengan, dan makanan siap saji dengan integrasi keranjang belanja dan WhatsApp API.",
    features: [
      { name: "Live Product Search & Filter", desc: "Pencarian real-time berdasarkan kata kunci dan kategori jajanan" },
      { name: "Dynamic Menu Catalog", desc: "Katalog puluhan kue basah, kue kering, gorengan, dan makanan siap saji" },
      { name: "Interactive Cart System", desc: "Keranjang belanja dinamis dengan pengatur kuantitas dan subtotal live" },
      { name: "WhatsApp Direct Checkout", desc: "Pembuatan otomatis template invoice pesanan ke nomor penjual" },
      { name: "Modal Detail Produk & Preview", desc: "Pop-up foto resolusi tinggi, rincian harga, dan tombol pesan" },
      { name: "Dark & Light Mode Theme", desc: "Sistem tema visual ganda dengan deteksi otomatis preferensi perangkat" },
    ],
    modules: ["Katalog Menu", "Pencarian Real-Time", "Keranjang Belanja", "Checkout WhatsApp", "Peta Lokasi Gmaps"],
    audience: ["Pecinta Kuliner & Jajanan", "Pemesanan Acara & Hajatan", "Konsumen Rumah Tangga", "Warga Balikpapan"],
    tech: ["HTML5", "CSS3", "JavaScript ES6+", "Bootstrap 5", "FontAwesome", "LocalStorage"],
  },
]

export default function PostersPage() {
  const [selectedId, setSelectedId] = useState(POSTERS[0].id)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const activePoster = POSTERS.find((p) => p.id === selectedId) || POSTERS[0]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Top Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              &larr; Portfolio
            </Link>
            <span className="text-neutral-600">/</span>
            <h1 className="text-sm font-bold tracking-wider uppercase text-neutral-200">
              System Information Posters <span className="text-emerald-400 text-xs font-semibold">(Landscape 16:9)</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {POSTERS.map((poster) => (
              <button
                key={poster.id}
                onClick={() => setSelectedId(poster.id)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedId === poster.id
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
                }`}
              >
                {poster.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Poster Showcase Screen */}
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                {activePoster.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                {activePoster.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">{activePoster.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={activePoster.image}
                download
                className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2 rounded-xl border border-neutral-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Poster (Full HD)
              </a>
              <button
                onClick={() => setPreviewImage(activePoster.image)}
                className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Lihat Ukuran Penuh
              </button>
            </div>
          </div>

          {/* Landscape Poster Display */}
          <div
            onClick={() => setPreviewImage(activePoster.image)}
            className="group relative cursor-zoom-in rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video shadow-2xl flex items-center justify-center transition-all duration-300 hover:border-emerald-500/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePoster.image}
              alt={activePoster.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-neutral-950/80 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl border border-neutral-700 backdrop-blur-md">
                Klik untuk Memperbesar
              </span>
            </div>
          </div>
        </section>

        {/* Detailed Information & Technical Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Features & Modules */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-3">Ikhtisar & Nilai Sistem</h3>
              <p className="text-sm leading-relaxed text-neutral-300 font-medium bg-neutral-950/50 p-4 rounded-2xl border border-neutral-800/80">
                {activePoster.tagline}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mt-6 mb-4">
                Fitur Utama Sistem
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activePoster.features.map((feat, idx) => (
                  <div key={idx} className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 flex flex-col gap-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {feat.name}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium pl-4">{feat.desc}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mt-6 mb-3">
                Modul-Modul Inti
              </h4>
              <div className="flex flex-wrap gap-2">
                {activePoster.modules.map((mod, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold bg-neutral-800 text-neutral-200 px-3.5 py-1.5 rounded-lg border border-neutral-700"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Target Audience, Tech Stack, & Access */}
          <div className="space-y-8">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
                  Cocok Untuk (Pengguna Sasaran)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activePoster.audience.map((aud, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-emerald-950/40 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-800/40"
                    >
                      ✓ {aud}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
                  Teknologi yang Digunakan
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activePoster.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold bg-neutral-950 text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                  Akses Tautan / Kode Sumber
                </h4>
                <a
                  href={activePoster.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline break-all"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {activePoster.repoLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-6xl w-full flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white text-sm font-bold bg-neutral-800 px-4 py-1.5 rounded-full border border-neutral-700"
            >
              ✕ Tutup (ESC)
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Fullscreen Poster"
              className="max-h-[85vh] w-auto object-contain rounded-2xl border border-neutral-800 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
