import type { Metadata } from "next";
import { Geist_Mono, Inter, Pacifico } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Happy Birthday Rubi 🎀",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const pacifico = Pacifico({ subsets: ["latin"], variable: "--font-display", weight: "400" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, pacifico.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}