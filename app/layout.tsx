import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";

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
    <html lang="en">
      <body className={jose.className}>{children}</body>
    </html>
  );
}
