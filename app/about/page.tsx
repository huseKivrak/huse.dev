import TechStack from '@/components/TechStack';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function About(): JSX.Element {
  return (
    <div className=''>
      <h1>about</h1>
      <div className='text-xl text-normal tracking-normal font-extralight text-white leading-7'>
        <div className='flex flex-col md:flex-row justify-between items-start'>
          <div className='flex flex-col md:flex-row'>
            <Image
              src='/images/huse.png'
              alt='profile picture of huse'
              width={125}
              height={125}
              className='object-contain'
            />
            <div className='flex flex-col items-start mt-2 md:mx-4 md:mt-10'>
              <h3 className='font-thin text-2xl tracking-widest text-white'>
                Huse Kivrak
              </h3>
              <Link
                href='https://github.com/husekivrak'
                className='font-thin tracking-widest text-white underline decoration-0 underline-offset-2 hover:text-stone-400 mb-1'
                target='_blank'
              >
                GitHub
              </Link>
              <Link
                href='https://linkedin.com/in/husekivrak'
                className='font-thin tracking-widest text-white underline decoration-0 underline-offset-2 hover:text-stone-400 mb-1'
                target='_blank'
              >
                LinkedIn
              </Link>
            </div>
          </div>
          <div id='tech' className='my-4 md:mt-10'>
            <h4 className=' text-xl font-thin tracking-widest'>
              tools & technologies
            </h4>
            <TechStack />
          </div>
        </div>
      </div>

      <div
        id='bio'
        className='text-xl text-normal tracking-normal font-extralight text-white leading-7'
      >
        {/* <Image
          src='/images/huse.png'
          alt='profile picture of huse'
          width={100}
          height={100}
          className='my-2'
        /> */}

        <Separator />
        <p className='mt-1'>
          Full-stack developer based in New York City.
          <br />
        </p>
        <p className='mt-4'>
          I&apos;m a &apos;late-blooming&apos; software engineer, fascinated by
          the versatility of programming. I love creating robust, intuitive
          tools that empower & delight users, and enjoy delving deeper into the
          principles & paradigms that underlie good code. Currently I&apos;m
          honing my skills in <span className='font-light'>Next.js </span>
          and <span className='font-light'>Django</span>, as well as other
          frameworks & technologies that facilitate scalable, performant
          development.
        </p>
        <p className='mt-3'>
          I also love offbeat, creative coding. I built a{' '}
          <Link
            href='/blog/chat-huh'
            className='font-light text-white underline decoration-0 underline-offset-2 hover:text-stone-400'
          >
            psychic chatbot
          </Link>
          , and am currently developing a{' '}
          <Link
            href='https://github.com/husekivrak/kanka'
            className='font-light text-white underline decoration-0 underline-offset-2 hover:text-stone-400'
            target='_blank'
          >
            letter correspondence service
          </Link>{' '}
          with Django that is definitely <i>not</i> &quot;just email but worse&quot;.
        </p>

        <p className='mt-3'>
          I transitioned to software engineering after six years in non-profit
          science education, bringing my love for collaboration & problem
          solving - plus my inner child - with me. I attended{' '}
          <Link
            href='https://rithmschool.com'
            className='font-light text-white underline decoration-0 underline-offset-2 hover:text-stone-400'
            target='_blank'
          >
            Rithm School
          </Link>
          , a 16-week full-stack bootcamp that instilled the values & practices
          essential to professional software development.
        </p>

        <p className='mt-2'>
          I&apos;m open to new opportunities and would love to hear from you!
        </p>
        <p className='flex'>
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
      {/* <div id='tech' className='my-2'>
        <h4 className=' text-3xl font-thin tracking-widest'>tech</h4>
        <TechStack />
      </div> */}
    </div>
  );
}
