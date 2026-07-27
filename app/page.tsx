'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_SESSIONS, Session, Feedback, classifySentiment } from '../lib/mockData';
import DashboardHeader from '../components/DashboardHeader';
import KpiCards from '../components/KpiCards';
import SessionList from '../components/SessionList';
import AnalyticsCharts from '../components/AnalyticsCharts';
import SessionDetailPanel from '../components/SessionDetailPanel';
import EvaluationForm, { EvaluationFormInputs } from '../components/EvaluationForm';

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize theme on mount to avoid hydration mismatches
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

  // Filter sessions based on search & tags
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || session.course === selectedCourse;
    const matchesInstructor = selectedInstructor === 'all' || session.instructor === selectedInstructor;
    return matchesSearch && matchesCourse && matchesInstructor;
  });

  // Automatically select the first visible session if the active selection gets filtered out
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

  // Handler for new evaluation submissions
  const handleAddEvaluation = (data: EvaluationFormInputs) => {
    const sentiment = classifySentiment(data.comment);
    const newFeedback: Feedback = {
      id: `fb-added-${Date.now()}`,
      rating: data.overall,
      comment: data.comment,
      sentiment,
      date: new Date().toISOString(),
    };

    if (data.sessionMode === 'existing' && data.sessionId) {
      // Add feedback to existing session & recompute weighted criteria rating averages
      setSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.id !== data.sessionId) return session;

          const updatedFeedbacks = [newFeedback, ...session.feedbacks];
          const count = session.feedbacks.length;

          const updatedRatings = {
            overall: Number(((session.ratings.overall * count + data.overall) / (count + 1)).toFixed(2)),
            content: Number(((session.ratings.content * count + data.content) / (count + 1)).toFixed(2)),
            delivery: Number(((session.ratings.delivery * count + data.delivery) / (count + 1)).toFixed(2)),
            materials: Number(((session.ratings.materials * count + data.materials) / (count + 1)).toFixed(2)),
            pacing: Number(((session.ratings.pacing * count + data.pacing) / (count + 1)).toFixed(2)),
          };

          return {
            ...session,
            ratings: updatedRatings,
            feedbacks: updatedFeedbacks,
            attendeesCount: session.attendeesCount + 1,
          };
        })
      );
    } else {
      // Create a brand new session with this evaluation as its first feedback
      const newSession: Session = {
        id: `sess-added-${Date.now()}`,
        title: data.newSessionTitle || 'New Session',
        course: data.course,
        instructor: data.instructor,
        date: new Date().toISOString(),
        duration: 90,
        attendeesCount: 1,
        ratings: {
          overall: data.overall,
          content: data.content,
          delivery: data.delivery,
          materials: data.materials,
          pacing: data.pacing,
        },
        feedbacks: [newFeedback],
      };
      setSessions((prevSessions) => [newSession, ...prevSessions]);
      setSelectedSessionId(newSession.id); // Automatically view the new session
    }

    setIsFormOpen(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header containing title, search, filters, theme-switch, and CTAs */}
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

        {/* Dynamic Key Performance Indicator (KPI) Widgets */}
        <KpiCards sessions={filteredSessions} />

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (Lists & Analytics) */}
          <div className="lg:col-span-2 space-y-6">
            {/* List Table of Evaluated Courses */}
            <SessionList
              sessions={filteredSessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
            
            {/* Analytics Trends and Comparisons */}
            <AnalyticsCharts sessions={filteredSessions} />
          </div>

          {/* Sidebar Column (Selected Session Deep-Dive Review) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SessionDetailPanel session={selectedSession} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide-over Feedback Form Modal Container */}
      <EvaluationForm
        sessions={sessions}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddEvaluation}
      />
    </main>
  );
}
