'use client';

import React, { useState } from 'react';
import { INITIAL_SESSIONS, INSTRUCTORS } from '../../lib/mockData';
import { FiActivity } from 'react-icons/fi';

interface InstructorStats {
  name: string;
  avatarGradient: string;
  sessionsCount: number;
  totalFeedbacks: number;
  totalAttendees: number;
  ratings: {
    overall: number;
    content: number;
    delivery: number;
    materials: number;
    pacing: number;
  };
  topCourse: string;
}

export default function InstructorsPage() {
  const [sessions] = useState(INITIAL_SESSIONS);
  const [instructorA, setInstructorA] = useState<string>(INSTRUCTORS[0]);
  const [instructorB, setInstructorB] = useState<string>(INSTRUCTORS[1]);

  // Dynamic avatar gradient mapping
  const gradients: Record<string, string> = {
    'Dr. Emily Vance': 'from-rose-500 to-pink-600 shadow-rose-500/20',
    'Prof. Michael Chen': 'from-blue-500 to-indigo-600 shadow-blue-500/20',
    'Eng. Sarah Jenkins': 'from-purple-500 to-fuchsia-600 shadow-purple-500/20',
    'Dr. Robert Kincaid': 'from-amber-500 to-orange-600 shadow-amber-500/20',
    'Prof. Priya Nair': 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    'Alex Rivera': 'from-cyan-500 to-blue-500 shadow-cyan-500/20',
  };

  // Compute stats for each instructor
  const getInstructorStats = (name: string): InstructorStats => {
    const instructorSessions = sessions.filter((s) => s.instructor === name);
    const sessionsCount = instructorSessions.length;
    
    let totalFeedbacks = 0;
    let totalAttendees = 0;
    let sumOverall = 0;
    let sumContent = 0;
    let sumDelivery = 0;
    let sumMaterials = 0;
    let sumPacing = 0;

    const courseCounts: Record<string, number> = {};

    instructorSessions.forEach((session) => {
      totalFeedbacks += session.feedbacks.length;
      totalAttendees += session.attendeesCount;
      sumOverall += session.ratings.overall;
      sumContent += session.ratings.content;
      sumDelivery += session.ratings.delivery;
      sumMaterials += session.ratings.materials;
      sumPacing += session.ratings.pacing;

      courseCounts[session.course] = (courseCounts[session.course] || 0) + 1;
    });

    // Find top course
    let topCourse = 'N/A';
    let maxCount = 0;
    Object.entries(courseCounts).forEach(([course, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCourse = course;
      }
    });

    return {
      name,
      avatarGradient: gradients[name] || 'from-slate-500 to-slate-600',
      sessionsCount,
      totalFeedbacks,
      totalAttendees,
      ratings: {
        overall: sessionsCount > 0 ? Number((sumOverall / sessionsCount).toFixed(2)) : 0,
        content: sessionsCount > 0 ? Number((sumContent / sessionsCount).toFixed(2)) : 0,
        delivery: sessionsCount > 0 ? Number((sumDelivery / sessionsCount).toFixed(2)) : 0,
        materials: sessionsCount > 0 ? Number((sumMaterials / sessionsCount).toFixed(2)) : 0,
        pacing: sessionsCount > 0 ? Number((sumPacing / sessionsCount).toFixed(2)) : 0,
      },
      topCourse,
    };
  };

  const instructorsList = INSTRUCTORS.map(name => getInstructorStats(name));
  const statsA = getInstructorStats(instructorA);
  const statsB = getInstructorStats(instructorB);



  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 3) return parts[1].charAt(0) + parts[2].charAt(0);
    return parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : '');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Instructors Directory
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Explore profiles, evaluations, and compare instructor performance indices side-by-side
        </p>
      </div>

      {/* Grid of Instructors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructorsList.map((inst, idx) => (
          <div
            key={idx}
            className="glass-panel relative rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border/80 group overflow-hidden"
          >
            {/* Ambient Background decoration */}
            <div className={`absolute top-[-40px] right-[-40px] w-28 h-28 bg-gradient-to-br ${inst.avatarGradient} opacity-5 group-hover:scale-125 transition-transform duration-500 rounded-full blur-md`} />

            <div className="flex items-center gap-4 mb-5">
              {/* Initials Avatar */}
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${inst.avatarGradient} flex items-center justify-center text-white text-base font-black shadow-md`}>
                {getInitials(inst.name)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {inst.name}
                </h3>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-bold tracking-wider uppercase mt-1 inline-block">
                  Top course: {inst.topCourse}
                </span>
              </div>
            </div>

            {/* Teaching Stats */}
            <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/40 text-center mb-4">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Classes</span>
                <p className="text-base font-extrabold text-foreground mt-0.5">{inst.sessionsCount}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Feedback</span>
                <p className="text-base font-extrabold text-foreground mt-0.5">{inst.totalFeedbacks}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
                <p className="text-base font-extrabold text-foreground mt-0.5">{inst.ratings.overall.toFixed(1)}/5</p>
              </div>
            </div>

            {/* Granular Ratings Breakdown Bars */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Lecture Delivery</span>
                <span>{inst.ratings.delivery.toFixed(1)}</span>
              </div>
              <div className="w-full bg-muted/60 dark:bg-muted/30 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(inst.ratings.delivery / 5) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Pacing suitability</span>
                <span>{inst.ratings.pacing.toFixed(1)}</span>
              </div>
              <div className="w-full bg-muted/60 dark:bg-muted/30 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(inst.ratings.pacing / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison Playground */}
      <div className="glass-panel rounded-2xl p-6 shadow-md border border-border/80">
        <div className="flex items-center gap-2 mb-6">
          <FiActivity className="text-primary animate-pulse" size={20} />
          <h2 className="text-lg font-bold text-foreground">Interactive Comparison Hub</h2>
        </div>

        {/* Dropdowns selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Instructor A</label>
            <select
              value={instructorA}
              onChange={(e) => setInstructorA(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer font-bold"
            >
              {INSTRUCTORS.map((name) => (
                <option key={name} value={name} disabled={name === instructorB}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Instructor B</label>
            <select
              value={instructorB}
              onChange={(e) => setInstructorB(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer font-bold"
            >
              {INSTRUCTORS.map((name) => (
                <option key={name} value={name} disabled={name === instructorA}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics comparison cards grid */}
        <div className="space-y-4">
          {[
            { key: 'overall', label: 'Overall Experience' },
            { key: 'content', label: 'Content Depth' },
            { key: 'delivery', label: 'Lecture Delivery' },
            { key: 'materials', label: 'Course Materials' },
            { key: 'pacing', label: 'Lesson Pacing' },
          ].map((metric) => {
            const valA = statsA.ratings[metric.key as keyof typeof statsA.ratings];
            const valB = statsB.ratings[metric.key as keyof typeof statsB.ratings];
            const diff = valA - valB;
            
            return (
              <div key={metric.key} className="p-4 rounded-xl bg-muted/20 dark:bg-muted/10 border border-border/40 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                {/* Instructor A Metric */}
                <div className="flex items-center gap-3 md:justify-end">
                  <span className="text-xs font-bold text-muted-foreground uppercase md:hidden">A: </span>
                  <div className="w-full md:w-32 bg-muted/60 dark:bg-muted/30 h-3 rounded-full overflow-hidden flex md:justify-end">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${(valA / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-extrabold text-foreground w-8 text-right">{valA.toFixed(1)}</span>
                </div>

                {/* Metric Label */}
                <div className="text-center font-bold text-xs text-foreground uppercase tracking-wide py-1 px-3 rounded-lg bg-background border border-border">
                  {metric.label}
                </div>

                {/* Instructor B Metric */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-foreground w-8">{valB.toFixed(1)}</span>
                  <div className="w-full md:w-32 bg-muted/60 dark:bg-muted/30 h-3 rounded-full overflow-hidden">
                    <div className="bg-fuchsia-500 h-full rounded-full transition-all duration-500" style={{ width: `${(valB / 5) * 100}%` }} />
                  </div>
                  {diff !== 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      diff > 0 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {diff > 0 ? `A +${diff.toFixed(1)}` : `B +${Math.abs(diff).toFixed(1)}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
