import supabase from "@/lib/supabase";
import { notFound } from "next/navigation";


export const revalidate = 60


export async function generateStaticParams() {
  const { data: posts } = await supabase.from("posts").select("id");

  return posts?.map(({ id }) => ({
    id,
  }));
}

export default async function Post({postId}:any) {

  const { data:post } = await supabase.from("posts").select().match({ postId }).single();

  if (!post) {
    notFound();
  }

  return <pre>{JSON.stringify(post, null, 2)}</pre>;
}
