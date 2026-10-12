import { NextRequest, NextResponse } from "next/server"

// Dictionary cache for instant translations
const DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "Beranda": "Home",
    "Tentang": "About",
    "Pengalaman": "Experience",
    "Pendidikan": "Education",
    "Proyek": "Projects",
    "Kontak": "Contact",
    "Jelajahi Karya": "Explore Work",
    "Explore Work": "Explore Work",
    "Unduh CV": "Download CV",
    "Download CV": "Download CV",
    "Lihat CV": "View ATS CV",
    "Kembali ke Portofolio": "Back to Portfolio",
    "Cetak / Simpan PDF (ATS Friendly)": "Print / Save PDF (ATS Friendly)",

    // Sections
    "Temukan": "Discover",
    "Discover": "Discover",
    "Tentang Saya": "About Me",
    "About Me": "About Me",
    "Siapa Saya": "Who Am I",
    "Who Am I": "Who Am I",
    "Detail Pribadi": "Personal Details",
    "Personal Details": "Personal Details",
    "Jalur Karir": "Career Path",
    "Career Path": "Career Path",
    "Pengalaman Kerja": "Work Experience",
    "Work Experience": "Work Experience",
    "Riwayat Akademik": "Academic Background",
    "Academic Background": "Academic Background",
    "Pendidikan & Kepemimpinan": "Education & Leadership",
    "Education & Leadership": "Education & Leadership",
    "Keahlian & Alat": "Skills & Tools",
    "Skills & Tools": "Skills & Tools",
    "Tech Stack Saya": "My Tech Stack",
    "My Tech Stack": "My Tech Stack",
    "Portofolio": "Portfolio",
    "Portfolio": "Portfolio",
    "Karya Pilihan": "Selected Works",
    "Selected Works": "Selected Works",
    "Hubungi Saya": "Get In Touch",
    "Get In Touch": "Get In Touch",
    "Kontak Saya": "Contact Me",
    "Contact Me": "Contact Me",

    // Actions & Buttons
    "Selengkapnya": "View More",
    "View More": "View More",
    "Tampilkan Lebih Sedikit": "Show Less",
    "Show Less": "Show Less",
    "Show More": "Show More",
    "Lihat Detail": "View Details",
    "View Details": "View Details",
    "Detail Proyek": "Project Details",
    "Project Details": "Project Details",
    "Kode Sumber": "Source Code",
    "Source Code": "Source Code",
    "Key Features": "Key Features",
    "Fitur Utama": "Key Features",
    "Created": "Created",
    "Dibuat": "Created",
    "Technologies": "Technologies",
    "Teknologi": "Technologies",
    "Tutup": "Close",
    "Close": "Close",

    // Labels & Details
    "Nama": "Name",
    "Name": "Name",
    "Lokasi": "Location",
    "Location": "Location",
    "Telepon / WhatsApp": "Phone / WhatsApp",
    "Phone / WhatsApp": "Phone / WhatsApp",
    "IPK": "GPA",
    "GPA": "GPA",
    "Email": "Email",
    "Connect": "Connect",
    "Hubungkan": "Connect",
    "Balikpapan, Kalimantan Timur": "Balikpapan, East Kalimantan",
    "Balikpapan, Kalimantan Timur, Indonesia": "Balikpapan, East Kalimantan, Indonesia",
    "📍 Balikpapan Utara": "📍 North Balikpapan",
    "Kalimantan Timur, Indonesia": "East Kalimantan, Indonesia",
    "Activities & Leadership:": "Activities & Leadership:",
    "Aktivitas & Kepemimpinan:": "Activities & Leadership:",
    "All rights reserved.": "All rights reserved.",
    "Semua hak dilindungi undang-undang.": "All rights reserved.",
  },
  id: {
    "Home": "Beranda",
    "About": "Tentang",
    "Experience": "Pengalaman",
    "Education": "Pendidikan",
    "Projects": "Proyek",
    "Contact": "Kontak",
  }
}

// Indonesian month mapping
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
  let result = text
  for (const [idm, enm] of Object.entries(ID_MONTHS)) {
    const reg = new RegExp(`\\b${idm}\\b`, "gi")
    result = result.replace(reg, enm)
  }
  return result
}

async function translateWithGoogle(text: string, target: string, source: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data && data[0] && Array.isArray(data[0])) {
      const translated = data[0].map((item: any) => item[0]).join("")
      if (translated && translated.trim()) return translated.trim()
    }
  } catch (err) {
    // Failover
  }
  return null
}

async function translateWithMyMemory(text: string, target: string, source: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
    const res = await fetch(url)
    if (!res.ok) return null
    const json = await res.json()
    const trans = json?.responseData?.translatedText
    if (trans && typeof trans === "string" && !trans.includes("MYMEMORY WARNING")) {
      return trans.trim()
    }
  } catch (err) {
    // Failover
  }
  return null
}

async function translateSingle(text: string, target: string, source: string): Promise<string> {
  if (!text || !text.trim()) return text
  const trimmed = text.trim()

  // 1. Check dictionary first (exact and trimmed)
  if (DICTIONARY[target] && DICTIONARY[target][trimmed]) {
    return DICTIONARY[target][trimmed]
  }
  if (DICTIONARY[target] && DICTIONARY[target][text]) {
    return DICTIONARY[target][text]
  }

  // 2. Check if it's purely a date pattern like "Januari 2025 - Februari 2025"
  const dateTrans = translateIndonesianDates(text)
  if (dateTrans !== text && /^[A-Za-z0-9\s–—\-]+$/.test(text)) {
    return dateTrans
  }

  // 3. Google Translate primary
  const googleRes = await translateWithGoogle(trimmed, target, source)
  if (googleRes) return googleRes

  // 4. MyMemory fallback
  const myMemoryRes = await translateWithMyMemory(trimmed, target, source)
  if (myMemoryRes) return myMemoryRes

  // 5. If translation failed, try date replacement as last resort
  return dateTrans
}

export async function POST(req: NextRequest) {
  try {
    const { texts, target = "en", source = "id" } = await req.json()

    if (Array.isArray(texts)) {
      const translatedList = await Promise.all(
        texts.map((t: string) => translateSingle(t, target, source))
      )
      return NextResponse.json({ success: true, translations: translatedList })
    }

    if (typeof texts === "string") {
      const translated = await translateSingle(texts, target, source)
      return NextResponse.json({ success: true, translation: translated })
    }

    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
