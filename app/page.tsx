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
      <div className='mb-8'>
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
          <div className='text-xl tracking-normal font-extralight text-white'>
            <p className='mt-4'>
              I&apos;m a full-stack engineer with a background in science
              education. Informed by my experience developing and implementing
              curricula, I create robust applications that are intuitive for
              users and colleagues alike.
            </p>

            <p className='mt-4'>
              I&apos;m also passionate about continuous learning and love that
              tech is an endless opportunity for growth. I enjoy exploring all
              facets of development and favor frameworks that foster scalable,
              performant applications.
            </p>
            <p className='font-normal text-lg mt-4 ml-12 text-stone-300'>
              tools & technologies
            </p>
            <div className='flex flex-col items-start mt-1 ml-12'>
              <TechStack />
            </div>

            <p className='mt-12'>
              And I started a blog; I write about my projects and recent topics
              of interest.{' '}
            </p>
            <p className='font-normal text-lg mt-4 ml-12 text-stone-300'>
              latest blog post:
            </p>
            <Link
              href={latestPost.url}
              className='text-lg ml-12 hover:text-stone-500 underline decoration-0 underline-offset-2'
            >
              {latestPost.title}
            </Link>

            <p className='mt-8 font-semibold text-lg'>
              Currently open to new opportunities.
            </p>
            <p className='flex mt-1'>
              You can download my resume&nbsp;
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
