"use client"; // We make this client-side for the checkboxes
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function RoadmapPage({ params }: { params: any }) {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      const resolved = await params;
      const { data } = await supabase.from('posts').select('*').eq('id', resolved.id).single();
      setData(data);
      // Load saved progress from localStorage
      const saved = localStorage.getItem(`progress-${resolved.id}`);
      if (saved) setCompleted(JSON.parse(saved));
    };
    load();
  }, [params]);

  const toggleStep = (stepIndex: number) => {
    const newCompleted = completed.includes(stepIndex)
      ? completed.filter(i => i !== stepIndex)
      : [...completed, stepIndex];
    setCompleted(newCompleted);
    localStorage.setItem(`progress-${data.id}`, JSON.stringify(newCompleted));
  };

  if (!data) return <div className="p-20 text-center font-serif">Unrolling the parchment...</div>;

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <Link href="/" className="text-[#94A684] font-bold block mb-10">← Back to Library</Link>
      
      <header className="mb-12 border-b-2 border-[#F3E9E2] pb-10">
        <h1 className="font-serif text-5xl text-[#483434] mb-4">{data.title}</h1>
        <p className="text-lg text-[#6B5E5E] italic mb-6">{data.description}</p>
        <div className="flex gap-4 text-sm font-bold uppercase text-[#8C7171]">
          <span>Level: {data.difficulty}</span>
          <span>•</span>
          <span>Duration: {data.time_estimate}</span>
        </div>
      </header>

      <div className="space-y-8 relative">
        {/* Connecting Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#F3E9E2] z-0"></div>

        {data.steps?.map((step: any, index: number) => (
          <div key={index} className="relative z-10 flex gap-6 group">
            <button 
              onClick={() => toggleStep(index)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                completed.includes(index) ? 'bg-[#94A684] border-[#94A684] text-white' : 'bg-white border-[#F3E9E2] text-transparent'
              }`}
            >
              ✓
            </button>
            <div className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                completed.includes(index) ? 'bg-[#F9FBF8] border-[#94A684]/20' : 'bg-white border-[#F3E9E2]'
            }`}>
              <h3 className="font-serif text-xl text-[#483434] mb-2">Step {step.step}: {step.task}</h3>
              <p className="text-[#6B5E5E] leading-relaxed">{step.details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-[#F2E3DB] rounded-[2rem] text-center">
        <h4 className="font-serif text-[#8C7171] mb-2">Further Learning</h4>
        <a 
          href={`https://www.google.com/search?q=how+to+${encodeURIComponent(data.title)}`}
          target="_blank"
          className="text-[#94A684] font-bold underline"
        >
          Search verified tutorials on Google →
        </a>
      </div>
    </div>
  );
}