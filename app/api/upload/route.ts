import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { isSupabaseConfigured, uploadToSupabaseStorage } from "@/lib/supabase"

function getMimeType(fileType?: string, ext?: string): string {
  if (fileType && fileType.length > 3) return fileType
  const cleanExt = (ext || "").toLowerCase().replace(".", "")
  switch (cleanExt) {
    case "mp4": return "video/mp4"
    case "webm": return "video/webm"
    case "mov": return "video/quicktime"
    case "ogg": return "video/ogg"
    case "m4v": return "video/mp4"
    case "png": return "image/png"
    case "webp": return "image/webp"
    case "gif": return "image/gif"
    case "svg": return "image/svg+xml"
    default: return "image/jpeg"
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string | null // e.g. "profile", "about" or "project"

    if (!file) {
      return NextResponse.json({ success: false, message: "File tidak ditemukan" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name) || ".jpg"
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_")
    const filename = `${Date.now()}_${cleanBase}${ext}`
    const mimeType = getMimeType(file.type, ext)

    // 1. If Supabase is configured, upload directly to Supabase Storage bucket
    if (isSupabaseConfigured()) {
      const supabaseUrl = await uploadToSupabaseStorage(buffer, filename, mimeType)
      if (supabaseUrl) {
        return NextResponse.json({
          success: true,
          url: supabaseUrl,
          message: mimeType.startsWith("video/") ? "Video looping berhasil diunggah ke cloud storage!" : "Foto berhasil diunggah ke cloud storage!",
        })
      }
    }

    // 2. Fallback: If local environment, write to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    let localSaved = false
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      const filePath = path.join(uploadsDir, filename)
      fs.writeFileSync(filePath, buffer)
      localSaved = true

      if (type === "profile") {
        const heroPath = path.join(process.cwd(), "public", "images", "hero.jpg")
        fs.writeFileSync(heroPath, buffer)
      }
    } catch (e) {
      // Expected on read-only serverless environment like Vercel
      localSaved = false
    }

    if (localSaved && process.env.NODE_ENV !== "production") {
      const publicUrl = `/uploads/${filename}`
      return NextResponse.json({
        success: true,
        url: publicUrl,
        message: "Media berhasil disimpan secara lokal!",
      })
    }

    // 3. Resilient Fallback: Base64 Data URL (guaranteed to render anywhere without disk writes)
    const base64Url = `data:${mimeType};base64,${buffer.toString("base64")}`
    return NextResponse.json({
      success: true,
      url: base64Url,
      message: "Media berhasil diunggah!",
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal mengunggah file" },
      { status: 500 }
    )
  }
}
