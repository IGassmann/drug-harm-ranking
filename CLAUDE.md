# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server at localhost:3000
pnpm build      # Production build
pnpm lint       # Run ESLint
```

## Architecture

This is a Next.js 16 app (App Router) that visualizes drug harm rankings from peer-reviewed MCDA (Multi-Criteria Decision Analysis) studies using Recharts.

### Data Layer (`src/data/`)

- **chartData.ts** - High-level study metadata, routing config (slug↔key mappings), and aggregate harm scores
- **criteriaData.ts** - Detailed criteria definitions and per-drug scores for each study:
  - UK 2010 and Australia 2019 share 16 criteria (9 user, 7 others)
  - NZ 2023 has modified criteria (combined mental impairment, added spiritual/intergenerational harm)
  - Europe 2015 only has aggregate user/others totals (no individual criteria)
  - Helper functions: `calculateUserHarm()`, `calculateOthersHarm()`, `calculateTotalHarm()`

### Views (`src/components/`)

- **ChartLayout.tsx** - Shared layout with navigation tabs and methodology info
- **SingleStudyView.tsx** - Stacked bar chart for one study with criteria toggles
- **ComparisonView.tsx** - Grouped bar chart comparing all 4 studies with user/others breakdown
- **CriteriaToggles.tsx** - UI for enabling/disabling harm criteria

### Routing (`src/app/`)

- `/` → UK 2010 study (default)
- `/[study]` → Dynamic route for studies: `uk-2010`, `australia-2019`, `new-zealand-2023`, `europe-2015`
- `/comparison` → Cross-study comparison view

### URL State

Uses `nuqs` for URL-synced state:
- `?criteria=` - Comma-separated list of enabled criteria (single study view)
- `?users=` / `?others=` - Boolean toggles for harm categories (comparison view)

## Key Patterns

- Study identification uses two formats: slugs for URLs (`uk-2010`) and keys for data access (`nutt2010`). Use `studySlugToKey`/`studyKeyToSlug` to convert.
- All charts use Recharts with `ResponsiveContainer` and vertical `BarChart` layout
- Criteria colors are defined in `criteriaData.ts` metadata; study colors in `chartData.ts`
