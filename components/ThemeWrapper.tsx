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
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-cyan/20 to-transparent dark:from-brand-cyan/12 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-[-300px] w-[600px] h-[600px] bg-gradient-to-br from-brand-violet/8 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-200px] left-[-300px] w-[600px] h-[600px] bg-gradient-to-tr from-brand-cyan/8 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Grid pattern background overlay using brand-cyan tint */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20" />

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
