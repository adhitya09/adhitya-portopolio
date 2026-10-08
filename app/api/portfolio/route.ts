import { NextRequest, NextResponse } from "next/server"
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio"

export async function GET() {
  try {
    const data = await getPortfolioData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data portofolio" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Data tidak valid" },
        { status: 400 }
      )
    }

    const saved = await savePortfolioData(body)
    if (!saved) {
      return NextResponse.json(
        { success: false, message: "Gagal menyimpan perubahan ke server" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Perubahan portofolio berhasil disimpan!",
      data: body,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
