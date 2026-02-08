import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export const revalidate = 0; // Always check for new posts

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts').select('*').order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Ghostwriter</h1>
      {posts?.map((post) => (
        <div key={post.id} className="border-b py-6">
          <span className="text-blue-600 text-sm uppercase">{post.category}</span>
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <Link href={`/post/${post.id}`} className="text-blue-500 hover:underline">Read more</Link>
        </div>
      ))}
    </div>
  );
}