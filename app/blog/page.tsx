'use client';


import supabase from "../../lib/supabase";
import Link from "next/link";
export default async function Blog() {
  const { data: posts } = await supabase.from("posts").select();
  return (
    <div>
      <h1 className="">
        blog
      </h1>
      <div>
        {posts?.map((post) => {
          const { id, name } = post || {};
          return (
            <div className="flex mt-4">
              <p className="mr-2">#{id}:</p>
              <Link href={`/blog/${id}`}>
                <h4>{name}</h4>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
