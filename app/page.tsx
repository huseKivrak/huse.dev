import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { TbMailFilled } from 'react-icons/tb';
import { allPosts } from '@/.contentlayer/generated';
import { compareDesc } from 'date-fns';
import Link from 'next/link';
import TechStack from '@/components/TechStack';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default async function App() {
  const latestPost = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )[0];

  return (
    <div>
      <div className='mb-2'>
        <div className='flex justify-between'>
          <div className='flex flex-col'>
            <h1>huse kivrak</h1>
            <h2 className='font-extralight text-stone-300 ml-1'>
              software engineer
            </h2>

            <div className='flex space-x-16 text-2xl mt-2 ml-1'>
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
          </div>
          <div className='mt-4 mr-2'>
            <Image
              src='/images/huse.png'
              alt='profile picture'
              width={125}
              height={125}
            />
          </div>
        </div>
        <div className='font-light tracking-wider py-4 text-stone-200 mt-2'>
          <Separator />
          <p className='font-light text-md mt-4 text-stone-400'>
            latest blog post:{' '}
            <Link
              href={latestPost.url}
              className=' hover:text-stone-600 underline decoration-0 underline-offset-2'
            >
              {latestPost.title}
            </Link>
          </p>
          <div className='text-xl tracking-normal font-extralight text-white'>
            <p className='mt-6'>
              Hi, I&apos;m Huse (like moose 🫎), a software engineer based in
              NYC. <br />I collaborate with clients and colleagues to build
              robust, full-stack applications.
            </p>
            <p className='mt-4'>
              I was previously the director of education at a nonprofit science
              museum, where I managed client-driven projects with administrators and community leaders. I&apos;m passionate about continuous learning, scientific
              literacy, and resourceful problem-solving.
            </p>
            <div className='mt-8 max-w-max mx-auto'>
              <p className='font-extralight text-base'>tools & technologies</p>
              <div className='flex flex-col items-start'>
                <TechStack />
              </div>
            </div>
            <p className='mt-10'>I&apos;m currently open to new opportunities.</p>
            <p className='mt-1 text-lg'>
              You can download my resume{' '}
              <Link
                href='/pdfs/huseKivrakResume.pdf'
                target='_blank'
                className='font-light text-white underline decoration-0 underline-offset-2 hover:text-stone-400'
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
