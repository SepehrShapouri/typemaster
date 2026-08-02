import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

function getRequestOrigin(requestHeaders: Headers) {
  const forwardedHost = requestHeaders
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim()
  const host = forwardedHost ?? requestHeaders.get("host") ?? "localhost:3000"
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https"

  try {
    return new URL(`${protocol}://${host}`)
  } catch {
    return new URL("http://localhost:3000")
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const origin = getRequestOrigin(requestHeaders)
  const socialImage = new URL("/og.png", origin).toString()

  return {
    metadataBase: origin,
    title: "TypeMaster — Touch typing that clicks",
    description:
      "Build calm, accurate typing muscle memory with guided lessons, live feedback, and a tactile interactive keyboard.",
    applicationName: "TypeMaster",
    category: "education",
    openGraph: {
      type: "website",
      url: origin,
      siteName: "TypeMaster",
      title: "TypeMaster — Touch typing that clicks",
      description:
        "Left hand, meet the home row. Learn touch typing with live guidance and a tactile interactive keyboard.",
      images: [
        {
          url: socialImage,
          width: 1731,
          height: 909,
          alt: "TypeMaster home row lesson with a coral and mint mechanical keyboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "TypeMaster — Touch typing that clicks",
      description:
        "Left hand, meet the home row. Guided practice with a tactile interactive keyboard.",
      images: [socialImage],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        geist.variable,
        geistMono.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
