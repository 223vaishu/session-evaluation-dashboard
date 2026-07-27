'use client';

import React, { useState } from 'react';
import { COURSES, INITIAL_SESSIONS } from '../../lib/mockData';
import { FiBook, FiSearch, FiStar, FiAward, FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface CourseDetails {
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: string[];
  description: string;
}

// Map each of the 19 courses to difficulty levels & key syllabus tags
const COURSE_CATALOG: Record<string, Omit<CourseDetails, 'name'>> = {
  WebDev: {
    difficulty: 'Beginner',
    description: 'Master frontend and backend web development using HTML5, CSS3, Javascript, React, and Node.js.',
    syllabus: ['Modern CSS Grid & Flexbox layouts', 'State management & React Hooks', 'REST API design with Express & Node']
  },
  Java: {
    difficulty: 'Intermediate',
    description: 'Object-oriented programming, concurrency foundations, collections framework, and JVM optimizations.',
    syllabus: ['Multithreading & Executor Services', 'Garbage collection & memory tuning', 'Stream API & lambda expressions']
  },
  Devops: {
    difficulty: 'Advanced',
    description: 'Infrastructure automation, continuous integration, Docker containerization, and Kubernetes deployments.',
    syllabus: ['Docker Compose & Multi-stage builds', 'CI/CD pipeline triggers with GitHub Actions', 'Kubernetes cluster state configurations']
  },
  'Data science': {
    difficulty: 'Intermediate',
    description: 'Statistical inference, machine learning models, regression analytics, and Python notebook workflows.',
    syllabus: ['Supervised Classification Algorithms (SVM, Random Forests)', 'Data cleaning & NumPy/Pandas scripting', 'Matplotlib & Seaborn visual exploration']
  },
  Android: {
    difficulty: 'Intermediate',
    description: 'Native mobile app development using Kotlin, Android Jetpack SDK, layouts, and SQLite databases.',
    syllabus: ['Jetpack Compose UI structures', 'Retrofit API networking & JSON parsing', 'Room database local persistence design']
  },
  Python: {
    difficulty: 'Beginner',
    description: 'Syntax fundamentals, standard scripting patterns, data structures, and file parsing workflows.',
    syllabus: ['Object-Oriented programming in Python', 'List comprehensions & functional decorators', 'File reading & Exception handling structures']
  },
  'AI+ML': {
    difficulty: 'Advanced',
    description: 'Mathematical foundations of Neural Networks, optimization theory, backpropagation, and Deep Learning.',
    syllabus: ['Convolutional Neural Networks (CNNs)', 'Optimization algorithms (Adam, SGD)', 'TensorFlow & PyTorch model compilation']
  },
  VLSI: {
    difficulty: 'Advanced',
    description: 'Integrated circuit design, Verilog coding, gate layouts, and digital hardware synthesis frameworks.',
    syllabus: ['Verilog HDL behavioral modeling', 'FPGA prototyping & registers routing', 'CMOS logic gates & layout constraints']
  },
  Robotices: {
    difficulty: 'Advanced',
    description: 'Kinematics, micro-controller wiring, sensors integration, and robotic control algorithms.',
    syllabus: ['Forward & Inverse Kinematics math', 'Arduino & Raspberry Pi serial interfaces', 'PWM motor speed controllers tuning']
  },
  'UI/Ux': {
    difficulty: 'Beginner',
    description: 'Wireframing interfaces, visual guidelines, figma prototyping, user research, and wireframe testing.',
    syllabus: ['Figma Auto-layout & component sheets', 'Color theory & visual layout hierarchy', 'Interactive user feedback testing']
  },
  cyber: {
    difficulty: 'Intermediate',
    description: 'Penetration testing, encryption mechanics, vulnerability auditing, and network security protocols.',
    syllabus: ['Symmetric & Asymmetric encryption theory', 'Cross-site scripting (XSS) audit scripts', 'Wireshark packet sniffing & logs audits']
  },
  AWS: {
    difficulty: 'Intermediate',
    description: 'Cloud infrastructure routing, virtual private clouds, storage architectures, and serverless hosting.',
    syllabus: ['EC2 virtual computing deployments', 'S3 bucket asset storage configs', 'AWS Lambda serverless endpoints execution']
  },
  GenAI: {
    difficulty: 'Advanced',
    description: 'Generative AI models, prompt tuning, LLMs fine-tuning, GANs, and retrieval-augmented generation.',
    syllabus: ['Generative Adversarial Networks (GANs)', 'Fine-tuning transformer weights', 'RAG database vector search queries']
  },
  DSA: {
    difficulty: 'Advanced',
    description: 'Graph search algorithms, dynamic programming transitions, tree balancing, and computational runtime analysis.',
    syllabus: ['Graph traversals (Dijkstra, DFS, BFS)', 'Dynamic Programming knapsacks solutions', 'Time and space complexity proofs']
  },
  IOT: {
    difficulty: 'Intermediate',
    description: 'Embedded network devices, sensor data publication, micro-controllers, and cloud databases bridges.',
    syllabus: ['MQTT protocol topics publishing', 'ESP32 Wi-Fi hardware configuration', 'Dynamic sensor stream dashboards mapping']
  },
  Graphic: {
    difficulty: 'Beginner',
    description: 'Digital art design, vector illustration, vector paths, layers, branding systems, and typography formatting.',
    syllabus: ['Adobe Illustrator vector paths', 'Photoshop compositing & masking', 'Logo creation & corporate identity templates']
  },
  embedded: {
    difficulty: 'Intermediate',
    description: 'Bare-metal C development, interrupt vectors, serial communication bus protocols, and hardware registers.',
    syllabus: ['Interrupt Service Routine configurations', 'SPI/I2C peripheral clock configurations', 'Register-level peripheral manipulation in C']
  },
  digital: {
    difficulty: 'Beginner',
    description: 'Boolean algebra logic simplifications, Karnaugh maps, binary arithmetic, and multiplexer wiring diagrams.',
    syllabus: ['Karnaugh map logic minimizations', 'Logic gates (AND, OR, XOR) wiring layouts', 'Decoders and flip-flops state machine models']
  },
  pcb: {
    difficulty: 'Intermediate',
    description: 'Schematic routing configurations, trace design layouts, footprint generation, and multi-layer boards.',
    syllabus: ['Footprint assignment & routing tracks', 'Ground plane noise isolation routing', 'Gerber export packages production specs']
  }
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Compute overall average ratings for each course from the session dataset
  const getCourseStats = (courseName: string) => {
    const courseSessions = INITIAL_SESSIONS.filter(s => s.course === courseName);
    const count = courseSessions.length;
    let sumOverall = 0;
    let totalReviews = 0;

    courseSessions.forEach(s => {
      sumOverall += s.ratings.overall;
      totalReviews += s.feedbacks.length;
    });

    return {
      averageRating: count > 0 ? (sumOverall / count).toFixed(1) : 'N/A',
      totalReviews,
      sessionsCount: count
    };
  };

  const getDifficultyColor = (diff: CourseDetails['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
  };

  // Filter courses based on query
  const filteredCourses = COURSES.filter(course =>
    course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (courseName: string) => {
    if (expandedCourse === courseName) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseName);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Courses Syllabus Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse the comprehensive catalog of 19 courses, evaluate syllabus, and view student scores
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const stats = getCourseStats(course);
          const info = COURSE_CATALOG[course] || {
            difficulty: 'Intermediate',
            description: 'Course syllabus outline is under preparation.',
            syllabus: ['Foundation metrics', 'Practical applications', 'Independent design work']
          };
          const isExpanded = expandedCourse === course;

          return (
            <div
              key={course}
              onClick={() => toggleExpand(course)}
              className={`glass-panel cursor-pointer rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-border/80 flex flex-col group overflow-hidden ${
                isExpanded ? 'ring-2 ring-primary border-transparent' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <FiBook className="text-primary group-hover:scale-110 transition-transform" size={18} />
                  <h3 className="font-extrabold text-sm text-foreground">{course}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getDifficultyColor(info.difficulty)}`}>
                  {info.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                {info.description}
              </p>

              {/* Rating Stats Summary */}
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FiStar className="text-amber-500 fill-amber-500/10" size={13} />
                  Rating: <span className="text-foreground font-bold">{stats.averageRating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <FiMessageSquare size={13} />
                  Reviews: <span className="text-foreground font-bold">{stats.totalReviews}</span>
                </span>
                <span className="ml-auto text-primary flex items-center gap-0.5 group-hover:translate-y-0.5 transition-transform">
                  {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </span>
              </div>

              {/* Expandable Syllabus Detail Panel */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border/40 space-y-3 animate-slide-down">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <FiAward size={12} className="text-violet-500" /> Key Syllabus Modules
                  </span>
                  <ul className="space-y-2">
                    {info.syllabus.map((topic, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 text-foreground font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
