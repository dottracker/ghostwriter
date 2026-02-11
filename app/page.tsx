"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true);
      
      // Start the query
      let query = supabase.from('posts').select('*');

      // 1. SEARCH LOGIC
      if (search) {
        // We search title OR description OR check if the tag array contains the word
        // ilike = case insensitive partial match
        const searchTerm = `%${search}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm},tags.cs.{${search.toLowerCase()}}`);
      }

      // 2. SORT LOGIC
      if (sortBy === "recent") {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === "difficulty") {
        // Custom order logic (Advanced first, or you can reverse it)
        query = query.order('difficulty', { ascending: true });
      } else if (sortBy === "alphabetical") {
        query = query.order('title', { ascending: true });
      }

      const { data, error } = await query;
      
      if (!error) setPosts(data || []);
      setLoading(false);
    };

    // Debounce: Wait 300ms after user stops typing to fetch
    const timeoutId = setTimeout(fetchRoadmaps, 300);
    return () => clearTimeout(timeoutId);
    
  }, [search, sortBy]);

  return (
    <main className="min-h-screen transition-colors duration-300 bg-study-light dark:bg-study-darkBg text-study-ink dark:text-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAV */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-study-accent rounded-xl rotate-12 flex items-center justify-center text-white font-bold">A</div>
            <span className="font-serif text-2xl font-bold tracking-tight">The Library</span>
          </div>
          <ThemeToggle />
        </nav>

        {/* SEARCH & FILTERS */}
        <section className="bg-white dark:bg-study-darkCard p-8 rounded-[3rem] shadow-xl shadow-blue-200/20 dark:shadow-none mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-8 text-center">What shall we master today?</h1>
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <input 
              type="text"
              placeholder="Search by keyword or tag..."
              className="flex-1 px-8 py-4 rounded-2xl border-2 border-study-light dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-study-accent transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="px-6 py-4 rounded-2xl border-2 border-study-light dark:border-gray-700 dark:bg-gray-800 font-bold outline-none"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Latest Books</option>
              <option value="difficulty">By Complexity</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </section>

        {/* ROADMAP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((roadmap) => (
            <Link href={`/post/${roadmap.post_uuid}`} key={roadmap.post_uuid}>
              <div className="group bg-white dark:bg-study-darkCard p-8 rounded-[2.5rem] border-b-8 border-r-8 border-transparent hover:border-study-accent/30 dark:hover:border-study-accent/10 hover:-translate-y-2 transition-all duration-300 h-full shadow-sm hover:shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold rounded-lg uppercase">
                    {roadmap.difficulty}
                  </span>
                </div>
                <h3 className="font-serif text-2xl mb-4 group-hover:text-blue-500 transition-colors">
                  {roadmap.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                  {roadmap.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {roadmap.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs text-study-accent font-medium">#{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}