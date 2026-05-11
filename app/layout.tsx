import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Sparkles, Youtube } from "lucide-react";
import { site } from "@/lib/site";

const BASE = `https://${site.domain}`;

export const viewport: Viewport = {
  themeColor: "#050b10",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: `${site.name} — 12-Year Smart Investing Journey on YouTube`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "SIP calculator",
    "lumpsum calculator",
    "EMI calculator",
    "investing journey",
    "mutual funds India",
    "swing trading",
    "MoneyEnlight",
    "financial planning",
    "12 year investment",
    "wealth creation",
  ],
  authors: [{ name: site.name, url: BASE }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: BASE,
    siteName: site.name,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: BASE,
  description: site.description,
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: BASE,
    sameAs: [site.youtube.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050b10]/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-400" />
              <span className="text-lg font-semibold tracking-tight">
                Money<span className="text-brand-400">Enlight</span>
              </span>
              <span className="hidden text-xs text-white/40 md:inline">· {site.tagline}</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm text-white/70 md:gap-5">
              <Link href="/" className="hidden hover:text-white md:inline">Journey</Link>
              <div className="group relative hidden md:inline-block">
                <span className="cursor-default hover:text-white">Tools</span>
                <div className="invisible absolute right-0 top-full z-50 min-w-[160px] pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <div className="rounded-lg border border-white/10 bg-[#0a1118] p-1 shadow-xl">
                    <Link
                      href="/calculators"
                      className="block rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      Calculators
                    </Link>
                    <Link
                      href="/capital-gains"
                      className="block rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      Capital Gains Tax
                    </Link>
                  </div>
                </div>
              </div>
              <a
                href={site.youtube.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                <Youtube className="h-4 w-4" /> Subscribe
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-white/5 py-8 text-center text-sm text-white/50">
          <p>
            © {new Date().getFullYear()} {site.name}. Educational content only — not financial advice.
          </p>
          <p className="mt-2">
            <a
              href={site.youtube.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white"
            >
              <Youtube className="h-4 w-4 text-red-500" /> Watch on YouTube · {site.youtube.handle}
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
