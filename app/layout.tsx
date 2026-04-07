// app/layout.tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import StoreStatusOverlay from "@/components/StoreStatusOverlay";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "✨ K-Pop Gacha Box | Blind Box Photocard Kamu",
  description:
    "Buka mystery blind box dan dapetin photocard K-pop eksklusif dari grup favorit kamu!",
  keywords: "kpop, gacha, photocard, blind box, NCT, BTS, SEVENTEEN, Stray Kids",
  openGraph: {
    title: "✨ K-Pop Gacha Box",
    description: "Dapetin photocard mystery dari grup K-pop favorit kamu!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body
        className="min-h-screen"
        style={{
          background: "linear-gradient(180deg, #FFF5E4 0%, #FFE8F0 40%, #EAF5FF 100%)",
          fontFamily: "var(--font-nunito), sans-serif",
        }}
      >
        <StoreStatusOverlay />
        {children}
      </body>
    </html>
  );
}
