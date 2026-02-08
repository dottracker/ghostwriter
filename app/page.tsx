import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export const revalidate = 0;

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts').select('*').order('created_at', { ascending: false });

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <header className="text-center mb-20">
          <div className="inline-block px-4 py-1 mb-4 border-y border-[#94A684] text-[#94A684] tracking-[0.2em] text-xs uppercase font-bold">
            Freshly Baked Every Six Hours
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-[#483434] mb-4">
            The Cozy Scribe
          </h1>
          <p className="italic text-[#8C7171] font-serif text-lg">
            "Warm thoughts for rainy afternoons."
          </p>
        </header>

        {/* Post Grid */}
        <div className="grid gap-12">
          {posts?.map((post) => (
            <article 
              key={post.id} 
              className="group relative bg-white border border-[#F3E9E2] p-8 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#F2E3DB] text-[#8C7171] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="h-px w-12 bg-[#F3E9E2]"></span>
              </div>
              
              <h2 className="font-serif text-3xl text-[#483434] mb-4 group-hover:text-[#94A684] transition-colors leading-snug">
                {post.title}
              </h2>
              
              <p className="text-[#6B5E5E] leading-relaxed mb-8 line-clamp-3">
                {post.content.substring(0, 180).replace(/[#*]/g, '')}...
              </p>

              <Link 
                href={`/post/${post.id}`} 
                className="inline-flex items-center justify-center px-8 py-3 bg-[#94A684] text-white font-bold rounded-full hover:bg-[#7A8A6A] transition-colors shadow-lg shadow-[#94A684]/20"
              >
                Read this entry
              </Link>
            </article>
          ))}
        </div>

        <footer className="mt-20 text-center text-[#A69090] text-sm font-serif italic border-t border-[#F3E9E2] pt-10">
          Stay warm & keep reading.
        </footer>
      </div>
    </main>
  );
}
