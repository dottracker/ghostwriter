"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, RotateCcw, CloudRain, Coffee, Music, Home } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function StudyHall() {
  // Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  // Ambience State
  const [showRain, setShowRain] = useState(false);
  const [showLofi, setShowLofi] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Switch modes when timer hits zero
          const nextMode = mode === 'focus' ? 'break' : 'focus';
          setMode(nextMode);
          setMinutes(nextMode === 'focus' ? 25 : 5);
          setIsActive(false);
          alert(nextMode === 'focus' ? "Break over! Time to study." : "Great work! Take a short break.");
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode]);

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="min-h-screen bg-study-light dark:bg-study-darkBg text-study-ink dark:text-gray-100 transition-colors duration-500 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* NAV */}
        <nav className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-study-darkCard rounded-full shadow-sm hover:scale-105 transition-transform font-bold text-study-accent">
            <Home size={18} /> Home
          </Link>
          <ThemeToggle />
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: THE TIMER */}
          <div className="lg:col-span-2 bg-white dark:bg-study-darkCard rounded-[3rem] p-12 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden text-center border-b-8 border-study-accent/20">
            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${mode === 'focus' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              {mode === 'focus' ? '📔 Deep Study Session' : '🍵 Tea Break'}
            </span>
            
            <h1 className="font-serif text-8xl md:text-9xl mb-8 tracking-tighter">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </h1>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsActive(!isActive)}
                className="w-16 h-16 rounded-2xl bg-study-accent text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center hover:rotate-180 transition-transform duration-500"
              >
                <RotateCcw />
              </button>
            </div>

            {/* STEAMING CUP ANIMATION */}
            <div className="mt-12 relative">
                <div className="text-6xl">☕</div>
                {isActive && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
                        <span className="w-1 h-8 bg-gray-300/40 rounded-full animate-steam-slow"></span>
                        <span className="w-1 h-12 bg-gray-300/40 rounded-full animate-steam-fast"></span>
                        <span className="w-1 h-8 bg-gray-300/40 rounded-full animate-steam-slow"></span>
                    </div>
                )}
            </div>
          </div>

          {/* RIGHT COLUMN: AMBIENCE MIXER */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-study-darkCard p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="font-serif text-xl mb-6">Ambience Mixer</h3>
              
              <div className="space-y-4">
                {/* RAIN TOGGLE */}
                <button 
                  onClick={() => setShowRain(!showRain)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${showRain ? 'border-study-accent bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-50 dark:border-gray-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <CloudRain className={showRain ? 'text-study-accent' : 'text-gray-400'} />
                    <span className="font-bold">Soft Rain</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${showRain ? 'bg-study-accent' : 'bg-gray-200'}`} />
                </button>

                {/* LOFI TOGGLE */}
                <button 
                  onClick={() => setShowLofi(!showLofi)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${showLofi ? 'border-study-accent bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-50 dark:border-gray-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <Music className={showLofi ? 'text-study-accent' : 'text-gray-400'} />
                    <span className="font-bold">Lo-Fi Radio</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${showLofi ? 'bg-study-accent' : 'bg-gray-200'}`} />
                </button>
              </div>

              {/* HIDDEN AUDIO ELEMENTS (Using YouTube embeds for stability) */}
              <div className="hidden">
                {showRain && (
                  <iframe width="1" height="1" src="https://www.youtube.com/embed/mPZkdNFkNps?autoplay=1&loop=1" allow="autoplay"></iframe>
                )}
                {showLofi && (
                  <iframe width="1" height="1" src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1" allow="autoplay"></iframe>
                )}
              </div>
            </div>

            <div className="bg-study-accent p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200/50">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Coffee size={18} /> Study Tip
                </h4>
                <p className="text-sm opacity-90 leading-relaxed italic">
                    "The Library thrives on consistency. Focus for 25 minutes, then let your mind wander for 5. Great things are built in small steps."
                </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          50% { transform: translateY(-20px) scaleX(1.5); opacity: 0.5; }
          100% { transform: translateY(-40px) scaleX(2); opacity: 0; }
        }
        .animate-steam-slow { animation: steam 3s infinite ease-out; }
        .animate-steam-fast { animation: steam 2s infinite ease-out; }
      `}</style>
    </div>
  );
}