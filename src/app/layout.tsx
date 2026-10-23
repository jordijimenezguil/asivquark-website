import type { ReactNode } from "react";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { pageMetadata } from "@/lib/seo/metadata";
import "./globals.css";
const sans = Manrope({
  variable: "--font-marketing",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});
export const metadata = { ...pageMetadata(), icons: { icon: [{ url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" }, { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }] } };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
