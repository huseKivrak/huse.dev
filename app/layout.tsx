import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'huse.dev',
  description: 'minimalist voice ai with 10 distinct personalities',
  keywords: ['voice ai', 'conversational ai', 'elevenlabs', 'minimalist'],
  authors: [{ name: 'huse' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'huse.dev',
    description: 'minimalist voice ai with 10 distinct personalities',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} bg-black`}>
      <body className="font-mono antialiased bg-black text-stone-300 min-h-screen">
        {children}
      </body>
    </html>
  );
}
