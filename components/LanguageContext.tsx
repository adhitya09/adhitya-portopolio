"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

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

  // Hero
  "Explore Work": "Explore Work",
  "Jelajahi Karya": "Explore Work",
  "Download CV": "Download ATS CV",
  "Unduh CV": "Download ATS CV",
  "Connect": "Connect",
  "Hubungkan": "Connect",

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
  "Selengkapnya": "Show More",
  "Tampilkan Lebih Sedikit": "Show Less",
  "View Details": "View Details",
  "Lihat Detail": "View Details",
  "Project Details": "Project Details",
  "Source Code": "Source Code",
  "Key Features": "Key Features",
  "Created": "Created",
  "Technologies": "Technologies",

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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id")
  const [cache, setCache] = useState<Record<string, string>>({})
  const [isTranslating, setIsTranslating] = useState(false)

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

  // Fast synchronous translator for labels
  const t = useCallback(
    (text: string, enFallback?: string): string => {
      if (!text) return ""
      if (language === "id") return text

      // If user provided direct English fallback, use it
      if (enFallback) return enFallback

      // Check static map
      if (STATIC_MAP[text]) return STATIC_MAP[text]

      // Check cache
      if (cache[text]) return cache[text]

      return text
    },
    [language, cache]
  )

  // Asynchronous automatic translator for dynamic descriptions
  const translateDynamic = useCallback(
    async (text: string): Promise<string> => {
      if (!text || language === "id") return text
      if (cache[text]) return cache[text]

      try {
        setIsTranslating(true)
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: text, target: "en", source: "id" }),
        })
        const json = await res.json()
        if (json.success && json.translation) {
          const trans = json.translation
          setCache((prev) => {
            const next = { ...prev, [text]: trans }
            try {
              localStorage.setItem("adhitya_trans_cache", JSON.stringify(next))
            } catch (e) {}
            return next
          })
          return trans
        }
      } catch (err) {
        console.warn("Dynamic translation failed:", err)
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
