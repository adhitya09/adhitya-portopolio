"use client"
import ScrollVelocity from "@/components/ScrollVelocity"
import FadeDown from "@/components/animations/FadeDown"
import Fade from "@/components/animations/Fade"
import FadeLeft from "@/components/animations/FadeLeft"
import Image from "next/image"
import { usePortfolio } from "@/components/PortfolioContext"
import { useLanguage } from "@/components/LanguageContext"

export default function About() {
  const { data } = usePortfolio()
  const { t, language } = useLanguage()
  const about = data.about || {}
  const details = about.personalDetails || {}
  const velocity = 50

  const profileImg = about.profileImage || data.hero?.profileImage || "/images/hero.jpg"
  const scrollTexts = about.scrollTexts && about.scrollTexts.length > 0 
    ? about.scrollTexts 
    : ["Adhitya Hermawan, S.Kom.", "Software Engineer | QA Analyst | Business Intelligence"]

  return (
    <>
      <section id="about" className="w-full max-w-7xl mx-auto py-20 sm:py-24 md:py-32 cursor-default bg-background overflow-hidden border-t border-text-secondary/10">
        <FadeDown>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-12 sm:mb-16 md:mb-24 w-full text-left">
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-3 sm:mb-4">
              {t(about.sectionTag || "Discover")}
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
              {t(about.title || "About Me")}
            </h3>
          </div>
        </FadeDown>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 px-4 sm:px-6 md:px-12">
          
          <div className="lg:col-span-5 hidden lg:flex flex-col items-center lg:items-center justify-center relative">
            <div className="w-full max-w-[350px] lg:max-w-[450px] relative">
              <Fade>
                <div className="relative z-10 p-2 bg-background border border-text-secondary/10 rounded-3xl shadow-2xl overflow-hidden aspect-[4/5] w-full group transition-all duration-500 hover:shadow-[0_20px_40px_-5px_rgb(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.05)] hover:-translate-y-1">
                  <Image 
                    src={profileImg} 
                    alt={details.name || "Adhitya Hermawan"} 
                    fill 
                    loading="lazy"
                    className="object-cover transition-all duration-700 scale-100 group-hover:scale-105" 
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"></div>
                </div>
                <div className="absolute -bottom-8 -left-8 text-8xl lg:text-9xl font-black text-text-secondary/5 select-none pointer-events-none tracking-tighter mix-blend-multiply dark:mix-blend-screen z-0">
                  {about.backdropWord || "ENG."}
                </div>
              </Fade>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Who Am I - Only (My Approach removed per request) */}
            <div className="flex flex-col">
              <Fade>
                <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-4 flex items-center border-b border-text-secondary/20 pb-4">
                  {t("Who Am I")}
                </h4>
                <p className="text-base md:text-lg text-text-secondary leading-relaxed font-medium">
                  {about.whoAmI || "Saya Sarjana Komputer (S.Kom.) dari program studi Sistem Informasi Institut Teknologi Kalimantan (ITK) dengan keahlian dalam Software Engineering, Backend Development, DevOps & Linux Server Management, Software QA, serta Business Intelligence."}
                </p>
              </Fade>
            </div>

            <div className="mt-12 md:mt-16">
              <Fade>
                <h4 className="text-lg md:text-xl font-bold text-text-primary mb-8 border-b border-text-secondary/20 pb-4 border-l-4 border-l-text-primary pl-4">
                  {t("Personal Details")}
                </h4>
              </Fade>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                <FadeLeft delay={0.1}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">
                      {t("Name")}
                    </span>
                    <span className="text-base font-semibold text-text-primary">{details.name || "Adhitya Hermawan, S.Kom."}</span>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.2}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">
                      {t("Location")}
                    </span>
                    <span className="text-base font-semibold text-text-primary">{details.location || "Balikpapan, Kalimantan Timur"}</span>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.3}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">
                      {t("Phone / WhatsApp")}
                    </span>
                    <a href={details.phoneUrl || "https://wa.me/6285248289959"} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-text-primary hover:text-text-secondary transition-colors underline decoration-text-secondary/30 underline-offset-4">
                      {details.phone || "+62 852-4828-9959"}
                    </a>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.4}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">
                      {t("GPA")}
                    </span>
                    <span className="text-base font-semibold text-text-primary">{details.gpa || "3.61 / 4.00"}</span>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.5}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">
                      {t("Email")}
                    </span>
                    <a href={`mailto:${details.email || "ntaps0989@gmail.com"}`} className="text-base font-semibold text-text-primary hover:text-text-secondary transition-colors underline decoration-text-secondary/30 underline-offset-4">
                      {details.email || "ntaps0989@gmail.com"}
                    </a>
                  </div>
                </FadeLeft>

                <FadeLeft delay={0.6}>
                  <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-thirdary/40">
                    <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-1">
                      {language === "en" ? "Education" : "Pendidikan"}
                    </span>
                    <span className="text-base font-semibold text-text-primary">{details.education || "Institut Teknologi Kalimantan (ITK)"}</span>
                  </div>
                </FadeLeft>
              </div>
            </div>
          </div>
        </div>

        <Fade>
          <div className="mt-24 md:mt-32 pb-6 border-text-secondary/10">
            <ScrollVelocity texts={scrollTexts} velocity={velocity} className="font-black tracking-tighter text-thirdary dark:text-button-hover opacity-50" />
          </div>
        </Fade>
      </section>
    </>
  )
}
