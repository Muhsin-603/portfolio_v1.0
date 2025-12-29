"use client"

import Image from "next/image"

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      {/* Profile Image with Geometric Border */}
      <div className="relative">
        {/* Geometric accent shape behind */}
        <svg
          className="absolute -top-8 -left-8 w-[320px] h-[380px] transition-transform duration-500 hover:scale-105"
          viewBox="0 0 320 380"
          fill="none"
        >
          <path
            d="M160 20 L280 80 L300 200 L260 320 L160 360 L60 320 L20 200 L40 80 Z"
            fill="#5F51C2"
            className="transition-all duration-300"
          />
          {/* Corner sparkles */}
          <circle cx="160" cy="20" r="4" fill="#EFEFEF" className="animate-pulse" />
          <circle cx="280" cy="80" r="4" fill="#EFEFEF" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
          <circle cx="40" cy="80" r="4" fill="#EFEFEF" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
          <circle cx="300" cy="200" r="4" fill="#EFEFEF" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
        </svg>

        {/* Profile Image */}
        <div className="relative z-10 w-[250px] h-[300px] rounded-full overflow-hidden transition-transform duration-500 hover:scale-105">
          <Image
            src="/images/image.png"
            alt="GoStark profile"
            fill
            className="object-cover object-top grayscale"
            priority
          />
        </div>
      </div>
    </section>
  )
}
