"use client"
import { useRef } from "react"
import { motion } from "framer-motion"
import FadeDown from "@/components/animations/FadeDown"
import { usePortfolio } from "@/components/PortfolioContext"
import { useLanguage } from "@/components/LanguageContext"

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { data } = usePortfolio()
  const { t, language } = useLanguage()
  const educationData = (data as any).education || {
    sectionTag: "Academic Background",
    title: "Education & Leadership",
    items: [],
  }
  const educationList = educationData.items || []

  return (
    <section id="education" className="w-full max-w-7xl mx-auto py-20 sm:py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10" ref={containerRef}>
      <FadeDown>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-12 sm:mb-16 md:mb-24 w-full text-left">
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-3 sm:mb-4">
            {t(educationData.sectionTag || "Academic Background")}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
            {t(educationData.title || "Education & Leadership")}
          </h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative group/list flex flex-col gap-6">
        {educationList.map((edu: any, index: number) => {
          return (
            <motion.div
              key={edu.id || index}
              initial={{ opacity: 0, y: 40, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group/item relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 p-4 sm:p-6 md:p-8 -mx-2 sm:-mx-6 md:-mx-8 rounded-2xl transition-all duration-500 hover:!opacity-100 hover:!blur-none group-hover/list:opacity-40 group-hover/list:blur-[2px] hover:bg-text-secondary/5 hover:shadow-lg border border-transparent hover:border-text-secondary/10"
            >
              {/* Left Column: Date & Location */}
              <div className="md:col-span-1 pt-1 md:pt-2 flex flex-col">
                <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">{edu.date}</span>
                {edu.location && (
                  <span className="text-xs font-medium text-text-secondary/70 mt-1">{edu.location}</span>
                )}
                {edu.gpa && (
                  <span className="inline-block mt-3 text-xs font-bold bg-thirdary text-text-primary px-3 py-1 rounded-md border border-text-secondary/15 w-fit">
                    GPA {edu.gpa}
                  </span>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="md:col-span-3 flex flex-col">
                <h4 className="text-2xl font-bold text-text-primary tracking-tight mb-1 group-hover/item:text-text-primary transition-colors">
                  {edu.institution}
                </h4>
                <h5 className="text-sm font-bold text-text-secondary tracking-wide uppercase mb-4">
                  {edu.degree}
                </h5>

                {edu.description && (
                  <p className="text-base text-text-secondary font-medium leading-relaxed mb-4">
                    {edu.description}
                  </p>
                )}

                {edu.activities && edu.activities.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      {language === "en" ? "Activities & Leadership:" : "Aktivitas & Kepemimpinan:"}
                    </span>
                    <ul className="flex flex-col gap-1.5 pl-4 list-disc text-sm text-text-secondary/90 font-medium">
                      {edu.activities.map((act: string, i: number) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
