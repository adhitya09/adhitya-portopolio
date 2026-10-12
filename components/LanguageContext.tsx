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

const STATIC_MAP: Record<string, string> = {
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
  "Contact": "Contact",

  // Hero
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

  // Sections
  "Discover": "Discover",
  "Temukan": "Discover",
  "About Me": "About Me",
  "Tentang Saya": "About Me",
  "Who Am I": "Who Am I",
  "Siapa Saya": "Who Am I",
  "Personal Details": "Personal Details",
  "Detail Pribadi": "Personal Details",
  "Career Path": "Career Path",
  "Jalur Karir": "Career Path",
  "Work Experience": "Work Experience",
  "Pengalaman Kerja": "Work Experience",
  "Academic Background": "Academic Background",
  "Riwayat Akademik": "Academic Background",
  "Education & Leadership": "Education & Leadership",
  "Pendidikan & Kepemimpinan": "Education & Leadership",
  "Skills & Tools": "Skills & Tools",
  "Keahlian & Alat": "Skills & Tools",
  "My Tech Stack": "My Tech Stack",
  "Tech Stack Saya": "My Tech Stack",
  "Portfolio": "Portfolio",
  "Portofolio": "Portfolio",
  "Selected Works": "Selected Works",
  "Karya Pilihan": "Selected Works",
  "Get In Touch": "Get In Touch",
  "Hubungi Saya": "Get In Touch",
  "Contact Me": "Contact Me",
  "Kontak Saya": "Contact Me",

  // Actions
  "Selengkapnya": "View More",
  "View More": "View More",
  "Show More": "Show More",
  "Show Less": "Show Less",
  "Tampilkan Lebih Sedikit": "Show Less",
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

  // Details
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
  "Activities & Leadership:": "Activities & Leadership:",
  "Aktivitas & Kepemimpinan:": "Activities & Leadership:",
  "Activities & Leadership": "Activities & Leadership",
  "Aktivitas & Kepemimpinan": "Activities & Leadership",
  "← Swipe horizontally to explore projects →": "← Swipe horizontally to explore projects →",
  "← Geser ke samping untuk melihat proyek lainnya →": "← Swipe horizontally to explore projects →",
  "LinkedIn": "LinkedIn",
  "GitHub": "GitHub",
  "Instagram": "Instagram",
  "WhatsApp": "WhatsApp",

  // Roles & Institutions
  "Kepala Badan Usaha Milik Himpunan (BUMH)": "Head of Student Union Enterprise (BUMH)",
  "Staff Ahli Divisi Acara": "Expert Staff of Event Division",
  "Kepala Divisi Perkamjin": "Head of Logistics, Security & Licensing Division",
  "Ketua Pelaksana EXSIS": "Chief Executive of EXSIS",
  "Panitia Divisi Acara": "Event Division Committee",
  "Institut Teknologi Kalimantan (ITK)": "Kalimantan Institute of Technology (ITK)",
  "Sarjana Komputer (S.Kom.)": "Bachelor of Computer Science (S.Kom.)",
  "Sistem Informasi": "Information Systems",
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
      .then((json) => {
        if (json.success && Array.isArray(json.translations)) {
          setCache((prev) => {
            const next = { ...prev }
            textsToTranslate.forEach((orig, idx) => {
              const trans = json.translations[idx]
              if (trans && trans !== orig) {
                next[orig] = trans
                next[orig.trim()] = trans
              }
            })
            try {
              localStorage.setItem("adhitya_trans_cache", JSON.stringify(next))
            } catch (e) {}
            return next
          })
        }
      })
      .catch((err) => console.warn("Auto translation batch error:", err))
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
      debounceTimerRef.current = setTimeout(processBatchQueue, 80)
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

      try {
        setIsTranslating(true)
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: trimmed, target: "en", source: "id" }),
        })
        const json = await res.json()
        if (json.success && json.translation) {
          const trans = json.translation
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
