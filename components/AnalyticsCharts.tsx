'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Session } from '../lib/mockData';
import { format } from 'date-fns';

interface AnalyticsChartsProps {
  sessions: Session[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      title?: string;
    };
  }>;
  label?: string;
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

// Custom tooltips for premium feel declared outside render to prevent resets
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-xl shadow-lg border border-border/80 text-xs">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <p className="font-semibold text-primary">
          Average Rating: <span className="font-bold text-sm text-foreground">{payload[0].value} / 5.0</span>
        </p>
        {payload[0].payload.title && (
          <p className="text-muted-foreground mt-1 max-w-[200px] truncate">
            {payload[0].payload.title}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }: BarTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-xl shadow-lg border border-border/80 text-xs">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <p className="font-semibold text-primary">
          Score: <span className="font-bold text-sm text-foreground">{payload[0].value} / 5.0</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts({ sessions }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px] items-center justify-center">
        <div className="glass-panel p-6 rounded-2xl h-80 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-sm">Loading charts...</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl h-80 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-sm">Loading charts...</p>
        </div>
      </div>
    );
  }

  // --- Chart 1: Rating Trend Over Time ---
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const trendData = sortedSessions.map((session) => ({
    date: format(new Date(session.date), 'MMM dd'),
    rating: Number(session.ratings.overall.toFixed(1)),
    title: session.title,
  }));

  // --- Chart 2: Average Rating by Course ---
  const courseRatings: Record<string, { totalRating: number; count: number }> = {};
  sessions.forEach((session) => {
    const course = session.course;
    if (!courseRatings[course]) {
      courseRatings[course] = { totalRating: 0, count: 0 };
    }
    courseRatings[course].totalRating += session.ratings.overall;
    courseRatings[course].count += 1;
  });

  const courseData = Object.entries(courseRatings)
    .map(([course, data]) => ({
      name: course,
      rating: Number((data.totalRating / data.count).toFixed(2)),
    }))
    .sort((a, b) => b.rating - a.rating); // Sort high to low

  // --- Chart 3: Evaluation Criteria Breakdown ---
  const criteriaSums = { content: 0, delivery: 0, materials: 0, pacing: 0, overall: 0 };
  const sessionCount = sessions.length;

  if (sessionCount > 0) {
    sessions.forEach((session) => {
      criteriaSums.content += session.ratings.content;
      criteriaSums.delivery += session.ratings.delivery;
      criteriaSums.materials += session.ratings.materials;
      criteriaSums.pacing += session.ratings.pacing;
      criteriaSums.overall += session.ratings.overall;
    });
  }

  const criteriaData = sessionCount > 0 ? [
    { name: 'Overall', score: Number((criteriaSums.overall / sessionCount).toFixed(2)), color: '#6366f1' },
    { name: 'Content', score: Number((criteriaSums.content / sessionCount).toFixed(2)), color: '#10b981' },
    { name: 'Delivery', score: Number((criteriaSums.delivery / sessionCount).toFixed(2)), color: '#8b5cf6' },
    { name: 'Materials', score: Number((criteriaSums.materials / sessionCount).toFixed(2)), color: '#f59e0b' },
    { name: 'Pacing', score: Number((criteriaSums.pacing / sessionCount).toFixed(2)), color: '#3b82f6' },
  ] : [];

  // Theme-aware custom color utilities for SVG rendering
  const gridColor = 'rgba(148, 163, 184, 0.08)';
  const labelColor = '#94a3b8'; // text-slate-400

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Chart 1: Performance Trend */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col h-80">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Performance Trend</h3>
          <p className="text-[11px] text-muted-foreground">Evaluation score progression over time</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  stroke={labelColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={8}
                />
                <YAxis 
                  domain={[3.0, 5.0]} 
                  stroke={labelColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRating)" 
                  activeDot={{ r: 5, strokeWidth: 1.5, stroke: '#6366f1', fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No trend data available.
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Course Performance */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col h-80">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Ratings by Course</h3>
          <p className="text-[11px] text-muted-foreground">Average feedback scores grouped by topic</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          {courseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  stroke={labelColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={8}
                />
                <YAxis 
                  domain={[0, 5]} 
                  stroke={labelColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-8}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
                <Bar dataKey="rating" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {courseData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : '#10b981'} 
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No course breakdown data.
            </div>
          )}
        </div>
      </div>

      {/* Chart 3: Evaluation Criteria Aspect breakdown */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col h-80 md:col-span-2">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Evaluation Criteria Summary</h3>
          <p className="text-[11px] text-muted-foreground">Comparison of Content, Delivery, Materials, and Pacing</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          {criteriaData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={criteriaData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis 
                  type="number" 
                  domain={[0, 5]} 
                  stroke={labelColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={4}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke={labelColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-4}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {criteriaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No criteria summaries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
