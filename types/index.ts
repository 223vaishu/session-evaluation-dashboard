/**
 * Centralized Type Definitions
 * 
 * All domain-level TypeScript interfaces and type aliases are defined here
 * to avoid duplication across components. Components import types from this
 * single source of truth rather than from data files or inline definitions.
 * 
 * Architecture decision: We keep types separate from data/logic so that
 * if we swap the mock data layer for a real API, the type contracts remain stable.
 */

// ─── Feedback & Sentiment ───────────────────────────────────────────

/** Sentiment classification for qualitative feedback comments */
export type Sentiment = 'positive' | 'neutral' | 'negative';

/** Individual feedback entry attached to a session evaluation */
export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  sentiment: Sentiment;
  date: string; // ISO 8601 string
}

// ─── Session Ratings ────────────────────────────────────────────────

/** Granular rating breakdown across 5 evaluation criteria */
export interface SessionRatings {
  overall: number;
  content: number;
  delivery: number;
  materials: number;
  pacing: number;
}

// ─── Session ────────────────────────────────────────────────────────

/** A single evaluated teaching session with metadata, ratings, and feedback */
export interface Session {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date: string;       // ISO 8601 string
  duration: number;   // in minutes
  attendeesCount: number;
  ratings: SessionRatings;
  feedbacks: Feedback[];
}

// ─── Evaluation Form ────────────────────────────────────────────────

/** Shape of the evaluation form submission payload */
export interface EvaluationFormInputs {
  sessionMode: 'existing' | 'new';
  sessionId?: string;
  newSessionTitle?: string;
  course: string;
  instructor: string;
  overall: number;
  content: number;
  delivery: number;
  materials: number;
  pacing: number;
  comment: string;
}

// ─── Filter State ───────────────────────────────────────────────────

/** Dashboard filter state used across header and session list */
export interface FilterState {
  searchQuery: string;
  selectedCourse: string;
  selectedInstructor: string;
}

// ─── Theme ──────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';
