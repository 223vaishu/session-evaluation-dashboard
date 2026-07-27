# Session Evaluation Dashboard

A comprehensive, production-grade dashboard for managing and analyzing teaching session evaluations. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Recharts**.

## Deployment - https://session-evaluation-dashboard.vercel.app/

---

## Features

- **Multi-criteria evaluation** — Rate sessions across 5 dimensions: Content, Delivery, Materials, Pacing, and Overall quality
- **Real-time KPI metrics** — Dynamic cards showing average ratings, feedback volume, participation rate, and sentiment index
- **Interactive session browser** — Filterable table with search, course tags, and instructor selectors
- **Detail panel** — Granular progress bars, sentiment distributions, and qualitative comment feeds
- **Analytics visualizations** — Performance trends (area chart), course comparisons (bar chart), and criteria breakdowns (horizontal bars)
- **Evaluation form** — Submit new feedback with `react-hook-form` validation for both existing and new sessions
- **Dark/Light mode** — Theme toggle with localStorage persistence and smooth CSS transitions
- **4 dedicated pages** — Dashboard, Instructors comparison, Courses catalog, and Analytics deep-dive
- **Responsive design** — Mobile-first cards that expand into desktop table layouts
- **Error boundaries** — Graceful error recovery, loading skeletons, and custom 404 page

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server/client component model, file-based routing, built-in optimization |
| Language | TypeScript | Type safety across components, props, and data interfaces |
| Styling | Tailwind CSS v4 | Utility-first CSS with custom design tokens for theming |
| Charts | Recharts | Composable React chart components with good SSR compatibility |
| Forms | react-hook-form | Performant form validation without re-renders on every keystroke |
| Icons | react-icons (Feather) | Lightweight, tree-shakeable icon library |
| Dates | date-fns | Modular date formatting (no moment.js bloat) |

---

## Project Architecture

```
├── app/                    # Next.js App Router pages & layouts
│   ├── layout.tsx          # Root layout with ThemeWrapper
│   ├── page.tsx            # Main dashboard (filters, KPIs, lists, charts)
│   ├── error.tsx           # Global error boundary
│   ├── loading.tsx         # Loading skeleton UI
│   ├── not-found.tsx       # Custom 404 page
│   ├── analytics/          # Analytics deep-dive page
│   ├── courses/            # Course catalog page
│   └── instructors/        # Instructor comparison page
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Global navigation with theme toggle
│   ├── ThemeWrapper.tsx    # Client-side theme provider
│   ├── DashboardHeader.tsx # Search + filter controls
│   ├── KpiCards.tsx        # 4x KPI summary cards
│   ├── SessionList.tsx     # Filterable session table/cards
│   ├── SessionDetailPanel  # Deep-dive sidebar panel
│   ├── AnalyticsCharts.tsx # Recharts visualizations
│   └── EvaluationForm.tsx  # Feedback submission form
├── hooks/                  # Custom React hooks
│   └── useSessionFilters   # Encapsulated filter state & logic
├── lib/                    # Utilities & data layer
│   ├── mockData.ts         # Mock evaluation dataset (19 courses, 6 instructors)
│   └── constants.ts        # Centralized magic values & config
└── types/                  # TypeScript type definitions
    └── index.ts            # All domain interfaces (Session, Feedback, etc.)
```

---

## State Management Decisions

We use **React `useState` + custom hooks** rather than Context API or external state managers. Here's why:

1. **All state is page-local** — Filter state, session selection, and form state are only needed on the dashboard page. No cross-route sharing is required, so Context or Redux would add unnecessary complexity.
2. **Custom hook extraction** — `useSessionFilters` encapsulates filter logic, making it testable in isolation and reusable if we later add an admin view.
3. **Derived state via `useMemo`** — Filtered sessions are computed from source data + filters, avoiding redundant state that could get out of sync.
4. **Form state via react-hook-form** — The evaluation form uses RHF's internal state management, which is more performant than controlled inputs for complex forms.

If the app grew to need cross-page state (e.g., authenticated user context, global notification queue), we would introduce React Context at the layout level.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/223vaishu/session-evaluation-dashboard.git
cd session-evaluation-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Git Workflow

This project was developed using **feature branches** to demonstrate clean version control:

| Branch | Purpose |
|---|---|
| `feature/mock-data-and-styling` | Data models, mock dataset, Tailwind theme configuration |
| `feature/dashboard-core-ui` | Header, filters, KPI cards, session list |
| `feature/analytics-charts` | Recharts integrations (trend, bar, criteria) |
| `feature/details-and-feedback-form` | Detail panel, evaluation form with react-hook-form |
| `feature/design-polish-and-subpages` | Navigation, theme wrapper, instructor/course/analytics pages |
| `feature/color-theme-overhaul` | Dual-color brand palette (Cyan + Violet) |
| `feature/engineering-polish` | Error handling, types, hooks, documentation, architecture |

---

## Scalability Considerations

- **Type-safe data layer** — All interfaces are centralized in `types/index.ts`. Swapping mock data for a real API only requires changing `lib/mockData.ts` without touching any component.
- **Constants extraction** — Course names, instructor names, and thresholds live in `lib/constants.ts` — no magic strings in components.
- **Custom hooks** — Business logic is separated from UI rendering, making it testable and reusable.
- **Error boundaries** — Runtime crashes are caught and displayed gracefully instead of white-screening.
- **Component isolation** — Each component receives data via props, has no side effects, and can be composed independently.

---

## License

This project was built as an academic assignment for session evaluation dashboard development.
