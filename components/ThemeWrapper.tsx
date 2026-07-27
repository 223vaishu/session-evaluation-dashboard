'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    const timer = setTimeout(() => {
      setTheme(initialTheme);
      setMounted(true);
    }, 0);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => clearTimeout(timer);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Prevent flash of light mode during SSR mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col relative overflow-hidden">
      
      {/* Decorative ambient background — big colorful washes */}
      <div className="absolute top-[-200px] left-[15%] w-[900px] h-[500px] bg-gradient-to-br from-brand-cyan/30 via-brand-cyan/10 to-transparent dark:from-brand-cyan/12 dark:via-brand-cyan/4 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[300px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-bl from-brand-violet/20 via-brand-violet/8 to-transparent dark:from-brand-violet/10 dark:via-brand-violet/3 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-150px] left-[-200px] w-[600px] h-[600px] bg-gradient-to-tr from-brand-cyan/15 to-transparent dark:from-brand-cyan/6 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute top-[60%] left-[40%] w-[500px] h-[400px] bg-gradient-to-r from-brand-violet/10 via-pink-400/8 to-transparent dark:from-brand-violet/5 dark:via-pink-500/3 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Subtle dot texture overlay instead of rigid grid */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.015] pointer-events-none -z-20" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Global Navbar */}
      <div className="px-4 md:px-8 pt-4">
        <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {children}
      </div>
    </div>
  );
}
