import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { isSupabaseConfigured, uploadToSupabaseStorage } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string | null // e.g. "profile" or "project"

    if (!file) {
      return NextResponse.json({ success: false, message: "File tidak ditemukan" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name) || ".jpg"
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_")
    const filename = `${Date.now()}_${cleanBase}${ext}`

    // 1. If Supabase is configured, upload directly to Supabase Storage bucket
    if (isSupabaseConfigured()) {
      const mimeType = file.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg")
      const supabaseUrl = await uploadToSupabaseStorage(buffer, filename, mimeType)
      if (supabaseUrl) {
        return NextResponse.json({
          success: true,
          url: supabaseUrl,
          message: "Foto berhasil diunggah ke cloud storage!",
        })
      }
    }

    // 2. Fallback to local storage
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true })
      } catch (e) {}
    }

    const filePath = path.join(uploadsDir, filename)
    try {
      fs.writeFileSync(filePath, buffer)
    } catch (e) {
      console.warn("Could not write file to local disk (expected on read-only serverless):", e)
    }

    // If type is profile, also try updating public/images/hero.jpg for fallback
    if (type === "profile") {
      const heroPath = path.join(process.cwd(), "public", "images", "hero.jpg")
      try {
        fs.writeFileSync(heroPath, buffer)
      } catch (e) {}
    }

    const publicUrl = `/uploads/${filename}`
    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Foto berhasil diunggah!",
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal mengunggah file" },
      { status: 500 }
    )
  }
}
