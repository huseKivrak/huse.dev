import './globals.css';
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
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
			<body className='antialiased'>
				<main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
					{children}
					<SpeedInsights />
				</main>
			</body>
		</html>
	);
}
