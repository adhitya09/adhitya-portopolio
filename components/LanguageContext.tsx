"use client"
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"

export type Language = "id" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (idText: string, enFallback?: string) => string
  translateDynamic: (text: string) => Promise<string>
  isTranslating: boolean
}

// Indonesian month mapping for instant date translation
const ID_MONTHS: Record<string, string> = {
  januari: "January",
  februari: "February",
  maret: "March",
  april: "April",
  mei: "May",
  juni: "June",
  juli: "July",
  agustus: "August",
  september: "September",
  oktober: "October",
  november: "November",
  desember: "December",
}

function translateIndonesianDates(text: string): string {
  if (!text || typeof text !== "string") return text
  let result = text
  for (const [idm, enm] of Object.entries(ID_MONTHS)) {
    const reg = new RegExp(`\\b${idm}\\b`, "gi")
    result = result.replace(reg, enm)
  }
  return result
}

const STATIC_MAP: Record<string, string> = {
  // Navigation & Header
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
  "Contact": "Contact",
  "Game": "Game",

  // Hero Section
  "Explore Work": "Explore Work",
  "Jelajahi Karya": "Explore Work",
  "Download CV": "Download CV",
  "Download ATS CV": "Download ATS CV",
  "Unduh CV": "Download CV",
  "Connect": "Connect",
  "Hubungkan": "Connect",
  "Hi, I'm": "Hi, I'm",
  "Halo, Saya": "Hi, I'm",
  "S.Kom. Graduate": "Bachelor of Computer Science (S.Kom.)",
  "S.Kom. Graduate ": "Bachelor of Computer Science (S.Kom.)",
  "Software Engineer": "Software Engineer",
  "Software Engineer ": "Software Engineer",
  "QA Analyst": "QA Analyst",
  "Business Intelligence": "Business Intelligence",
  "BPMN Engineer": "BPMN Engineer",
  "Full-Stack Web Developer": "Full-Stack Web Developer",
  "DevOps & Cloud Ready": "DevOps & Cloud Ready",
  "Fresh graduate Sistem Informasi Institut Teknologi Kalimantan (ITK) dengan spesialisasi Software Engineering, QA Automation, DevOps, dan Business Intelligence. Berpengalaman dalam merancang dan mengembangkan sistem web end-to-end yang tangguh, efisien, dan teruji.":
    "Fresh graduate in Information Systems from Kalimantan Institute of Technology (ITK) specializing in Software Engineering, QA Automation, DevOps, and Business Intelligence. Experienced in designing and developing robust, efficient, and well-tested end-to-end web systems.",

  // About Me Section
  "Discover": "Discover",
  "Temukan": "Discover",
  "About Me": "About Me",
  "Tentang Saya": "About Me",
  "Who Am I": "Who Am I",
  "Siapa Saya": "Who Am I",
  "Saya Sarjana Komputer (S.Kom.) dari program studi Sistem Informasi Institut Teknologi Kalimantan (ITK) dengan keahlian dalam Software Engineering, Backend Development, DevOps & Linux Server Management, Software QA (Maestro automation & regression testing), serta Business Intelligence. Berdedikasi membangun arsitektur sistem yang skalabel, aman, dan mudah dimaintain dari perancangan database hingga deployment produksi.":
    "I am a Bachelor of Computer Science (S.Kom.) graduate from Information Systems at Kalimantan Institute of Technology (ITK) with expertise in Software Engineering, Backend Development, DevOps & Linux Server Management, Software QA (Maestro automation & regression testing), and Business Intelligence. Dedicated to architecting scalable, secure, and maintainable systems from database design to production deployment.",
  "Personal Details": "Personal Details",
  "Detail Pribadi": "Personal Details",
  "Name": "Name",
  "Nama": "Name",
  "Location": "Location",
  "Lokasi": "Location",
  "Phone / WhatsApp": "Phone / WhatsApp",
  "Telepon / WhatsApp": "Phone / WhatsApp",
  "GPA": "GPA",
  "IPK": "GPA",
  "Email": "Email",
  "Balikpapan, Kalimantan Timur": "Balikpapan, East Kalimantan",
  "Balikpapan, Kalimantan Timur, Indonesia": "Balikpapan, East Kalimantan, Indonesia",
  "📍 Balikpapan Utara": "📍 North Balikpapan",
  "Kalimantan Timur, Indonesia": "East Kalimantan, Indonesia",
  "Sarjana Komputer (S.Kom.)": "Bachelor of Computer Science (S.Kom.)",
  "Sistem Informasi": "Information Systems",
  "Institut Teknologi Kalimantan (ITK)": "Kalimantan Institute of Technology (ITK)",

  // Experience Section
  "Career Path": "Career Path",
  "Jalur Karir": "Career Path",
  "Work Experience": "Work Experience",
  "Pengalaman Kerja": "Work Experience",
  "Junior Software Engineer (Intern)": "Junior Software Engineer (Intern)",
  "Software & System Development (Intern)": "Software & System Development (Intern)",
  "Web Developer (Intern)": "Web Developer (Intern)",
  "PT Javan Cipta Solusi": "PT Javan Cipta Solusi",
  "PT Pertamina Patra Niaga": "PT Pertamina Patra Niaga",
  "Telkom": "Telkom",
  "Januari 2025 - Februari 2025": "January 2025 - February 2025",
  "Jul 2026 - October 2026": "July 2026 - October 2026",
  "Berkontribusi dalam pengembangan dan deployment enterprise SaaS menggunakan framework AlurKerja. Mengelola server Linux, VPS provisioning, Docker, Docker Compose, SSL, reverse proxies, Micro Frontends (MFE), Keycloak, Camunda, dan BPMN process modeling. Melakukan pengujian Software QA: eksekusi test case, regression testing, retesting, dan otomatisasi UI menggunakan Maestro.":
    "Contributed to enterprise SaaS development and deployment using the AlurKerja framework. Managed Linux servers, VPS provisioning, Docker, Docker Compose, SSL, reverse proxies, Micro Frontends (MFE), Keycloak, Camunda, and BPMN process modeling. Conducted Software QA: test case execution, regression testing, retesting, and UI automation with Maestro.",
  "Berkontribusi dalam pengembangan SIMPRO (Sistem Informasi Manajemen Proyek) untuk sentralisasi dan pelacakan proyek operasional secara real-time. Terlibat dalam analisis kebutuhan pengguna, perancangan database relasional, arsitektur sistem, pengembangan web application berbasis Laravel, pengujian QA, dan penyusunan dokumentasi teknis sistem.":
    "Contributed to the development of SIMPRO (Project Management Information System) to centralize and track operational projects in real-time. Involved in user requirement analysis, relational database design, system architecture, Laravel web application development, QA testing, and technical documentation.",
  "melaksanan PKL secara daring dengan pihak telkom dengan project pelatihan pembuatan website berbasis laravel":
    "Completed online vocational internship with PT Telkom focusing on web application development with Laravel.",

  // Education Section
  "Academic Background": "Academic Background",
  "Riwayat Akademik": "Academic Background",
  "Education & Leadership": "Education & Leadership",
  "Pendidikan & Kepemimpinan": "Education & Leadership",
  "Sarjana Komputer (S.Kom.) - Sistem Informasi": "Bachelor of Computer Science (S.Kom.) - Information Systems",
  "Rekayasa Perangkat Lunak (RPL)": "Software Engineering",
  "SMK Negeri 6 Balikpapan": "SMK Negeri 6 Balikpapan",
  "Lulus dengan (IPK 3.61). Fokus studi pada Sistem Informasi": "Graduated with GPA 3.61. Focused studies on Information Systems.",
  "Pendidikan kejuruan fokus rekayasa perangkat lunak. Membangun fondasi kuat dalam logika algoritma, database relational, pemrograman berorientasi objek (OOP), dan web development.":
    "Vocational education focused on software engineering. Built strong foundations in algorithm logic, relational databases, object-oriented programming (OOP), and web development.",
  "Activities & Leadership:": "Activities & Leadership:",
  "Aktivitas & Kepemimpinan:": "Activities & Leadership:",
  "Panitia Divisi Acara ITK Open House (2023)": "Event Division Committee of ITK Open House (2023)",
  "Ketua Pelaksana EXSIS (2023)": "Chief Executive / Project Lead of EXSIS (2023)",
  "Staf Divisi Kesehatan Information System Care (ISC) ITK (2023)": "Health Division Staff of Information System Care (ISC) ITK (2023)",
  "Staff Divisi Acara INSPACE (2023)": "Event Division Staff of INSPACE (2023)",
  "Staff Divisi Perkamjin KPU HMSI (2023)": "Security & Equipment Staff of KPU HMSI (2023)",
  "Kepala Divisi Perkamjin KPU HMSI (2024)": "Head of Equipment, Security & Permits Division of KPU HMSI (2024)",
  "Staff Ahli Divisi Acara INSPACE (2024)": "Expert Event Division Staff of INSPACE (2024)",
  "Staff Badan Usaha Milik Himpunan (BUMH) Kabinet Synergia (2024)": "Student Enterprise (BUMH) Staff of Synergia Cabinet (2024)",
  "Kepala Badan Usaha Milik Himpunan (BUMH) Kabinet Istanava (2024–2025)": "Head of Student Enterprise (BUMH) of Istanava Cabinet (2024–2025)",
  "Peserta Presentator SEPAKAT (2026)": "Presenter Participant of SEPAKAT (2026)",
  "Pengembangan Proyek Perangkat Lunak Siswa": "Student Software Project Development",
  "Praktik Kerja Industri Rekayasa Perangkat Lunak": "Software Engineering Industrial Internship",
  "Ketua Cabang Olahraga Petanque": "President of Petanque Sports Club",

  // Organizations (CV)
  "ORGANIZATIONAL & COMMITTEE EXPERIENCE": "ORGANIZATIONAL & COMMITTEE EXPERIENCE",
  "KEPANITIAAN DAN ORGANISASI": "ORGANIZATIONAL & COMMITTEE EXPERIENCE",
  "Kepala Badan Usaha Milik Himpunan (BUMH)": "Head of Student Enterprise (BUMH)",
  "Himpunan Mahasiswa Sistem Informasi (HMSI) ITK - Kabinet Istanava": "Information Systems Student Association (HMSI) ITK - Istanava Cabinet",
  "Memimpin pengelolaan dan operasional kewirausahaan himpunan mahasiswa serta koordinasi program kerja strategis.":
    "Led entrepreneurship management and operations for the student association and coordinated strategic programs.",
  "Staff Ahli Divisi Acara": "Expert Event Division Staff",
  "INSPACE ITK": "INSPACE ITK",
  "Mengkoordinasikan konsep acara, timeline, dan pelaksanaan teknis festival teknologi informasi tahunan.":
    "Coordinated event concepts, timeline schedules, and technical execution of the annual IT festival.",
  "Kepala Divisi Perkamjin": "Head of Security, Equipment & Permits Division",
  "KPU Himpunan Mahasiswa Sistem Informasi (HMSI) ITK": "General Elections Commission of HMSI ITK",
  "Bertanggung jawab atas perlengkapan, keamanan, dan perizinan dalam pemilu raya himpunan mahasiswa.":
    "Responsible for logistics equipment, security, and permits during the student association general elections.",
  "Ketua Pelaksana EXSIS": "Chief Executive of EXSIS",
  "Program Studi Sistem Informasi ITK": "Information Systems Study Program ITK",
  "Memimpin kepanitiaan penyambutan dan pengenalan program studi sistem informasi bagi mahasiswa baru.":
    "Led the welcoming committee and study program orientation for incoming freshmen students.",
  "Panitia Divisi Acara": "Event Division Committee",
  "ITK Open House": "ITK Open House",
  "Menyusun rangkaian kegiatan pengenalan kampus dan koordinasi pemateri untuk peserta eksternal.":
    "Formulated campus open-house schedules and coordinated guest speakers for external attendees.",

  // Tech Stack Section
  "Skills & Tools": "Skills & Tools",
  "Keahlian & Alat": "Skills & Tools",
  "My Tech Stack": "My Tech Stack",
  "Tech Stack Saya": "My Tech Stack",
  "Backend & Frameworks": "Backend & Frameworks",
  "Frontend & UI": "Frontend & UI",
  "DevOps & Cloud": "DevOps & Cloud",
  "QA & Testing": "QA & Testing",
  "Database & BI": "Database & BI",
  "Robust server-side architecture, enterprise SaaS, and RESTful APIs.": "Robust server-side architecture, enterprise SaaS, and RESTful APIs.",
  "Modern frameworks for reactive and intuitive user interfaces.": "Modern frameworks for reactive and intuitive user interfaces.",
  "Containerization, automated deployments, and server administration.": "Containerization, automated deployments, and server administration.",
  "Comprehensive automated testing, regression suites, and QA workflows.": "Comprehensive automated testing, regression suites, and QA workflows.",
  "Relational data modeling, query optimization, and analytics pipelines.": "Relational data modeling, query optimization, and analytics pipelines.",

  // Projects Section
  "Portfolio": "Portfolio",
  "Portofolio": "Portfolio",
  "Selected Works": "Selected Works",
  "Karya Pilihan": "Selected Works",
  "SIMPRO - Sistem Informasi Manajemen Proyek": "SIMPRO - Project Management Information System",
  "Aplikasi web enterprise untuk manajemen dan pemantauan proyek internal Pertamina Patra Niaga secara terpusat, real-time, dan terintegrasi.":
    "Enterprise web application for centralized, real-time, and integrated project tracking and management at Pertamina Patra Niaga.",
  "Enterprise SaaS AlurKerja Platform": "Enterprise SaaS AlurKerja Platform",
  "Platform enterprise SaaS berbasis BPMN workflow, Keycloak SSO, Camunda Engine, dan Micro Frontends dengan otomatisasi pengujian Maestro.":
    "Enterprise SaaS platform powered by BPMN workflows, Keycloak SSO, Camunda Engine, and Micro Frontends with Maestro QA automation.",
  "Automated QA Testing Suite - Maestro": "Automated QA Testing Suite - Maestro",
  "Suite otomatisasi pengujian UI dan regresi end-to-end untuk aplikasi enterprise multi-platform menggunakan Maestro & YAML workflows.":
    "End-to-end UI & regression test automation suite for multi-platform enterprise applications using Maestro & YAML workflows.",
  "Enterprise / Private": "Enterprise / Private",
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
  "Close": "Close",
  "Tutup": "Close",
  "Selengkapnya": "View More",
  "View More": "View More",
  "Tampilkan Lebih Sedikit": "Show Less",
  "Show Less": "Show Less",
  "Show More": "Show More",
  "← Swipe horizontally to explore projects →": "← Swipe horizontally to explore projects →",
  "← Geser ke samping untuk melihat proyek lainnya →": "← Swipe horizontally to explore projects →",

  // Contact & Footer Section
  "Get In Touch": "Get In Touch",
  "Hubungi Saya": "Get In Touch",
  "Contact Me": "Contact Me",
  "Kontak Saya": "Contact Me",
  "All rights reserved.": "All rights reserved.",
  "Software Engineer | QA Analyst | Business Intelligence • ITK": "Software Engineer | QA Analyst | Business Intelligence • ITK",

  // CV Page
  "Kembali ke Portofolio": "Back to Portfolio",
  "Back to Portfolio": "Back to Portfolio",
  "Cetak / Simpan PDF (ATS Friendly)": "Print / Save PDF (ATS Friendly)",
  "Print / Save PDF (ATS Friendly)": "Print / Save PDF (ATS Friendly)",
  "PROFILE": "PROFILE",
  "PROFILE SAYA": "PROFILE",
  "EXPERIENCE": "EXPERIENCE",
  "EDUCATION": "EDUCATION",
  "SELECTED PROJECTS": "SELECTED PROJECTS",
  "PROJECT": "SELECTED PROJECTS",
  "SKILLS": "SKILLS",
  "Core Competencies:": "Core Competencies:",
  "Key Highlights:": "Key Highlights:",
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id")
  const [cache, setCache] = useState<Record<string, string>>({})
  const [isTranslating, setIsTranslating] = useState(false)

  const queueRef = useRef<Set<string>>(new Set())
  const inFlightRef = useRef<Set<string>>(new Set())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("adhitya_language") as Language
      if (saved === "id" || saved === "en") {
        setLanguageState(saved)
      }
      const savedCache = localStorage.getItem("adhitya_trans_cache")
      if (savedCache) {
        setCache(JSON.parse(savedCache))
      }
    } catch (e) {}
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem("adhitya_language", lang)
    } catch (e) {}
  }

  // Client-side fallback translation directly from browser if API route fails
  const clientTranslateSingle = async (text: string): Promise<string> => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|en`
      const res = await fetch(url)
      if (res.ok) {
        const json = await res.json()
        const trans = json?.responseData?.translatedText
        if (trans && typeof trans === "string" && !trans.includes("MYMEMORY WARNING")) {
          return trans.trim()
        }
      }
    } catch (e) {}
    return translateIndonesianDates(text)
  }

  // Batch process translation queue
  const processBatchQueue = useCallback(() => {
    if (queueRef.current.size === 0) return

    const textsToTranslate = Array.from(queueRef.current)
    queueRef.current.clear()

    textsToTranslate.forEach((t) => inFlightRef.current.add(t))
    setIsTranslating(true)

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, target: "en", source: "id" }),
    })
      .then((res) => res.json())
      .then(async (json) => {
        const next: Record<string, string> = {}
        for (let idx = 0; idx < textsToTranslate.length; idx++) {
          const orig = textsToTranslate[idx]
          let trans = json.success && Array.isArray(json.translations) ? json.translations[idx] : null

          // If server failed or returned identical untranslated text, try client fallback
          if (!trans || trans === orig) {
            trans = await clientTranslateSingle(orig)
          }

          if (trans) {
            next[orig] = trans
            next[orig.trim()] = trans
          }
        }

        setCache((prev) => {
          const merged = { ...prev, ...next }
          try {
            localStorage.setItem("adhitya_trans_cache", JSON.stringify(merged))
          } catch (e) {}
          return merged
        })
      })
      .catch(async () => {
        // Fallback for full network failure on /api/translate
        const next: Record<string, string> = {}
        for (const orig of textsToTranslate) {
          const trans = await clientTranslateSingle(orig)
          next[orig] = trans
          next[orig.trim()] = trans
        }
        setCache((prev) => {
          const merged = { ...prev, ...next }
          try {
            localStorage.setItem("adhitya_trans_cache", JSON.stringify(merged))
          } catch (e) {}
          return merged
        })
      })
      .finally(() => {
        textsToTranslate.forEach((t) => inFlightRef.current.delete(t))
        setIsTranslating(false)
      })
  }, [])

  // Auto request translation for missing dynamic strings
  const requestTranslation = useCallback(
    (text: string) => {
      if (!text || typeof text !== "string") return
      const trimmed = text.trim()

      if (
        trimmed.length < 2 ||
        STATIC_MAP[trimmed] ||
        STATIC_MAP[text] ||
        cache[trimmed] ||
        cache[text] ||
        queueRef.current.has(trimmed) ||
        inFlightRef.current.has(trimmed)
      ) {
        return
      }

      queueRef.current.add(trimmed)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(processBatchQueue, 60)
    },
    [cache, processBatchQueue]
  )

  // Reactive translator
  const t = useCallback(
    (text: string, enFallback?: string): string => {
      if (!text || typeof text !== "string") return text || ""
      if (language === "id") return text

      const trimmed = text.trim()

      if (enFallback) return enFallback
      if (STATIC_MAP[trimmed]) return STATIC_MAP[trimmed]
      if (STATIC_MAP[text]) return STATIC_MAP[text]
      if (cache[trimmed]) return cache[trimmed]
      if (cache[text]) return cache[text]

      // Quick date translation if it contains Indonesian month names
      const dateTrans = translateIndonesianDates(text)
      if (dateTrans !== text) {
        return dateTrans
      }

      // Queue automatic background translation for dynamic / CMS inputs
      requestTranslation(text)

      return text
    },
    [language, cache, requestTranslation]
  )

  // Asynchronous direct single-text translator
  const translateDynamic = useCallback(
    async (text: string): Promise<string> => {
      if (!text || language === "id") return text
      const trimmed = text.trim()
      if (STATIC_MAP[trimmed]) return STATIC_MAP[trimmed]
      if (cache[trimmed]) return cache[trimmed]

      const dateTrans = translateIndonesianDates(text)
      if (dateTrans !== text) return dateTrans

      try {
        setIsTranslating(true)
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: trimmed, target: "en", source: "id" }),
        })
        const json = await res.json()
        let trans = json.success && json.translation ? json.translation : null
        if (!trans || trans === trimmed) {
          trans = await clientTranslateSingle(trimmed)
        }
        if (trans) {
          setCache((prev) => {
            const next = { ...prev, [trimmed]: trans, [text]: trans }
            try {
              localStorage.setItem("adhitya_trans_cache", JSON.stringify(next))
            } catch (e) {}
            return next
          })
          return trans
        }
      } catch (err) {
        console.warn("Direct dynamic translation failed:", err)
      } finally {
        setIsTranslating(false)
      }
      return text
    },
    [language, cache]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateDynamic, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return ctx
}
