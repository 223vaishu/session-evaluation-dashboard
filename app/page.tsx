'use client';

/**
 * Dashboard Home Page
 * 
 * This is the primary entry point for the Session Evaluation Dashboard.
 * It composes several feature components into a responsive layout:
 * 
 * ┌─────────────────────────────────────┐
 * │ DashboardHeader (search + filters)  │
 * ├─────────────────────────────────────┤
 * │ KpiCards (4x metric summary)        │
 * ├──────────────────────┬──────────────┤
 * │ SessionList          │ DetailPanel  │
 * │ AnalyticsCharts      │ (sticky)     │
 * └──────────────────────┴──────────────┘
 * 
 * State management approach:
 * - Filter state is encapsulated in useSessionFilters (custom hook)
 * - Session selection uses local useState (single page, no need for Context)
 * - Form state is managed by react-hook-form inside EvaluationForm
 * - We chose useState over Context/Redux because all state is local to this
 *   page — no other route needs access to the filter or selection state
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_SESSIONS, classifySentiment } from '../lib/mockData';
import { useSessionFilters } from '../hooks/useSessionFilters';
import DashboardHeader from '../components/DashboardHeader';
import KpiCards from '../components/KpiCards';
import SessionList from '../components/SessionList';
import AnalyticsCharts from '../components/AnalyticsCharts';
import SessionDetailPanel from '../components/SessionDetailPanel';
import EvaluationForm from '../components/EvaluationForm';
import type { Session, Feedback, EvaluationFormInputs } from '../types';

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter logic extracted into custom hook for testability and reuse
  const {
    filters,
    filteredSessions,
    setSearchQuery,
    setSelectedCourse,
    setSelectedInstructor,
    resetFilters,
  } = useSessionFilters(sessions);

  // Auto-select first visible session when filters change
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (filteredSessions.length > 0) {
      if (!selectedSessionId || !filteredSessions.some(s => s.id === selectedSessionId)) {
        const firstId = filteredSessions[0].id;
        timer = setTimeout(() => {
          setSelectedSessionId(firstId);
        }, 0);
      }
    } else {
      timer = setTimeout(() => {
        setSelectedSessionId(null);
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [filteredSessions, selectedSessionId]);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || null;

  /**
   * Handles new evaluation submissions from the EvaluationForm.
   * 
   * Two modes:
   * 1. "existing" — adds feedback to an existing session and recalculates
   *    weighted rating averages using running mean formula
   * 2. "new" — creates a brand new session with this as its first evaluation
   */
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
      // Recalculate weighted averages using running mean: new_avg = (old_avg * n + new_val) / (n + 1)
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
      // Create brand new session with this evaluation as its first feedback
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
      setSelectedSessionId(newSession.id);
    }

    setIsFormOpen(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header: search bar, course/instructor filters, and "Add Feedback" CTA */}
        <DashboardHeader
          searchQuery={filters.searchQuery}
          onSearchChange={setSearchQuery}
          selectedCourse={filters.selectedCourse}
          onCourseChange={setSelectedCourse}
          selectedInstructor={filters.selectedInstructor}
          onInstructorChange={setSelectedInstructor}
          onAddFeedbackClick={() => setIsFormOpen(true)}
        />

        {/* KPI summary cards — dynamically computed from filtered dataset */}
        <KpiCards sessions={filteredSessions} />

        {/* Empty state when no sessions match the active filters */}
        {filteredSessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-3 mt-6">
            <p className="text-4xl">🔍</p>
            <h3 className="text-base font-bold text-foreground">No sessions match your filters</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try adjusting your search query, course selection, or instructor filter to see results.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/5 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          /* Main content grid: session list + charts on left, detail panel on right */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SessionList
                sessions={filteredSessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={setSelectedSessionId}
              />
              <AnalyticsCharts sessions={filteredSessions} />
            </div>

            {/* Sticky sidebar — stays visible while scrolling through session list */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SessionDetailPanel session={selectedSession} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal overlay: evaluation submission form */}
      <EvaluationForm
        sessions={sessions}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddEvaluation}
      />
    </main>
  );
}
