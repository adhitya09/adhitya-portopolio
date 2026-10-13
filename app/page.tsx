import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "./hero"
import About from "./about"
import Experience from "./experience"
import Education from "./education"
import TechStack from "./tech-stack"
import Project from "./project"
import Contact from "./contact"
import GameSection from "./game"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <>
      <header className="cursor-default sticky top-0 z-50">
        <Header />
      </header>
      <Hero />
      <About />
      <Experience />
      <Education />
      <TechStack />
      <Project />
      <Contact />
      <GameSection />
      <Footer />
    </>
  )
}
