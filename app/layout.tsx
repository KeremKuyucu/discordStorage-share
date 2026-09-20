import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "DiscordStorage Share",
  description: "DiscordStorage ile ücretsiz ve sınırsız bulut depolama. Dosyalarını paylaş.",
  keywords: ["discord", "storage", "file sharing", "cloud", "free"],
  openGraph: {
    title: "DiscordStorage Share",
    description: "Discord altyapısını kullanan ücretsiz bulut depolama servisi.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
