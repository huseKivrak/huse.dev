import { format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer/hooks';
import type { MDXComponents } from 'mdx/types';
import { Separator } from '@/components/ui/separator';
const mdxComponents: MDXComponents = {};

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.description,
  };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) notFound();

  const MDXContent = useMDXComponent(post.body.code);

  return (
    <article className=''>
      <h1>{post.title}</h1>
      <p className='font-thin text-stone-100 text-xl'>{post.description}</p>
      <time dateTime={post.date} className='mb-1 text-xs font-light text-stone-200'>
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <Separator className=''/>
      <MDXContent components={mdxComponents} />
    </article>
  );
};

export default PostLayout;
