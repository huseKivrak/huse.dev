import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { TbMailFilled } from 'react-icons/tb';
import { allPosts } from '@/.contentlayer/generated';
import { compareDesc } from 'date-fns';

import Link from 'next/link';

export default async function App() {
  const latestPost = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )[0];

  return (
    <div>
      <div className='mb-10 font-thin'>
        <h1>huse kivrak</h1>
        <h2 className='font-thin text-xl mb-4 text-stone-200'>
          software engineer
        </h2>

        <div className='flex space-x-12 text-3xl ml-1'>
          <Link
            href='https://github.com/husekivrak'
            target='_blank'
            aria-label='GitHub Link'
          >
            <SiGithub className=' text-white hover:bg-stone-600 rounded-full hover:text-black' />
          </Link>
          <Link
            href='https://www.linkedin.com/in/husekivrak/'
            target='_blank'
            aria-label='LinkedIn Link'
          >
            <FaLinkedin className='text-white hover:text-blue-500' />
          </Link>
          <Link
            href='mailto:huse@husekivrak.com'
            target='_blank'
            rel='noopener noreferrer'
            className='text-stone-100/80'
            aria-label='Email Link'
          >
            <TbMailFilled className='text-white hover:text-rose-300' />
          </Link>
        </div>

        <div className='mt-2 text-2xl font-light tracking-wider py-4 text-stone-200'>
          <Link
            href='/about'
            className='hover:text-stone-500 underline decoration-0 underline-offset-2'
          >
            learn more
          </Link>
          <h3 className='mt-8 tracking-wider'>latest blog post:</h3>
          <Link
            href={latestPost.url}
            className='hover:text-stone-500 underline decoration-0 underline-offset-2'
          >
            {latestPost.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
