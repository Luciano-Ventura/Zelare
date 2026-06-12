import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#8ECADF",
};

export const metadata: Metadata = {
  title: "Zelare | Cuidadores, babás e profissionais de enfermagem",
  description: "A Zelare conecta famílias a cuidadores, babás e profissionais de enfermagem para plantões avulsos ou recorrentes, com segurança, agilidade e confiança.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zelare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-bg-main text-text-main">
        {children}
      </body>
    </html>
  );
}
