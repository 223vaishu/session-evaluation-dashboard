'use client';

import React, { useState } from 'react';
import { FiMessageSquare, FiUser, FiCalendar, FiClock, FiStar, FiSearch, FiSmile, FiMeh, FiFrown } from 'react-icons/fi';
import { format } from 'date-fns';
import { Session, Feedback } from '../lib/mockData';

interface SessionDetailPanelProps {
  session: Session | null;
  onClose?: () => void;
}

export default function SessionDetailPanel({ session, onClose }: SessionDetailPanelProps) {
  const [commentSearch, setCommentSearch] = useState('');

  if (!session) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center shadow-sm text-muted-foreground min-h-[400px]">
        <FiMessageSquare size={36} className="mb-3 opacity-30" />
        <h3 className="font-bold text-foreground text-base">No Session Selected</h3>
        <p className="text-xs max-w-xs mt-1">Select a session from the list to view attendee feedback and criteria scores.</p>
      </div>
    );
  }

  // Calculate sentiment stats
  const totalComments = session.feedbacks.length;
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  session.feedbacks.forEach((fb) => {
    if (fb.sentiment === 'positive') positiveCount++;
    else if (fb.sentiment === 'negative') negativeCount++;
    else neutralCount++;
  });

  const positivePercent = totalComments > 0 ? Math.round((positiveCount / totalComments) * 100) : 0;
  const neutralPercent = totalComments > 0 ? Math.round((neutralCount / totalComments) * 100) : 0;
  const negativePercent = totalComments > 0 ? Math.round((negativeCount / totalComments) * 100) : 0;

  // Filter feedbacks by search
  const filteredFeedbacks = session.feedbacks.filter((fb) =>
    fb.comment.toLowerCase().includes(commentSearch.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={13}
            className={star <= rating ? 'fill-current text-amber-500' : 'text-slate-300 dark:text-slate-700'}
          />
        ))}
      </div>
    );
  };

  const getSentimentIcon = (sentiment: Feedback['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <FiSmile className="text-emerald-500" size={14} />;
      case 'negative':
        return <FiFrown className="text-rose-500" size={14} />;
      default:
        return <FiMeh className="text-amber-500" size={14} />;
    }
  };

  const getSentimentBg = (sentiment: Feedback['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10';
      case 'negative':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/10';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10';
    }
  };

  const criteriaList = [
    { label: 'Overall Quality', score: session.ratings.overall, color: 'bg-brand-cyan' },
    { label: 'Content Depth', score: session.ratings.content, color: 'bg-brand-violet' },
    { label: 'Delivery & Explanation', score: session.ratings.delivery, color: 'bg-brand-cyan' },
    { label: 'Slides & Materials', score: session.ratings.materials, color: 'bg-brand-violet' },
    { label: 'Pacing & Tempo', score: session.ratings.pacing, color: 'bg-brand-cyan' },
  ];

  return (
    <div className="glass-panel rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-5 border-b border-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
              {session.course}
            </span>
            <h2 className="text-base font-bold text-foreground mt-2 line-clamp-2" title={session.title}>
              {session.title}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-sm p-1"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-2">
            <FiUser size={13} className="shrink-0" />
            <span className="text-foreground">{session.instructor}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <FiCalendar size={13} />
              {format(new Date(session.date), 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={13} />
              {session.duration} minutes
            </span>
          </div>
        </div>
      </div>

      {/* Panel Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Section 1: Ratings Progress */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Criteria Ratings</h3>
          <div className="space-y-3.5">
            {criteriaList.map((criteria, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{criteria.label}</span>
                  <span className="text-foreground font-bold">{criteria.score.toFixed(1)} / 5.0</span>
                </div>
                <div className="w-full bg-muted/60 dark:bg-muted/30 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${criteria.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(criteria.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Sentiment Indicators */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Feedback Sentiment</h3>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/3 border border-emerald-500/10 rounded-xl">
              <FiSmile className="mx-auto text-emerald-500 mb-1" size={16} />
              <p className="text-base font-bold text-emerald-500">{positivePercent}%</p>
              <p className="text-[9px] text-muted-foreground uppercase font-medium">Positive</p>
            </div>
            <div className="p-3 bg-amber-500/5 dark:bg-amber-500/3 border border-amber-500/10 rounded-xl">
              <FiMeh className="mx-auto text-amber-500 mb-1" size={16} />
              <p className="text-base font-bold text-amber-500">{neutralPercent}%</p>
              <p className="text-[9px] text-muted-foreground uppercase font-medium">Neutral</p>
            </div>
            <div className="p-3 bg-rose-500/5 dark:bg-rose-500/3 border border-rose-500/10 rounded-xl">
              <FiFrown className="mx-auto text-rose-500 mb-1" size={16} />
              <p className="text-base font-bold text-rose-500">{negativePercent}%</p>
              <p className="text-[9px] text-muted-foreground uppercase font-medium">Critical</p>
            </div>
          </div>
        </div>

        {/* Section 3: User Comments Feed */}
        <div className="space-y-4 pt-4 border-t border-border/60 flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attendee Comments</h3>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold text-muted-foreground">
              {filteredFeedbacks.length} Comment{filteredFeedbacks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Comment Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
              <FiSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search comments..."
              value={commentSearch}
              onChange={(e) => setCommentSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/20 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    {renderStars(fb.rating)}
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {format(new Date(fb.date), 'MMM dd')}
                    </span>
                  </div>
                  <p className="text-foreground/90 font-normal leading-relaxed break-words">
                    {fb.comment}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border ${getSentimentBg(fb.sentiment)} uppercase tracking-wider`}>
                      {getSentimentIcon(fb.sentiment)}
                      <span>{fb.sentiment}</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6 text-xs font-medium">
                No comments match your search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
