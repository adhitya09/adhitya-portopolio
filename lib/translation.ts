/**
 * Comprehensive dual-language translation engine for Adhitya Hermawan Portfolio
 * Supports automatic instant translation between Indonesian (ID) and English (EN)
 */

export const TRANSLATION_MAP: Record<string, string> = {
  // Navigation
  "Home": "Home",
  "Beranda": "Home",
  "About": "About",
  "Tentang": "About",
  "Experience": "Experience",
  "Pengalaman": "Experience",
  "Education": "Education",
  "Pendidikan": "Education",
  "Projects": "Projects",
  "Proyek": "Projects",
  "Contacts": "Contact",
  "Kontak": "Contact",

  // Hero Section
  "Hi, I'm": "Hi, I'm",
  "Halo, Saya": "Hi, I'm",
  "Explore Work": "Explore Work",
  "Jelajahi Karya": "Explore Work",
  "Download CV": "Download ATS CV",
  "Unduh CV": "Download ATS CV",
  "Connect": "Connect",
  "Hubungkan": "Connect",
  "Fresh graduate Sistem Informasi Institut Teknologi Kalimantan (ITK) dengan spesialisasi Software Engineering, QA Automation, DevOps, dan Business Intelligence. Berpengalaman dalam merancang dan mengembangkan sistem web end-to-end yang tangguh, efisien, dan teruji.":
    "Information Systems graduate from Kalimantan Institute of Technology (ITK) specializing in Software Engineering, QA Automation, DevOps, and Business Intelligence. Experienced in architecting and engineering robust, scalable, and production-tested end-to-end web systems.",
  
  // Hero Titles Typewriter
  "Software Engineer": "Software Engineer",
  "QA Analyst": "QA Analyst",
  "Backend Developer": "Backend Developer",
  "Business Intelligence": "Business Intelligence",

  // Hero Quick Stats Badges
  "S.Kom. Graduate (IPK 3.61)": "Bachelor of Comp. Science (GPA 3.61)",
  "Software Engineer & QA": "Software Engineer & QA Analyst",
  "DevOps & Cloud Ready": "DevOps & Cloud Infrastructure",

  // About Section
  "Discover": "Discover",
  "Temukan": "Discover",
  "About Me": "About Me",
  "Tentang Saya": "About Me",
  "Who Am I": "Who Am I",
  "Siapa Saya": "Who Am I",
  "Personal Details": "Personal Details",
  "Detail Pribadi": "Personal Details",
  "Saya Sarjana Komputer (S.Kom.) dari program studi Sistem Informasi Institut Teknologi Kalimantan (ITK) dengan keahlian dalam Software Engineering, Backend Development, DevOps & Linux Server Management, Software QA (Maestro automation & regression testing), serta Business Intelligence. Berdedikasi membangun arsitektur sistem yang skalabel, aman, dan mudah dimaintain dari perancangan database hingga deployment produksi.":
    "I hold a Bachelor of Computer Science (S.Kom.) in Information Systems from Kalimantan Institute of Technology (ITK) with expertise in Software Engineering, Backend Architecture, DevOps & Linux Server Administration, Software QA (Maestro automation & regression testing), and Business Intelligence. Dedicated to engineering scalable, secure, and maintainable systems from database design to production deployment.",
  
  // Personal Details
  "Name": "Name",
  "Nama": "Name",
  "Location": "Location",
  "Lokasi": "Location",
  "Phone / WhatsApp": "Phone / WhatsApp",
  "Telepon / WhatsApp": "Phone / WhatsApp",
  "GPA": "GPA",
  "IPK": "GPA",
  "Email": "Email",
  "Balikpapan, Kalimantan Timur": "Balikpapan, East Kalimantan, Indonesia",
  "Institut Teknologi Kalimantan (ITK)": "Kalimantan Institute of Technology (ITK)",
  "Software Engineer | QA Analyst | Business Intelligence": "Software Engineer | QA Analyst | Business Intelligence",
  "Adhitya Hermawan, S.Kom.": "Adhitya Hermawan, S.Kom.",

  // Experience Section
  "Career Path": "Career Path",
  "Jalur Karir": "Career Path",
  "Work Experience": "Work Experience",
  "Pengalaman Kerja": "Work Experience",
  "Jul 2026 - Present": "Jul 2026 - Present",
  "Jul 2026 - Sekarang": "Jul 2026 - Present",
  "2024 - Present": "2024 - Present",
  "2024 - Sekarang": "2024 - Present",
  "Berkontribusi dalam pengembangan dan deployment enterprise SaaS menggunakan framework AlurKerja. Mengelola server Linux, VPS provisioning, Docker, Docker Compose, SSL, reverse proxies, Micro Frontends (MFE), Keycloak, Camunda, dan BPMN process modeling. Melakukan pengujian Software QA: eksekusi test case, regression testing, retesting, dan otomatisasi UI menggunakan Maestro.":
    "Contributed to enterprise SaaS development and deployment utilizing the AlurKerja framework. Managed Linux servers, VPS provisioning, Docker, Docker Compose, SSL, reverse proxies, Micro Frontends (MFE), Keycloak IAM, Camunda, and BPMN process modeling. Conducted comprehensive Software QA: test case execution, regression testing, retesting, and automated UI testing with Maestro.",
  "Berkontribusi dalam pengembangan SIMPRO (Sistem Informasi Manajemen Proyek) untuk sentralisasi dan pelacakan proyek operasional secara real-time. Terlibat dalam analisis kebutuhan pengguna, perancangan database relasional, arsitektur sistem, pengembangan web application berbasis Laravel, pengujian QA, dan penyusunan dokumentasi teknis sistem.":
    "Engineered SIMPRO (Project Management Information System) to centralize and track operational project milestones in real time. Engaged in requirements engineering, relational database schema design, system architecture, Laravel web application development, QA testing, and technical documentation.",
  "Merancang dan membangun aplikasi bisnis berbasis web termasuk Dhian R POS (Point of Sale & Inventory Management menggunakan Laravel & Filament) serta sistem registrasi bimbingan belajar Tensai Edutor. Mengimplementasikan autentikasi multi-role, API RESTful, dan manajemen database teroptimasi.":
    "Architected and delivered custom web-based business solutions including Dhian R POS (Point of Sale & Inventory Management with Laravel & Filament) and Tensai Edutor course registration platform. Implemented multi-role RBAC authorization, RESTful APIs, and optimized query performance.",
  "Junior Software Engineer (Intern)": "Junior Software Engineer (Intern)",
  "Software & System Development Intern": "Software & System Development Intern",
  "Fullstack Web & Systems Developer": "Fullstack Web & Systems Developer",

  // Education Section
  "Academic Background": "Academic Background",
  "Riwayat Akademik": "Academic Background",
  "Education & Leadership": "Education & Leadership",
  "Pendidikan & Kepemimpinan": "Education & Leadership",
  "Sarjana Komputer (S.Kom.) - Sistem Informasi": "Bachelor of Computer Science (S.Kom.) - Information Systems",
  "Lulus dengan predikat sangat memuaskan (IPK 3.61). Fokus studi pada Rekayasa Perangkat Lunak, Manajemen Basis Data, Software Quality Assurance, DevOps, dan Business Intelligence.":
    "Graduated with high distinction (GPA 3.61/4.00). Core academic focus on Software Engineering, Relational & NoSQL Database Management, Software QA, DevOps, and Business Intelligence.",
  "Ketua Pelaksana EXSIS (Exhibition of Information System) 2023": "Chief Executive of EXSIS (Exhibition of Information System) 2023",
  "Kepala Badan Usaha Milik Himpunan (BUMH) Kabinet Istanava (2024–2025)": "Head of Commercial & Business Enterprise (BUMH) Istanava Cabinet (2024–2025)",
  "Staf Divisi Kesehatan Information System Care (ISC) ITK 2023": "Health Division Staff Information System Care (ISC) ITK 2023",
  "SMK Negeri 6 Balikpapan": "State Vocational High School 6 Balikpapan",
  "Rekayasa Perangkat Lunak (RPL)": "Software Engineering (RPL)",
  "Pendidikan kejuruan fokus rekayasa perangkat lunak. Membangun fondasi kuat dalam logika algoritma, database relational, pemrograman berorientasi objek (OOP), dan web development.":
    "Vocational technical education focusing on software engineering. Built a rigorous foundation in algorithms, relational databases, object-oriented programming (OOP), and full-stack web development.",
  "Pengembangan Proyek Perangkat Lunak Siswa": "Software Engineering Student Project Development",
  "Praktik Kerja Industri Rekayasa Perangkat Lunak": "Industry Apprenticeship in Software Development",
  "Aktivitas & Kepemimpinan:": "Activities & Leadership:",
  "Activities & Leadership:": "Activities & Leadership:",

  // Tech Stack Section
  "Skills & Tools": "Skills & Tools",
  "Keahlian & Alat": "Skills & Tools",
  "My Tech Stack": "My Tech Stack",
  "Tech Stack Saya": "My Tech Stack",
  "Backend & Frameworks": "Backend & Frameworks",
  "Robust server-side architecture, enterprise SaaS, and RESTful APIs.": "Robust server-side architecture, enterprise SaaS, and RESTful APIs.",
  "Arsitektur server yang tangguh, enterprise SaaS, dan API RESTful.": "Robust server-side architecture, enterprise SaaS, and RESTful APIs.",
  "Frontend & UI": "Frontend & UI",
  "Modern frameworks for reactive and intuitive user interfaces.": "Modern frameworks for reactive and intuitive user interfaces.",
  "Framework modern untuk antarmuka pengguna yang responsif dan intuitif.": "Modern frameworks for reactive and intuitive user interfaces.",
  "Databases & Business Intelligence": "Databases & Business Intelligence",
  "Relational database modeling, query optimization, and BI reporting.": "Relational database modeling, query optimization, and BI reporting.",
  "Pemodelan basis data relasional, optimasi kueri, dan pelaporan BI.": "Relational database modeling, query optimization, and BI reporting.",
  "DevOps, QA & Infrastructure": "DevOps, QA & Infrastructure",
  "Containerization, automated testing, server administration, and CI/CD.": "Containerization, automated testing, server administration, and CI/CD.",
  "Kontainerisasi, pengujian otomatis, administrasi server, dan CI/CD.": "Containerization, automated testing, server administration, and CI/CD.",

  // Projects Section
  "Portfolio": "Portfolio",
  "Portofolio": "Portfolio",
  "Selected Works": "Selected Works",
  "Karya Pilihan": "Selected Works",
  "Selengkapnya": "Show More",
  "Tampilkan Lebih Sedikit": "Show Less",
  "See All on GitHub": "See All on GitHub",
  "Lihat Semua di GitHub": "See All on GitHub",
  "View Details": "View Details",
  "Lihat Detail": "View Details",
  "Project Details": "Project Details",
  "Detail Proyek": "Project Details",
  "Source Code": "Source Code",
  "Kode Sumber": "Source Code",
  "Key Features": "Key Features",
  "Fitur Utama": "Key Features",
  "Created": "Created",
  "Dibuat": "Created",
  "Technologies": "Technologies",
  "Teknologi": "Technologies",
  "Enterprise / Private": "Enterprise / Private",

  // Projects Descriptions
  "Sistem Informasi Manajemen Proyek terintegrasi untuk PT Pertamina Patra Niaga guna tracking progress milestone, efisiensi alokasi anggaran, dan pelaporan proyek terpusat.":
    "Integrated Project Management Information System for PT Pertamina Patra Niaga to monitor milestone progress, streamline budget allocation, and centralize operational reporting in real time.",
  "Solusi Point of Sale (POS) dan manajemen inventaris berbasis web menggunakan Laravel & Filament untuk transaksi kasir cepat, stok otomatis, dan analitik penjualan komprehensif.":
    "Web-based Point of Sale (POS) and inventory control platform built with Laravel & Filament for rapid checkout, automated stock tracking, and in-depth sales analytics.",
  "Platform pendaftaran kursus dan tata kelola bimbingan belajar dengan landing page interaktif serta portal multi-role (Siswa, Pengajar, Administrator, dan Owner).":
    "Course enrollment and tutoring management portal featuring responsive landing pages and multi-role dashboards for Students, Tutors, Administrators, and Owners.",
  "Sistem kesehatan cerdas berbasis Computer Vision dan Deep Learning untuk skrining dini dan pemantauan gangguan neurologis gerakan (Parkinson's & analisa gait) menggunakan YOLO.":
    "Intelligent healthcare system leveraging Computer Vision and Deep Learning for early detection and tracking of neurological movement disorders (Parkinson's & gait analysis) using YOLO.",

  // Project Features
  "Real-time Milestone Tracking": "Real-time Milestone Tracking",
  "Gantt Chart & Progress Analytics": "Gantt Chart & Progress Analytics",
  "Role-based Access & Approval Flow": "Role-based Access & Approval Flow",
  "Interactive Budget & Resource Monitoring": "Interactive Budget & Resource Monitoring",
  "Real-time Stock & Low Level Alerts": "Real-time Stock & Low Level Alerts",
  "Fast POS Checkout & Barcode Scanning": "Fast POS Checkout & Barcode Scanning",
  "Comprehensive Financial & Sales Reporting": "Comprehensive Financial & Sales Reporting",
  "Multi-user Roles & Supplier Management": "Multi-user Roles & Supplier Management",
  "Automated Student Registration": "Automated Student Registration",
  "Interactive Class & Tutor Scheduling": "Interactive Class & Tutor Scheduling",
  "Role-based Management Dashboards": "Role-based Management Dashboards",
  "Integrated Payment & Enrollment Records": "Integrated Payment & Enrollment Records",
  "Real-time Skeleton & Pose Tracking": "Real-time Skeleton & Pose Tracking",
  "Biometric Gait Analysis & Diagnostics": "Biometric Gait Analysis & Diagnostics",
  "Neural Network Confidence Scoring": "Neural Network Confidence Scoring",
  "Interactive Medical Assessment Dashboard": "Interactive Medical Assessment Dashboard",

  // Contact & Maps
  "Get In Touch": "Get In Touch",
  "Hubungi Saya": "Get In Touch",
  "Contact Me": "Contact Me",
  "Kontak Saya": "Contact Me",
  "📍 Balikpapan Utara": "📍 North Balikpapan",
  "Kalimantan Timur, Indonesia": "East Kalimantan, Indonesia",

  // Footer
  "Developer": "Software Engineer | QA Analyst | Business Intelligence • ITK",
  "Software Engineer | QA Analyst | Business Intelligence • ITK": "Software Engineer | QA Analyst | Business Intelligence • ITK",
}

// In-memory dynamic translation cache populated at runtime
const DYNAMIC_MAP: Record<string, string> = {}

/**
 * Register dynamic translations into memory cache
 */
export function registerTranslations(pairs: Record<string, string>) {
  Object.assign(DYNAMIC_MAP, pairs)
}

/**
 * Synchronous dictionary translator
 */
export function translateText(text: string, lang: "id" | "en"): string {
  if (!text || typeof text !== "string") return text
  if (lang === "id") return text

  const trimmed = text.trim()

  // 1. Static curated dictionary
  if (TRANSLATION_MAP[trimmed]) return TRANSLATION_MAP[trimmed]

  // 2. In-memory dynamic map
  if (DYNAMIC_MAP[trimmed]) return DYNAMIC_MAP[trimmed]

  // 3. LocalStorage dynamic cache (browser environment)
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("adhitya_trans_cache")
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed[trimmed]) {
          DYNAMIC_MAP[trimmed] = parsed[trimmed]
          return parsed[trimmed]
        }
      }
    } catch (e) {}
  }

  return text
}

// Keys that should NEVER be translated (URLs, assets, tech identifiers, contacts)
const SKIP_KEYS = new Set([
  "id",
  "icon",
  "svg",
  "imagePath",
  "profileImage",
  "cvUrl",
  "href",
  "url",
  "phoneUrl",
  "embedUrl",
  "githubUrl",
  "liveDemoUrl",
  "email",
  "phone",
  "gpa",
  "backdropWord",
])

function isUrlOrIdentifier(val: string): boolean {
  if (!val || typeof val !== "string") return false
  const trimmed = val.trim()
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("+62") ||
    trimmed.startsWith("<svg")
  )
}

/**
 * Deep recursive translator that walks ANY object/array and translates all text properties automatically
 */
export function translateDeep(value: any, lang: "id" | "en"): any {
  if (lang === "id" || value === null || value === undefined) {
    return value
  }

  if (typeof value === "string") {
    if (isUrlOrIdentifier(value)) return value
    return translateText(value, lang)
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateDeep(item, lang))
  }

  if (typeof value === "object") {
    const result: Record<string, any> = {}
    for (const key of Object.keys(value)) {
      if (SKIP_KEYS.has(key)) {
        result[key] = value[key]
      } else {
        result[key] = translateDeep(value[key], lang)
      }
    }
    return result
  }

  return value
}

/**
 * Automatic deep portfolio translator
 */
export function translatePortfolioData(data: any, lang: "id" | "en"): any {
  if (!data || lang === "id") return data
  try {
    return translateDeep(data, lang)
  } catch (err) {
    console.error("Deep translation error:", err)
    return data
  }
}

/**
 * Background auto-translator for any untranslated text strings
 * Collects untranslated Indonesian strings, sends them in a single batch to /api/translate,
 * and caches the translations to localStorage.
 */
let isAutoTranslating = false
export async function autoTranslateUnknownTexts(data: any, onComplete?: () => void) {
  if (!data || typeof window === "undefined" || isAutoTranslating) return

  // Collect all strings that need translation
  const untranslatedSet = new Set<string>()

  function collectStrings(val: any, parentKey?: string) {
    if (val === null || val === undefined) return
    if (parentKey && SKIP_KEYS.has(parentKey)) return

    if (typeof val === "string") {
      const trimmed = val.trim()
      if (
        trimmed.length > 2 &&
        !isUrlOrIdentifier(trimmed) &&
        !TRANSLATION_MAP[trimmed] &&
        !DYNAMIC_MAP[trimmed]
      ) {
        untranslatedSet.add(trimmed)
      }
      return
    }

    if (Array.isArray(val)) {
      val.forEach((item) => collectStrings(item, parentKey))
      return
    }

    if (typeof val === "object") {
      for (const k of Object.keys(val)) {
        collectStrings(val[k], k)
      }
    }
  }

  collectStrings(data)

  const toTranslate = Array.from(untranslatedSet)
  if (toTranslate.length === 0) return

  try {
    isAutoTranslating = true
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: toTranslate, target: "en", source: "id" }),
    })
    const json = await res.json()
    if (json.success && Array.isArray(json.translations)) {
      const newCache: Record<string, string> = {}
      toTranslate.forEach((original, idx) => {
        const trans = json.translations[idx]
        if (trans && trans !== original) {
          newCache[original] = trans
          DYNAMIC_MAP[original] = trans
        }
      })

      try {
        const existing = JSON.parse(localStorage.getItem("adhitya_trans_cache") || "{}")
        const merged = { ...existing, ...newCache }
        localStorage.setItem("adhitya_trans_cache", JSON.stringify(merged))
      } catch (e) {}

      if (onComplete) {
        onComplete()
      }
    }
  } catch (err) {
    console.warn("Background auto-translation failed:", err)
  } finally {
    isAutoTranslating = false
  }
}
