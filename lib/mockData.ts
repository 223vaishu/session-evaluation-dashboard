export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
}

export interface SessionRatings {
  overall: number;
  content: number;
  delivery: number;
  materials: number;
  pacing: number;
}

export interface Session {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date: string; // ISO String
  duration: number; // in minutes
  attendeesCount: number;
  ratings: SessionRatings;
  feedbacks: Feedback[];
}

export const COURSES = [
  'WebDev', 'Java', 'Devops', 'Data science', 'Android', 'Python', 'AI+ML', 
  'VLSI', 'Robotices', 'UI/Ux', 'cyber', 'AWS', 'GenAI', 'DSA', 'IOT', 
  'Graphic', 'embedded', 'digital', 'pcb'
] as const;

export type CourseType = typeof COURSES[number];

export const INSTRUCTORS = [
  'Dr. Emily Vance',
  'Prof. Michael Chen',
  'Eng. Sarah Jenkins',
  'Dr. Robert Kincaid',
  'Prof. Priya Nair',
  'Alex Rivera'
];

// Helper to determine sentiment based on keywords
export function classifySentiment(comment: string): 'positive' | 'neutral' | 'negative' {
  const text = comment.toLowerCase();
  const positiveWords = [
    'good', 'great', 'excellent', 'perfect', 'awesome', 'amazing', 
    'clear', 'helpful', 'love', 'best', 'informative', 'learned a lot',
    'fantastic', 'enjoyed', 'easy', 'smooth'
  ];
  const negativeWords = [
    'bad', 'slow', 'fast', 'hard', 'difficult', 'confusing', 'poor', 
    'waste', 'improve', 'boring', 'lost', 'tough', 'heavy', 'rushed', 
    'struggled', 'frustrating'
  ];

  let posCount = 0;
  let negCount = 0;

  positiveWords.forEach(word => {
    if (text.includes(word)) posCount++;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) negCount++;
  });

  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

// Generate default mock data
export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sess-1',
    title: 'Modern CSS Layouts & Flexbox/Grid Deep Dive',
    course: 'WebDev',
    instructor: 'Alex Rivera',
    date: '2026-07-20T10:00:00Z',
    duration: 90,
    attendeesCount: 45,
    ratings: {
      overall: 4.7,
      content: 4.8,
      delivery: 4.6,
      materials: 4.5,
      pacing: 4.6
    },
    feedbacks: [
      {
        id: 'fb-1-1',
        rating: 5,
        comment: 'Excellent session! The hands-on coding exercises made Grid layout so easy to understand.',
        sentiment: 'positive',
        date: '2026-07-20T11:45:00Z'
      },
      {
        id: 'fb-1-2',
        rating: 4,
        comment: 'Really good structure. Pacing was nice, though it got a bit rushed at the end with subgrid.',
        sentiment: 'positive',
        date: '2026-07-20T12:00:00Z'
      },
      {
        id: 'fb-1-3',
        rating: 5,
        comment: 'Alex is an amazing instructor. Clear explanations and great slide materials.',
        sentiment: 'positive',
        date: '2026-07-20T12:15:00Z'
      },
      {
        id: 'fb-1-4',
        rating: 3,
        comment: 'The explanations were clear but the exercises were quite difficult to finish on time.',
        sentiment: 'neutral',
        date: '2026-07-20T12:30:00Z'
      },
      {
        id: 'fb-1-5',
        rating: 2,
        comment: 'Felt a bit fast. Hard to follow along with the live coding on screen.',
        sentiment: 'negative',
        date: '2026-07-20T13:00:00Z'
      }
    ]
  },
  {
    id: 'sess-2',
    title: 'Multithreading & Concurrency in Java',
    course: 'Java',
    instructor: 'Dr. Robert Kincaid',
    date: '2026-07-21T14:00:00Z',
    duration: 120,
    attendeesCount: 30,
    ratings: {
      overall: 4.2,
      content: 4.5,
      delivery: 4.0,
      materials: 4.6,
      pacing: 3.8
    },
    feedbacks: [
      {
        id: 'fb-2-1',
        rating: 4,
        comment: 'Very informative session on volatile variables and executor services.',
        sentiment: 'positive',
        date: '2026-07-21T16:10:00Z'
      },
      {
        id: 'fb-2-2',
        rating: 3,
        comment: 'The subject is highly complex and pacing was too fast. Struggled to keep up with synchronization concepts.',
        sentiment: 'negative',
        date: '2026-07-21T16:25:00Z'
      },
      {
        id: 'fb-2-3',
        rating: 5,
        comment: 'Dr. Kincaid is a master of this topic. The diagrams in slides were extremely helpful!',
        sentiment: 'positive',
        date: '2026-07-21T16:30:00Z'
      },
      {
        id: 'fb-2-4',
        rating: 4,
        comment: 'Solid examples. Concurrency is always tough, but this made it clear.',
        sentiment: 'positive',
        date: '2026-07-21T17:00:00Z'
      },
      {
        id: 'fb-2-5',
        rating: 2,
        comment: 'Too dry and fast. I got lost in the first 30 minutes. More visual diagrams would improve this.',
        sentiment: 'negative',
        date: '2026-07-21T17:15:00Z'
      }
    ]
  },
  {
    id: 'sess-3',
    title: 'Dockerizing Microservices for CI/CD Pipelines',
    course: 'Devops',
    instructor: 'Eng. Sarah Jenkins',
    date: '2026-07-22T09:00:00Z',
    duration: 150,
    attendeesCount: 55,
    ratings: {
      overall: 4.8,
      content: 4.9,
      delivery: 4.8,
      materials: 4.7,
      pacing: 4.5
    },
    feedbacks: [
      {
        id: 'fb-3-1',
        rating: 5,
        comment: 'Absolute best workshop ever! Clear step-by-step setup of Docker Compose and multi-stage builds.',
        sentiment: 'positive',
        date: '2026-07-22T12:00:00Z'
      },
      {
        id: 'fb-3-2',
        rating: 5,
        comment: 'Sarah is an excellent guide. Very structured, no errors during live demo. Loved it.',
        sentiment: 'positive',
        date: '2026-07-22T12:05:00Z'
      },
      {
        id: 'fb-3-3',
        rating: 4,
        comment: 'Great content. I learned a lot about caching docker layers. Pacing was appropriate.',
        sentiment: 'positive',
        date: '2026-07-22T12:15:00Z'
      },
      {
        id: 'fb-3-4',
        rating: 5,
        comment: 'Excellent, highly practical templates provided. This will save me weeks of work.',
        sentiment: 'positive',
        date: '2026-07-22T12:20:00Z'
      }
    ]
  },
  {
    id: 'sess-4',
    title: 'Supervised Learning & Classification Algorithms',
    course: 'Data science',
    instructor: 'Prof. Priya Nair',
    date: '2026-07-23T11:00:00Z',
    duration: 90,
    attendeesCount: 40,
    ratings: {
      overall: 4.5,
      content: 4.6,
      delivery: 4.5,
      materials: 4.3,
      pacing: 4.4
    },
    feedbacks: [
      {
        id: 'fb-4-1',
        rating: 5,
        comment: 'Priya explained Random Forests and SVMs beautifully. The math was made simple.',
        sentiment: 'positive',
        date: '2026-07-23T12:35:00Z'
      },
      {
        id: 'fb-4-2',
        rating: 4,
        comment: 'Good lecture. The interactive notebook was very helpful to visualize decision boundaries.',
        sentiment: 'positive',
        date: '2026-07-23T12:45:00Z'
      },
      {
        id: 'fb-4-3',
        rating: 3,
        comment: 'Decent, but we spent too much time on linear algebra. The pacing was a bit sluggish in the middle.',
        sentiment: 'neutral',
        date: '2026-07-23T12:55:00Z'
      },
      {
        id: 'fb-4-4',
        rating: 5,
        comment: 'Fantastic explanation of bias-variance tradeoff. Truly enlightened!',
        sentiment: 'positive',
        date: '2026-07-23T13:00:00Z'
      },
      {
        id: 'fb-4-5',
        rating: 2,
        comment: 'Slides had typos in the equations, which was confusing. Hope they fix it.',
        sentiment: 'negative',
        date: '2026-07-23T13:10:00Z'
      }
    ]
  },
  {
    id: 'sess-5',
    title: 'Introduction to Generative Adversarial Networks (GANs)',
    course: 'GenAI',
    instructor: 'Dr. Emily Vance',
    date: '2026-07-24T15:00:00Z',
    duration: 120,
    attendeesCount: 65,
    ratings: {
      overall: 4.6,
      content: 4.7,
      delivery: 4.6,
      materials: 4.8,
      pacing: 4.1
    },
    feedbacks: [
      {
        id: 'fb-5-1',
        rating: 5,
        comment: 'Mind-blowing session! GenAI is changing everything, and this was the perfect math-plus-code intro.',
        sentiment: 'positive',
        date: '2026-07-24T17:10:00Z'
      },
      {
        id: 'fb-5-2',
        rating: 4,
        comment: 'Very cool demo on training a GAN to generate handwritten digits. Pacing was slightly fast.',
        sentiment: 'positive',
        date: '2026-07-24T17:15:00Z'
      },
      {
        id: 'fb-5-3',
        rating: 5,
        comment: 'Emily Vance is excellent. Her enthusiasm is contagious. Highly recommended!',
        sentiment: 'positive',
        date: '2026-07-24T17:30:00Z'
      },
      {
        id: 'fb-5-4',
        rating: 3,
        comment: 'The conceptual explanation of generator vs discriminator was excellent, but the PyTorch code was too complex to follow quickly.',
        sentiment: 'neutral',
        date: '2026-07-24T17:40:00Z'
      }
    ]
  },
  {
    id: 'sess-6',
    title: 'UI/UX Design Patterns & Prototyping in Figma',
    course: 'UI/Ux',
    instructor: 'Alex Rivera',
    date: '2026-07-25T10:00:00Z',
    duration: 90,
    attendeesCount: 50,
    ratings: {
      overall: 4.9,
      content: 4.8,
      delivery: 4.9,
      materials: 5.0,
      pacing: 4.8
    },
    feedbacks: [
      {
        id: 'fb-6-1',
        rating: 5,
        comment: 'Incredible! Alex walked through Figma auto-layout and components. My prototypes look ten times better now.',
        sentiment: 'positive',
        date: '2026-07-25T11:40:00Z'
      },
      {
        id: 'fb-6-2',
        rating: 5,
        comment: 'Perfect pacing and high-quality files shared. Extremely useful exercises.',
        sentiment: 'positive',
        date: '2026-07-25T11:45:00Z'
      },
      {
        id: 'fb-6-3',
        rating: 5,
        comment: 'Loved the feedback on our student designs. More sessions like this please!',
        sentiment: 'positive',
        date: '2026-07-25T11:55:00Z'
      },
      {
        id: 'fb-6-4',
        rating: 4,
        comment: 'Very good dashboard design examples. Alex has a great eye for detail.',
        sentiment: 'positive',
        date: '2026-07-25T12:00:00Z'
      }
    ]
  },
  {
    id: 'sess-7',
    title: 'Embedded C Programming & Microcontrollers',
    course: 'embedded',
    instructor: 'Dr. Robert Kincaid',
    date: '2026-07-26T13:00:00Z',
    duration: 120,
    attendeesCount: 22,
    ratings: {
      overall: 4.0,
      content: 4.3,
      delivery: 3.8,
      materials: 4.2,
      pacing: 3.9
    },
    feedbacks: [
      {
        id: 'fb-7-1',
        rating: 4,
        comment: 'Detailed coverage of interrupt service routines and register configurations.',
        sentiment: 'positive',
        date: '2026-07-26T15:10:00Z'
      },
      {
        id: 'fb-7-2',
        rating: 4,
        comment: 'Good hardware demo. Dr. Kincaid is very thorough, though the session felt dry at points.',
        sentiment: 'neutral',
        date: '2026-07-26T15:20:00Z'
      },
      {
        id: 'fb-7-3',
        rating: 2,
        comment: 'The coding examples were hard to follow because of poor layout on the slides. The font was tiny.',
        sentiment: 'negative',
        date: '2026-07-26T15:35:00Z'
      },
      {
        id: 'fb-7-4',
        rating: 4,
        comment: 'Decent introduction to bare-metal programming. Very useful for my assignments.',
        sentiment: 'positive',
        date: '2026-07-26T15:45:00Z'
      }
    ]
  },
  {
    id: 'sess-8',
    title: 'Graph Algorithms & Dynamic Programming Mastery',
    course: 'DSA',
    instructor: 'Prof. Priya Nair',
    date: '2026-07-27T08:30:00Z',
    duration: 180,
    attendeesCount: 38,
    ratings: {
      overall: 4.7,
      content: 4.8,
      delivery: 4.7,
      materials: 4.6,
      pacing: 4.4
    },
    feedbacks: [
      {
        id: 'fb-8-1',
        rating: 5,
        comment: 'Priya Nair is a genius. DFS/BFS and Dijkstra were explained with beautiful step-by-step trace tables.',
        sentiment: 'positive',
        date: '2026-07-27T11:45:00Z'
      },
      {
        id: 'fb-8-2',
        rating: 5,
        comment: 'Excellent dynamic programming templates. The knapsack problem finally clicked for me!',
        sentiment: 'positive',
        date: '2026-07-27T11:50:00Z'
      },
      {
        id: 'fb-8-3',
        rating: 4,
        comment: 'Three hours is quite long, but the short breaks helped. Very dense and clear content.',
        sentiment: 'positive',
        date: '2026-07-27T12:00:00Z'
      },
      {
        id: 'fb-8-4',
        rating: 3,
        comment: 'I struggled with the DP transitions. Pacing got too fast at the end because of time constraints.',
        sentiment: 'neutral',
        date: '2026-07-27T12:10:00Z'
      }
    ]
  }
];
