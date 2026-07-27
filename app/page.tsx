'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_SESSIONS, Session } from '../lib/mockData';
import DashboardHeader from '../components/DashboardHeader';
import KpiCards from '../components/KpiCards';
import SessionList from '../components/SessionList';
import AnalyticsCharts from '../components/AnalyticsCharts';

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || session.course === selectedCourse;
    const matchesInstructor = selectedInstructor === 'all' || session.instructor === selectedInstructor;
    return matchesSearch && matchesCourse && matchesInstructor;
  });

  // Set selected session automatically if none is selected
  useEffect(() => {
    if (filteredSessions.length > 0) {
      if (!selectedSessionId || !filteredSessions.some(s => s.id === selectedSessionId)) {
        setSelectedSessionId(filteredSessions[0].id);
      }
    } else {
      setSelectedSessionId(null);
    }
  }, [filteredSessions, selectedSessionId]);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || null;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          selectedInstructor={selectedInstructor}
          onInstructorChange={setSelectedInstructor}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onAddFeedbackClick={() => setIsFormOpen(true)}
        />

        {/* KPI Summary Cards */}
        <KpiCards sessions={filteredSessions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Sessions List */}
          <div className="lg:col-span-2 space-y-6">
            <SessionList
              sessions={filteredSessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
            
            {/* Visual Charts */}
            <AnalyticsCharts sessions={filteredSessions} />
          </div>

          {/* Right Column: Session Deep-Dive Details Placeholder */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl shadow-sm h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-base font-bold mb-2">Session Deep Dive</h3>
              <p className="text-sm text-muted-foreground">Select a session to see detailed evaluations.</p>
              {selectedSession && (
                <div className="mt-4 p-4 border border-border rounded-xl w-full text-left bg-muted/20">
                  <p className="font-semibold text-sm line-clamp-1">{selectedSession.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Instructor: {selectedSession.instructor}</p>
                  <p className="text-xs text-muted-foreground">Course: {selectedSession.course}</p>
                  <p className="text-xs text-amber-500 font-bold mt-2">⭐ {selectedSession.ratings.overall.toFixed(1)} / 5.0</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Feedback Form Modal Placeholder */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-2">Add Evaluation Feedback</h3>
            <p className="text-sm text-muted-foreground mb-4">Feedback submission form is being prepared for release...</p>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
