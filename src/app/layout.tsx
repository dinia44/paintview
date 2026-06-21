import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StoreHydrator } from "@/components/StoreHydrator";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PaintView — Smart room capture, colour preview, and decorator quotes",
  description:
    "Take room photos, mark walls, estimate paint, preview colours, and build professional quotes for painters and decorators.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PaintView",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090B12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
