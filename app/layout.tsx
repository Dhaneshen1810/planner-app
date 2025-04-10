import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700"], // Load specific font weights
});

export const metadata: Metadata = {
  title: "Planner App",
  description: "Planner App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex h-screen bg-gradient-to-b from-lightPink via-lightPink to-lavender justify-center">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
