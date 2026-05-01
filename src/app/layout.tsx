import type { Metadata } from "next";
import { Bebas_Neue, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alaskalabs.is"),
  title: "Alaska Labs — The Purest Peptides You Can Get",
  description: "The Purest Peptides You Can Get.",
  icons: {
    icon: [
      { url: "/images/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/images/logo.png",
    shortcut: "/images/favicon-64.png",
  },
  openGraph: {
    title: "Alaska Labs",
    description: "The Purest Peptides You Can Get.",
    siteName: "Alaska Labs",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Alaska Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alaska Labs",
    description: "The Purest Peptides You Can Get.",
    images: ["/images/logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${bebasNeue.variable} ${fraunces.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-full">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
