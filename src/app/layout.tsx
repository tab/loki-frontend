import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.scss"

import Providers from "@/app/providers"
import Header from "@/components/layout/Header"
import Main from "@/components/layout/Main"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Loki",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <Main>
          <Providers>{children}</Providers>
        </Main>
      </body>
    </html>
  )
}
