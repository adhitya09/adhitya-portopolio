import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "../styles/globals.css"
import PageLoader from "@/components/PageLoader"
import { PortfolioProvider } from "@/components/PortfolioContext"
import { LanguageProvider } from "@/components/LanguageContext"
import { getPortfolioData } from "@/lib/portfolio"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://adhitya-hermawan.vercel.app"),
  title: {
    default: "AH | PORTOPOLIO",
    template: "%s | AH | PORTOPOLIO",
  },
  description: "Personal portfolio of Adhitya Hermawan, S.Kom. Software Engineer, QA Analyst, and Business Intelligence specialist from Institut Teknologi Kalimantan.",
  keywords: ["Adhitya Hermawan", "Portfolio", "Software Engineer", "Backend Developer", "QA Analyst", "Business Intelligence", "Laravel", "Docker", "DevOps", "ITK", "Institut Teknologi Kalimantan"],
  authors: [{ name: "Adhitya Hermawan" }],
  creator: "Adhitya Hermawan",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "AH | PORTOPOLIO",
    description: "Personal portfolio of Adhitya Hermawan, S.Kom. Software Engineer, QA Analyst, and Business Intelligence specialist from Institut Teknologi Kalimantan.",
    siteName: "AH PORTOPOLIO",
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "AH PORTOPOLIO Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AH | PORTOPOLIO",
    description: "Personal portfolio of Adhitya Hermawan, S.Kom. Software Engineer, QA Analyst, and Business Intelligence specialist from Institut Teknologi Kalimantan.",
    images: ["/logo.png"],
    creator: "@adhitya_hermawan",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialData = await getPortfolioData()

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <LanguageProvider>
          <PortfolioProvider initialData={initialData}>
            <PageLoader />
            {children}
          </PortfolioProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
