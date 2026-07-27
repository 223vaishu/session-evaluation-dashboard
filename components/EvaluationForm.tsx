'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiStar } from 'react-icons/fi';
import { COURSES, INSTRUCTORS, Session } from '../lib/mockData';

interface EvaluationFormProps {
  sessions: Session[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluationFormInputs) => void;
}

export interface EvaluationFormInputs {
  sessionMode: 'existing' | 'new';
  sessionId?: string;
  newSessionTitle?: string;
  course: string;
  instructor: string;
  overall: number;
  content: number;
  delivery: number;
  materials: number;
  pacing: number;
  comment: string;
}

export default function EvaluationForm({
  sessions,
  isOpen,
  onClose,
  onSubmit,
}: EvaluationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EvaluationFormInputs>({
    defaultValues: {
      sessionMode: 'existing',
      overall: 5,
      content: 5,
      delivery: 5,
      materials: 5,
      pacing: 5,
      course: COURSES[0],
      instructor: INSTRUCTORS[0],
    },
  });

  const sessionMode = watch('sessionMode');
  const overall = watch('overall');
  const content = watch('content');
  const delivery = watch('delivery');
  const materials = watch('materials');
  const pacing = watch('pacing');

  if (!isOpen) return null;

  const handleFormSubmit = (data: EvaluationFormInputs) => {
    onSubmit(data);
    reset(); // reset form
  };

  const renderStarSelector = (
    name: 'overall' | 'content' | 'delivery' | 'materials' | 'pacing',
    currentValue: number
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(name, star)}
            className="focus:outline-none transition-transform active:scale-125"
          >
            <FiStar
              size={24}
              className={
                star <= currentValue
                  ? 'fill-amber-500 text-amber-500 hover:scale-115 transition-transform'
                  : 'text-slate-300 dark:text-slate-700 hover:scale-115 transition-transform'
              }
            />
          </button>
        ))}
        <span className="text-xs font-bold text-muted-foreground ml-2">
          {currentValue}.0
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Submit Session Evaluation</h2>
            <p className="text-xs text-muted-foreground">Provide feedback to improve session outcomes</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 focus:outline-none transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Form Option: Existing vs New Session */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evaluation Target</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 dark:bg-muted/30 rounded-xl">
              <button
                type="button"
                onClick={() => setValue('sessionMode', 'existing')}
                className={`py-2 text-xs font-semibold rounded-lg focus:outline-none transition-all ${
                  sessionMode === 'existing'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Existing Session
              </button>
              <button
                type="button"
                onClick={() => setValue('sessionMode', 'new')}
                className={`py-2 text-xs font-semibold rounded-lg focus:outline-none transition-all ${
                  sessionMode === 'new'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create New Session
              </button>
            </div>
          </div>

          {/* Conditional Session Selection */}
          {sessionMode === 'existing' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Select Session</label>
              <select
                {...register('sessionId', { required: sessionMode === 'existing' })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              >
                <option value="">-- Choose a session --</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.course}] {s.title} ({s.instructor})
                  </option>
                ))}
              </select>
              {errors.sessionId && (
                <span className="text-[10px] font-bold text-rose-500">Please choose a session</span>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-slide-down">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">New Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Next.js App Router"
                  {...register('newSessionTitle', { required: sessionMode === 'new' })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.newSessionTitle && (
                  <span className="text-[10px] font-bold text-rose-500">Please enter a session title</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Course Category</label>
                  <select
                    {...register('course', { required: sessionMode === 'new' })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                  >
                    {COURSES.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Instructor</label>
                  <select
                    {...register('instructor', { required: sessionMode === 'new' })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                  >
                    {INSTRUCTORS.map((instructor) => (
                      <option key={instructor} value={instructor}>
                        {instructor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Ratings Grid */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evaluation Criteria</label>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">Overall Experience Rating</span>
                {renderStarSelector('overall', overall)}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">Content Quality & Depth</span>
                {renderStarSelector('content', content)}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">Instructor Explanation & Delivery</span>
                {renderStarSelector('delivery', delivery)}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">Slides, Handouts & Materials</span>
                {renderStarSelector('materials', materials)}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">Pacing & Tempo suitability</span>
                {renderStarSelector('pacing', pacing)}
              </div>
            </div>
          </div>

          {/* Text Area for Qualitative Feedback */}
          <div className="space-y-1.5 pt-4 border-t border-border/60">
            <label className="text-xs font-bold text-foreground">Qualitative Comments</label>
            <textarea
              rows={3}
              placeholder="Provide comments on strengths, difficulties, or suggestions for improvement..."
              {...register('comment', { required: 'Please provide feedback comments' })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {errors.comment && (
              <span className="text-[10px] font-bold text-rose-500">{errors.comment.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted/80 focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet text-white text-sm font-semibold hover:opacity-90 active:scale-95 focus:outline-none transition-all shadow-md shadow-brand-cyan/20"
            >
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
