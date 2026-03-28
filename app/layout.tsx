// app/layout.tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "✨ K-Pop Gacha Box | Mystery Photocard Shop",
  description:
    "Open mystery blind boxes to discover exclusive K-pop photocards from your favorite groups!",
  keywords: "kpop, gacha, photocard, blind box, NCT, BTS, SEVENTEEN, Stray Kids",
  openGraph: {
    title: "✨ K-Pop Gacha Box",
    description: "Discover mystery photocards from your favorite K-pop groups!",
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
        {children}
      </body>
    </html>
  );
}
