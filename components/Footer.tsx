"use client"
import React from "react"
import { usePortfolio } from "@/components/PortfolioContext"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { data } = usePortfolio()
  const footerData = data.footer || {}
  const links = footerData.links || [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/adhitya-hermawan-9481b7320/" },
    { name: "GitHub", href: "https://github.com/adhitya09" },
    { name: "Instagram", href: "https://www.instagram.com/adhityah_09?stkn=ZzN2MGV3MmN2cGQ2" },
    { name: "Email", href: "mailto:ntaps0989@gmail.com" },
    { name: "WhatsApp", href: "https://wa.me/6285248289959" },
  ]

  return (
    <footer className="w-full border-t border-text-secondary/10 bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-text-secondary">
            &copy; {currentYear} {footerData.copyrightName || "Adhitya Hermawan, S.Kom."} All rights reserved.
          </p>
          <p className="text-xs font-medium text-text-secondary/70 mt-1">
            {footerData.subtitle || "Software Engineer | QA Analyst | Business Intelligence • ITK"}
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {links.map((link: any, idx: number) => (
            <a 
              key={idx} 
              href={link.href} 
              target={link.href.startsWith("http") ? "_blank" : undefined} 
              rel="noopener noreferrer" 
              className="text-text-secondary hover:text-text-primary transition-colors text-xs font-bold uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
