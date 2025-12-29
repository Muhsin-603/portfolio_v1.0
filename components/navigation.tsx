"use client"

import Link from "next/link"
import { useState } from "react"

const navItems = [
  { label: "initial spawn", href: "#home" },
  { label: "stats", href: "#about" },
  { label: "inventory", href: "#projects" },
  { label: "map", href: "#journey" },
]

const socialLinks = [
  { icon: "G", href: "#", label: "GitHub" },
  { icon: "D", href: "#", label: "Discord" },
  { icon: "I", href: "#", label: "Instagram" },
  { icon: "T", href: "#", label: "Twitter" },
]

export function Navigation() {
  const [activeItem, setActiveItem] = useState("initial spawn")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="text-[#EFEFEF] text-xs tracking-wider">
            <span className="text-lg">👁️‍🗨️</span>
          </div>
          <span className="text-[#EFEFEF] text-sm font-display">GoStark</span>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setActiveItem(item.label)}
              className={`text-[#EFEFEF] text-sm transition-all duration-300 hover:opacity-80 hover:scale-105 ${
                activeItem === item.label ? "opacity-100" : "opacity-70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              className="text-[#EFEFEF] text-sm opacity-70 transition-all duration-300 hover:opacity-100 hover:scale-110"
              aria-label={social.label}
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
