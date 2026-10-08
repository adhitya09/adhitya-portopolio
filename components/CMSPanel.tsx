"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import defaultPortfolio from "@/data/portfolio.json"
import { resolveTechIcon, searchTechIcons, POPULAR_TECHS } from "@/lib/iconResolver"

type PortfolioData = typeof defaultPortfolio

export default function CMSPanel() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request")
  const [forgotEmail, setForgotEmail] = useState("adhityahermawan0906@gmail.com")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState("")
  const [devCodeNotice, setDevCodeNotice] = useState("")

  // CMS state
  const [data, setData] = useState<PortfolioData>(defaultPortfolio)
  const [activeTab, setActiveTab] = useState<
    "photo" | "hero" | "about" | "experience" | "education" | "techstack" | "projects" | "contact" | "footer"
  >("photo")
  
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  // Tech stack live icon auto-detector state
  const [techInputName, setTechInputName] = useState("")
  const [techInputUrl, setTechInputUrl] = useState("")
  const [techTargetCategory, setTechTargetCategory] = useState(0)
  const [suggestedIcons, setSuggestedIcons] = useState<any[]>([])

  // Check existing session
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("adhitya_cms_token")
      if (savedToken) {
        setIsAuthenticated(true)
      }
    } catch (e) {}
    setAuthChecking(false)
  }, [])

  // Load portfolio data
  useEffect(() => {
    try {
      const cached = localStorage.getItem("adhitya_portfolio_custom")
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && typeof parsed === "object") {
          setData({
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
    } catch (e) {}

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
          setData(merged)
          localStorage.setItem("adhitya_portfolio_custom", JSON.stringify(merged))
        }
      })
      .catch((err) => console.warn("Failed to load portfolio:", err))
  }, [])

  // Auto icon detector when typing in tech stack input
  useEffect(() => {
    if (!techInputName.trim()) {
      setTechInputUrl("")
      setSuggestedIcons(POPULAR_TECHS.slice(0, 8))
      return
    }

    const autoUrl = resolveTechIcon(techInputName)
    setTechInputUrl(autoUrl)
    setSuggestedIcons(searchTechIcons(techInputName))
  }, [techInputName])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3500)
  }

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoggingIn(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername.trim(), password: loginPassword.trim() }),
      })
      const result = await res.json()

      if (result.success && result.token) {
        localStorage.setItem("adhitya_cms_token", result.token)
        setIsAuthenticated(true)
        showToast("Login berhasil! Selamat datang di Studio CMS.")
      } else {
        setLoginError(result.message || "Username atau password salah")
      }
    } catch (err: any) {
      setLoginError("Koneksi gagal: " + err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("adhitya_cms_token")
    setIsAuthenticated(false)
    setLoginPassword("")
    showToast("Anda telah keluar dari CMS.")
  }

  // Request Reset Password Code
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotMessage("")
    setDevCodeNotice("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      })
      const result = await res.json()

      if (result.success) {
        setForgotStep("verify")
        setForgotMessage(result.message)
        if (result.devCode) {
          setDevCodeNotice(`Kode verifikasi Anda adalah: ${result.devCode}`)
        }
      } else {
        setForgotMessage(result.message || "Gagal mengirim kode verifikasi")
      }
    } catch (err: any) {
      setForgotMessage("Error: " + err.message)
    } finally {
      setForgotLoading(false)
    }
  }

  // Confirm Reset Password with Code
  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: resetCode.trim(), newPassword: newPassword.trim() }),
      })
      const result = await res.json()

      if (result.success) {
        showToast("Password berhasil diperbarui! Silakan login.")
        setShowForgotModal(false)
        setForgotStep("request")
        setResetCode("")
        setNewPassword("")
        setLoginPassword("")
      } else {
        setForgotMessage(result.message || "Kode salah atau kadaluarsa")
      }
    } catch (err: any) {
      setForgotMessage("Error: " + err.message)
    } finally {
      setForgotLoading(false)
    }
  }

  // Save changes to API & LocalStorage
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      // Clean up raw editing strings and ensure trimmed/filtered arrays
      const cleanedData: PortfolioData = {
        ...data,
        hero: {
          ...data.hero,
          titles: ((data.hero as any).titlesRaw !== undefined ? (data.hero as any).titlesRaw : (data.hero.titles || []).join("\n"))
            .split("\n")
            .map((t: string) => t.trim())
            .filter(Boolean),
        },
        about: {
          ...data.about,
          scrollTexts: ((data.about as any).scrollTextsRaw !== undefined ? (data.about as any).scrollTextsRaw : ((data.about.scrollTexts || []).join("\n")))
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean),
        },
        experience: {
          ...data.experience,
          items: (data.experience.items || []).map(({ skillsRaw, ...exp }: any) => ({
            ...exp,
            skills: (skillsRaw !== undefined ? skillsRaw : (exp.skills || []).join(", "))
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean),
          })),
        },
        education: {
          ...((data as any).education || {}),
          items: (((data as any).education?.items) || []).map(({ activitiesRaw, ...edu }: any) => ({
            ...edu,
            activities: (activitiesRaw !== undefined ? activitiesRaw : (edu.activities || []).join("\n"))
              .split("\n")
              .map((a: string) => a.trim())
              .filter(Boolean),
          })),
        },
        projects: {
          ...data.projects,
          items: (data.projects.items || []).map(({ techRaw, featuresRaw, ...proj }: any) => ({
            ...proj,
            tech: (techRaw !== undefined ? techRaw : (proj.tech || []).join(", "))
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean),
            features: (featuresRaw !== undefined ? featuresRaw : (proj.features || []).join("\n"))
              .split("\n")
              .map((f: string) => f.trim())
              .filter(Boolean),
          })),
        },
      }

      // Delete temporary raw properties from hero and about
      delete (cleanedData.hero as any).titlesRaw
      delete (cleanedData.about as any).scrollTextsRaw

      setData(cleanedData)
      localStorage.setItem("adhitya_portfolio_custom", JSON.stringify(cleanedData))

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      })
      const result = await res.json()

      if (result.success) {
        showToast("Semua perubahan berhasil disimpan! CV dan website langsung terupdate.")
      } else {
        showToast(result.message || "Gagal menyimpan ke server", "error")
      }
    } catch (error: any) {
      showToast("Tersimpan di browser lokal. Server sedang offline.", "success")
    } finally {
      setSaving(false)
    }
  }

  // Upload Photo / Screenshot handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "profile" | "about" | "cvProfile" | "project", projectIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", targetField)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await res.json()

      if (result.success && result.url) {
        if (targetField === "profile") {
          setData((prev) => ({
            ...prev,
            hero: { ...prev.hero, profileImage: result.url },
          }))
          showToast("Foto profil Home / Hero berhasil diunggah!")
        } else if (targetField === "about") {
          setData((prev) => ({
            ...prev,
            about: { ...prev.about, profileImage: result.url },
          }))
          showToast("Foto profil About Me berhasil diunggah!")
        } else if (targetField === "cvProfile") {
          setData((prev) => ({
            ...prev,
            cvProfileImage: result.url,
          } as any))
          showToast("Foto profil khusus CV ATS berhasil diunggah!")
        } else if (targetField === "project" && typeof projectIndex === "number") {
          setData((prev) => {
            const nextProjects = [...prev.projects.items]
            nextProjects[projectIndex] = {
              ...nextProjects[projectIndex],
              imagePath: result.url,
            }
            return {
              ...prev,
              projects: {
                ...prev.projects,
                items: nextProjects,
              },
            }
          })
          showToast("Screenshot proyek berhasil diunggah!")
        }
      } else {
        showToast(result.message || "Gagal mengunggah foto", "error")
      }
    } catch (err: any) {
      showToast("Terjadi error saat upload: " + err.message, "error")
    } finally {
      setUploading(false)
    }
  }

  // Add technology with live auto-resolved icon
  const handleAddTechnology = () => {
    if (!techInputName.trim()) return

    const resolvedUrl = techInputUrl || resolveTechIcon(techInputName)
    const newTech = {
      name: techInputName.trim(),
      svg: resolvedUrl,
    }

    setData((prev) => {
      const nextCategories = [...prev.techStack.categories]
      const targetCat = nextCategories[techTargetCategory] || nextCategories[0]
      if (targetCat) {
        targetCat.technologies = [...(targetCat.technologies || []), newTech]
      }
      return {
        ...prev,
        techStack: {
          ...prev.techStack,
          categories: nextCategories,
        },
      }
    })

    setTechInputName("")
    setTechInputUrl("")
    showToast(`Teknologi "${newTech.name}" berhasil ditambahkan dengan logo otomatis!`)
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-text-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // ===================== LOGIN SCREEN =====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md bg-background border border-text-secondary/20 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-text-primary text-background rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg">
              🔐
            </div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Studio CMS Login</h1>
            <p className="text-xs text-text-secondary mt-1">
              Portal privat pengelolaan portofolio Adhitya Hermawan, S.Kom.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2">
              <span>⚠</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="adhitya0989"
                className="w-full bg-thirdary/30 border border-text-secondary/25 focus:border-text-primary rounded-xl px-4 py-3 text-sm font-semibold text-text-primary outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs uppercase font-bold tracking-wider text-text-secondary">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-text-secondary hover:text-text-primary underline cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-thirdary/30 border border-text-secondary/25 focus:border-text-primary rounded-xl px-4 py-3 text-sm font-semibold text-text-primary outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-2 w-full bg-text-primary text-background py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? "Memeriksa Kredensial..." : "Masuk ke Studio CMS"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-text-secondary/15 text-center">
            <Link href="/" className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
              &larr; Kembali ke Live Portfolio
            </Link>
          </div>
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="bg-background border border-text-secondary/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => {
                  setShowForgotModal(false)
                  setForgotStep("request")
                  setForgotMessage("")
                }}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary font-bold text-lg"
              >
                ✕
              </button>

              <h2 className="text-xl font-black text-text-primary mb-2">Reset Password CMS</h2>
              <p className="text-xs text-text-secondary mb-6">
                Konfirmasi akan dikirimkan ke email terdaftar: <br />
                <strong className="text-text-primary">adhityahermawan0906@gmail.com</strong>
              </p>

              {forgotMessage && (
                <div className="mb-4 p-3 bg-thirdary border border-text-secondary/20 rounded-xl text-xs font-semibold text-text-primary">
                  {forgotMessage}
                </div>
              )}

              {devCodeNotice && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs font-bold text-green-500">
                  {devCodeNotice}
                </div>
              )}

              {forgotStep === "request" ? (
                <form onSubmit={handleRequestResetCode} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                      Email Konfirmasi
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-thirdary/30 border border-text-secondary/25 rounded-xl px-4 py-3 text-sm font-medium outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-text-primary text-background py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? "Mengirim Kode..." : "Kirim Kode Verifikasi"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmResetPassword} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                      Kode Verifikasi (6-Digit)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Contoh: 123456"
                      className="w-full bg-thirdary/30 border border-text-secondary/25 rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-widest text-center outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full bg-thirdary/30 border border-text-secondary/25 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-text-primary text-background py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? "Memperbarui..." : "Ubah Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Monochrome Navigation Tabs for unified styling
  const navTabs = [
    {
      id: "photo",
      label: "Foto Profil",
      fullLabel: "Foto Profil",
      desc: "Home, About & CV ATS",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "hero",
      label: "Home / Hero",
      fullLabel: "Home / Hero",
      desc: "Greeting, Sosmed, Gelar",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "about",
      label: "About Me",
      fullLabel: "About Me",
      desc: "Who Am I & Detail Diri",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "experience",
      label: "Karir",
      fullLabel: "Work Experience",
      desc: "Karir & Pengalaman Kerja",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "education",
      label: "Pendidikan",
      fullLabel: "Education",
      desc: "Pendidikan & Organisasi",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
        </svg>
      ),
    },
    {
      id: "techstack",
      label: "Tech Stack",
      fullLabel: "My Tech Stack",
      desc: "Auto Icon Detector",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: "projects",
      label: "Proyek",
      fullLabel: "Selected Works",
      desc: "Proyek & Upload Screenshot",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: "contact",
      label: "Kontak",
      fullLabel: "Contact & Maps",
      desc: "Peta & Sosial Media",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "footer",
      label: "Footer",
      fullLabel: "Footer",
      desc: "Hak Cipta & Tautan",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ]

  // ===================== AUTHENTICATED CMS STUDIO =====================
  return (
    <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col">
      {/* Top Header / Studio Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-text-secondary/15 px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-text-primary text-background flex items-center justify-center font-black text-sm sm:text-lg shadow-md shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-tight text-text-primary">PORTFOLIO CMS STUDIO</h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap">
                adhitya0989
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-text-secondary font-medium hidden sm:block">Data tersimpan otomatis memperbarui live site & ATS CV</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/cv"
            target="_blank"
            className="text-xs font-bold border border-text-secondary/30 hover:border-text-primary px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all hover:bg-thirdary/30 flex items-center gap-1.5"
            title="Lihat CV ATS Friendly yang otomatis tersinkronisasi"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Lihat</span>
            <span>ATS CV</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="text-xs font-bold border border-text-secondary/30 hover:border-text-primary px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all hover:bg-thirdary/30 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="hidden sm:inline">Live</span>
            <span>Web</span>
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="cursor-pointer text-xs font-bold bg-text-primary text-background px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-500 hover:text-red-700 border border-red-500/20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-colors cursor-pointer"
            title="Keluar dari CMS"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Tab Navigation Bar (Swipeable horizontal pills with monochrome icons) */}
      <div className="lg:hidden sticky top-[57px] sm:top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-text-secondary/15 px-3 py-2.5 overflow-x-auto flex gap-1.5 no-scrollbar shadow-xs">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-text-primary text-background shadow-md"
                : "bg-thirdary/30 text-text-secondary hover:text-text-primary hover:bg-thirdary/60 border border-text-secondary/10"
            }`}
          >
            <span className={activeTab === tab.id ? "text-background" : "text-text-secondary"}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main CMS Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Navigation Sidebar (Desktop only - Uniform Monochrome Icons) */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <div className="sticky top-28 bg-thirdary/20 border border-text-secondary/15 rounded-2xl p-3 flex flex-col gap-1.5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-3 py-2">
              Menu Pengaturan
            </span>
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-left px-3.5 py-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer group ${
                  activeTab === tab.id
                    ? "bg-text-primary text-background shadow-md font-bold"
                    : "text-text-primary hover:bg-thirdary/50 font-medium"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 transition-colors ${
                    activeTab === tab.id
                      ? "text-background"
                      : "text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {tab.icon}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm truncate">{tab.fullLabel}</span>
                  <span
                    className={`text-[10px] ${
                      activeTab === tab.id ? "text-background/80" : "text-text-secondary"
                    }`}
                  >
                    {tab.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 bg-background border border-text-secondary/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden pb-32">
          {/* ===================== TAB 1: PHOTO & PROFILE ===================== */}
          {activeTab === "photo" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Foto Profil & Hero</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Kelola foto profil Anda. Unggah foto baru dari komputer/HP kapan saja.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15">
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-text-primary shadow-2xl bg-thirdary">
                    <Image
                      src={data.hero.profileImage || "/images/hero.jpg"}
                      alt="Foto Profil"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-text-secondary mt-3">Preview Foto Aktif Saat Ini</span>
                </div>

                <div className="md:col-span-7 flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-black text-text-primary">Foto Profil Home / Hero (Halaman Utama)</h3>
                    <p className="text-xs text-text-secondary mt-0.5 mb-3">
                      Tampil di lingkaran hero bagian atas halaman Home. Mengganti foto ini tidak mempengaruhi About Me.
                    </p>
                    <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                      Upload Foto Baru Dari Komputer / HP
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "profile")}
                      disabled={uploading}
                      className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-text-primary file:text-background hover:file:opacity-90 file:cursor-pointer cursor-pointer border border-text-secondary/20 rounded-xl p-2 bg-background"
                    />
                    {uploading && (
                      <p className="text-xs text-amber-500 font-bold mt-2 animate-pulse">Sedang mengunggah foto...</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                      Atau Masukkan Path / URL Foto Langsung
                    </label>
                    <input
                      type="text"
                      value={data.hero.profileImage || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, profileImage: e.target.value },
                        }))
                      }
                      placeholder="/images/hero.jpg atau https://..."
                      className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text-primary text-text-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* FOTO PROFIL BAGIAN ABOUT ME (TENTANG SAYA) */}
              <div className="bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-secondary/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="text-base font-black text-text-primary">
                        Foto Profil Bagian About Me (Tentang Saya)
                      </h3>
                      <span className="bg-text-primary/10 text-text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Mandiri / Tidak Mengikuti Home
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Foto ini khusus tampil pada kartu profil bagian About Me di Live Site (format portrait 4:5). Mengganti foto di sini tidak akan merubah foto Home / Hero.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="relative w-36 h-44 rounded-2xl overflow-hidden border-2 border-text-primary shadow-lg bg-thirdary">
                      <img
                        src={data.about.profileImage || data.hero.profileImage || "/images/hero.jpg"}
                        alt="Foto About Me"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-text-secondary mt-2">Preview Foto About Me (4:5)</span>
                  </div>

                  <div className="md:col-span-8 flex flex-col gap-4">
                    <div>
                      <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                        Upload Foto About Me Baru Dari Komputer / HP
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "about")}
                        disabled={uploading}
                        className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-text-primary file:text-background hover:file:opacity-90 file:cursor-pointer cursor-pointer border border-text-secondary/20 rounded-xl p-2 bg-background"
                      />
                      {uploading && (
                        <p className="text-xs text-amber-500 font-bold mt-2 animate-pulse">Sedang mengunggah foto About Me...</p>
                      )}
                    </div>

                    <div className="pt-1">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                        Atau Masukkan Path / URL Foto About Me Langsung
                      </label>
                      <input
                        type="text"
                        value={data.about.profileImage || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            about: { ...prev.about, profileImage: e.target.value },
                          }))
                        }
                        placeholder="/images/adhitya.jpg atau https://..."
                        className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text-primary text-text-primary font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const homeImg = data.hero.profileImage || "/images/hero.jpg"
                          setData((prev) => ({
                            ...prev,
                            about: { ...prev.about, profileImage: homeImg },
                          }))
                          showToast("Foto About Me disamakan dengan foto Home / Hero!")
                        }}
                        className="text-xs text-text-primary hover:underline font-semibold cursor-pointer"
                      >
                        Salin dari Foto Home / Hero
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOTO PROFIL KHUSUS CV ATS (LEMBAR RESUME) */}
              <div className="bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-secondary/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📄</span>
                      <h3 className="text-base font-black text-text-primary">
                        Foto Profil Khusus CV ATS (Lembar Resume)
                      </h3>
                      <span className="bg-text-primary/10 text-text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Mandiri / Terpisah
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Foto ini khusus tampil pada lembar CV ATS. Mengganti foto di sini tidak akan merubah foto profil halaman Live Site, sehingga Anda bebas menggunakan foto formal pas foto CV.
                    </p>
                  </div>
                  <a
                    href="/cv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold bg-text-primary text-background px-3 py-1.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <span>Lihat CV ATS</span>
                    <span>↗</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="relative w-36 h-44 rounded-xl overflow-hidden border-2 border-text-primary shadow-lg bg-thirdary">
                      <img
                        src={(data as any).cvProfileImage || data.hero.profileImage || "/images/hero.jpg"}
                        alt="Foto Profil CV ATS"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-text-secondary mt-2">Preview Foto CV ATS (Format Pas Foto 3:4)</span>
                  </div>

                  <div className="md:col-span-8 flex flex-col gap-4">
                    <div>
                      <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                        Upload Foto CV Baru Dari Komputer / HP
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "cvProfile")}
                        disabled={uploading}
                        className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-text-primary file:text-background hover:file:opacity-90 file:cursor-pointer cursor-pointer border border-text-secondary/20 rounded-xl p-2 bg-background"
                      />
                      {uploading && (
                        <p className="text-xs text-amber-500 font-bold mt-2 animate-pulse">Sedang mengunggah foto CV...</p>
                      )}
                    </div>

                    <div className="pt-1">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                        Atau Masukkan Path / URL Foto CV Langsung
                      </label>
                      <input
                        type="text"
                        value={(data as any).cvProfileImage || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            cvProfileImage: e.target.value,
                          } as any))
                        }
                        placeholder="/uploads/... atau https://..."
                        className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text-primary text-text-primary font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const liveImg = data.hero.profileImage || "/images/hero.jpg"
                          setData((prev) => ({
                            ...prev,
                            cvProfileImage: liveImg,
                          } as any))
                          showToast("Foto CV disamakan dengan foto Live Site!")
                        }}
                        className="text-xs text-text-primary hover:underline font-semibold cursor-pointer"
                      >
                        Salin & Samakan dengan Foto Live Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING QUICK STATS BADGES SECTION (Melayang di Foto Hero) */}
              <div className="bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-secondary/10 pb-4">
                  <div>
                    <h3 className="text-base font-black text-text-primary">
                      Floating Quick Stats Badges (Badge Melayang di Samping Foto Hero)
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Pills melayang yang tampil di pojok foto profil Anda pada halaman utama. Anda bisa ubah teks, icon, tambah badge baru, atau hapus.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = Date.now()
                      const currentStats = data.hero.quickStats || []
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          quickStats: [
                            ...currentStats,
                            { id: newId, message: "Badge Baru", icon: "star" },
                          ],
                        },
                      })
                      showToast("Badge baru berhasil ditambahkan!")
                    }}
                    className="bg-text-primary text-background px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer shadow-sm"
                  >
                    + Tambah Badge Baru
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {(data.hero.quickStats || []).map((stat, sIdx) => (
                    <div
                      key={stat.id || sIdx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-background p-4 rounded-2xl border border-text-secondary/20 items-center shadow-xs"
                    >
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-text-secondary">Pilih Icon</label>
                        <select
                          value={stat.icon || "education"}
                          onChange={(e) => {
                            const nextStats = [...data.hero.quickStats]
                            nextStats[sIdx].icon = e.target.value
                            setData({ ...data, hero: { ...data.hero, quickStats: nextStats } })
                          }}
                          className="bg-thirdary/40 border border-text-secondary/20 rounded-xl p-2.5 text-xs font-semibold text-text-primary focus:outline-none"
                        >
                          <option value="education">🎓 Pendidikan / Gelar (S.Kom.)</option>
                          <option value="code">💻 Developer / Coding / QA (&lt;/&gt;)</option>
                          <option value="server">🖥 Server / Cloud / DevOps</option>
                          <option value="star">⭐ Bintang / Prestasi</option>
                          <option value="work">💼 Karir / Pekerjaan</option>
                          <option value="zap">⚡ Inovasi / Kecepatan</option>
                        </select>
                      </div>

                      <div className="sm:col-span-7 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-text-secondary">Teks Pesan Badge</label>
                        <input
                          type="text"
                          value={stat.message}
                          onChange={(e) => {
                            const nextStats = [...data.hero.quickStats]
                            nextStats[sIdx].message = e.target.value
                            setData({ ...data, hero: { ...data.hero, quickStats: nextStats } })
                          }}
                          placeholder="Contoh: S.Kom. Graduate (IPK 3.61)"
                          className="bg-thirdary/40 border border-text-secondary/20 rounded-xl p-2.5 text-xs font-bold text-text-primary focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const nextStats = [...data.hero.quickStats]
                            nextStats.splice(sIdx, 1)
                            setData({ ...data, hero: { ...data.hero, quickStats: nextStats } })
                            showToast("Badge dihapus")
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold p-2 cursor-pointer"
                          title="Hapus badge ini"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* LIVE PREVIEW OF FLOATING BADGES */}
                <div className="mt-3 pt-4 border-t border-text-secondary/10">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-3">
                    Preview Tampilan Badge Melayang:
                  </span>
                  <div className="flex flex-col gap-2.5 bg-neutral-900/90 p-3.5 sm:p-5 rounded-2xl border border-white/10 w-full sm:w-fit">
                    {(data.hero.quickStats || []).map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 p-2 sm:p-2.5 pr-3.5 sm:pr-5 rounded-xl shadow-lg max-w-full"
                      >
                        <div className="bg-white text-black p-1.5 rounded-lg text-sm font-bold flex items-center justify-center w-7 h-7 shrink-0">
                          {stat.icon === "code" ? "</>" : stat.icon === "server" ? "🖥" : stat.icon === "star" ? "⭐" : stat.icon === "work" ? "💼" : stat.icon === "zap" ? "⚡" : "🎓"}
                        </div>
                        <span className="text-xs font-bold text-white break-words sm:whitespace-nowrap">{stat.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: HERO / HOME ===================== */}
          {activeTab === "hero" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Home / Hero Section</h2>
                <p className="text-sm text-text-secondary mt-1">Ubah teks pembuka, nama, jabatan animasi mengetik, dan bio pembuka.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                    Sapaan (Greeting)
                  </label>
                  <input
                    type="text"
                    value={data.hero.greeting || ""}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, greeting: e.target.value } })}
                    className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={data.hero.name || ""}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, name: e.target.value } })}
                    className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    type="text"
                    value={data.hero.fullName || ""}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, fullName: e.target.value } })}
                    className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                    Link URL Tombol CV
                  </label>
                  <input
                    type="text"
                    value={data.hero.cvUrl || "/cv"}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, cvUrl: e.target.value } })}
                    className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                  />
                </div>
              </div>

              {/* Animated Typewriter Titles */}
              <div className="bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-4">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-1">
                    Daftar Gelar / Spesialisasi (Efek Animasi Mengetik / Typewriter)
                  </label>
                  <div className="flex flex-wrap gap-2 my-3">
                    {(data.hero.titles || []).map((title, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 bg-text-primary text-background px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        {title}
                        <button
                          type="button"
                          onClick={() => {
                            const newTitles = [...data.hero.titles]
                            newTitles.splice(i, 1)
                            setData({
                              ...data,
                              hero: {
                                ...data.hero,
                                titles: newTitles,
                                titlesRaw: newTitles.join("\n"),
                              } as any,
                            })
                          }}
                          className="hover:text-red-300 text-xs font-black cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      id="newHeroTitleInput"
                      placeholder="Tambah spesialisasi baru (pisahkan koma jika lebih dari satu)..."
                      className="flex-1 bg-background border border-text-secondary/20 rounded-xl px-4 py-2 text-sm font-medium"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const val = (e.target as HTMLInputElement).value.trim()
                          if (val) {
                            const added = val.includes(",")
                              ? val.split(",").map((s) => s.trim()).filter(Boolean)
                              : [val]
                            const newTitles = [...data.hero.titles, ...added]
                            setData({
                              ...data,
                              hero: {
                                ...data.hero,
                                titles: newTitles,
                                titlesRaw: newTitles.join("\n"),
                              } as any,
                            })
                            ;(e.target as HTMLInputElement).value = ""
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newHeroTitleInput") as HTMLInputElement
                        if (input && input.value.trim()) {
                          const val = input.value.trim()
                          const added = val.includes(",")
                            ? val.split(",").map((s) => s.trim()).filter(Boolean)
                            : [val]
                          const newTitles = [...data.hero.titles, ...added]
                          setData({
                            ...data,
                            hero: {
                              ...data.hero,
                              titles: newTitles,
                              titlesRaw: newTitles.join("\n"),
                            } as any,
                          })
                          input.value = ""
                        }
                      }}
                      className="bg-text-primary text-background px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
                    >
                      + Tambah
                    </button>
                  </div>

                  <div className="pt-2 border-t border-text-secondary/10">
                    <label className="text-[11px] uppercase font-bold text-text-secondary block mb-1">
                      Atau Edit Semua Spesialisasi Sekaligus (Satu per baris, bebas enter ke baris baru):
                    </label>
                    <textarea
                      rows={4}
                      value={
                        (data.hero as any).titlesRaw !== undefined
                          ? (data.hero as any).titlesRaw
                          : (data.hero.titles || []).join("\n")
                      }
                      onChange={(e) => {
                        const val = e.target.value
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            titlesRaw: val,
                            titles: val.split("\n").map((t) => t.trim()).filter(Boolean),
                          } as any,
                        })
                      }}
                      placeholder="Software Engineer&#10;QA Analyst&#10;Full-Stack Web Developer"
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-text-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                  Deskripsi / Bio Singkat Hero
                </label>
                <textarea
                  rows={4}
                  value={data.hero.description || ""}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                  className="w-full bg-background border border-text-secondary/20 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-text-primary"
                />
              </div>

              {/* FLOATING QUICK STATS BADGES SECTION (Melayang di Foto Hero) */}
              <div className="bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-secondary/10 pb-4">
                  <div>
                    <h3 className="text-base font-black text-text-primary">
                      Floating Quick Stats Badges (Badge Melayang di Samping Foto Hero)
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Pills melayang yang tampil di pojok foto profil Anda pada halaman utama.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = Date.now()
                      const currentStats = data.hero.quickStats || []
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          quickStats: [
                            ...currentStats,
                            { id: newId, message: "Badge Baru", icon: "star" },
                          ],
                        },
                      })
                      showToast("Badge baru berhasil ditambahkan!")
                    }}
                    className="bg-text-primary text-background px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer shadow-sm"
                  >
                    + Tambah Badge Baru
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {(data.hero.quickStats || []).map((stat, sIdx) => (
                    <div
                      key={stat.id || sIdx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-background p-4 rounded-2xl border border-text-secondary/20 items-center shadow-xs"
                    >
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-text-secondary">Pilih Icon</label>
                        <select
                          value={stat.icon || "education"}
                          onChange={(e) => {
                            const nextStats = [...data.hero.quickStats]
                            nextStats[sIdx].icon = e.target.value
                            setData({ ...data, hero: { ...data.hero, quickStats: nextStats } })
                          }}
                          className="bg-thirdary/40 border border-text-secondary/20 rounded-xl p-2.5 text-xs font-semibold text-text-primary focus:outline-none"
                        >
                          <option value="education">🎓 Pendidikan / Gelar (S.Kom.)</option>
                          <option value="code">💻 Developer / Coding / QA (&lt;/&gt;)</option>
                          <option value="server">🖥 Server / Cloud / DevOps</option>
                          <option value="star">⭐ Bintang / Prestasi</option>
                          <option value="work">💼 Karir / Pekerjaan</option>
                          <option value="zap">⚡ Inovasi / Kecepatan</option>
                        </select>
                      </div>

                      <div className="sm:col-span-7 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-text-secondary">Teks Pesan Badge</label>
                        <input
                          type="text"
                          value={stat.message}
                          onChange={(e) => {
                            const nextStats = [...data.hero.quickStats]
                            nextStats[sIdx].message = e.target.value
                            setData({ ...data, hero: { ...data.hero, quickStats: nextStats } })
                          }}
                          placeholder="Contoh: S.Kom. Graduate (IPK 3.61)"
                          className="bg-thirdary/40 border border-text-secondary/20 rounded-xl p-2.5 text-xs font-bold text-text-primary focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const nextStats = [...data.hero.quickStats]
                            nextStats.splice(sIdx, 1)
                            setData({ ...data, hero: { ...data.hero, quickStats: nextStats } })
                            showToast("Badge dihapus")
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold p-2 cursor-pointer"
                          title="Hapus badge ini"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links on Hero */}
              <div className="border-t border-text-secondary/15 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
                  Tautan Sosial Media Hero (Termasuk GitHub & Instagram)
                </h3>
                <div className="flex flex-col gap-3">
                  {(data.hero.socialLinks || []).map((s, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-thirdary/15 p-3 rounded-xl border border-text-secondary/10">
                      <span className="text-xs font-bold text-text-primary self-center">{s.name}</span>
                      <input
                        type="text"
                        value={s.href}
                        onChange={(e) => {
                          const nextSocial = [...data.hero.socialLinks]
                          nextSocial[idx].href = e.target.value
                          setData({ ...data, hero: { ...data.hero, socialLinks: nextSocial } })
                        }}
                        className="sm:col-span-2 bg-background border border-text-secondary/20 rounded-xl p-2 text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: ABOUT ME (WHO AM I ONLY) ===================== */}
          {activeTab === "about" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">About Me Section</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Ubah foto profil About Me, narasi profil "Who Am I", dan rincian data diri. Foto About Me mandiri dan tidak mengikuti Home.
                </p>
              </div>

              {/* FOTO PROFIL ABOUT ME MANAGER */}
              <div className="bg-thirdary/20 p-5 sm:p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-secondary/10 pb-3">
                  <div>
                    <h3 className="text-base font-black text-text-primary flex items-center gap-2">
                      <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Foto Profil Bagian About Me (Mandiri)
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Foto yang tampil di bagian Tentang Saya pada Live Site. Mandiri dan tidak mengikuti Home / Hero.
                    </p>
                  </div>
                  <span className="bg-text-primary/10 text-text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Independen
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-4 flex flex-col items-center">
                    <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-text-primary shadow-md bg-thirdary">
                      <img
                        src={data.about.profileImage || data.hero.profileImage || "/images/hero.jpg"}
                        alt="Foto About Me"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary mt-2">Preview Foto About Me (4:5)</span>
                  </div>

                  <div className="sm:col-span-8 flex flex-col gap-3">
                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                        Upload Foto Baru
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "about")}
                        disabled={uploading}
                        className="block w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-text-primary file:text-background hover:file:opacity-90 file:cursor-pointer cursor-pointer border border-text-secondary/20 rounded-xl p-1.5 bg-background"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                        Atau URL / Path Foto
                      </label>
                      <input
                        type="text"
                        value={data.about.profileImage || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            about: { ...prev.about, profileImage: e.target.value },
                          }))
                        }
                        placeholder="/images/adhitya.jpg atau https://..."
                        className="w-full bg-background border border-text-secondary/20 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const homeImg = data.hero.profileImage || "/images/hero.jpg"
                        setData((prev) => ({
                          ...prev,
                          about: { ...prev.about, profileImage: homeImg },
                        }))
                        showToast("Foto About Me disamakan dengan foto Home / Hero!")
                      }}
                      className="text-xs text-text-primary hover:underline font-semibold cursor-pointer text-left"
                    >
                      Salin dari Foto Home / Hero
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                    Section Sub-heading
                  </label>
                  <input
                    type="text"
                    value={data.about.sectionTag || ""}
                    onChange={(e) => setData({ ...data, about: { ...data.about, sectionTag: e.target.value } })}
                    className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={data.about.title || ""}
                    onChange={(e) => setData({ ...data, about: { ...data.about, title: e.target.value } })}
                    className="w-full bg-background border border-text-secondary/20 rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-2">
                  Who Am I (Siapa Saya - Live Site)
                </label>
                <textarea
                  rows={5}
                  value={data.about.whoAmI || ""}
                  onChange={(e) => setData({ ...data, about: { ...data.about, whoAmI: e.target.value } })}
                  className="w-full bg-background border border-text-secondary/20 rounded-xl p-4 text-sm font-medium"
                />
              </div>

              {/* Profile Khusus CV ATS (Independen / Berdiri Sendiri) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-thirdary/30 border-2 border-text-primary/20 flex flex-col gap-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-text-secondary/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📄</span>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
                        Profile Khusus CV ATS (Halaman /cv)
                      </h3>
                      <p className="text-[11px] text-text-secondary">
                        Khusus tampil di lembar CV ATS • Mandiri & tidak merubah tulisan Live Site
                      </p>
                    </div>
                  </div>
                  <a
                    href="/cv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold bg-text-primary text-background px-3 py-1.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <span>Lihat CV ATS</span>
                    <span>↗</span>
                  </a>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Tulis kalimat ringkasan profil yang ingin Anda tampilkan pada lembar CV ATS. Kolom ini mandiri, sehingga Anda bebas menyesuaikan kalimat yang diinginkan tanpa mengikuti atau mempengaruhi tulisan pada live site.
                </p>

                <textarea
                  rows={5}
                  value={(data as any).cvProfile || ""}
                  onChange={(e) => setData({ ...data, cvProfile: e.target.value } as any)}
                  placeholder="Contoh: Sarjana Komputer (S.Kom.) Sistem Informasi dari Institut Teknologi Kalimantan (ITK) dengan spesialisasi Software Engineering..."
                  className="w-full bg-background border border-text-secondary/25 rounded-xl p-4 text-sm font-medium focus:border-text-primary focus:outline-none leading-relaxed"
                />

                <div className="flex flex-wrap items-center justify-between text-xs text-text-secondary pt-1 gap-2">
                  <span>{((data as any).cvProfile || "").length} karakter</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("photo")}
                      className="text-text-primary hover:underline font-semibold cursor-pointer"
                    >
                      📸 Ganti Foto CV ATS
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setData({ ...data, cvProfile: data.about.whoAmI } as any)
                        showToast("Teks Profile CV disamakan dengan Who Am I")
                      }}
                      className="text-text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Salin dari "Who Am I"
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-text-secondary/15 pt-6">
                <h3 className="text-lg font-bold text-text-primary mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Nama</label>
                    <input
                      type="text"
                      value={data.about.personalDetails?.name || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            personalDetails: { ...data.about.personalDetails, name: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Lokasi</label>
                    <input
                      type="text"
                      value={data.about.personalDetails?.location || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            personalDetails: { ...data.about.personalDetails, location: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Telepon / WA</label>
                    <input
                      type="text"
                      value={data.about.personalDetails?.phone || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            personalDetails: { ...data.about.personalDetails, phone: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">IPK (GPA)</label>
                    <input
                      type="text"
                      value={data.about.personalDetails?.gpa || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            personalDetails: { ...data.about.personalDetails, gpa: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Email</label>
                    <input
                      type="text"
                      value={data.about.personalDetails?.email || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            personalDetails: { ...data.about.personalDetails, email: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Pendidikan</label>
                    <input
                      type="text"
                      value={data.about.personalDetails?.education || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            personalDetails: { ...data.about.personalDetails, education: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Marquee Running Text & Backdrop */}
              <div className="border-t border-text-secondary/15 pt-6 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-text-primary">Efek Teks Marquee & Background</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                      Backdrop Word (Teks Watermark Besar)
                    </label>
                    <input
                      type="text"
                      value={data.about.backdropWord || "ENG."}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            backdropWord: e.target.value,
                          },
                        })
                      }
                      placeholder="ENG."
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                      Teks Berjalan Marquee (Satu per baris, bebas tekan Enter untuk baris baru)
                    </label>
                    <textarea
                      rows={3}
                      value={
                        (data.about as any).scrollTextsRaw !== undefined
                          ? (data.about as any).scrollTextsRaw
                          : (data.about.scrollTexts || []).join("\n")
                      }
                      onChange={(e) => {
                        const val = e.target.value
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            scrollTextsRaw: val,
                            scrollTexts: val.split("\n").map((s) => s.trim()).filter(Boolean),
                          } as any,
                        })
                      }}
                      placeholder="Adhitya Hermawan, S.Kom.&#10;Software Engineer | QA Analyst | Business Intelligence"
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: WORK EXPERIENCE ===================== */}
          {activeTab === "experience" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">Work Experience (Karir)</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Khusus riwayat pekerjaan dan magang industri profesional.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = Date.now()
                    setData({
                      ...data,
                      experience: {
                        ...data.experience,
                        items: [
                          {
                            id: newId,
                            company: "Perusahaan Baru",
                            role: "Posisi / Role",
                            date: "Tahun Mulai - Selesai",
                            description: "Uraian tugas dan kontribusi Anda.",
                            skills: ["Docker", "Laravel"],
                          },
                          ...data.experience.items,
                        ],
                      },
                    })
                    showToast("Item pengalaman kerja baru ditambahkan!")
                  }}
                  className="bg-text-primary text-background px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  + Tambah Pengalaman Kerja
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {(data.experience.items || []).map((exp, index) => (
                  <div
                    key={exp.id || index}
                    className="p-6 rounded-2xl bg-thirdary/20 border border-text-secondary/15 flex flex-col gap-4 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-text-secondary/10 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Pengalaman Kerja #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextItems = [...data.experience.items]
                          nextItems.splice(index, 1)
                          setData({ ...data, experience: { ...data.experience, items: nextItems } })
                          showToast("Pengalaman dihapus")
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Perusahaan</label>
                        <input
                          type="text"
                          value={exp.company || ""}
                          onChange={(e) => {
                            const nextItems = [...data.experience.items]
                            nextItems[index].company = e.target.value
                            setData({ ...data, experience: { ...data.experience, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Jabatan / Role</label>
                        <input
                          type="text"
                          value={exp.role || ""}
                          onChange={(e) => {
                            const nextItems = [...data.experience.items]
                            nextItems[index].role = e.target.value
                            setData({ ...data, experience: { ...data.experience, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Periode / Waktu</label>
                        <input
                          type="text"
                          value={exp.date || ""}
                          onChange={(e) => {
                            const nextItems = [...data.experience.items]
                            nextItems[index].date = e.target.value
                            setData({ ...data, experience: { ...data.experience, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Deskripsi</label>
                      <textarea
                        rows={3}
                        value={exp.description || ""}
                        onChange={(e) => {
                          const nextItems = [...data.experience.items]
                          nextItems[index].description = e.target.value
                          setData({ ...data, experience: { ...data.experience, items: nextItems } })
                        }}
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                        Skills / Tags (Pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        value={
                          (exp as any).skillsRaw !== undefined
                            ? (exp as any).skillsRaw
                            : (exp.skills || []).join(", ")
                        }
                        onChange={(e) => {
                          const val = e.target.value
                          const nextItems = [...data.experience.items]
                          nextItems[index] = {
                            ...nextItems[index],
                            skillsRaw: val,
                            skills: val
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          } as any
                          setData({ ...data, experience: { ...data.experience, items: nextItems } })
                        }}
                        placeholder="Contoh: Docker, Linux VPS, Keycloak, Camunda"
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 5: EDUCATION ===================== */}
          {activeTab === "education" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">Education (Pendidikan)</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Khusus riwayat pendidikan formal, IPK, gelar, dan kepemimpinan organisasi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = Date.now()
                    const currentEd = (data as any).education?.items || []
                    setData({
                      ...data,
                      education: {
                        ...((data as any).education || { sectionTag: "Academic Background", title: "Education & Leadership" }),
                        items: [
                          {
                            id: newId,
                            institution: "Nama Institusi / Kampus Baru",
                            degree: "Gelar / Program Studi",
                            date: "Tahun - Tahun",
                            gpa: "3.61 / 4.00",
                            location: "Lokasi",
                            description: "Deskripsi kelulusan dan konsentrasi studi.",
                            activities: ["Aktivitas 1", "Aktivitas 2"],
                          },
                          ...currentEd,
                        ],
                      },
                    })
                    showToast("Pendidikan baru ditambahkan!")
                  }}
                  className="bg-text-primary text-background px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  + Tambah Pendidikan
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {(((data as any).education?.items) || []).map((edu: any, index: number) => (
                  <div
                    key={edu.id || index}
                    className="p-6 rounded-2xl bg-thirdary/20 border border-text-secondary/15 flex flex-col gap-4 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-text-secondary/10 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Pendidikan #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextItems = [...(data as any).education.items]
                          nextItems.splice(index, 1)
                          setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                          showToast("Pendidikan dihapus")
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Institusi</label>
                        <input
                          type="text"
                          value={edu.institution || ""}
                          onChange={(e) => {
                            const nextItems = [...(data as any).education.items]
                            nextItems[index].institution = e.target.value
                            setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Gelar / Jurusan</label>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => {
                            const nextItems = [...(data as any).education.items]
                            nextItems[index].degree = e.target.value
                            setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Periode / Waktu</label>
                        <input
                          type="text"
                          value={edu.date || ""}
                          onChange={(e) => {
                            const nextItems = [...(data as any).education.items]
                            nextItems[index].date = e.target.value
                            setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">IPK (GPA)</label>
                        <input
                          type="text"
                          value={edu.gpa || ""}
                          onChange={(e) => {
                            const nextItems = [...(data as any).education.items]
                            nextItems[index].gpa = e.target.value
                            setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Lokasi</label>
                        <input
                          type="text"
                          value={edu.location || ""}
                          onChange={(e) => {
                            const nextItems = [...(data as any).education.items]
                            nextItems[index].location = e.target.value
                            setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Deskripsi</label>
                      <textarea
                        rows={3}
                        value={edu.description || ""}
                        onChange={(e) => {
                          const nextItems = [...(data as any).education.items]
                          nextItems[index].description = e.target.value
                          setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                        }}
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                        Aktivitas & Kepemimpinan (Satu per baris, bebas tekan Enter untuk baris baru)
                      </label>
                      <textarea
                        rows={4}
                        value={
                          (edu as any).activitiesRaw !== undefined
                            ? (edu as any).activitiesRaw
                            : (edu.activities || []).join("\n")
                        }
                        onChange={(e) => {
                          const val = e.target.value
                          const nextItems = [...((data as any).education?.items || [])]
                          nextItems[index] = {
                            ...nextItems[index],
                            activitiesRaw: val,
                            activities: val
                              .split("\n")
                              .map((a: string) => a.trim())
                              .filter(Boolean),
                          } as any
                          setData({ ...data, education: { ...(data as any).education, items: nextItems } })
                        }}
                        placeholder="Aktivitas 1 (tekan Enter untuk baris baru)&#10;Aktivitas 2&#10;Aktivitas 3"
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bagian Khusus Kepanitiaan & Organisasi (Tampil di CV ATS) */}
              <div className="border-t border-text-secondary/15 pt-8 mt-4 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-text-primary tracking-tight">
                      🏛️ Kepanitiaan & Organisasi (Tampil di CV ATS)
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Kelola daftar peran kepanitiaan dan kepengurusan organisasi untuk ditampilkan di lembar CV ATS.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = Date.now()
                      const currentOrgs = (data as any).organizations || []
                      setData({
                        ...data,
                        organizations: [
                          {
                            id: newId,
                            role: "Jabatan / Peran Baru",
                            organization: "Nama Organisasi / Kepanitiaan",
                            date: "Tahun",
                            description: "Deskripsi singkat kontribusi dan tanggung jawab.",
                          },
                          ...currentOrgs,
                        ],
                      } as any)
                      showToast("Pengalaman organisasi baru ditambahkan!")
                    }}
                    className="bg-text-primary text-background px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer shadow-xs"
                  >
                    + Tambah Organisasi / Kepanitiaan
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {(((data as any).organizations) || []).map((org: any, orgIdx: number) => (
                    <div
                      key={org.id || orgIdx}
                      className="p-5 rounded-2xl bg-thirdary/20 border border-text-secondary/15 flex flex-col gap-3.5 relative"
                    >
                      <div className="flex items-center justify-between border-b border-text-secondary/10 pb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                          Organisasi #{orgIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextOrgs = [...((data as any).organizations || [])]
                            nextOrgs.splice(orgIdx, 1)
                            setData({ ...data, organizations: nextOrgs } as any)
                            showToast("Organisasi dihapus")
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] uppercase font-bold text-text-secondary block mb-1">
                            Jabatan / Role
                          </label>
                          <input
                            type="text"
                            value={org.role || ""}
                            onChange={(e) => {
                              const nextOrgs = [...((data as any).organizations || [])]
                              nextOrgs[orgIdx] = { ...nextOrgs[orgIdx], role: e.target.value }
                              setData({ ...data, organizations: nextOrgs } as any)
                            }}
                            className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase font-bold text-text-secondary block mb-1">
                            Periode / Tahun
                          </label>
                          <input
                            type="text"
                            value={org.date || ""}
                            onChange={(e) => {
                              const nextOrgs = [...((data as any).organizations || [])]
                              nextOrgs[orgIdx] = { ...nextOrgs[orgIdx], date: e.target.value }
                              setData({ ...data, organizations: nextOrgs } as any)
                            }}
                            className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-bold text-text-secondary block mb-1">
                          Nama Organisasi / Kepanitiaan
                        </label>
                        <input
                          type="text"
                          value={org.organization || ""}
                          onChange={(e) => {
                            const nextOrgs = [...((data as any).organizations || [])]
                            nextOrgs[orgIdx] = { ...nextOrgs[orgIdx], organization: e.target.value }
                            setData({ ...data, organizations: nextOrgs } as any)
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-bold text-text-secondary block mb-1">
                          Deskripsi Singkat / Kontribusi
                        </label>
                        <textarea
                          rows={2}
                          value={org.description || ""}
                          onChange={(e) => {
                            const nextOrgs = [...((data as any).organizations || [])]
                            nextOrgs[orgIdx] = { ...nextOrgs[orgIdx], description: e.target.value }
                            setData({ ...data, organizations: nextOrgs } as any)
                          }}
                          className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 6: MY TECH STACK (WITH AUTO ICON DETECTION) ===================== */}
          {activeTab === "techstack" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">My Tech Stack</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Saat mengetik nama teknologi (misal: <code>react</code>, <code>laravel</code>, <code>docker</code>),
                  icon logo resmi akan <strong>otomatis terdeteksi dan muncul langsung</strong>!
                </p>
              </div>

              {/* LIVE AUTO ICON DETECTOR BOX */}
              <div className="bg-thirdary/30 border-2 border-text-primary/30 p-6 rounded-3xl flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
                    <h3 className="text-base font-black text-text-primary tracking-tight">
                      Automatic Icon Detection Generator
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-text-primary text-background px-2.5 py-1 rounded-full">
                    Auto-Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-4 flex flex-col gap-1.5">
                    <label className="text-xs uppercase font-bold tracking-wider text-text-secondary">
                      Pilih Kategori Tujuan
                    </label>
                    <select
                      value={techTargetCategory}
                      onChange={(e) => setTechTargetCategory(Number(e.target.value))}
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-text-primary"
                    >
                      {(data.techStack.categories || []).map((cat, idx) => (
                        <option key={idx} value={idx}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-5 flex flex-col gap-1.5">
                    <label className="text-xs uppercase font-bold tracking-wider text-text-secondary">
                      Ketik Nama Teknologi (misal: React, Docker, Laravel, Vue)
                    </label>
                    <input
                      type="text"
                      value={techInputName}
                      onChange={(e) => setTechInputName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTechnology()
                        }
                      }}
                      placeholder="Ketik react, vue, laravel, python, figma..."
                      className="w-full bg-background border-2 border-text-primary/50 rounded-xl px-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:border-text-primary"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={handleAddTechnology}
                      disabled={!techInputName.trim()}
                      className="w-full bg-text-primary text-background py-3.5 px-4 rounded-xl text-sm font-black hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>+ Tambahkan</span>
                    </button>
                  </div>
                </div>

                {/* LIVE PREVIEW BADGE */}
                <div className="bg-background border border-text-secondary/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-thirdary/40 border-2 border-text-secondary/30 flex items-center justify-center p-2.5">
                      {techInputUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={techInputUrl}
                          alt="Preview"
                          className="w-full h-full object-contain dark:brightness-125"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.style.display = "none"
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `<span class="font-bold text-xl">${
                                techInputName ? techInputName.charAt(0).toUpperCase() : "?"
                              }</span>`
                            }
                          }}
                        />
                      ) : (
                        <span className="text-text-secondary text-xs font-bold text-center">No Icon</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Preview Icon Otomatis:</p>
                      <h4 className="text-base font-black text-text-primary">
                        {techInputName ? techInputName : "Ketik nama teknologi di atas..."}
                      </h4>
                      <p className="text-[11px] font-mono text-text-secondary/80 truncate max-w-sm sm:max-w-md">
                        {techInputUrl || "URL logo akan terisi otomatis"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      Saran Cepat:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedIcons.slice(0, 6).map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setTechInputName(item.name)
                            setTechInputUrl(item.url)
                          }}
                          className="text-[11px] font-semibold bg-thirdary hover:bg-text-primary hover:text-background px-2.5 py-1 rounded-lg border border-text-secondary/15 transition-all cursor-pointer"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CATEGORIES & CURRENT TECH LIST */}
              <div className="flex flex-col gap-8">
                {(data.techStack.categories || []).map((cat, catIdx) => (
                  <div
                    key={catIdx}
                    className="bg-thirdary/15 border border-text-secondary/15 rounded-2xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between border-b border-text-secondary/10 pb-3">
                      <div>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const nextCats = [...data.techStack.categories]
                            nextCats[catIdx].title = e.target.value
                            setData({ ...data, techStack: { ...data.techStack, categories: nextCats } })
                          }}
                          className="text-lg font-black text-text-primary bg-transparent border-b border-dashed border-text-secondary/30 focus:outline-none focus:border-text-primary"
                        />
                        <input
                          type="text"
                          value={cat.description || ""}
                          onChange={(e) => {
                            const nextCats = [...data.techStack.categories]
                            nextCats[catIdx].description = e.target.value
                            setData({ ...data, techStack: { ...data.techStack, categories: nextCats } })
                          }}
                          placeholder="Deskripsi kategori..."
                          className="text-xs text-text-secondary bg-transparent w-full mt-1 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextCats = [...data.techStack.categories]
                          nextCats.splice(catIdx, 1)
                          setData({ ...data, techStack: { ...data.techStack, categories: nextCats } })
                          showToast("Kategori dihapus")
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Hapus Kategori
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {(cat.technologies || []).map((tech, techIdx) => (
                        <div
                          key={techIdx}
                          className="bg-background border border-text-secondary/15 hover:border-text-primary rounded-xl p-3 flex flex-col items-center justify-center relative group shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const nextCats = [...data.techStack.categories]
                              nextCats[catIdx].technologies.splice(techIdx, 1)
                              setData({ ...data, techStack: { ...data.techStack, categories: nextCats } })
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                            title="Hapus item ini"
                          >
                            ✕
                          </button>

                          <div className="w-10 h-10 mb-2 flex items-center justify-center">
                            {tech.svg ? (
                              tech.svg.startsWith("<") ? (
                                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: tech.svg }} />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={tech.svg}
                                  alt={tech.name}
                                  className="w-8 h-8 object-contain dark:brightness-125"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              )
                            ) : (
                              <span className="font-bold text-base">{tech.name.charAt(0)}</span>
                            )}
                          </div>

                          <input
                            type="text"
                            value={tech.name}
                            onChange={(e) => {
                              const nextCats = [...data.techStack.categories]
                              nextCats[catIdx].technologies[techIdx].name = e.target.value
                              setData({ ...data, techStack: { ...data.techStack, categories: nextCats } })
                            }}
                            className="text-xs font-bold text-center text-text-primary bg-transparent w-full focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const autoUrl = resolveTechIcon(tech.name)
                              const nextCats = [...data.techStack.categories]
                              nextCats[catIdx].technologies[techIdx].svg = autoUrl
                              setData({ ...data, techStack: { ...data.techStack, categories: nextCats } })
                              showToast(`Icon untuk ${tech.name} diperbarui!`)
                            }}
                            className="text-[9px] text-text-secondary hover:text-text-primary mt-1 underline cursor-pointer"
                          >
                            Re-detect Icon
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 7: SELECTED WORKS / PROJECTS ===================== */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">Selected Works / Portfolio</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Ganti atau upload screenshot proyek, edit deskripsi, dan perbarui link.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextItems = [
                      {
                        id: Date.now(),
                        imagePath: "/images/simpro.jpg",
                        title: "Judul Proyek Baru",
                        shortDescription: "Deskripsi singkat tentang proyek baru ini dan tujuan solusinya.",
                        createdAt: new Date().getFullYear().toString(),
                        features: ["Fitur Unggulan 1", "Fitur Unggulan 2", "Fitur Unggulan 3"],
                        tech: ["React", "Node.js", "Tailwind CSS"],
                        githubUrl: "https://github.com/adhitya09",
                        liveDemoUrl: "https://demo.com",
                        isPrivateRepo: false,
                      },
                      ...data.projects.items,
                    ]
                    setData({
                      ...data,
                      projects: {
                        ...data.projects,
                        items: nextItems,
                      },
                    })
                    showToast("Proyek baru berhasil ditambahkan di urutan pertama!")
                  }}
                  className="bg-text-primary text-background px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  + Tambah Proyek Baru
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {(data.projects.items || []).map((project, index) => (
                  <div
                    key={project.id || index}
                    className="p-6 rounded-3xl bg-thirdary/20 border border-text-secondary/15 flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between border-b border-text-secondary/10 pb-4">
                      <span className="text-sm font-black text-text-primary">
                        Proyek #{index + 1}: {project.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextItems = [...data.projects.items]
                          nextItems.splice(index, 1)
                          setData({ ...data, projects: { ...data.projects, items: nextItems } })
                          showToast("Proyek dihapus")
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Hapus Proyek Ini
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Screenshot Preview & Direct Upload */}
                      <div className="lg:col-span-5 flex flex-col gap-3">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-text-secondary/20 bg-background shadow-md">
                          <Image
                            src={project.imagePath || "/images/simpro.jpg"}
                            alt={project.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                            Ganti / Upload Screenshot Baru
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, "project", index)}
                            className="block w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-text-primary file:text-background cursor-pointer border border-text-secondary/20 rounded-xl p-1 bg-background"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                            Atau Path / URL Screenshot
                          </label>
                          <input
                            type="text"
                            value={project.imagePath || ""}
                            onChange={(e) => {
                              const nextItems = [...data.projects.items]
                              nextItems[index].imagePath = e.target.value
                              setData({ ...data, projects: { ...data.projects, items: nextItems } })
                            }}
                            className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-xs font-medium"
                          />
                        </div>
                      </div>

                      {/* Project Fields */}
                      <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                              Judul Proyek
                            </label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => {
                                const nextItems = [...data.projects.items]
                                nextItems[index].title = e.target.value
                                setData({ ...data, projects: { ...data.projects, items: nextItems } })
                              }}
                              className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                              Tahun / Waktu
                            </label>
                            <input
                              type="text"
                              value={project.createdAt}
                              onChange={(e) => {
                                const nextItems = [...data.projects.items]
                                nextItems[index].createdAt = e.target.value
                                setData({ ...data, projects: { ...data.projects, items: nextItems } })
                              }}
                              className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                            Deskripsi Singkat
                          </label>
                          <textarea
                            rows={3}
                            value={project.shortDescription || ""}
                            onChange={(e) => {
                              const nextItems = [...data.projects.items]
                              nextItems[index].shortDescription = e.target.value
                              setData({ ...data, projects: { ...data.projects, items: nextItems } })
                            }}
                            className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                            Tech Stack Tags (Pisahkan koma)
                          </label>
                          <input
                            type="text"
                            value={
                              (project as any).techRaw !== undefined
                                ? (project as any).techRaw
                                : (project.tech || []).join(", ")
                            }
                            onChange={(e) => {
                              const val = e.target.value
                              const nextItems = [...data.projects.items]
                              nextItems[index] = {
                                ...nextItems[index],
                                techRaw: val,
                                tech: val
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              } as any
                              setData({ ...data, projects: { ...data.projects, items: nextItems } })
                            }}
                            placeholder="Contoh: React, Node.js, Tailwind CSS"
                            className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                            Fitur Utama (Satu per baris, bebas tekan Enter untuk baris baru)
                          </label>
                          <textarea
                            rows={4}
                            value={
                              (project as any).featuresRaw !== undefined
                                ? (project as any).featuresRaw
                                : (project.features || []).join("\n")
                            }
                            onChange={(e) => {
                              const val = e.target.value
                              const nextItems = [...data.projects.items]
                              nextItems[index] = {
                                ...nextItems[index],
                                featuresRaw: val,
                                features: val
                                  .split("\n")
                                  .map((f) => f.trim())
                                  .filter(Boolean),
                              } as any
                              setData({ ...data, projects: { ...data.projects, items: nextItems } })
                            }}
                            placeholder="Fitur 1 (tekan Enter untuk baris baru)&#10;Fitur 2&#10;Fitur 3"
                            className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-text-primary"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                              Live Demo URL
                            </label>
                            <input
                              type="text"
                              value={project.liveDemoUrl || ""}
                              onChange={(e) => {
                                const nextItems = [...data.projects.items]
                                nextItems[index].liveDemoUrl = e.target.value
                                setData({ ...data, projects: { ...data.projects, items: nextItems } })
                              }}
                              className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                              Source Code / GitHub URL
                            </label>
                            <input
                              type="text"
                              value={project.githubUrl || ""}
                              onChange={(e) => {
                                const nextItems = [...data.projects.items]
                                nextItems[index].githubUrl = e.target.value
                                setData({ ...data, projects: { ...data.projects, items: nextItems } })
                              }}
                              className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="checkbox"
                            id={`private-${index}`}
                            checked={Boolean(project.isPrivateRepo)}
                            onChange={(e) => {
                              const nextItems = [...data.projects.items]
                              nextItems[index].isPrivateRepo = e.target.checked
                              setData({ ...data, projects: { ...data.projects, items: nextItems } })
                            }}
                            className="w-4 h-4 rounded text-text-primary cursor-pointer"
                          />
                          <label htmlFor={`private-${index}`} className="text-xs font-bold text-text-primary cursor-pointer">
                            Tandai sebagai Private / Enterprise Repository
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 8: CONTACT & MAPS ===================== */}
          {activeTab === "contact" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Contact & Maps</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Atur informasi kontak, koordinat Google Maps, serta kartu media sosial (termasuk GitHub & Instagram).
                </p>
              </div>

              <div className="bg-thirdary/20 p-6 rounded-2xl border border-text-secondary/15 flex flex-col gap-4">
                <h3 className="text-base font-bold text-text-primary">Google Maps Embed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Judul Pin</label>
                    <input
                      type="text"
                      value={data.contact?.map?.title || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: {
                            ...data.contact,
                            map: { ...data.contact.map, title: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Sub-judul Pin</label>
                    <input
                      type="text"
                      value={data.contact?.map?.subtitle || ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: {
                            ...data.contact,
                            map: { ...data.contact.map, subtitle: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    value={data.contact?.map?.embedUrl || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        contact: {
                          ...data.contact,
                          map: { ...data.contact.map, embedUrl: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-text-primary">Kartu Kontak Sosial</h3>
                {(data.contact?.socialCards || []).map((card, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-thirdary/15 p-4 rounded-xl border border-text-secondary/10"
                  >
                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Platform</label>
                      <input
                        type="text"
                        value={card.platform}
                        onChange={(e) => {
                          const nextCards = [...data.contact.socialCards]
                          nextCards[idx].platform = e.target.value
                          setData({ ...data, contact: { ...data.contact, socialCards: nextCards } })
                        }}
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Username / Teks</label>
                      <input
                        type="text"
                        value={card.username}
                        onChange={(e) => {
                          const nextCards = [...data.contact.socialCards]
                          nextCards[idx].username = e.target.value
                          setData({ ...data, contact: { ...data.contact, socialCards: nextCards } })
                        }}
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-bold text-text-secondary block mb-1">Link URL</label>
                      <input
                        type="text"
                        value={card.url}
                        onChange={(e) => {
                          const nextCards = [...data.contact.socialCards]
                          nextCards[idx].url = e.target.value
                          setData({ ...data, contact: { ...data.contact, socialCards: nextCards } })
                        }}
                        className="w-full bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 9: FOOTER ===================== */}
          {activeTab === "footer" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Footer Settings</h2>
                <p className="text-sm text-text-secondary mt-1">Ubah nama hak cipta, subjudul footer, dan tautan.</p>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                  Nama Hak Cipta (Copyright)
                </label>
                <input
                  type="text"
                  value={data.footer?.copyrightName || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, copyrightName: e.target.value },
                    })
                  }
                  className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-text-secondary block mb-1">
                  Sub-judul / Tagline Footer
                </label>
                <input
                  type="text"
                  value={data.footer?.subtitle || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-background border border-text-secondary/20 rounded-xl p-3 text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs uppercase font-bold text-text-secondary block">Tautan Footer</label>
                {(data.footer?.links || []).map((link, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const nextLinks = [...data.footer.links]
                        nextLinks[idx].name = e.target.value
                        setData({ ...data, footer: { ...data.footer, links: nextLinks } })
                      }}
                      className="bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const nextLinks = [...data.footer.links]
                        nextLinks[idx].href = e.target.value
                        setData({ ...data, footer: { ...data.footer, links: nextLinks } })
                      }}
                      className="bg-background border border-text-secondary/20 rounded-xl p-2.5 text-sm font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-4 sm:bottom-6 z-40 max-w-sm mx-auto px-3 sm:px-4 w-full">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="w-full bg-text-primary text-background p-3.5 sm:p-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all cursor-pointer border-2 border-background"
        >
          {saving ? (
            <span>Menyimpan Perubahan...</span>
          ) : (
            <>
              <span>💾 Simpan Semua Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${
          toast.show ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-text-primary text-background border-text-secondary/20"
              : "bg-red-500 text-white border-red-600"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      </div>
    </div>
  )
}
