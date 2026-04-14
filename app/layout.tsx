import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google"
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConsultaSim",
  description: "Controle seus gastos no mercado em tempo real",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ConsultaSim",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
    children: React.ReactNode;
  }) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>{children}</body>
    </html>
  )
}