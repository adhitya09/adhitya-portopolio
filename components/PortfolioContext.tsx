"use client"
import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import defaultPortfolio from "@/data/portfolio.json"
import { useLanguage } from "@/components/LanguageContext"
import { translatePortfolioData, autoTranslateUnknownTexts } from "@/lib/translation"

export type PortfolioData = typeof defaultPortfolio

interface PortfolioContextType {
  data: PortfolioData
  rawData: PortfolioData
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>
  reloadData: () => Promise<void>
  saveData: (newData: PortfolioData) => Promise<{ success: boolean; message: string }>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({
  initialData,
  children,
}: {
  initialData?: PortfolioData
  children: React.ReactNode
}) {
  const [rawData, setRawData] = useState<PortfolioData>(initialData || (defaultPortfolio as PortfolioData))
  const [cacheVersion, setCacheVersion] = useState(0)
  const { language } = useLanguage()

  // Sync with localStorage or server on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("adhitya_portfolio_custom")
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && typeof parsed === "object") {
          setRawData({
            ...defaultPortfolio,
            ...parsed,
            cvProfile: parsed.cvProfile || (defaultPortfolio as any).cvProfile,
            cvProfileImage: parsed.cvProfileImage || (defaultPortfolio as any).cvProfileImage,
            organizations: (parsed.organizations && parsed.organizations.length > 0)
              ? parsed.organizations
              : (defaultPortfolio as any).organizations,
          })
        }
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e)
    }

    // Also fetch fresh from API
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const merged = {
            ...defaultPortfolio,
            ...res.data,
            cvProfile: res.data.cvProfile || (defaultPortfolio as any).cvProfile,
            cvProfileImage: res.data.cvProfileImage || (defaultPortfolio as any).cvProfileImage,
            organizations: (res.data.organizations && res.data.organizations.length > 0)
              ? res.data.organizations
              : (defaultPortfolio as any).organizations,
          }
          setRawData(merged)
          localStorage.setItem("adhitya_portfolio_custom", JSON.stringify(merged))
        }
      })
      .catch((err) => {
        console.warn("Portfolio API sync:", err)
      })
  }, [])

  // When language is EN, auto-trigger background translation for any untranslated text
  useEffect(() => {
    if (language === "en") {
      autoTranslateUnknownTexts(rawData, () => {
        setCacheVersion((v) => v + 1)
      })
    }
  }, [rawData, language])

  // Automatically compute deep-translated portfolio when language is EN
  const data = useMemo(() => {
    if (language === "en") {
      return translatePortfolioData(rawData, "en")
    }
    return rawData
  }, [rawData, language, cacheVersion])

  const reloadData = async () => {
    try {
      const res = await fetch("/api/portfolio")
      const json = await res.json()
      if (json.success && json.data) {
        setRawData(json.data)
        localStorage.setItem("adhitya_portfolio_custom", JSON.stringify(json.data))
      }
    } catch (err) {
      console.error("Failed to reload data:", err)
    }
  }

  const saveData = async (newData: PortfolioData) => {
    setRawData(newData)
    try {
      localStorage.setItem("adhitya_portfolio_custom", JSON.stringify(newData))
    } catch (e) {}

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      })
      const json = await res.json()
      return {
        success: json.success ?? true,
        message: json.message || "Berhasil disimpan",
      }
    } catch (err: any) {
      return {
        success: true, // Still saved in localStorage on client
        message: "Perubahan disimpan di browser (API offline)",
      }
    }
  }

  return (
    <PortfolioContext.Provider value={{ data, rawData, setData: setRawData, reloadData, saveData }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
