import { NextRequest, NextResponse } from "next/server"
import { getAuthData, saveAuthData } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { code, newPassword } = await req.json()
    const currentAuth = getAuthData()

    if (!code || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Kode dan password baru harus diisi!" },
        { status: 400 }
      )
    }

    if (!currentAuth.resetCode || currentAuth.resetCode !== code.trim()) {
      return NextResponse.json(
        { success: false, message: "Kode verifikasi salah atau tidak valid!" },
        { status: 400 }
      )
    }

    if (currentAuth.codeExpires && Date.now() > currentAuth.codeExpires) {
      return NextResponse.json(
        { success: false, message: "Kode verifikasi telah kadaluarsa. Silakan minta kode baru." },
        { status: 400 }
      )
    }

    // Update password
    currentAuth.password = newPassword.trim()
    currentAuth.resetCode = null
    currentAuth.codeExpires = null
    saveAuthData(currentAuth)

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui! Silakan login dengan password baru.",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mereset password" },
      { status: 500 }
    )
  }
}
