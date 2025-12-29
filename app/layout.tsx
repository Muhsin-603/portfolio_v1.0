import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { GameProvider } from "@/lib/game-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "GoStark - Portfolio Quest",
  description: "A game developer's portfolio - an interactive journey through projects, skills, and achievements",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-display antialiased">
        <GameProvider>{children}</GameProvider>
        <Analytics />
      </body>
    </html>
  )
}
