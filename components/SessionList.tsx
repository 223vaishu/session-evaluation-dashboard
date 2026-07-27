'use client';

import React from 'react';
import { format } from 'date-fns';
import { FiMessageSquare, FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { Session } from '../lib/mockData';

interface SessionListProps {
  sessions: Session[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
}

// Map courses to colors for dynamic visual badges
const COURSE_COLORS: Record<string, string> = {
  WebDev: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Java: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Devops: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Data science': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Android: 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20',
  Python: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  'AI+ML': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  VLSI: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  Robotices: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  'UI/Ux': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  cyber: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  AWS: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  GenAI: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
  DSA: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  IOT: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  Graphic: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  embedded: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  digital: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  pcb: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
};

export default function SessionList({
  sessions,
  selectedSessionId,
  onSelectSession,
}: SessionListProps) {
  
  const getCourseBadgeColor = (course: string) => {
    return COURSE_COLORS[course] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (rating >= 3.8) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  if (sessions.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center shadow-sm">
        <p className="text-muted-foreground text-sm">No evaluation sessions found matching the filters.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-2xl shadow-sm">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Evaluated Sessions</h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
          {sessions.length} Session{sessions.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs font-semibold text-muted-foreground bg-muted/20 uppercase tracking-wider">
              <th className="py-4 px-6">Session & Course</th>
              <th className="py-4 px-6">Instructor</th>
              <th className="py-4 px-6">Date & Duration</th>
              <th className="py-4 px-6 text-center">Feedback</th>
              <th className="py-4 px-6 text-center">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sessions.map((session) => {
              const isSelected = session.id === selectedSessionId;
              const formattedDate = format(new Date(session.date), 'MMM dd, yyyy');
              
              return (
                <tr
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group cursor-pointer transition-colors hover:bg-muted/40 ${
                    isSelected ? 'bg-primary/5 hover:bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Title & Course Tag */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {session.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCourseBadgeColor(session.course)} uppercase tracking-wider`}>
                          {session.course}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <FiClock size={12} /> {session.duration}m
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="h-7 w-7 rounded-full bg-muted/80 flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {session.instructor.split(' ').pop()?.charAt(0) || 'I'}
                      </div>
                      <span className="font-medium">{session.instructor}</span>
                    </div>
                  </td>

                  {/* Date & Duration */}
                  <td className="py-4 px-6 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar size={13} />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Feedback Count */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      <FiMessageSquare size={13} />
                      <span>{session.feedbacks.length}</span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-bold border ${getRatingColor(session.ratings.overall)}`}>
                      {session.ratings.overall.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-border/60">
        {sessions.map((session) => {
          const isSelected = session.id === selectedSessionId;
          const formattedDate = format(new Date(session.date), 'MMM dd, yyyy');
          
          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`p-4 cursor-pointer transition-colors active:bg-muted/80 ${
                isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="font-semibold text-sm text-foreground line-clamp-2">
                  {session.title}
                </span>
                <span className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-xs font-bold border ${getRatingColor(session.ratings.overall)}`}>
                  {session.ratings.overall.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCourseBadgeColor(session.course)} uppercase tracking-wider`}>
                  {session.course}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <FiClock size={12} /> {session.duration}m
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <FiUser size={13} />
                  <span>{session.instructor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={13} />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <FiMessageSquare size={13} />
                    {session.feedbacks.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
