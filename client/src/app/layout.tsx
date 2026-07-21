import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeKing — Modern Typing Speed Test",
  description: "Minimalist, high-performance typing test with solo practice and real-time multiplayer racing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
        <footer className="py-6 text-center text-xs font-mono text-neutral-600">
          TypeKing — minimalist typing test & race
        </footer>
      </body>
    </html>
  );
}
