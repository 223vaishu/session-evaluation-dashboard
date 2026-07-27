import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructors | EduEval Dashboard',
  description: 'View instructor profiles, compare teaching scores, and explore session performance across faculty.',
};

export default function InstructorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
