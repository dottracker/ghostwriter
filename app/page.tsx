"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Search, Coffee, Sparkles, BookOpen } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const PAGE_SIZE = 6;

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // FETCH FUNCTION
  const fetchRoadmaps = useCallback(async (pageNumber: number, isNewSearch: boolean = false) => {
    setLoading(true);
    
    // Calculate the range for pagination
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply Search Filter if search exists
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (!error && data) {
      if (isNewSearch) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }

      // Check if we've reached the end of the database
      const totalLoaded = from + data.length;
      if (count !== null && totalLoaded >= count) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
    setLoading(false);
  }, [search]);

  // Handle Search Changes (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      setHasMore(true);
      fetchRoadmaps(0, true);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchRoadmaps]);

  // Load More Function
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRoadmaps(nextPage);
  };

  return (
    <main className="min-h-screen bg-study-light dark:bg-study-darkBg text-study-ink dark:text-study-darkText transition-colors duration-300 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-study-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-study-accent/30 rotate-3">
              <BookOpen size={24} />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight hidden sm:block">
              The Library
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/study-hall" 
              className="flex items-center gap-2 px-5 py-2.5 bg-study-accent text-white rounded-full font-bold shadow-lg shadow-study-accent/20 hover:scale-105 transition-all text-sm"
            >
              <Coffee size={18} /> <span className="hidden xs:inline">Study Hall</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* HERO & SEARCH */}
        <header className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
            What shall we <br /> <span className="text-study-accent italic">master</span> today?
          </h1>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-study-accent transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text"
              placeholder="Search skills, topics, or tags..."
              className="w-full pl-14 pr-8 py-5 rounded-[2rem] border-2 border-study-accent/10 bg-white dark:bg-study-darkCard shadow-xl shadow-blue-100/20 dark:shadow-none outline-none focus:border-study-accent transition-all text-lg"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* GRID OF ROADMAPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((roadmap) => (
            <Link href={`/post/${roadmap.post_uuid}`} key={roadmap.post_uuid}>
              <div className="group bg-white dark:bg-study-darkCard p-8 rounded-[2.5rem] border-2 border-transparent hover:border-study-accent/20 dark:hover:border-study-accent/40 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-study-light dark:bg-study-darkBg text-study-accent text-[10px] font-bold rounded-lg uppercase tracking-widest">
                    {roadmap.difficulty}
                  </span>
                  <Sparkles size={16} className="text-study-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="font-serif text-2xl mb-4 group-hover:text-study-accent transition-colors leading-tight">
                  {roadmap.title}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-8">
                  {roadmap.description}
                </p>

                <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex gap-2">
                    {roadmap.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[10px] text-gray-400 font-medium">#{tag}</span>
                    ))}
                  </div>
                  <span className="text-xs font-serif italic text-gray-400">{roadmap.time_estimate}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-400 italic">No scrolls match your search...</p>
          </div>
        )}

        {/* PAGINATION / LOAD MORE */}
        {hasMore && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="px-10 py-4 bg-white dark:bg-study-darkCard border-2 border-study-accent text-study-accent font-bold rounded-full hover:bg-study-accent hover:text-white transition-all shadow-lg disabled:opacity-50 flex items-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Opening Scrolls...
                </>
              ) : (
                "Explore More Knowledge"
              )}
            </button>
          </div>
        )}

        <footer className="mt-32 pb-12 text-center border-t border-study-accent/10 pt-12">
          <p className="font-serif italic text-gray-400">
            "Knowledge is a light that grows as it is shared."
          </p>
        </footer>
      </div>
    </main>
  );
}