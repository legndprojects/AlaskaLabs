import type { Metadata } from "next";
import { Bebas_Neue, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
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

export const metadata: Metadata = {
  title: "Prime Ice Pop — AlaskaLabs",
  description: "The purest peptide, straight from the source.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${bebasNeue.variable} ${fraunces.variable}`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
