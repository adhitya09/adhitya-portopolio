import { NextRequest, NextResponse } from "next/server"

// Dictionary cache for instant static translations
const DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    "Beranda": "Home",
    "Tentang": "About",
    "Pengalaman": "Experience",
    "Pendidikan": "Education",
    "Proyek": "Projects",
    "Kontak": "Contact",
    "Jelajahi Karya": "Explore Work",
    "Unduh CV": "Download CV",
    "Lihat CV": "View ATS CV",
    "Temukan": "Discover",
    "Tentang Saya": "About Me",
    "Siapa Saya": "Who Am I",
    "Jalur Karir": "Career Path",
    "Pengalaman Kerja": "Work Experience",
    "Riwayat Akademik": "Academic Background",
    "Pendidikan & Kepemimpinan": "Education & Leadership",
    "Keahlian & Alat": "Skills & Tools",
    "Tech Stack Saya": "My Tech Stack",
    "Portofolio": "Portfolio",
    "Karya Pilihan": "Selected Works",
    "Selengkapnya": "Show More",
    "Sembunyikan": "Show Less",
    "Hubungi Saya": "Get In Touch",
    "Kontak Saya": "Contact Me",
    "Lihat Detail": "View Details",
    "Detail Proyek": "Project Details",
    "Kode Sumber": "Source Code",
    "Tutup": "Close",
    "Nama": "Name",
    "Lokasi": "Location",
    "Telepon / WhatsApp": "Phone / WhatsApp",
    "IPK": "GPA",
    "Email": "Email",
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

async function translateSingle(text: string, target: string, source: string): Promise<string> {
  if (!text || !text.trim()) return text

  // Check dictionary first
  if (DICTIONARY[target] && DICTIONARY[target][text]) {
    return DICTIONARY[target][text]
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
    const data = await res.json()
    if (data && data[0] && Array.isArray(data[0])) {
      const translated = data[0].map((item: any) => item[0]).join("")
      return translated || text
    }
  } catch (err) {
    console.warn("Translation fallback for text:", text.slice(0, 30))
  }
  return text
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
