import { Post } from "contentlayer/generated";

import Link from "next/link";

export default function PostCard(post: Post) {
  return (
    <div className="mb-12">
      <h2 >
        <Link
          href={post.url}
          className="text-stone-200 hover:text-white"
        >
          {post.title}
        </Link>
      </h2>
      <p className='text-stone-100 font-light mb-1'>{post.description}</p>
      <time dateTime={post.date} className="mb-2 block text-xs font-light text-stone-200">
      {new Date(post.date).toLocaleDateString("en-US")}
      </time>
    </div>
  );
}
