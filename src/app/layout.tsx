import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart FIR - Legal Awareness & FIR Management",
  description: "Empowering citizens with legal awareness and AI-powered FIR registration system",
  keywords: ["Smart FIR", "Legal Awareness", "BNS", "FIR", "Indian Law", "AI Legal Assistant"],
  authors: [{ name: "Smart FIR Team" }],
  openGraph: {
    title: "Smart FIR - Legal Awareness Platform",
    description: "AI-powered legal assistance and FIR management system",
    url: "https://smartfir.example.com",
    siteName: "Smart FIR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart FIR - Legal Awareness Platform",
    description: "AI-powered legal assistance and FIR management system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
