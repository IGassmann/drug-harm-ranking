'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import {
  studyInfo,
  studyKeyToSlug,
  studySlugToKey,
  studySlugs,
  type ChartStudyKey,
  type StudySlug,
} from '@/data/chartData';

interface ChartLayoutProps {
  children: ReactNode;
}

export default function ChartLayout({ children }: ChartLayoutProps) {
  const pathname = usePathname();
  const isComparison = pathname === '/comparison';

  // Determine which study is currently active based on pathname
  const currentSlug = pathname.slice(1) as StudySlug; // Remove leading '/'
  const isStudyRoute = studySlugs.includes(currentSlug);
  const currentStudyKey = isStudyRoute ? studySlugToKey[currentSlug] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-slate-50 mb-2 tracking-tight">
            Drug Harm Rankings
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Multi-Criteria Decision Analysis (MCDA) scores from peer-reviewed expert panel studies. Scores represent
            weighted harm assessments across criteria including mortality, dependence, physical damage, and mental
            impairment.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 mb-6 flex-wrap">
          {/* Study Selection */}
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(studyInfo) as [ChartStudyKey, typeof studyInfo[ChartStudyKey]][]).map(([key, info]) => {
              const slug = studyKeyToSlug[key];
              const isActive = currentStudyKey === key || (pathname === '/' && key === 'nutt2010');

              return (
                <Link
                  key={key}
                  href={`/${slug}`}
                  className="px-4 py-2 rounded-lg font-mono text-xs font-medium transition-all"
                  style={{
                    border: isActive ? `2px solid ${info.color}` : '2px solid transparent',
                    background: isActive ? `${info.color}20` : 'rgba(30, 41, 59, 0.6)',
                    color: isActive ? info.color : '#94a3b8',
                  }}
                >
                  {info.name}
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-slate-700" />

          {/* Comparison Link */}
          <Link
            href="/comparison"
            className={`px-5 py-2.5 rounded-lg font-mono text-sm font-semibold transition-all flex items-center gap-2 ${
              isComparison
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare All
          </Link>
        </div>

        {/* Content */}
        {children}

        {/* Methodology Note */}
        <div className="mt-6 px-5 py-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
          <p className="text-indigo-300 text-xs leading-relaxed">
            <strong>Methodology:</strong> Scores use Multi-Criteria Decision Analysis with swing weighting. Harm to
            users criteria include: mortality (drug-specific and drug-related), physical damage (direct and related),
            dependence, mental impairment, loss of tangibles, and loss of relationships. New Zealand 2023 also includes
            non-physical/spiritual harm criteria. Scale: 0 (no harm) to 100 (maximum possible harm).
          </p>
        </div>

        {/* Sources */}
        <div className="mt-4 text-slate-500 text-xs leading-relaxed">
          <p>
            Sources: Nutt et al. (2010) The Lancet; Bonomo et al. (2019) J Psychopharmacology; Crossin et al. (2023) J
            Psychopharmacology; van Amsterdam et al. (2015) J Psychopharmacology
          </p>
        </div>
      </div>
    </div>
  );
}
