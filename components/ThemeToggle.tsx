"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const isD = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isD);
    if (isD) document.documentElement.classList.add("dark");
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return <div className="p-6" />; // Prevent flicker

  return (
    <button onClick={toggle} className="p-3 rounded-xl bg-blue-100 dark:bg-slate-800 transition-all hover:scale-110 border border-blue-200 dark:border-slate-700">
      {isDark ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-slate-700" size={20} />}
    </button>
  );
}