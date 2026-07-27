/**
 * Application Constants
 * 
 * Centralizes magic values (course names, instructor names, config) so they
 * aren't scattered as string literals across components. When the data source
 * changes to a real API, only this file needs updating.
 */

/** All available course topics offered by the institute */
export const COURSES = [
  'WebDev', 'Java', 'Devops', 'Data science', 'Android', 'Python', 'AI+ML',
  'VLSI', 'Robotices', 'UI/Ux', 'cyber', 'AWS', 'GenAI', 'DSA', 'IOT',
  'Graphic', 'embedded', 'digital', 'pcb'
] as const;

export type CourseType = typeof COURSES[number];

/** Teaching staff roster */
export const INSTRUCTORS = [
  'Dr. Emily Vance',
  'Prof. Michael Chen',
  'Eng. Sarah Jenkins',
  'Dr. Robert Kincaid',
  'Prof. Priya Nair',
  'Alex Rivera'
] as const;

export type InstructorType = typeof INSTRUCTORS[number];

/** Rating scale boundaries for badge color assignment */
export const RATING_THRESHOLDS = {
  excellent: 4.5,
  good: 3.8,
  average: 3.0,
} as const;

/** Navigation routes used by the global navbar */
export const NAV_ROUTES = [
  { name: 'Dashboard', href: '/' },
  { name: 'Instructors', href: '/instructors' },
  { name: 'Courses', href: '/courses' },
  { name: 'Analytics', href: '/analytics' },
] as const;

/** Default filter values */
export const FILTER_DEFAULTS = {
  searchQuery: '',
  selectedCourse: 'all',
  selectedInstructor: 'all',
} as const;
