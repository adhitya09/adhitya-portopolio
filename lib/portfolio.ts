import fs from "fs"
import path from "path"
import defaultPortfolio from "@/data/portfolio.json"
import {
  isSupabaseConfigured,
  fetchPortfolioFromSupabase,
  savePortfolioToSupabase,
} from "@/lib/supabase"

export type PortfolioData = typeof defaultPortfolio

const dataFilePath = path.join(process.cwd(), "data", "portfolio.json")

export async function getPortfolioData(): Promise<PortfolioData> {
  if (isSupabaseConfigured()) {
    try {
      const supabaseData = await fetchPortfolioFromSupabase()
      if (supabaseData) {
        return supabaseData as PortfolioData
      }
    } catch (e) {
      console.warn("Failed to fetch from Supabase, using fallback:", e)
    }
  }

  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8")
      return JSON.parse(fileContent)
    }
  } catch (error) {
    console.error("Failed to read portfolio.json:", error)
  }
  return defaultPortfolio as PortfolioData
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  let supabaseSuccess = false
  if (isSupabaseConfigured()) {
    supabaseSuccess = await savePortfolioToSupabase(data)
  }

  let localSuccess = false
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
    localSuccess = true
  } catch (error) {
    // Expected on serverless environments where root fs is read-only
    console.warn("Local portfolio.json write skipped (read-only environment):", error)
  }

  return isSupabaseConfigured() ? supabaseSuccess : localSuccess
}
