'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBookOpen, FiSun, FiMoon, FiMenu, FiX, FiUsers, FiCompass, FiPieChart } from 'react-icons/fi';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: <FiCompass size={16} /> },
    { name: 'Instructors', href: '/instructors', icon: <FiUsers size={16} /> },
    { name: 'Courses', href: '/courses', icon: <FiBookOpen size={16} /> },
    { name: 'Analytics', href: '/analytics', icon: <FiPieChart size={16} /> },
  ];

  return (
    <nav className="glass-panel sticky top-4 z-50 w-full max-w-7xl mx-auto rounded-2xl px-5 py-3 shadow-md mb-6 border border-border/80">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-violet text-white shadow-md shadow-brand-cyan/20 group-hover:rotate-12 transition-transform duration-300">
            <FiCompass size={18} />
          </div>
          <div>
            <span className="font-extrabold text-sm md:text-base tracking-tight text-foreground bg-gradient-to-r from-brand-cyan to-brand-violet bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              EduEval
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1.5 px-1.5 py-0.5 rounded bg-muted/60 dark:bg-muted/40">
              v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-brand-cyan bg-brand-cyan/5 dark:bg-brand-cyan/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions (Toggle & Mobile Trigger) */}
        <div className="flex items-center gap-2">
          {/* Theme Switch */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border text-foreground hover:bg-muted/80 focus:outline-none transition-all active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-background border border-border text-foreground hover:bg-muted/80 focus:outline-none transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-3 border-t border-border/60 flex flex-col gap-2 animate-slide-down">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'text-brand-cyan bg-brand-cyan/5 dark:bg-brand-cyan/10 border-l-4 border-l-brand-cyan'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-l-4 border-l-transparent'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
