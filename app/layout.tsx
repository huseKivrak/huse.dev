import './globals.css';
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const jose = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'huse kivrak',
  description: "Huse Kivrak's personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={jose.className}>
      <body className='antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 lg:mx-auto'>
        <main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
          <Nav />
          {children}
          <Analytics />
        </main>
      </body>
      <Footer />
    </html>
  );
}
