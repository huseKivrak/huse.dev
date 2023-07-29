import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import Nav from "@/components/Nav";

const jose = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "huse kivrak",
  description: "Portfolio of Huse Kivrak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-stone-800 tracking-wider">
      <body className={jose.className}>
        <Providers>
          <div className="relative flex flex-col h-screen">
            <Nav />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <footer className="text-stone-300 font-extralight w-full flex items-center justify-center py-3">
              &copy; huse kivrak 2023
            </footer>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
