"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, RotateCcw, CloudRain, Music, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function StudyHall() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1);
        else if (minutes > 0) { setMinutes(minutes - 1); setSeconds(59); }
        else { setIsActive(false); alert("Session complete!"); }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#0F172A] text-slate-900 dark:text-white transition-colors py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
            <ArrowLeft size={20} /> Library
          </Link>
          <ThemeToggle />
        </nav>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-12 shadow-2xl text-center border border-slate-100 dark:border-slate-700">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4 block">
            {mode === 'focus' ? 'Session in Progress' : 'Resting'}
          </span>
          <h1 className="text-8xl md:text-9xl font-serif mb-12 text-slate-900 dark:text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </h1>

          <div className="flex justify-center gap-6">
            <button 
              onClick={() => setIsActive(!isActive)}
              className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 shadow-xl transition-all"
            >
              {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
            </button>
            <button 
              onClick={() => {setIsActive(false); setMinutes(25); setSeconds(0);}}
              className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:rotate-180 transition-all duration-500"
            >
              <RotateCcw size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}