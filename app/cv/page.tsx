"use client"
import React from "react"
import Link from "next/link"
import { usePortfolio } from "@/components/PortfolioContext"
import { useLanguage } from "@/components/LanguageContext"

export default function ATSCVPage() {
  const { data } = usePortfolio()
  const { language, setLanguage } = useLanguage()

  const hero = data.hero || {}
  const about = data.about || {}
  const details = about.personalDetails || {}
  const experience = data.experience?.items || []
  const education = (data as any).education?.items || []
  const organizations = (data as any).organizations || []
  const projects = data.projects?.items || []
  const techCategories = data.techStack?.categories || []

  // Dynamic CV profile with fallback
  const cvProfile =
    (data as any).cvProfile ||
    about.whoAmI ||
    hero.description ||
    ""

  // Photo (Prioritizes dedicated CV photo from CMS, falls back to hero/about photo)
  const profilePhoto =
    (data as any).cvProfileImage ||
    hero.profileImage ||
    about.profileImage ||
    "/uploads/1791392897605_WhatsApp_Image_2026-10-04_at_00_56_51.jpeg"

  // Contacts
  const fullName = hero.fullName || details.name || "Adhitya Hermawan, S.Kom."
  const titles = hero.titles && hero.titles.length > 0
    ? hero.titles
    : ["Software Engineer", "QA Analyst", "Backend Developer", "Business Intelligence"]

  const location = details.location || "Balikpapan, Kalimantan Timur, Indonesia"
  const email = details.email || "adhityahermawan0906@gmail.com"

  // Resolve social URLs
  const socialLinks = hero.socialLinks || []
  const githubLink =
    socialLinks.find((s: any) => s.name?.toLowerCase().includes("github"))?.href ||
    "https://github.com/adhitya09"
  const linkedinLink =
    socialLinks.find((s: any) => s.name?.toLowerCase().includes("linkedin"))?.href ||
    "https://www.linkedin.com/in/adhitya-hermawan-9481b7320/"
  const instagramLink =
    socialLinks.find((s: any) => s.name?.toLowerCase().includes("instagram"))?.href ||
    "https://www.instagram.com/adhityah_09"

  // Display friendly usernames
  const githubDisplay = githubLink
    .replace(/^https?:\/\/(www\.)?github\.com\/?/i, "github.com/")
    .replace(/\/$/, "")
  const linkedinDisplay = linkedinLink
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/?/i, "linkedin.com/")
    .replace(/\/$/, "")
  const instagramDisplay = instagramLink.includes("instagram.com/")
    ? "@" + instagramLink.split("instagram.com/")[1].split("?")[0].replace(/\/$/, "")
    : "@adhityah_09"

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans py-8 px-4 sm:px-6 print:p-0 print:bg-white print:min-h-0">
      {/* Top action bar (hidden when printed) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 bg-white px-4 py-2.5 rounded-lg border border-neutral-300 shadow-xs flex items-center gap-2 hover:border-neutral-400 transition-colors"
        >
          &larr; {language === "en" ? "Back to Portfolio" : "Kembali ke Portofolio"}
        </Link>
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="cursor-pointer text-xs font-bold tracking-wider px-3.5 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 transition-all flex items-center gap-1.5 shadow-xs"
            title="Switch Language"
          >
            <span className={language === "id" ? "font-black text-neutral-900" : "text-neutral-400"}>ID</span>
            <span className="text-neutral-300">|</span>
            <span className={language === "en" ? "font-black text-neutral-900" : "text-neutral-400"}>EN</span>
          </button>
          <button
            onClick={handlePrint}
            className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>{language === "en" ? "Print / Save PDF (ATS Friendly)" : "Cetak / Simpan PDF (ATS Friendly)"}</span>
          </button>
        </div>
      </div>

      {/* ATS Resume Sheet (Pure White background with sleek Silver lines) */}
      <main className="max-w-4xl mx-auto bg-white p-6 sm:p-12 border border-neutral-300 shadow-xl rounded-xl print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none">
        {/* ATS HEADER: Photo (Left) + Full Name & Title (Center) + Contact Info (Right) */}
        <header className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-5 text-left">
          {/* 1. Foto Profil */}
          <div className="shrink-0 flex justify-center sm:justify-start">
            <img
              src={profilePhoto}
              alt={fullName}
              className="w-24 h-28 sm:w-28 sm:h-32 object-cover object-top rounded-xl border border-neutral-300 shadow-2xs"
            />
          </div>

          {/* 2. Nama Lengkap & Sub-title */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase leading-tight">
              {fullName}
            </h1>
            <p className="text-xs sm:text-[13px] font-bold text-neutral-700 tracking-wide mt-1.5 leading-snug">
              {titles.join(" • ")}
            </p>
          </div>

          {/* 3. Kontak (Asal, Email, GitHub, LinkedIn, Instagram) */}
          <div className="shrink-0 flex flex-col gap-1.5 text-xs text-neutral-700 font-medium self-center sm:self-start w-full sm:w-auto border-t sm:border-t-0 border-neutral-200 pt-3 sm:pt-0">
            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-neutral-900 hover:underline transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{email}</span>
            </a>

            {/* Asal */}
            <div className="flex items-center gap-2 text-neutral-700">
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{location}</span>
            </div>

            {/* GitHub */}
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-neutral-900 hover:underline transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="truncate">{githubDisplay}</span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-neutral-900 hover:underline transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span className="truncate">{linkedinDisplay}</span>
            </a>

            {/* Instagram */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-neutral-900 hover:underline transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="truncate">{instagramDisplay}</span>
            </a>
          </div>
        </header>

        {/* Silver Divider Line */}
        <div className="w-full h-[1.5px] bg-neutral-300 my-4" />

        {/* 4. PROFILE SAYA */}
        <section className="mb-5">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
            {language === "en" ? "PROFILE" : "PROFILE SAYA"}
          </h2>
          <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-800 text-justify">
            {cvProfile}
          </p>
        </section>

        {/* 5. EXPERIENCE */}
        <section className="mb-5 print:break-inside-avoid">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3">
            {language === "en" ? "EXPERIENCE" : "EXPERIENCE"}
          </h2>
          <div className="flex flex-col gap-3.5">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="flex flex-col print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    {exp.role}
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                    {exp.date}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-700 mt-0.5">
                  {exp.company}
                </p>
                <p className="text-xs leading-relaxed text-neutral-700 mt-1 text-justify">
                  {exp.description}
                </p>
                {exp.skills && exp.skills.length > 0 && (
                  <p className="text-[11px] text-neutral-600 mt-1">
                    <strong className="text-neutral-800 font-semibold">Core Competencies:</strong>{" "}
                    {exp.skills.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6. EDUCATION */}
        <section className="mb-5 print:break-inside-avoid">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3">
            {language === "en" ? "EDUCATION" : "EDUCATION"}
          </h2>
          <div className="flex flex-col gap-3.5">
            {education.map((edu: any, i: number) => (
              <div key={i} className="flex flex-col print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    {edu.degree}
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                    {edu.date}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs font-semibold text-neutral-700 mt-0.5">
                  <span>{edu.institution}</span>
                  {edu.gpa && <span className="font-bold text-neutral-900">GPA: {edu.gpa}</span>}
                </div>
                {edu.description && (
                  <p className="text-xs text-neutral-600 mt-1 text-justify">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. KEPANITIAAN DAN ORGANISASI */}
        <section className="mb-5 print:break-inside-avoid">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3">
            {language === "en" ? "ORGANIZATIONAL & COMMITTEE EXPERIENCE" : "KEPANITIAAN DAN ORGANISASI"}
          </h2>
          <div className="flex flex-col gap-3">
            {organizations.length > 0 ? (
              organizations.map((org: any, i: number) => (
                <div key={i} className="flex flex-col print:break-inside-avoid">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      {org.role}
                    </h3>
                    <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                      {org.date}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 mt-0.5">
                    {org.organization}
                  </p>
                  {org.description && (
                    <p className="text-xs text-neutral-600 mt-0.5 text-justify">{org.description}</p>
                  )}
                </div>
              ))
            ) : (
              // Fallback if organizations array is not yet filled
              (education[0]?.activities || []).map((act: string, i: number) => (
                <div key={i} className="flex justify-between items-baseline text-xs text-neutral-700">
                  <span className="font-medium">• {act}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 8. PROJECT */}
        <section className="mb-5 print:break-inside-avoid">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3">
            {language === "en" ? "SELECTED PROJECTS" : "PROJECT"}
          </h2>
          <div className="flex flex-col gap-3.5">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="flex flex-col print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>{proj.title}</span>
                    {proj.liveUrl && (
                      <span className="text-[11px] font-normal text-neutral-500">
                        ({proj.liveUrl.replace(/^https?:\/\//, "")})
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                    {proj.createdAt || proj.year || ""}
                  </span>
                </div>
                {proj.tech && proj.tech.length > 0 && (
                  <p className="text-[11px] font-semibold text-neutral-600 mt-0.5">
                    {proj.tech.join(" • ")}
                  </p>
                )}
                <p className="text-xs text-neutral-700 mt-1 leading-relaxed text-justify">
                  {proj.shortDescription || proj.description}
                </p>
                {proj.features && proj.features.length > 0 && (
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    <strong className="text-neutral-800 font-semibold">Key Highlights:</strong>{" "}
                    {proj.features.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. SKILLS */}
        <section className="mb-2 print:break-inside-avoid">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3">
            {language === "en" ? "SKILLS" : "SKILLS"}
          </h2>
          <div className="flex flex-col gap-2.5 text-xs text-neutral-800">
            {techCategories.map((cat: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 print:break-inside-avoid">
                <span className="font-bold sm:w-48 shrink-0 text-neutral-900">
                  {cat.title}
                </span>
                <span className="text-neutral-700 leading-relaxed">
                  {(cat.technologies || []).map((t: any) => t.name).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
