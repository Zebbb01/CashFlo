import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./(auth)/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "CashFlo - AI-Powered Personal & Business Finance Management",
    template: "%s | CashFlo"
  },
  description: "Take absolute control of your finances with CashFlo. Isolate per-user data, track actual net margins, automate complex revenue sharing, and scale your business.",
  openGraph: {
    title: "CashFlo - Advanced Finance Management",
    description: "Enterprise-grade financial clarity for scaling businesses and individuals.",
    url: "https://app.cashflo.finance",
    siteName: "CashFlo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CashFlo - Advanced Finance Management",
    description: "Enterprise-grade financial clarity for scaling businesses and individuals.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CashFlo',
    applicationCategory: 'FinanceApplication',
    description: 'AI-powered personal and business finance management platform offering per-user data isolation, automated revenue sharing, and absolute financial precision.',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <Providers>{children}</Providers>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}