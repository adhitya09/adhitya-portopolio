"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import GlareHover from "@/components/GlareHover"
import { usePortfolio } from "@/components/PortfolioContext"
import { useLanguage } from "@/components/LanguageContext"

export default function Project() {
  const [isOpen, setIsOpen] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const { data } = usePortfolio()
  const { t, language } = useLanguage()
  const projectsData = data.projects || {}
  
  const rawList = projectsData.items || []
  const projectList = rawList.map((p: any, idx: number) => ({
    ...p,
    index: typeof p.index === "number" ? p.index : idx,
    tech: p.tech || [],
    features: p.features || [],
  }))

  const displayedProjects = showAll ? projectList : projectList.slice(0, 6)

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const activeProject = projectList.find((p: any) => p.index === isOpen)

  return (
    <>
      <section id="projects" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
        <FadeDown>
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
            <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">
              {t(projectsData.sectionTag || "Portfolio")}
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
              {t(projectsData.title || "Selected Works")}
            </h3>
          </div>
        </FadeDown>

        {/* Desktop View: Grid (Shows max 6 initially, expands when clicking Selengkapnya) */}
        <div className="hidden lg:grid max-w-7xl mx-auto grid-cols-3 gap-8 px-6 md:px-12">
          {displayedProjects.map((project: any, index: number) => (
            <FadeUp key={`desktop-${project.id || index}`}>
              <GlareHover className="group flex flex-col h-full bg-background border border-text-secondary/20 hover:border-text-primary/50 rounded-xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl">
                <div className="relative overflow-hidden aspect-[16/10] bg-text-secondary/5 border-b border-text-secondary/10">
                  <Image 
                    src={project.imagePath || "/images/simpro.jpg"} 
                    alt={project.title} 
                    fill 
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover transition-all duration-700 group-hover:scale-105" 
                  />

                  {/* Tech Stack Overlay */}
                  <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-10px] group-hover:translate-y-0">
                    {project.tech.slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-1 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-sm">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && <span className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-1 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-sm">+{project.tech.length - 3}</span>}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                  {/* Numbering */}
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-background border border-text-secondary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-text-secondary shadow-sm">{String(project.index + 1).padStart(2, "0")}</div>

                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-black text-text-primary tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text-primary group-hover:to-text-secondary transition-all duration-500">{project.title}</h4>
                  </div>

                  <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 flex-grow line-clamp-3">{project.shortDescription}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-text-secondary/10">
                    <button className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-3 group/btn cursor-pointer" onClick={() => setIsOpen(project.index)}>
                      {t("View Details")}
                      <span className="w-8 h-[2px] bg-text-primary group-hover/btn:w-12 transition-all duration-300"></span>
                    </button>

                    {project.liveDemoUrl && (
                      <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="p-2 border border-text-secondary/20 rounded-full text-text-secondary hover:text-background hover:bg-text-primary hover:border-text-primary transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </GlareHover>
            </FadeUp>
          ))}
        </div>

        {/* Mobile & Tablet View */}
        {/* Mobile & Tablet View: Smooth Touch-Swipeable Snap Carousel */}
        <div className="lg:hidden w-full relative py-4">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 no-scrollbar scroll-smooth pb-4">
            {displayedProjects.map((project: any, index: number) => (
              <div key={`mobile-${index}`} className="w-[86vw] max-w-[360px] sm:w-[380px] shrink-0 snap-center">
                <GlareHover className="group flex flex-col h-full bg-background border border-text-secondary/20 hover:border-text-primary/50 rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl">
                  <div className="relative overflow-hidden aspect-[16/10] bg-text-secondary/5 border-b border-text-secondary/10">
                    <Image 
                      src={project.imagePath || "/images/simpro.jpg"} 
                      alt={project.title} 
                      fill 
                      loading="lazy"
                      sizes="(max-width: 640px) 86vw, 380px"
                      className="object-cover transition-all duration-700 group-hover:scale-105" 
                    />

                    <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end z-10">
                      {project.tech.slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-0.5 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-xs">
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[10px] font-bold bg-background/90 text-text-primary px-1.5 py-0.5 rounded backdrop-blur-md border border-text-secondary/20 shadow-xs">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-grow relative">
                    <div className="absolute top-0 right-5 -translate-y-1/2 bg-background border border-text-secondary/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest text-text-secondary shadow-xs">
                      {String(project.index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight leading-tight">{project.title}</h4>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed mb-6 flex-grow line-clamp-3">
                      {project.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-text-secondary/10">
                      <button 
                        className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" 
                        onClick={() => setIsOpen(project.index)}
                      >
                        <span>{t("View Details")}</span>
                        <span className="w-6 h-[2px] bg-text-primary"></span>
                      </button>

                      {project.liveDemoUrl && (
                        <a 
                          href={project.liveDemoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 border border-text-secondary/20 rounded-full text-text-secondary hover:text-background hover:bg-text-primary transition-all"
                          title="Buka Demo"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </GlareHover>
              </div>
            ))}
          </div>

          <div className="text-center mt-2 px-4">
            <span className="text-[11px] font-medium text-text-secondary/70">
              {language === "en" ? "← Swipe horizontally to explore projects →" : "← Geser ke samping untuk melihat proyek lainnya →"}
            </span>
          </div>
        </div>

        {/* "Selengkapnya" Button (Replaces "View More on LinkedIn") */}
        <FadeUp>
          <div className="mt-16 flex justify-center w-full px-6">
            {projectList.length > 6 ? (
              <button
                onClick={() => setShowAll(!showAll)}
                className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-background border border-text-secondary/20 text-text-primary hover:border-text-primary hover:bg-text-primary hover:text-background rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 ease-out group hover:-translate-y-1.5 hover:scale-[1.02] shadow-sm hover:shadow-xl"
              >
                <span>{showAll ? (language === "en" ? "Show Less" : "Tampilkan Lebih Sedikit") : (language === "en" ? "Show More" : "Selengkapnya")}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${showAll ? "rotate-180" : "group-hover:translate-y-0.5"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <a
                href="https://github.com/adhitya09"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-background border border-text-secondary/20 text-text-primary hover:border-text-primary hover:bg-text-primary hover:text-background rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 ease-out group hover:-translate-y-1.5 hover:scale-[1.02] shadow-sm hover:shadow-xl"
              >
                <span>{language === "en" ? "See All on GitHub" : "Selengkapnya"}</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </FadeUp>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {isOpen !== null && activeProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsOpen(null)} />

              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-background border border-text-secondary/20 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative z-10">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-text-secondary/10">
                  <h4 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight pr-4">{activeProject.title}</h4>
                  <button className="text-text-secondary hover:text-text-primary transition-colors p-2 bg-text-secondary/5 rounded-full cursor-pointer shrink-0" onClick={() => setIsOpen(null)}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-text-secondary/10">
                    <div>
                      <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-2 sm:mb-3">{t("Created")}</span>
                      <span className="text-sm font-bold bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10 inline-block">{activeProject.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-2 sm:mb-3">{t("Technologies")}</span>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tech.map((tech: string, i: number) => (
                          <span key={i} className="text-xs font-bold bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10 uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-4 sm:mb-5">{t("Key Features")}</span>
                    <ul className="space-y-3 sm:space-y-4">
                      {activeProject.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center bg-thirdary/50 p-3 sm:p-4 rounded-xl border border-text-secondary/5">
                          <span className="text-text-primary mr-3 font-black">&rarr;</span>
                          <span className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wide">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 sm:p-6 border-t border-text-secondary/10 flex flex-col sm:flex-row gap-3 sm:gap-4 bg-background">
                  {activeProject.liveDemoUrl && (
                    <a href={activeProject.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-bold text-xs sm:text-sm tracking-widest uppercase bg-text-primary text-background py-3.5 sm:py-4 rounded-xl hover:-translate-y-1 transition-transform duration-300">
                      {t("Project Details")}
                    </a>
                  )}
                  {activeProject.isPrivateRepo ? (
                    <button disabled className="flex-1 flex justify-center items-center gap-2 text-center font-bold text-xs sm:text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-secondary opacity-50 cursor-not-allowed py-3.5 sm:py-4 rounded-xl">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Enterprise / Private
                    </button>
                  ) : (
                    <a href={activeProject.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 text-center font-bold text-xs sm:text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-primary hover:border-text-primary hover:-translate-y-1 transition-all duration-300 py-3.5 sm:py-4 rounded-xl">
                      {t("Source Code")}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}
