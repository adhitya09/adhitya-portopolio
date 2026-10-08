"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import FadeDown from "./animations/FadeDown"
import { useLanguage } from "./LanguageContext"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  useEffect(() => {
    setMounted(true)

    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    const prefersDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)

    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", shouldBeDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme ? "dark" : "light")
      document.documentElement.classList.toggle("dark", newTheme)
    }
  }

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = document.querySelectorAll("section")
          let current = ""
          const scrollY = window.scrollY
          sections.forEach((section) => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight
            if (scrollY >= sectionTop - sectionHeight / 3) {
              current = section.getAttribute("id") || ""
            }
          })
          if (current) {
            setActiveSection(current)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return null
  }

  const shortCut = [
    { name: language === "en" ? "Home" : "Beranda", link: "home", id: "home" },
    { name: language === "en" ? "About" : "Tentang", link: "about", id: "about" },
    { name: language === "en" ? "Experience" : "Pengalaman", link: "experience", id: "experience" },
    { name: language === "en" ? "Education" : "Pendidikan", link: "education", id: "education" },
    { name: language === "en" ? "Projects" : "Proyek", link: "projects", id: "projects" },
    { name: language === "en" ? "Contacts" : "Kontak", link: "contacts", id: "contacts" },
  ]

  return (
    <div className="fixed top-3 sm:top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none w-full">
      <div className="w-[96%] max-w-md sm:max-w-xl lg:w-auto lg:max-w-none pointer-events-auto">
        <FadeDown>
          <div className="relative flex items-center justify-between lg:justify-start gap-4 sm:gap-6 lg:gap-7 xl:gap-8 py-2 sm:py-2.5 md:py-3 px-3.5 sm:px-5 md:px-6 bg-background/85 backdrop-blur-md border border-text-secondary/20 rounded-full shadow-lg transition-colors duration-300">
            {/* AH Brand Logo */}
            <button
              onClick={() => handleScroll("home")}
              className="flex items-center group cursor-pointer text-left focus:outline-none shrink-0"
              title="AH | PORTOPOLIO"
              aria-label="Kembali ke Beranda"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-white/25 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="AH Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300"
                  priority
                />
              </div>
            </button>

            {/* Desktop Navigation Links (Spaced identically from logo to every item) */}
            <nav className="hidden lg:flex items-center gap-6 lg:gap-7 xl:gap-8">
              {shortCut.map((item, index) => (
                <button 
                  onClick={() => handleScroll(item.link)} 
                  key={index} 
                  className={`
                    ${activeSection === item.id ? "text-text-primary font-bold" : "text-text-secondary font-medium hover:text-text-primary"} 
                    cursor-pointer text-sm md:text-[15px] tracking-wide flex flex-row items-center transition-colors duration-200 ease-in-out whitespace-nowrap
                  `}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Subtle Divider before Controls on Desktop */}
            <div className="hidden lg:block h-4 w-px bg-text-secondary/25 shrink-0" />

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Language Switcher Button (ID / EN) */}
              <button
                onClick={() => setLanguage(language === "id" ? "en" : "id")}
                className="cursor-pointer text-[11px] sm:text-xs font-bold tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-text-secondary/25 hover:border-text-primary text-text-primary bg-thirdary/30 hover:bg-thirdary transition-all flex items-center gap-1 sm:gap-1.5"
                title="Ganti Bahasa (Switch Language)"
              >
                <span className={language === "id" ? "text-text-primary font-black" : "text-text-secondary font-medium"}>ID</span>
                <span className="text-text-secondary/40 font-light text-[10px]">|</span>
                <span className={language === "en" ? "text-text-primary font-black" : "text-text-secondary font-medium"}>EN</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors p-1"
                onClick={() => {
                  toggleTheme()
                }}
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button 
                className="lg:hidden text-text-secondary hover:text-text-primary p-1 cursor-pointer" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation Menu"
              >
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                   <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M5 7h14M5 12h14M5 17h14"} />
                </svg>
              </button>
            </div>

            {/* Mobile & Tablet Menu Dropdown */}
            {isOpen && (
              <div 
                className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}
            <div className={`${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"} lg:hidden transform absolute top-14 sm:top-16 right-2 sm:right-4 z-50 origin-top-right transition-all duration-300 ease-in-out`}>
              <div className="flex flex-col gap-3 bg-background/95 backdrop-blur-xl border border-text-secondary/20 p-4 sm:p-5 rounded-2xl shadow-2xl w-48 sm:w-56">
                {shortCut.map((item, index) => (
                  <button 
                    onClick={() => { handleScroll(item.link); setIsOpen(false); }} 
                    key={index} 
                    className={`
                      ${activeSection === item.id ? "text-text-primary font-bold bg-thirdary/40" : "text-text-secondary font-medium hover:bg-thirdary/20"} 
                      cursor-pointer text-sm px-3 py-2 rounded-xl flex items-center hover:text-text-primary transition-all duration-200 text-left
                    `}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeDown>
      </div>
    </div>
  )
}
