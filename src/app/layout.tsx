import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "COALESCE | The Pinnacle of Collegiate Excellence",
  description: "Experience COALESCE 2026 - the most prestigious college event of the year. A grand convergence of technology, culture, and innovation. Register now for an unforgettable journey.",
  keywords: ["COALESCE 2026", "college festival", "technical event", "cultural fest", "innovation summit", "prestigious event", "college registration"],
  authors: [{ name: "Aasurjya", url: "https://aasurjya.in" }],
  creator: "Aasurjya",
  openGraph: {
    title: "COALESCE 2026 | Where Excellence Converges",
    description: "Join the elite gathering of bright minds at COALESCE 2026. Excellence, Innovation, and Legacy.",
    url: "https://coalesce.event",
    siteName: "COALESCE 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "COALESCE 2026 Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COALESCE 2026 | The Grand Reveal",
    description: "Experience the most prestigious college event of the year. Excellence awaits.",
    creator: "@aasurjya",
    images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1b263b',
              color: '#fafafa',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#0d1b2a',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
