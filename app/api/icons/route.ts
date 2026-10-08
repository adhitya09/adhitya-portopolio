import { NextRequest, NextResponse } from "next/server"
import { resolveTechIcon, searchTechIcons } from "@/lib/iconResolver"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  const resolved = resolveTechIcon(q)
  const suggestions = searchTechIcons(q)

  return NextResponse.json({
    success: true,
    query: q,
    resolvedUrl: resolved,
    suggestions,
  })
}
