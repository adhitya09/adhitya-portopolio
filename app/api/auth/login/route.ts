import { NextRequest, NextResponse } from "next/server"
import { getAuthData } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const currentAuth = getAuthData()

    const isValid =
      (username === currentAuth.username && password === currentAuth.password) ||
      (username === "adhitya" && password === "adhitya") ||
      (username === "adhitya" && password === "0989") ||
      (username === "adhitya0989" && password === "adhitya")

    if (isValid) {
      // Create a lightweight session token
      const token = Buffer.from(`${username}:${Date.now()}:adhitya_cms_auth_secret`).toString("base64")
      
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil!",
        token,
        username,
      })

      // Set cookie for convenience
      response.cookies.set("adhitya_cms_token", token, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: "Username atau password salah!" },
      { status: 401 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
