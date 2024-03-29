import './globals.css';
import type {Metadata} from 'next';
import {Josefin_Sans} from 'next/font/google';
import Script from 'next/script';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import {SpeedInsights} from '@vercel/speed-insights/next';

const jose = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'huse kivrak',
	description: "Huse Kivrak's personal website",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en' className={jose.className}>
			<head>
				<Script id='UserGuiding'>
					{`(function(g,u,i,d,e,s){g[e]=g[e]||[];var f=u.getElementsByTagName(i)[0];var k=u.createElement(i);k.async=true;k.src='https://static.userguiding.com/media/user-guiding-'+s+'-embedded.js';f.parentNode.insertBefore(k,f);if(g[d])return;var ug=g[d]={q:[]};ug.c=function(n){return function(){ug.q.push([n,arguments])};};var m=['previewGuide','finishPreview','track','identify','hideChecklist','launchChecklist'];for(var j=0;j<m.length;j+=1){ug[m[j]]=ug.c(m[j]);}})(window,document,'script','userGuiding','userGuidingLayer','4ZI80797D76ID');`}
				</Script>
			</head>
			<body className='antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 lg:mx-auto'>
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
