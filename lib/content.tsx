import { Project } from './types';

/** NAV LINKS */
export const NAV_LINKS = [
	{
		name: 'projects',
		url: '/projects',
	},
	{
		name: 'blog',
		url: '/blog',
	},
	// {
	//   name: "about",
	//   url: "/about",
	// },
	// {
	//   name: "contact",
	//   url: "/contact",
	// },
];

/** PROJECTS */
export const PROJECT_LIST: Project[] = [
	{
		title: 'npSpeak',
		description: 'AI-powered NPC voice synthesis',
		image: '/images/projects/npspeak.png',
		github: 'https://github.com/husekivrak/npspeak',
		tags: ['Next.js', 'TypeScript', 'AWS', 'ElevenLabs'],
	},
	{
		title: 'AMP Portal',
		description: 'a customer service dashboard',
		image: '/images/projects/amp.png',
		url: 'https://amp.husekivrak.com',
		github: 'https://github.com/husekivrak/car-wash-portal',
		tags: ['Next.js', 'TypeScript', 'PostgreSQL'],
	},
	{
		title: 'Jobly',
		description: 'a job search web application',
		image: '/images/projects/jobly.png',
		url: 'https://jobly.huse.dev',
		github: 'https://github.com/husekivrak/jobly',
		tags: ['Express.js', 'React', 'PostgreSQL'],
	},
	{
		title: 'Warbler',
		image: '/images/projects/warbler.png',
		description: 'a social media application',
		url: 'https://warbler-huse.onrender.com',
		github: 'https://github.com/husekivrak/warbler',
		tags: ['Flask', 'PostgreSQL', 'SQLAlchemy'],
	},
	{
		title: 'StudentGo',
		image: '/images/projects/rithmgo.jpg',
		description: 'a mobile application for students using the Rithm School API',
		github: 'https://github.com/husekivrak/studentgo',
		tags: ['React Native', 'TypeScript'],
	},
];
