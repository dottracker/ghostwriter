import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export const revalidate = 0;


export default async function Home() {
  const { data: roadmaps } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <header className="text-center mb-16">
        <h1 className="font-serif text-5xl text-[#483434] mb-4">The Apprentice's Library</h1>
        <p className="italic text-[#8C7171]">Curated roadmaps for the curious mind.</p>
      </header>

      <div className="grid gap-8">
        {roadmaps?.map((map) => (
          <Link href={`/post/${map.id}`} key={map.id}>
            <div className="bg-white border-2 border-[#F3E9E2] p-8 rounded-[2rem] hover:border-[#94A684] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#94A684] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  {map.difficulty}
                </span>
                <span className="text-[#A69090] text-sm font-serif italic">{map.time_estimate}</span>
              </div>
              <h2 className="text-3xl font-serif text-[#483434] group-hover:text-[#94A684] mb-2">{map.title}</h2>
              <p className="text-[#6B5E5E]">{map.description}</p>
              <div className="mt-4 flex gap-2">
                {map.tags?.map((t: string) => <span key={t} className="text-xs text-[#8C7171]">#{t}</span>)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}