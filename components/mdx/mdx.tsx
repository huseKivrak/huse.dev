import './mdx.css';
import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  //   h1: (props) => (
  //     <h1
  //       className='text-5xl font-thin text-white tracking-widest mt-8'
  //       {...props}
  //     />
  //   ),
  h2: (props) => (
    <h2 className='text-4xl font-extralight mt-8 text-rose-300' {...props} />
  ),
  h3: (props) => (
    <h2
      className='text-3xl font-extralight mt-8 pl-8 text-rose-300'
      {...props}
    />
  ),

  p: (props) => (
    <p
      className='text-xl text-normal tracking-normal font-extralight text-white leading-7 mt-4'
      {...props}
    />
  ),

  ul: (props) => <ul className='list-disc ml-8 mr-4 mt-2' {...props} />,
  li: (props) => (
    <li {...props} className='mb-1 font-extralight text-lg pr-1' />
  ),
  ol: (props) => <ol className='list-decimal' {...props} />,

  a: (props) => (
    <a
      className='text-white hover:text-stone-400 font-normal text-lg'
      {...props}
      target='_blank'
    />
  ),
  pre: (props) => <pre className='mt-4' {...props} />,
  code: (props) => (
    <code className='text-sm text-emerald-400 mt-4' {...props} />
  ),

  blockquote: (props) => (
    <blockquote
      className='text-sm italic text-white mb-8 ml-4 pl-2 border-l-4 border-rose-200'
      {...props}
    />
  ),

  em: (props) => <em className='' {...props} />,
  strong: (props) => <strong className='font-light' {...props} />,
  img: (props) => <img className='mx-auto mt-4' {...props} />,
//   figcaption: (props) => <figcaption className='text-sm font-thin italic' {...props} />

};
