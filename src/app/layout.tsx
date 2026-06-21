import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://komaniyaexpress.com.br"),
  title: {
    default: "Komaniya Express - Farm de Primogemas Profissional",
    template: "%s | Komaniya Express",
  },
  description:
    "Serviço profissional de farm de Primogemas para Genshin Impact. Farm seguro, rápido e com os melhores preços do Brasil.",
  keywords: [
    "genshin impact", "farm primogemas", "genshin boost", "primogemas brasil",
    "farm genshin", "genshin impact brasil", "exploração genshin",
  ],
  authors: [{ name: "Komaniya Express" }],
  creator: "Komaniya Express",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://komaniyaexpress.com.br",
    siteName: "Komaniya Express",
    title: "Komaniya Express - Farm de Primogemas Profissional",
    description: "Serviço profissional de farm de Primogemas para Genshin Impact.",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "Komaniya Express" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
