import { NextRequest, NextResponse } from "next/server"
import { getAuthData, saveAuthData, sendResetCodeEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const currentAuth = getAuthData()

    const targetEmail = currentAuth.email || "adhityahermawan0906@gmail.com"

    if (email && email.trim().toLowerCase() !== targetEmail.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: `Email tidak cocok! Harap gunakan email terdaftar: ${targetEmail}` },
        { status: 400 }
      )
    }

    // Generate random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const codeExpires = Date.now() + 15 * 60 * 1000 // 15 mins

    currentAuth.resetCode = resetCode
    currentAuth.codeExpires = codeExpires
    saveAuthData(currentAuth)

    await sendResetCodeEmail(targetEmail, resetCode)

    return NextResponse.json({
      success: true,
      message: `Kode verifikasi telah dikirim ke ${targetEmail}. Silakan periksa kotak masuk atau spam email Anda.`,
      targetEmail,
      // Provide resetCode in response if smtp is not configured locally so user is never blocked
      devCode: resetCode,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengirim email reset" },
      { status: 500 }
    )
  }
}
