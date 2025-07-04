import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "huse.dev",
  description: "developer, creator, problem solver",
  keywords: ["huse", "developer", "portfolio", "projects", "software engineer"],
  authors: [{ name: "huse" }],
  openGraph: {
    title: "huse.dev",
    description: "developer, creator, problem solver",
    url: "https://huse.dev",
    siteName: "huse.dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-stone-100 font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
