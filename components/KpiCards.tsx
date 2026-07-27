'use client';

import React from 'react';
import { FiStar, FiCalendar, FiMessageSquare, FiSmile } from 'react-icons/fi';
import { Session } from '../lib/mockData';

interface KpiCardsProps {
  sessions: Session[];
}

export default function KpiCards({ sessions }: KpiCardsProps) {
  // Calculations based on current filtered sessions
  const totalSessions = sessions.length;
  
  let totalFeedbacks = 0;
  let sumOverallRatings = 0;
  let positiveFeedbacks = 0;
  let totalAttendees = 0;

  sessions.forEach(session => {
    totalFeedbacks += session.feedbacks.length;
    sumOverallRatings += session.ratings.overall;
    totalAttendees += session.attendeesCount;
    session.feedbacks.forEach(fb => {
      if (fb.sentiment === 'positive') {
        positiveFeedbacks++;
      }
    });
  });

  const averageRating = totalSessions > 0 ? (sumOverallRatings / totalSessions).toFixed(2) : '0.00';
  const responseRate = totalAttendees > 0 ? ((totalFeedbacks / totalAttendees) * 100).toFixed(0) : '0';
  const positiveRatio = totalFeedbacks > 0 ? ((positiveFeedbacks / totalFeedbacks) * 100).toFixed(0) : '0';

  const kpis = [
    {
      title: 'Average Rating',
      value: `${averageRating} / 5.0`,
      icon: <FiStar className="text-amber-500 fill-amber-500/20" size={24} />,
      gradient: 'from-amber-500/10 to-amber-600/10',
      borderHover: 'hover:border-amber-500/30',
      subtext: 'Weighted session score',
      trend: '+0.15 this month',
      trendColor: 'text-emerald-500',
    },
    {
      title: 'Total Sessions',
      value: totalSessions.toString(),
      icon: <FiCalendar className="text-indigo-500" size={24} />,
      gradient: 'from-indigo-500/10 to-indigo-600/10',
      borderHover: 'hover:border-indigo-500/30',
      subtext: 'Evaluated courses & classes',
      trend: '+4 new this week',
      trendColor: 'text-indigo-500',
    },
    {
      title: 'Feedback Volume',
      value: totalFeedbacks.toString(),
      icon: <FiMessageSquare className="text-emerald-500" size={24} />,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      borderHover: 'hover:border-emerald-500/30',
      subtext: `Avg. response rate: ${responseRate}%`,
      trend: '82% participation',
      trendColor: 'text-emerald-500',
    },
    {
      title: 'Positive Sentiment',
      value: `${positiveRatio}%`,
      icon: <FiSmile className="text-sky-500" size={24} />,
      gradient: 'from-sky-500/10 to-sky-600/10',
      borderHover: 'hover:border-sky-500/30',
      subtext: 'Constructive comments',
      trend: '+2.4% vs last week',
      trendColor: 'text-sky-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={`glass-panel relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${kpi.borderHover} group`}
        >
          {/* Subtle background gradient glow on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">{kpi.title}</span>
            <div className="p-2.5 rounded-xl bg-muted/60 dark:bg-muted/30 group-hover:scale-110 transition-transform duration-300">
              {kpi.icon}
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {kpi.value}
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{kpi.subtext}</span>
              <span className={`font-semibold ${kpi.trendColor}`}>{kpi.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
