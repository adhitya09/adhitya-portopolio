import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey)
}

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) return null
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

export async function fetchPortfolioFromSupabase() {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("data")
      .eq("id", "main")
      .single()

    if (error) {
      if (error.code !== "PGRST116") {
        console.warn("Supabase fetch portfolio error:", error.message)
      }
      return null
    }

    return data?.data || null
  } catch (err) {
    console.warn("Supabase fetch portfolio exception:", err)
    return null
  }
}

export async function savePortfolioToSupabase(portfolioData: any): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from("portfolio_content")
      .upsert({
        id: "main",
        data: portfolioData,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error("Supabase upsert portfolio error:", error)
      return false
    }

    return true
  } catch (err) {
    console.error("Supabase upsert portfolio exception:", err)
    return false
  }
}

export async function uploadToSupabaseStorage(
  buffer: Buffer,
  filename: string,
  contentType: string = "image/jpeg"
): Promise<string | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const bucket = "portfolio-assets"
  const filePath = `uploads/${filename}`

  try {
    // Attempt direct upload
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      })

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
      return publicUrlData?.publicUrl || null
    }

    // If bucket was missing or failed, attempt to create/verify bucket
    try {
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 20971520, // 20MB
      })
    } catch (createErr) {
      // Bucket might already exist or ignore error
    }

    // Retry upload once
    const { error: retryError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      })

    if (!retryError) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
      return publicUrlData?.publicUrl || null
    }

    console.error("Supabase storage upload retry error:", retryError)
    return null
  } catch (err) {
    console.error("Supabase storage exception:", err)
    return null
  }
}
