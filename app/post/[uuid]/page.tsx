"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ThemeToggle from '@/components/ThemeToggle';
import { BookOpen, CheckCircle2, GraduationCap, Search, ArrowLeft } from 'lucide-react';

// Define the shape of a Roadmap Step
interface Step {
  step: number;
  task: string;
  details: string;
}

export default function RoadmapPage({ params }: { params: Promise<{ uuid: string }> }) {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        const uuid = resolvedParams.uuid;

        const { data: roadmap, error } = await supabase
          .from('posts')
          .select('*')
          .eq('post_uuid', uuid)
          .single();

        if (error) throw error;

        if (roadmap) {
          setData(roadmap);
          const savedProgress = localStorage.getItem(`progress-${roadmap.post_uuid}`);
          if (savedProgress) {
            setCompleted(JSON.parse(savedProgress));
          }
        }
      } catch (err) {
        console.error("Error loading roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const toggleStep = (index: number) => {
    const newCompleted = completed.includes(index)
      ? completed.filter((i) => i !== index)
      : [...completed, index];

    setCompleted(newCompleted);
    localStorage.setItem(`progress-${data.post_uuid}`, JSON.stringify(newCompleted));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-study-light dark:bg-study-darkBg transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-study-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-serif text-2xl text-study-accent">Opening the scrolls...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-study-light dark:bg-study-darkBg transition-colors px-6 text-center">
        <h1 className="font-serif text-3xl mb-4 dark:text-slate-100">The Library has no record of this scroll.</h1>
        <Link href="/" className="px-6 py-2 bg-study-accent text-white rounded-full font-bold">Return Home</Link>
      </div>
    );
  }

  const progressPercent = Math.round((completed.length / data.steps.length) * 100);

  return (
    <div className="min-h-screen bg-study-light dark:bg-[#0F172A] text-study-ink dark:text-slate-100 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <nav className="flex justify-between items-center mb-10">
          <Link href="/" className="group flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-all dark:text-slate-200">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Library</span>
          </Link>
          <ThemeToggle />
        </nav>

        {/* MAIN CARD */}
        <article className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-slate-700">
          
          {/* HEADER SECTION */}
          <header className="pt-12 pb-8 px-8 md:px-12 text-center border-b border-gray-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex justify-center gap-3 mb-6">
              <span className="px-4 py-1 bg-study-accent/10 text-study-accent dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-study-accent/20">
                {data.category}
              </span>
              <span className="px-4 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                {data.difficulty}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight text-slate-900 dark:text-white">
              {data.title}
            </h1>
            
            <p className="text-gray-600 dark:text-slate-300 text-lg italic font-serif max-w-xl mx-auto leading-relaxed">
              "{data.description}"
            </p>

            {/* PROGRESS OVERVIEW */}
            <div className="mt-10 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-bold uppercase text-study-accent dark:text-blue-400 mb-2">
                <span>Learning Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-study-accent dark:bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </header>

          {/* ROADMAP STEPS */}
          <div className="p-8 md:p-12 space-y-6 bg-white dark:bg-slate-800">
            <h2 className="font-serif text-2xl mb-8 flex items-center gap-3 dark:text-white">
              <BookOpen className="text-study-accent dark:text-blue-400" />
              The Curriculum
            </h2>

            {data.steps.map((item: Step, index: number) => (
              <div 
                key={index}
                onClick={() => toggleStep(index)}
                className={`group cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex items-start gap-6 relative ${
                  completed.includes(index) 
                  ? 'border-study-accent bg-blue-50/30 dark:bg-blue-900/20 dark:border-blue-500' 
                  : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-study-accent/40'
                }`}
              >
                {/* Step Number Bubble */}
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-xl transition-all ${
                  completed.includes(index) 
                  ? 'bg-study-accent text-white scale-90' 
                  : 'bg-study-light dark:bg-slate-900 text-slate-400'
                }`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-serif text-2xl mb-2 transition-all ${
                    completed.includes(index) ? 'opacity-40 line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.task}
                  </h3>
                  {/* prose-invert fixes the Markdown text color in dark mode */}
                  <div className={`text-slate-600 dark:text-slate-300 leading-relaxed prose prose-slate dark:prose-invert max-w-none transition-opacity ${
                    completed.includes(index) ? 'opacity-30' : 'opacity-100'
                  }`}>
                    <ReactMarkdown>{item.details}</ReactMarkdown>
                  </div>
                </div>

                {/* Checkmark Indicator */}
                {completed.includes(index) && (
                  <CheckCircle2 className="absolute top-6 right-8 text-study-accent dark:text-blue-400 animate-in fade-in zoom-in duration-300" />
                )}
              </div>
            ))}
          </div>

          {/* FOOTER / RESEARCH TOOLS */}
          <footer className="bg-slate-50 dark:bg-slate-900/50 p-10 border-t border-slate-100 dark:border-slate-700 text-center">
            <h4 className="font-serif text-xl mb-4 text-slate-900 dark:text-white">Expand Your Horizons</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-sm mx-auto">
              Our AI provided the roadmap, but these factual search engines will provide the depth.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={`https://www.google.com/search?q=how+to+master+${encodeURIComponent(data.title)}+tutorial+factual`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-white dark:bg-slate-800 text-study-accent dark:text-blue-400 border-2 border-study-accent/20 dark:border-blue-400/20 font-bold rounded-2xl hover:bg-study-accent/5 transition-all flex items-center gap-2 shadow-sm"
              >
                <Search size={18} /> Search Tutorials
              </a>
              
              <a 
                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(data.title)}`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-white dark:bg-slate-800 text-study-accent dark:text-blue-400 border-2 border-study-accent/20 dark:border-blue-400/20 font-bold rounded-2xl hover:bg-study-accent/5 transition-all flex items-center gap-2 shadow-sm"
              >
                <GraduationCap size={18} /> Academic Sources
              </a>
            </div>

            <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-bold">
              Archived by AI Mentor • {new Date(data.created_at).toLocaleDateString()}
            </p>
          </footer>
        </article>
      </div>

      <style jsx global>{`
        .prose-invert {
          --tw-prose-body: #cbd5e1;
          --tw-prose-headings: #f8fafc;
          --tw-prose-bold: #f8fafc;
        }
      `}</style>
    </div>
  );
}
