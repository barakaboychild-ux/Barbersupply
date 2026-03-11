import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartContext";
import Header from "./components/Header";
import ConditionalFooter from "./components/ConditionalFooter";
import GlobalCart from "./components/GlobalCart";
import SessionManager from "./components/SessionManager";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Barber & Cosmetics Supply | Premium Professional Tools",
  description: "Your trusted supplier for premium barber and cosmetic products. Industrial grade tools and styling cosmetics for professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-outfit">
        <CartProvider>
          <SessionManager />
          <Header />
          <GlobalCart />
          <main>
            {children}
          </main>
          <ConditionalFooter />
        </CartProvider>
      </body>
    </html>
  );
}