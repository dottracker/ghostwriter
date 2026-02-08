import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export const revalidate = 0;

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post || error) {
    return (
      <div className="min-h-screen py-20 text-center font-serif text-2xl text-[#8C7171]">
        <p>Taking a nap... (Post Not Found)</p>
        <Link href="/" className="text-sm underline mt-4 block">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-[#94A684] font-bold mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <span className="mr-2">←</span> Back to the library
        </Link>

        <header className="mb-12">
          <div className="text-[#94A684] font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
            {post.category} • {new Date(post.created_at).toLocaleDateString()}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#483434] leading-tight mb-6">
            {post.title}
          </h1>
          <div className="h-1 w-20 bg-[#E2C799] rounded-full"></div>
        </header>

        <article className="prose prose-stone prose-headings:font-serif prose-headings:text-[#483434] prose-p:text-[#6B5E5E] prose-p:leading-[1.8] text-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        <div className="mt-20 p-8 bg-[#F2E3DB] rounded-[2rem] text-center border-2 border-dashed border-[#E2C799]">
          <p className="font-serif italic text-[#8C7171]">
            This entry was prepared by your AI companion, Gem. 
            Best enjoyed with a cup of earl grey tea.
          </p>
        </div>
      </div>
    </div>
  );
}