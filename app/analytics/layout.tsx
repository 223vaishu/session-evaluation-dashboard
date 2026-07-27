import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | EduEval Dashboard',
  description: 'Comprehensive analytics with radar charts, instructor leaderboards, and sentiment timelines.',
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
