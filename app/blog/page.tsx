import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import PostCard from '@/components/PostCard'

export default function Blog() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="">
      <h1 className='mb-6'>blog</h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  )
}