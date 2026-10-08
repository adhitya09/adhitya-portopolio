"use client"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import { usePortfolio } from "@/components/PortfolioContext"
import { useLanguage } from "@/components/LanguageContext"

export default function TechStack() {
  const { data } = usePortfolio()
  const { t } = useLanguage()
  const techStackData = data.techStack || {}
  const categories = techStackData.categories || []

  return (
    <section id="techstack" className="w-full max-w-7xl mx-auto py-20 sm:py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10 overflow-hidden">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-12 sm:mb-16 md:mb-24 w-full text-left">
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-3 sm:mb-4">
            {t(techStackData.sectionTag || "Skills & Tools")}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
            {t(techStackData.title || "My Tech Stack")}
          </h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-12 sm:gap-16">
        {categories.map((category: any, idx: number) => (
          <div key={idx} className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="md:w-1/3">
              <FadeDown delay={idx * 0.1}>
                <h4 className="text-2xl font-black text-text-primary tracking-tight mb-2">{category.title}</h4>
                <p className="text-text-secondary font-medium text-sm">{category.description}</p>
              </FadeDown>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
              {(category.technologies || []).map((tech: any, techIdx: number) => (
                <FadeUp key={techIdx} delay={idx * 0.1 + techIdx * 0.05}>
                  <div className="group flex flex-col items-center justify-center p-6 bg-thirdary/20 hover:bg-thirdary/50 border border-text-secondary/10 hover:border-text-primary/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <div className="w-12 h-12 mb-4 transition-transform group-hover:scale-110 flex items-center justify-center pointer-events-none">
                      {tech.svg ? (
                        tech.svg.startsWith("<") ? (
                          <div className="w-full h-full fill-current" dangerouslySetInnerHTML={{ __html: tech.svg }} />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={tech.svg} 
                            alt={tech.name} 
                            loading="lazy"
                            decoding="async"
                            className="w-10 h-10 object-contain dark:brightness-125 dark:contrast-125" 
                            onError={(e) => {
                              const target = e.currentTarget
                              target.style.display = 'none'
                              if (target.parentElement) {
                                target.parentElement.innerHTML = `<div class="w-10 h-10 flex items-center justify-center font-bold text-lg bg-thirdary text-text-primary rounded-xl border border-text-secondary/20">${tech.name.charAt(0)}</div>`
                              }
                            }}
                          />
                        )
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center font-bold text-lg bg-thirdary text-text-primary rounded-xl border border-text-secondary/20">
                          {tech.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-text-primary text-center">{tech.name}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
