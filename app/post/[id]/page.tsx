import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export const revalidate = 0;

// NOTICE: params is now a Promise in Next.js 15
export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Await the params to get the actual ID from the URL
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch the specific post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Handle errors or missing post
  if (!post || error) {
    console.error("Supabase Error:", error); // This helps you debug in the console
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-gray-500 mb-4">We couldn't find a post with ID: {id}</p>
        <Link href="/" className="text-blue-500 underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/" className="text-gray-500 hover:text-black mb-8 block">
        ← Back to all posts
      </Link>
      
      <header className="mb-10">
        <span className="text-blue-600 text-sm font-bold uppercase">{post.category}</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-4 text-gray-900 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-400 mt-4 text-sm">
          Published on {new Date(post.created_at).toLocaleDateString()}
        </p>
      </header>

      <article className="prose prose-lg max-w-none border-t pt-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}
