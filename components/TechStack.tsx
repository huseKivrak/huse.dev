import * as Icons from 'react-icons/si';
import { Tech } from '@/lib/types';

/** TECH STACK */
export const TECHS: Tech[] = [
  {
    title: 'JavaScript',
    Icon: Icons.SiJavascript,
    color: 'text-yellow-300',
    url: 'https://www.javascript.com/',
  },
  {
    title: 'TypeScript',
    Icon: Icons.SiTypescript,
    color: 'text-blue-600',
    url: 'https://www.typescriptlang.org/',
  },
  {
    title: 'Python',
    Icon: Icons.SiPython,
    color: 'text-blue-300',
    url: 'https://www.python.org/',
  },
  {
    title: 'Tailwind CSS',
    Icon: Icons.SiTailwindcss,
    color: 'text-teal-500',
    url: 'https://tailwindcss.com/',
  },
  {
    title: 'React',
    Icon: Icons.SiReact,
    color: 'text-blue-300',
    url: 'https://reactjs.org/',
  },
  {
    title: 'Node.js',
    Icon: Icons.SiNodedotjs,
    color: 'text-green-400',
    url: 'https://nodejs.org/',
  },
  {
    title: 'Express',
    Icon: Icons.SiExpress,
    color: 'text-black hover:bg-stone-700 rounded-full',
    url: 'https://expressjs.com/',
  },
  {
    title: 'Django',
    Icon: Icons.SiDjango,
    color: 'text-green-700',
    url: 'https://www.djangoproject.com/',
  },
  {
    title: 'Flask',
    Icon: Icons.SiFlask,
    color: 'text-black hover:bg-stone-700 rounded',
    url: 'https://flask.palletsprojects.com/',
  },
  {
    title: 'PostgreSQL',
    Icon: Icons.SiPostgresql,
    color: 'text-blue-700',
    url: 'https://www.postgresql.org/',
  },
  {
    title: 'Next.js',
    Icon: Icons.SiNextdotjs,
    color: 'text-black hover:bg-stone-600 rounded-full',
    url: 'https://nextjs.org/',
  },
  {
    title: 'Vercel',
    Icon: Icons.SiVercel,
    color: 'text-black hover:bg-stone-600 rounded',
    url: 'https://vercel.com/',
  },
];

export default function TechStack() {
  return (
    <div id='icons' className=' grid grid-cols-6 gap-y-8 gap-x-12 max-w-fit'>
      {TECHS.map((tech) => (
        <a
          href={tech.url}
          className='relative group'
          target='_blank'
          rel='noopener noreferrer'
          key={tech.title}
        >
          <tech.Icon
            className={`text-3xl ${tech.color} opacity-60 hover:opacity-100 transition-opacity duration-200`}
          />
          <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full bg-stone-700 text-white text-xs rounded px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            {tech.title}
          </span>
        </a>
      ))}
    </div>
  );
}
