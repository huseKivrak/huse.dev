import supabase from "../../../lib/supabase";
import Link from "next/link";
async function getPost(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", postId)
    .single();
  if (error) throw error;
  return data;
}

export default async function PostPage({ params }: any) {
  const post = await getPost(params.id);

  return (
    <div className="">
      <Link href="/blog">
        <span className="font-extralight text-rose-50">back</span>
        </Link>
      <h1 className="">
        #{post.id}: {post.name}
      </h1>
      <p>{post.content}</p>
    </div>
  );
}
