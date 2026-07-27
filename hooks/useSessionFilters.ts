/**
 * Custom Hook: useSessionFilters
 * 
 * Encapsulates all dashboard filtering logic (search, course, instructor)
 * into a reusable hook. This follows the "custom hooks for logic, components
 * for UI" separation principle.
 * 
 * Why a custom hook instead of keeping state in page.tsx?
 * - Testable in isolation (can unit test filtering without rendering UI)
 * - Reusable if we add a second filtered view (e.g., an admin panel)
 * - Keeps the page component focused on layout composition, not data logic
 */

import { useState, useMemo } from 'react';
import type { Session, FilterState } from '../types';
import { FILTER_DEFAULTS } from '../lib/constants';

export function useSessionFilters(sessions: Session[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: FILTER_DEFAULTS.searchQuery,
    selectedCourse: FILTER_DEFAULTS.selectedCourse,
    selectedInstructor: FILTER_DEFAULTS.selectedInstructor,
  });

  // Derive filtered list from source sessions + active filters
  // useMemo ensures we only recompute when sessions or filters actually change
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        session.instructor.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesCourse =
        filters.selectedCourse === 'all' || session.course === filters.selectedCourse;
      const matchesInstructor =
        filters.selectedInstructor === 'all' || session.instructor === filters.selectedInstructor;
      return matchesSearch && matchesCourse && matchesInstructor;
    });
  }, [sessions, filters]);

  // Individual setters for ergonomic usage in components
  const setSearchQuery = (searchQuery: string) =>
    setFilters((prev) => ({ ...prev, searchQuery }));

  const setSelectedCourse = (selectedCourse: string) =>
    setFilters((prev) => ({ ...prev, selectedCourse }));

  const setSelectedInstructor = (selectedInstructor: string) =>
    setFilters((prev) => ({ ...prev, selectedInstructor }));

  const resetFilters = () => setFilters({
    searchQuery: FILTER_DEFAULTS.searchQuery,
    selectedCourse: FILTER_DEFAULTS.selectedCourse,
    selectedInstructor: FILTER_DEFAULTS.selectedInstructor,
  });

  return {
    filters,
    filteredSessions,
    setSearchQuery,
    setSelectedCourse,
    setSelectedInstructor,
    resetFilters,
  };
}
