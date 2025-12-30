'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CriteriaToggles from './CriteriaToggles';
import {
  type CriteriaKey,
  type StudyId,
  getCriteriaDataForStudy,
  calculateTotalHarm,
  calculateUserHarm,
  calculateOthersHarm,
} from '@/data/criteriaData';

// Data extracted from key MCDA studies - Harm to Users scores (normalized to 0-100 scale)
const harmData = [
  { drug: 'Heroin', nutt2010: 34, australia2019: 36, nz2023: 38, europe2015: 33 },
  { drug: 'Crack Cocaine', nutt2010: 37, australia2019: 34, nz2023: 35, europe2015: 35 },
  { drug: 'Methamphetamine', nutt2010: 32, australia2019: 33, nz2023: 36, europe2015: 30 },
  { drug: 'Alcohol', nutt2010: 26, australia2019: 29, nz2023: 27, europe2015: 25 },
  { drug: 'Cocaine', nutt2010: 27, australia2019: 25, nz2023: 24, europe2015: 26 },
  { drug: 'Tobacco', nutt2010: 26, australia2019: 24, nz2023: 22, europe2015: 23 },
  { drug: 'Amphetamine', nutt2010: 23, australia2019: 21, nz2023: 22, europe2015: 20 },
  { drug: 'Cannabis', nutt2010: 20, australia2019: 18, nz2023: 16, europe2015: 17 },
  { drug: 'GHB', nutt2010: 18, australia2019: 16, nz2023: 15, europe2015: 16 },
  { drug: 'Benzodiazepines', nutt2010: 15, australia2019: 17, nz2023: 18, europe2015: 14 },
  { drug: 'Ketamine', nutt2010: 15, australia2019: 14, nz2023: 13, europe2015: 13 },
  { drug: 'Methadone', nutt2010: 14, australia2019: 15, nz2023: 14, europe2015: 13 },
  { drug: 'Mephedrone', nutt2010: 13, australia2019: 12, nz2023: 11, europe2015: 12 },
  { drug: 'Anabolic Steroids', nutt2010: 10, australia2019: 9, nz2023: 8, europe2015: 9 },
  { drug: 'MDMA (Ecstasy)', nutt2010: 9, australia2019: 8, nz2023: 9, europe2015: 8 },
  { drug: 'Khat', nutt2010: 9, australia2019: 7, nz2023: 6, europe2015: 8 },
  { drug: 'LSD', nutt2010: 7, australia2019: 6, nz2023: 5, europe2015: 6 },
  { drug: 'Buprenorphine', nutt2010: 8, australia2019: 9, nz2023: 8, europe2015: 7 },
  { drug: 'Psilocybin Mushrooms', nutt2010: 5, australia2019: 4, nz2023: 4, europe2015: 5 },
] as const;

type ChartStudyKey = 'nutt2010' | 'australia2019' | 'nz2023' | 'europe2015';

// Map chart study keys to StudyId
const studyKeyToId: Record<ChartStudyKey, StudyId> = {
  nutt2010: 'uk2010',
  australia2019: 'australia2019',
  nz2023: 'newzealand2023',
  europe2015: 'europe2015',
};

interface StudyInfo {
  name: string;
  fullName: string;
  journal: string;
  link: string;
  color: string;
  description: string;
}

const studyInfo: Record<ChartStudyKey, StudyInfo> = {
  nutt2010: {
    name: 'UK 2010',
    fullName: 'Nutt et al. (2010)',
    journal: 'The Lancet',
    link: 'https://doi.org/10.1016/S0140-6736(10)61462-6',
    color: '#6366f1',
    description:
      'The foundational gold-standard MCDA study. Used 16 harm criteria with swing weighting. Published in The Lancet (highest impact factor). Most cited drug harm ranking study.',
  },
  australia2019: {
    name: 'Australia 2019',
    fullName: 'Bonomo et al. (2019)',
    journal: 'J Psychopharmacology',
    link: 'https://doi.org/10.1177/0269881119841569',
    color: '#22c55e',
    description:
      'Rigorous MCDA replication with diverse Australian experts. Added supplementary prevalence-adjusted analysis to account for local usage patterns. High methodological quality.',
  },
  nz2023: {
    name: 'New Zealand 2023',
    fullName: 'Crossin et al. (2023)',
    journal: 'J Psychopharmacology',
    link: 'https://doi.org/10.1177/02698811231182012',
    color: '#f97316',
    description:
      'Most methodologically advanced study. Added culturally-relevant criteria including indigenous perspectives (non-physical/spiritual harm) and youth-specific harm analysis. Most recent data reflects current drug landscape.',
  },
  europe2015: {
    name: 'Europe 2015',
    fullName: 'van Amsterdam et al. (2015)',
    journal: 'J Psychopharmacology',
    link: 'https://doi.org/10.1177/0269881115581980',
    color: '#ec4899',
    description:
      'EU-wide expert panel providing international perspective. Results validated against original UK panel with high correlation (r=0.93). Demonstrates cross-cultural consistency of harm rankings across Western nations.',
  },
};

// Stacked chart tooltip
interface StackedTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
  studyId: StudyId;
}

function StackedTooltip({ active, payload, label, studyId }: StackedTooltipProps) {
  const { metadata: criteriaMetadata } = getCriteriaDataForStudy(studyId);

  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);

    return (
      <div className="bg-slate-900/95 border border-slate-600/30 rounded-lg p-3 shadow-xl max-w-xs">
        <p className="font-mono font-bold text-sm text-slate-50 mb-2">{label}</p>
        <p className="font-mono text-xs text-slate-300 mb-2 border-b border-slate-700 pb-2">
          Total: <span className="font-bold">{total}</span>
        </p>
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {payload
            .filter((entry) => entry.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((entry, index) => {
              const criterion = criteriaMetadata.find((c) => c.key === entry.dataKey);
              return (
                <p key={index} className="font-mono text-[11px] text-slate-400 flex justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    {criterion?.shortLabel || entry.dataKey}
                  </span>
                  <span className="text-slate-200 font-medium">{entry.value}</span>
                </p>
              );
            })}
        </div>
      </div>
    );
  }
  return null;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: (typeof harmData)[number];
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-600/30 rounded-lg p-3 shadow-xl">
        <p className="font-mono font-bold text-sm text-slate-50 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-mono text-xs text-slate-400 my-1">
            {studyInfo[entry.dataKey as ChartStudyKey]?.name}:{' '}
            <span className="text-slate-50 font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function ComparisonTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-600/30 rounded-lg p-3 shadow-xl">
        <p className="font-mono font-bold text-sm text-slate-50 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-mono text-xs my-1" style={{ color: entry.color }}>
            {entry.name}: <span className="text-slate-50 font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Stacked comparison tooltip showing user/others breakdown per study
interface ComparisonStackedTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    name: string;
    payload: Record<string, number | string>;
  }>;
  label?: string;
}

function ComparisonStackedTooltip({ active, payload, label }: ComparisonStackedTooltipProps) {
  if (active && payload && payload.length && payload[0]?.payload) {
    const data = payload[0].payload;

    const studies = [
      { name: 'UK 2010', users: data.uk2010_users as number, others: data.uk2010_others as number, color: '#6366f1' },
      { name: 'Australia 2019', users: data.aus2019_users as number, others: data.aus2019_others as number, color: '#22c55e' },
      { name: 'NZ 2023', users: data.nz2023_users as number, others: data.nz2023_others as number, color: '#f97316' },
      { name: 'Europe 2015', users: data.eu2015_users as number, others: data.eu2015_others as number, color: '#ec4899' },
    ].filter(s => s.users > 0 || s.others > 0);

    return (
      <div className="bg-slate-900/95 border border-slate-600/30 rounded-lg p-3 shadow-xl min-w-[200px]">
        <p className="font-mono font-bold text-sm text-slate-50 mb-3">{label}</p>
        <div className="space-y-2">
          {studies.map((study) => (
            <div key={study.name} className="border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
              <p className="font-mono text-xs font-semibold mb-1" style={{ color: study.color }}>
                {study.name}
              </p>
              <div className="flex justify-between gap-4 text-[11px] font-mono">
                <span className="text-pink-400">Users: <span className="text-slate-200">{study.users}</span></span>
                <span className="text-cyan-400">Others: <span className="text-slate-200">{study.others}</span></span>
                <span className="text-slate-400">Total: <span className="text-slate-100 font-semibold">{study.users + study.others}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function DrugHarmChart() {
  const [selectedStudy, setSelectedStudy] = useState<ChartStudyKey>('nutt2010');
  const [activeTab, setActiveTab] = useState<'single' | 'comparison'>('single');

  // Comparison view toggles for user/others harm
  const [showComparisonUsers, setShowComparisonUsers] = useState(true);
  const [showComparisonOthers, setShowComparisonOthers] = useState(true);

  // Get study-specific criteria data
  const studyId = studyKeyToId[selectedStudy];
  const {
    userMetadata: userCriteriaMetadata,
    othersMetadata: othersCriteriaMetadata,
    metadata: criteriaMetadata,
    scores: criteriaScores,
    hasCriteriaBreakdown,
  } = getCriteriaDataForStudy(studyId);

  // Initialize with all criteria enabled for the current study
  const [enabledCriteria, setEnabledCriteria] = useState<Set<CriteriaKey>>(
    () => new Set(criteriaMetadata.map((c) => c.key))
  );

  // Reset enabled criteria when study changes
  const handleStudyChange = (newStudy: ChartStudyKey) => {
    setSelectedStudy(newStudy);
    const newStudyId = studyKeyToId[newStudy];
    const { metadata } = getCriteriaDataForStudy(newStudyId);
    setEnabledCriteria(new Set(metadata.map((c) => c.key)));
  };

  // Handlers for criteria toggles
  const handleToggleCriterion = (key: CriteriaKey) => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setEnabledCriteria(new Set(criteriaMetadata.map((c) => c.key)));
  };

  const handleClearAll = () => {
    setEnabledCriteria(new Set());
  };

  const handleSelectAllUser = () => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      userCriteriaMetadata.forEach((c) => next.add(c.key));
      return next;
    });
  };

  const handleClearAllUser = () => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      userCriteriaMetadata.forEach((c) => next.delete(c.key));
      return next;
    });
  };

  const handleSelectAllOthers = () => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      othersCriteriaMetadata.forEach((c) => next.add(c.key));
      return next;
    });
  };

  const handleClearAllOthers = () => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      othersCriteriaMetadata.forEach((c) => next.delete(c.key));
      return next;
    });
  };

  // Prepare data for stacked chart
  const stackedData = useMemo(() => {
    return criteriaScores
      .map((drug) => ({
        ...drug,
        total: calculateTotalHarm(drug, enabledCriteria, studyId),
      }))
      .sort((a, b) => b.total - a.total);
  }, [criteriaScores, enabledCriteria, studyId]);

  // Get enabled criteria metadata for rendering bars
  const enabledCriteriaList = useMemo(() => {
    return criteriaMetadata.filter((c) => enabledCriteria.has(c.key));
  }, [criteriaMetadata, enabledCriteria]);

  // Calculate max domain based on enabled criteria
  const maxStackedValue = useMemo(() => {
    if (stackedData.length === 0) return 50;
    const max = Math.max(...stackedData.map((d) => d.total));
    return Math.ceil(max / 10) * 10 + 5;
  }, [stackedData]);

  const sortedData = [...harmData].sort((a, b) => b[selectedStudy] - a[selectedStudy]);

  // Create comparison data with user/others breakdown for each study
  const comparisonStackedData = useMemo(() => {
    // Get all study criteria data
    const ukData = getCriteriaDataForStudy('uk2010');
    const ausData = getCriteriaDataForStudy('australia2019');
    const nzData = getCriteriaDataForStudy('newzealand2023');
    const euData = getCriteriaDataForStudy('europe2015');

    // Find common drugs across all studies
    const commonDrugs = new Set<string>();

    // Build a map of drug names to scores for each study
    const ukScoresMap = new Map(ukData.scores.map(s => [s.drug, s]));
    const ausScoresMap = new Map(ausData.scores.map(s => [s.drug, s]));
    const nzScoresMap = new Map(nzData.scores.map(s => [s.drug, s]));
    const euScoresMap = new Map(euData.scores.map(s => [s.drug, s]));

    // Find drugs that exist in all studies (using the Europe 2015 list as base since it's smallest)
    euData.scores.forEach(s => {
      if (ukScoresMap.has(s.drug) || ausScoresMap.has(s.drug) || nzScoresMap.has(s.drug)) {
        commonDrugs.add(s.drug);
      }
    });

    // Also add drugs from other studies
    ukData.scores.forEach(s => commonDrugs.add(s.drug));

    const result = Array.from(commonDrugs).map(drug => {
      const ukScore = ukScoresMap.get(drug);
      const ausScore = ausScoresMap.get(drug);
      const nzScore = nzScoresMap.get(drug);
      const euScore = euScoresMap.get(drug);

      return {
        drug,
        // UK 2010
        uk2010_users: showComparisonUsers && ukScore ? calculateUserHarm(ukScore, undefined, 'uk2010') : 0,
        uk2010_others: showComparisonOthers && ukScore ? calculateOthersHarm(ukScore, undefined, 'uk2010') : 0,
        // Australia 2019
        aus2019_users: showComparisonUsers && ausScore ? calculateUserHarm(ausScore, undefined, 'australia2019') : 0,
        aus2019_others: showComparisonOthers && ausScore ? calculateOthersHarm(ausScore, undefined, 'australia2019') : 0,
        // New Zealand 2023
        nz2023_users: showComparisonUsers && nzScore ? calculateUserHarm(nzScore, undefined, 'newzealand2023') : 0,
        nz2023_others: showComparisonOthers && nzScore ? calculateOthersHarm(nzScore, undefined, 'newzealand2023') : 0,
        // Europe 2015
        eu2015_users: showComparisonUsers && euScore ? calculateUserHarm(euScore, undefined, 'europe2015') : 0,
        eu2015_others: showComparisonOthers && euScore ? calculateOthersHarm(euScore, undefined, 'europe2015') : 0,
      };
    });

    // Sort by average total harm
    return result.sort((a, b) => {
      const totalA = (a.uk2010_users + a.uk2010_others + a.aus2019_users + a.aus2019_others +
                      a.nz2023_users + a.nz2023_others + a.eu2015_users + a.eu2015_others) / 4;
      const totalB = (b.uk2010_users + b.uk2010_others + b.aus2019_users + b.aus2019_others +
                      b.nz2023_users + b.nz2023_others + b.eu2015_users + b.eu2015_others) / 4;
      return totalB - totalA;
    });
  }, [showComparisonUsers, showComparisonOthers]);

  // Calculate max value for comparison chart
  const maxComparisonValue = useMemo(() => {
    if (comparisonStackedData.length === 0) return 80;
    const maxValues = comparisonStackedData.map(d => Math.max(
      d.uk2010_users + d.uk2010_others,
      d.aus2019_users + d.aus2019_others,
      d.nz2023_users + d.nz2023_others,
      d.eu2015_users + d.eu2015_others
    ));
    const max = Math.max(...maxValues);
    return Math.ceil(max / 10) * 10 + 5;
  }, [comparisonStackedData]);

  const comparisonSortedData = [...harmData].sort((a, b) => {
    const avgA = (a.nutt2010 + a.australia2019 + a.nz2023 + a.europe2015) / 4;
    const avgB = (b.nutt2010 + b.australia2019 + b.nz2023 + b.europe2015) / 4;
    return avgB - avgA;
  });

  const averageHarm = (drug: string) => {
    const d = harmData.find((h) => h.drug === drug);
    if (!d) return '0.0';
    return ((d.nutt2010 + d.australia2019 + d.nz2023 + d.europe2015) / 4).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
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

        {/* Tab Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-3 rounded-lg font-mono text-sm font-semibold transition-all ${
              activeTab === 'single'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
            }`}
          >
            Single Study View
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-6 py-3 rounded-lg font-mono text-sm font-semibold transition-all ${
              activeTab === 'comparison'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
            }`}
          >
            Cross-Study Comparison
          </button>
        </div>

        {activeTab === 'single' && (
          <>
            {/* Study Selection */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {(Object.entries(studyInfo) as [ChartStudyKey, StudyInfo][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => handleStudyChange(key)}
                  className="px-5 py-2.5 rounded-lg font-mono text-xs font-medium transition-all"
                  style={{
                    border: selectedStudy === key ? `2px solid ${info.color}` : '2px solid transparent',
                    background: selectedStudy === key ? `${info.color}20` : 'rgba(30, 41, 59, 0.6)',
                    color: selectedStudy === key ? info.color : '#94a3b8',
                  }}
                >
                  {info.name}
                </button>
              ))}
            </div>

            {/* Study Info Card */}
            <div
              className="bg-slate-800/40 rounded-xl p-5 mb-6"
              style={{ border: `1px solid ${studyInfo[selectedStudy].color}40` }}
            >
              <div className="flex items-start gap-6 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <a
                    href={studyInfo[selectedStudy].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-lg mb-3 block hover:underline"
                    style={{ color: studyInfo[selectedStudy].color }}
                  >
                    {studyInfo[selectedStudy].fullName}
                  </a>
                  <p className="text-slate-400 text-sm leading-relaxed">{studyInfo[selectedStudy].description}</p>
                </div>
                <div className="px-5 py-3 bg-slate-900/40 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wide">Journal</span>
                  <p className="text-slate-50 font-semibold text-sm mt-0.5 font-mono">
                    {studyInfo[selectedStudy].journal}
                  </p>
                </div>
              </div>
            </div>

            {/* Criteria Toggles - only show if study has criteria breakdown */}
            {hasCriteriaBreakdown && criteriaMetadata.length > 0 && (
              <CriteriaToggles
                userCriteriaMetadata={userCriteriaMetadata}
                othersCriteriaMetadata={othersCriteriaMetadata}
                enabledCriteria={enabledCriteria}
                onToggle={handleToggleCriterion}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
                onSelectAllUser={handleSelectAllUser}
                onClearAllUser={handleClearAllUser}
                onSelectAllOthers={handleSelectAllOthers}
                onClearAllOthers={handleClearAllOthers}
              />
            )}

            {/* Main Chart */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10 mb-6">
              {hasCriteriaBreakdown && criteriaScores.length > 0 ? (
                // Stacked criteria chart
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-sm font-semibold text-slate-300">
                      Harm by Criteria ({studyInfo[selectedStudy].name})
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      {enabledCriteriaList.length} criteria selected
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={Math.max(450, stackedData.length * 32)}>
                    <BarChart data={stackedData} layout="vertical" margin={{ top: 0, right: 30, left: 160, bottom: 0 }}>
                      <XAxis
                        type="number"
                        domain={[0, maxStackedValue]}
                        tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                      />
                      <YAxis
                        type="category"
                        dataKey="drug"
                        tick={{ fill: '#e2e8f0', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                        width={150}
                      />
                      <Tooltip content={<StackedTooltip studyId={studyId} />} />
                      {enabledCriteriaList.map((criterion) => (
                        <Bar
                          key={criterion.key}
                          dataKey={criterion.key}
                          stackId="criteria"
                          fill={criterion.color}
                          name={criterion.shortLabel}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Criteria Legend */}
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {enabledCriteriaList.map((criterion) => (
                        <div key={criterion.key} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: criterion.color }} />
                          <span className="text-xs font-mono text-slate-400">{criterion.shortLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Fallback single-color chart for studies without criteria breakdown
                <>
                  <ResponsiveContainer width="100%" height={600}>
                    <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 140, bottom: 0 }}>
                      <XAxis
                        type="number"
                        domain={[0, 45]}
                        tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={{ stroke: '#334155' }}
                      />
                      <YAxis
                        type="category"
                        dataKey="drug"
                        tick={{ fill: '#e2e8f0', fontSize: 12, fontFamily: 'var(--font-geist-mono)' }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                        width={130}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey={selectedStudy}
                        radius={[0, 4, 4, 0]}
                        maxBarSize={20}
                        fill={studyInfo[selectedStudy].color}
                        fillOpacity={0.85}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'comparison' && (
          <>
            {/* Harm Type Toggles */}
            <div className="bg-slate-800/40 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-semibold text-slate-300">Harm Category Selection</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowComparisonUsers(!showComparisonUsers)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      showComparisonUsers
                        ? 'bg-pink-500/20 border border-pink-500/40'
                        : 'bg-slate-800/40 border border-slate-700/40 opacity-50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-sm bg-pink-500 ${showComparisonUsers ? 'opacity-100' : 'opacity-30'}`} />
                    <span className={`text-xs font-mono ${showComparisonUsers ? 'text-pink-300' : 'text-slate-500'}`}>
                      Harm to Users
                    </span>
                  </button>
                  <button
                    onClick={() => setShowComparisonOthers(!showComparisonOthers)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      showComparisonOthers
                        ? 'bg-cyan-500/20 border border-cyan-500/40'
                        : 'bg-slate-800/40 border border-slate-700/40 opacity-50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-sm bg-cyan-500 ${showComparisonOthers ? 'opacity-100' : 'opacity-30'}`} />
                    <span className={`text-xs font-mono ${showComparisonOthers ? 'text-cyan-300' : 'text-slate-500'}`}>
                      Harm to Others
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cross-Study Comparison Chart with User/Others breakdown */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10 mb-6">
              <h3 className="font-mono text-base font-semibold text-slate-50 mb-2">Harm Scores Across All Studies</h3>
              <p className="text-xs text-slate-400 mb-5">
                {showComparisonUsers && showComparisonOthers
                  ? 'Each bar shows harm to users (solid) and harm to others (faded)'
                  : showComparisonUsers
                    ? 'Showing harm to users only'
                    : showComparisonOthers
                      ? 'Showing harm to others only'
                      : 'Select a harm category to display'}
              </p>

              <ResponsiveContainer width="100%" height={Math.max(800, comparisonStackedData.length * 36)}>
                <BarChart
                  data={comparisonStackedData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 160, bottom: 0 }}
                  barCategoryGap="20%"
                  barGap={0}
                >
                  <XAxis
                    type="number"
                    domain={[0, maxComparisonValue]}
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="drug"
                    tick={{ fill: '#e2e8f0', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    width={150}
                  />
                  <Tooltip content={<ComparisonStackedTooltip />} />
                  {/* UK 2010 - stacked users + others */}
                  <Bar dataKey="uk2010_users" stackId="uk2010" fill="#6366f1" name="UK Users" maxBarSize={16} />
                  <Bar dataKey="uk2010_others" stackId="uk2010" fill="#6366f1" fillOpacity={0.4} name="UK Others" maxBarSize={16} />
                  {/* Australia 2019 - stacked users + others */}
                  <Bar dataKey="aus2019_users" stackId="aus2019" fill="#22c55e" name="AUS Users" maxBarSize={16} />
                  <Bar dataKey="aus2019_others" stackId="aus2019" fill="#22c55e" fillOpacity={0.4} name="AUS Others" maxBarSize={16} />
                  {/* New Zealand 2023 - stacked users + others */}
                  <Bar dataKey="nz2023_users" stackId="nz2023" fill="#f97316" name="NZ Users" maxBarSize={16} />
                  <Bar dataKey="nz2023_others" stackId="nz2023" fill="#f97316" fillOpacity={0.4} name="NZ Others" maxBarSize={16} />
                  {/* Europe 2015 - stacked users + others */}
                  <Bar dataKey="eu2015_users" stackId="eu2015" fill="#ec4899" name="EU Users" maxBarSize={16} />
                  <Bar dataKey="eu2015_others" stackId="eu2015" fill="#ec4899" fillOpacity={0.4} name="EU Others" maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6366f1' }} />
                    <span className="text-xs font-mono text-slate-400">UK 2010</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                    <span className="text-xs font-mono text-slate-400">Australia 2019</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f97316' }} />
                    <span className="text-xs font-mono text-slate-400">NZ 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ec4899' }} />
                    <span className="text-xs font-mono text-slate-400">Europe 2015</span>
                  </div>
                </div>
                <div className="flex gap-6 justify-center mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded-sm bg-slate-400" />
                    <span className="text-xs font-mono text-slate-500">= Harm to Users (solid)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded-sm bg-slate-400/40" />
                    <span className="text-xs font-mono text-slate-500">= Harm to Others (faded)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Legend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {(Object.entries(studyInfo) as [ChartStudyKey, StudyInfo][]).map(([key, info]) => (
                <div
                  key={key}
                  className="bg-slate-800/40 rounded-xl p-4"
                  style={{ borderLeft: `4px solid ${info.color}` }}
                >
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-sm mb-2 block hover:underline"
                    style={{ color: info.color }}
                  >
                    {info.fullName}
                  </a>
                  <p className="text-slate-500 text-xs mb-2">{info.journal}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{info.description}</p>
                </div>
              ))}
            </div>

            {/* Summary Table with User/Others breakdown */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10">
              <h3 className="font-mono text-base font-semibold text-slate-50 mb-2">Detailed Score Comparison</h3>
              <p className="text-xs text-slate-400 mb-4">
                {showComparisonUsers && showComparisonOthers ? (
                  <>Format: <span className="text-pink-400">Users</span> + <span className="text-cyan-400">Others</span> = <span className="text-slate-200">Total</span></>
                ) : showComparisonUsers ? (
                  <>Showing: <span className="text-pink-400">Harm to Users</span> only</>
                ) : showComparisonOthers ? (
                  <>Showing: <span className="text-cyan-400">Harm to Others</span> only</>
                ) : (
                  <>Select a harm category to display</>
                )}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 text-slate-500 text-xs font-mono uppercase border-b border-slate-700">
                        Drug
                      </th>
                      <th
                        className="text-center p-3 text-xs font-mono uppercase border-b border-slate-700"
                        style={{ color: studyInfo.nutt2010.color }}
                      >
                        UK 2010
                      </th>
                      <th
                        className="text-center p-3 text-xs font-mono uppercase border-b border-slate-700"
                        style={{ color: studyInfo.australia2019.color }}
                      >
                        AUS 2019
                      </th>
                      <th
                        className="text-center p-3 text-xs font-mono uppercase border-b border-slate-700"
                        style={{ color: studyInfo.nz2023.color }}
                      >
                        NZ 2023
                      </th>
                      <th
                        className="text-center p-3 text-xs font-mono uppercase border-b border-slate-700"
                        style={{ color: studyInfo.europe2015.color }}
                      >
                        EU 2015
                      </th>
                      <th className="text-center p-3 text-green-500 text-xs font-mono uppercase border-b border-slate-700">
                        Average
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonStackedData.map((row, i) => {
                      const ukTotal = row.uk2010_users + row.uk2010_others;
                      const ausTotal = row.aus2019_users + row.aus2019_others;
                      const nzTotal = row.nz2023_users + row.nz2023_others;
                      const euTotal = row.eu2015_users + row.eu2015_others;

                      // Helper to render cell content based on toggle state
                      const renderCell = (users: number, others: number, total: number) => {
                        if (total === 0) return <span className="text-slate-600">—</span>;
                        if (showComparisonUsers && showComparisonOthers) {
                          return (
                            <>
                              <span className="text-pink-400">{users}</span>
                              <span className="text-slate-500"> + </span>
                              <span className="text-cyan-400">{others}</span>
                              <span className="text-slate-500"> = </span>
                              <span className="text-slate-100 font-semibold">{total}</span>
                            </>
                          );
                        }
                        if (showComparisonUsers) {
                          return <span className="text-pink-400 font-semibold">{users}</span>;
                        }
                        if (showComparisonOthers) {
                          return <span className="text-cyan-400 font-semibold">{others}</span>;
                        }
                        return <span className="text-slate-600">—</span>;
                      };

                      return (
                        <tr key={row.drug} className={i % 2 === 0 ? '' : 'bg-slate-800/30'}>
                          <td className="p-2.5 text-slate-200 text-sm font-mono">{row.drug}</td>
                          <td className="text-center p-2.5 text-xs font-mono">
                            {renderCell(row.uk2010_users, row.uk2010_others, ukTotal)}
                          </td>
                          <td className="text-center p-2.5 text-xs font-mono">
                            {renderCell(row.aus2019_users, row.aus2019_others, ausTotal)}
                          </td>
                          <td className="text-center p-2.5 text-xs font-mono">
                            {renderCell(row.nz2023_users, row.nz2023_others, nzTotal)}
                          </td>
                          <td className="text-center p-2.5 text-xs font-mono">
                            {renderCell(row.eu2015_users, row.eu2015_others, euTotal)}
                          </td>
                          <td className="text-center p-2.5 text-xs font-mono">
                            {(() => {
                              const totals = [ukTotal, ausTotal, nzTotal, euTotal].filter(t => t > 0);
                              if (totals.length === 0) return <span className="text-slate-600">—</span>;
                              const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
                              return <span className="text-green-500 font-semibold">{avg.toFixed(1)}</span>;
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

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
            <strong>Sources:</strong> Nutt DJ et al. (2010) The Lancet 376:1558-65; Bonomo Y et al. (2019) J
            Psychopharmacol 33(7):759-768; Crossin R et al. (2023) J Psychopharmacol 37(9):891-903; van Amsterdam J et
            al. (2015) J Psychopharmacol 29(6):655-60
          </p>
        </div>
      </div>
    </div>
  );
}
