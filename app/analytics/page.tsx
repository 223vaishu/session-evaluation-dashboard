'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_SESSIONS, Session, INSTRUCTORS } from '../../lib/mockData';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { FiPieChart, FiActivity, FiSmile } from 'react-icons/fi';
import { format } from 'date-fns';

interface LeaderboardTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      fullName: string;
    };
  }>;
}

interface SentimentTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      sessionTitle: string;
    };
  }>;
}

const LeaderboardTooltip = ({ active, payload }: LeaderboardTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-xl shadow-lg border border-border/80 text-xs">
        <p className="font-bold text-foreground mb-1">{payload[0].payload.fullName}</p>
        <p className="font-semibold text-primary">
          Average Score: <span className="font-bold text-sm text-foreground">{payload[0].value} / 5.0</span>
        </p>
      </div>
    );
  }
  return null;
};

const SentimentTooltip = ({ active, payload }: SentimentTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-xl shadow-lg border border-border/80 text-xs">
        <p className="font-bold text-foreground mb-1">{payload[0].payload.date}</p>
        <p className="font-semibold text-emerald-500">
          Positive Feedback: <span className="font-bold text-sm text-foreground">{payload[0].value}%</span>
        </p>
        <p className="text-muted-foreground mt-1 max-w-[200px] truncate">
          {payload[0].payload.sessionTitle}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [sessions] = useState<Session[]>(INITIAL_SESSIONS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // --- Data 1: Instructor Leaderboard ---
  const instructorScores = INSTRUCTORS.map((instructor) => {
    const instSessions = sessions.filter((s) => s.instructor === instructor);
    const count = instSessions.length;
    let sumOverall = 0;
    instSessions.forEach((s) => {
      sumOverall += s.ratings.overall;
    });
    return {
      name: instructor.split(' ').pop() || instructor,
      score: count > 0 ? Number((sumOverall / count).toFixed(2)) : 0,
      fullName: instructor,
    };
  }).sort((a, b) => b.score - a.score);

  // --- Data 2: Overall Radar Metrics ---
  let sumContent = 0, sumDelivery = 0, sumMaterials = 0, sumPacing = 0, sumOverall = 0;
  const count = sessions.length;
  sessions.forEach((s) => {
    sumContent += s.ratings.content;
    sumDelivery += s.ratings.delivery;
    sumMaterials += s.ratings.materials;
    sumPacing += s.ratings.pacing;
    sumOverall += s.ratings.overall;
  });

  const radarData = [
    { subject: 'Overall', score: count > 0 ? Number((sumOverall / count).toFixed(2)) : 0 },
    { subject: 'Content', score: count > 0 ? Number((sumContent / count).toFixed(2)) : 0 },
    { subject: 'Delivery', score: count > 0 ? Number((sumDelivery / count).toFixed(2)) : 0 },
    { subject: 'Materials', score: count > 0 ? Number((sumMaterials / count).toFixed(2)) : 0 },
    { subject: 'Pacing', score: count > 0 ? Number((sumPacing / count).toFixed(2)) : 0 },
  ];

  // --- Data 3: Sentiment Index Timeline ---
  // Group feedback comments by date
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sentimentTimeline = sortedSessions.map((session) => {
    const total = session.feedbacks.length;
    const positive = session.feedbacks.filter(f => f.sentiment === 'positive').length;
    return {
      date: format(new Date(session.date), 'MMM dd'),
      ratio: total > 0 ? Math.round((positive / total) * 100) : 0,
      sessionTitle: session.title,
    };
  });

  const gridColor = 'rgba(148, 163, 184, 0.08)';
  const labelColor = '#94a3b8';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Comprehensive Analytics
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Deep-dive analysis of teaching scores, sentiments, and leaderboards across all sessions
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart: Overall Criteria Breakdown */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col h-80">
          <div className="mb-4 flex items-center gap-2">
            <FiPieChart className="text-primary" size={16} />
            <div>
              <h3 className="text-sm font-bold text-foreground">Criteria Radar Balance</h3>
              <p className="text-[10px] text-muted-foreground">Comparative balance between Content, Delivery, Pacing, and Materials</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="95%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
                <PolarAngleAxis dataKey="subject" stroke={labelColor} fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke={labelColor} fontSize={9} />
                <Radar
                  name="Metrics"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Instructor Comparison */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col h-80">
          <div className="mb-4 flex items-center gap-2">
            <FiActivity className="text-violet-500 animate-pulse" size={16} />
            <div>
              <h3 className="text-sm font-bold text-foreground">Instructor Leaderboard</h3>
              <p className="text-[10px] text-muted-foreground">Overall average scores across all teaching instructors</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={instructorScores}
                layout="vertical"
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" domain={[0, 5]} stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<LeaderboardTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.03)' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {instructorScores.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : '#10b981'}
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Sentiment Index Timeline */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col h-80 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <FiSmile className="text-emerald-500" size={16} />
            <div>
              <h3 className="text-sm font-bold text-foreground">Positive Sentiment Timeline</h3>
              <p className="text-[10px] text-muted-foreground">Percentage of positive feedback remarks over chronological session schedules</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date" stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} dy={8} />
                <YAxis domain={[0, 100]} stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} dx={-8} />
                <Tooltip content={<SentimentTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ratio"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRatio)"
                  activeDot={{ r: 5, strokeWidth: 1.5, stroke: '#10b981', fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
