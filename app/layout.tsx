import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "huse kivrak",
  description: "Talk to an AI version of Huse Kivrak — software engineer.",
  openGraph: {
    title: "huse kivrak",
    description: "Talk to an AI version of Huse Kivrak — software engineer.",
    url: "https://huse.dev",
    siteName: "huse.dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          {children}
        </main>
        <footer className="text-center py-6">
          <span className="text-xs text-stone-600 tracking-widest">
            &copy; {new Date().getFullYear()} Huse Kivrak
          </span>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
}
