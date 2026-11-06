import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import { config } from "@/data/config";

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Script from "next/script";
import AppOverlays from "@/components/app-overlays";
import { Providers } from "@/components/providers";
import GoogleAnalytics from "@/components/seo/google-analytics";

export const metadata: Metadata = {
  metadataBase: new URL(config.site),
  title: config.title,
  alternates: { canonical: "/" },
  description: config.description.long,
  keywords: config.keywords,
  authors: [{ name: config.author }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: config.title,
    description: config.description.short,
    url: config.site,
    siteName: config.author,
    locale: "en_US",
    images: [
      {
        url: config.ogImg,
        width: 1200,
        height: 630,
        alt: "Dev Nambiar, Machine Learning Engineer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description.short,
    images: [config.ogImg],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, archivoBlack.variable, "font-display"].join(" ")} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preload" as="fetch" href="/assets/iphone_main.spline" crossOrigin="anonymous" />
        {process.env.UMAMI_DOMAIN && (
          <Script
            defer
            src={process.env.UMAMI_DOMAIN}
            data-website-id={process.env.UMAMI_SITE_ID}
          ></Script>
        )}
        <GoogleAnalytics />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <AppOverlays />
        </Providers>
      </body>
    </html>
  );
}
