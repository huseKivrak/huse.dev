import './globals.css';
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';

const jose = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'huse',
	description: "huse's website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className={jose.className}>
			<body className='antialiased max-w-7xl mb-40 flex flex-col md:flex-row mx-4 lg:mx-auto'>
				<main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
					<Nav />
					{children}
					<SpeedInsights />
				</main>
			</body>
			<Footer />
		</html>
	);
}
