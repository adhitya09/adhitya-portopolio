import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://adhitya-hermawan.vercel.app"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/admin", "/cms", "/studio-adhitya-0989"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
