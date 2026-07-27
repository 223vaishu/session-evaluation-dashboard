import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses Catalog | EduEval Dashboard',
  description: 'Browse all 19 course topics, view syllabi, difficulty levels, and aggregated student ratings.',
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
