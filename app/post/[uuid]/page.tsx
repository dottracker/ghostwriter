"use client";

import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ThemeToggle from '@/components/ThemeToggle';

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

        // 1. Fetch the Roadmap from Supabase using UUID
        const { data: roadmap, error } = await supabase
          .from('posts')
          .select('*')
          .eq('post_uuid', uuid)
          .single();

        if (error) throw error;

        if (roadmap) {
          setData(roadmap);
          
          // 2. Load Progress from LocalStorage
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
    // Save to LocalStorage using the UUID
    localStorage.setItem(`progress-${data.post_uuid}`, JSON.stringify(newCompleted));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-study-light dark:bg-study-darkBg transition-colors">
        <p className="font-serif text-2xl animate-pulse text-study-accent">Unrolling the scrolls...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-study-light dark:bg-study-darkBg transition-colors px-6 text-center">
        <h1 className="font-serif text-3xl mb-4">The Library has no record of this scroll.</h1>
        <Link href="/" className="px-6 py-2 bg-study-accent text-white rounded-full font-bold">Return Home</Link>
      </div>
    );
  }

  // Calculate Progress Percentage
  const progressPercent = Math.round((completed.length / data.steps.length) * 100);

  return (
    <div className="min-h-screen bg-study-light dark:bg-study-darkBg text-study-ink dark:text-gray-100 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <nav className="flex justify-between items-center mb-10">
          <Link href="/" className="group flex items-center gap-2 px-5 py-2 bg-white dark:bg-study-darkCard rounded-full shadow-sm hover:shadow-md transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-bold text-sm">Library</span>
          </Link>
          <ThemeToggle />
        </nav>

        {/* MAIN CARD */}
        <article className="bg-white dark:bg-study-darkCard rounded-[3rem] shadow-2xl overflow-hidden border border-white dark:border-gray-800">
          
          {/* HEADER SECTION */}
          <header className="pt-12 pb-8 px-8 md:px-12 text-center border-b border-gray-100 dark:border-gray-800">
            <div className="flex justify-center gap-3 mb-6">
              <span className="px-4 py-1 bg-study-accent/20 text-study-accent text-[10px] font-bold rounded-full uppercase tracking-widest">
                {data.category}
              </span>
              <span className="px-4 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest">
                {data.difficulty}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">
              {data.title}
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 text-lg italic font-serif max-w-xl mx-auto">
              "{data.description}"
            </p>

            {/* PROGRESS OVERVIEW */}
            <div className="mt-10 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-bold uppercase text-study-accent mb-2">
                <span>Your Progress</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-study-accent transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </header>

          {/* ROADMAP STEPS */}
          <div className="p-8 md:p-12 space-y-6">
            <h2 className="font-serif text-2xl mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-study-accent flex items-center justify-center text-white text-sm">✓</span>
              Learning Path
            </h2>

            {data.steps.map((item: Step, index: number) => (
              <div 
                key={index}
                onClick={() => toggleStep(index)}
                className={`group cursor-pointer p-6 rounded-[2rem] border-2 transition-all flex items-start gap-6 relative ${
                  completed.includes(index) 
                  ? 'border-study-accent bg-blue-50/30 dark:bg-blue-900/10' 
                  : 'border-study-light dark:border-gray-800 bg-white dark:bg-gray-900/40 hover:border-study-accent/40'
                }`}
              >
                {/* Step Number Bubble */}
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-xl transition-colors ${
                  completed.includes(index) 
                  ? 'bg-study-accent text-white' 
                  : 'bg-study-light dark:bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-serif text-2xl mb-2 transition-all ${
                    completed.includes(index) ? 'opacity-40 line-through text-gray-400' : 'text-study-ink dark:text-gray-100'
                  }`}>
                    {item.task}
                  </h3>
                  <div className={`text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none transition-opacity ${
                    completed.includes(index) ? 'opacity-30' : 'opacity-100'
                  }`}>
                    <ReactMarkdown>{item.details}</ReactMarkdown>
                  </div>
                </div>

                {/* Checkmark Indicator */}
                {completed.includes(index) && (
                  <div className="absolute top-6 right-8 text-study-accent text-2xl animate-bounce-short">
                    ✨
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FOOTER / RESEARCH TOOLS */}
          <footer className="bg-gray-50 dark:bg-gray-900/50 p-10 border-t border-gray-100 dark:border-gray-800 text-center">
            <h4 className="font-serif text-xl mb-4 text-study-ink dark:text-gray-200">Deepen Your Knowledge</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Want more factual resources? We've prepared a custom search to help you find verified tutorials and papers.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={`https://www.google.com/search?q=how+to+master+${encodeURIComponent(data.title)}+tutorial+factual`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-white dark:bg-study-darkCard text-study-accent border-2 border-study-accent/20 font-bold rounded-2xl hover:bg-study-accent/5 transition-all"
              >
                <span>🔍</span> Search Google for Tutorials
              </a>
              
              <a 
                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(data.title)}`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-white dark:bg-study-darkCard text-study-accent border-2 border-study-accent/20 font-bold rounded-2xl hover:bg-study-accent/5 transition-all"
              >
                🎓 Academic Resources
              </a>
            </div>

            <p className="mt-12 text-[10px] uppercase tracking-widest text-gray-400 font-bold italic">
              Archived by AI Mentor • {new Date(data.created_at).toLocaleDateString()}
            </p>
          </footer>
        </article>
      </div>

      {/* Added some custom animation to the globals.css later */}
      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s infinite;
        }
      `}</style>
    </div>
  );
}
