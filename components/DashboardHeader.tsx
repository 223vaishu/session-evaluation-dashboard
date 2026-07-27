'use client';

import React from 'react';
import { FiSearch, FiPlus, FiBookOpen } from 'react-icons/fi';
import { COURSES, INSTRUCTORS } from '../lib/mockData';

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  selectedInstructor: string;
  onInstructorChange: (instructor: string) => void;
  onAddFeedbackClick: () => void;
}

export default function DashboardHeader({
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedInstructor,
  onInstructorChange,
  onAddFeedbackClick,
}: DashboardHeaderProps) {
  return (
    <header className="glass-panel sticky top-0 z-40 w-full rounded-2xl p-4 shadow-sm md:p-6 mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30 animate-pulse">
            <FiBookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Session Evaluation Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Monitor and evaluate instructor performance and student feedback
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search session or instructor..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
          >
            <option value="all">All Courses</option>
            {COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Instructor Filter */}
          <select
            value={selectedInstructor}
            onChange={(e) => onInstructorChange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
          >
            <option value="all">All Instructors</option>
            {INSTRUCTORS.map((instructor) => (
              <option key={instructor} value={instructor}>
                {instructor}
              </option>
            ))}
          </select>



          {/* Add Evaluation Button */}
          <button
            onClick={onAddFeedbackClick}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-md shadow-primary/20"
          >
            <FiPlus size={16} />
            <span>Submit Feedback</span>
          </button>
        </div>
      </div>
    </header>
  );
}
