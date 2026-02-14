"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Search, Coffee, BookOpen, ArrowUpDown, ChevronDown } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const PAGE_SIZE = 6;

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Sorting State
  const [sortBy, setSortBy] = useState("created_at"); 
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Helper to clean Gemini's "Fluff" from time estimates
  const cleanTime = (time: string) => {
    if (!time) return "N/A";
    // Regex to keep only the first part (e.g., "4-6 weeks")
    const match = time.match(/^\d+-\d+\s+\w+|^\d+\s+\w+/);
    return match ? match[0] : time.split(',')[0].split('(')[0].trim();
  };

  const fetchRoadmaps = useCallback(async (pageNumber: number, isNewSearch: boolean = false) => {
    setLoading(true);
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('posts').select('*', { count: 'exact' }).range(from, to);

    // Sorting Logic
    query = query.order(sortBy, { ascending: order === "asc" });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, count, error } = await query;
    if (!error && data) {
      setPosts(prev => isNewSearch ? data : [...prev, ...data]);
      setHasMore(count !== null && from + data.length < count);
    }
    setLoading(false);
  }, [search, sortBy, order]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      fetchRoadmaps(0, true);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, sortBy, order, fetchRoadmaps]);

  return (
    <main className="min-h-screen bg-[#F0F7FF] dark:bg-[#0F172A] transition-colors duration-300 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* NAV (Fixed Tags) */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Library" className="w-12 h-12 object-contain" />
             <span className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Library</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/study-hall" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-all text-sm">
              <Coffee size={18} /> Study Hall
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* SEARCH & SORT */}
        <header className="mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-slate-900 dark:text-white mb-8 text-center leading-tight">
             Explore the <span className="text-blue-600 italic">Curriculum</span>
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search skills or topics..."
                className="w-full pl-16 pr-8 py-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 dark:text-white text-slate-900 shadow-xl outline-none text-lg"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center items-center">
              <div className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400 mr-3 uppercase">Sort By:</span>
                <select 
                  className="bg-transparent text-slate-900 dark:text-white font-bold outline-none text-sm cursor-pointer"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created_at">Date Added</option>
                  <option value="title">Alphabetical</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="time_estimate">Duration</option>
                </select>
              </div>

              <button 
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm"
              >
                <ArrowUpDown size={16} /> {order === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((roadmap) => (
            <Link href={`/post/${roadmap.post_uuid}`} key={roadmap.post_uuid} className="group h-full">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-blue-500/30 transition-all shadow-md hover:shadow-2xl flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-bold rounded-lg uppercase tracking-tighter">
                    {roadmap.difficulty}
                  </span>
                  <span className="text-xs font-serif italic text-slate-400 dark:text-slate-500">
                    {cleanTime(roadmap.time_estimate)}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {roadmap.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-8">
                  {roadmap.description}
                </p>
                <div className="mt-auto flex gap-2">
                  {roadmap.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[10px] font-bold text-blue-600 dark:text-blue-400">#{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="mt-16 flex justify-center">
            <button onClick={() => { setPage(p => p + 1); fetchRoadmaps(page + 1); }} className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all">
              {loading ? "Loading..." : "Load More Scrolls"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
