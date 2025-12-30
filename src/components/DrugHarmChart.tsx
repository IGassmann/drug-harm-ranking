'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import CriteriaToggles from './CriteriaToggles';
import {
  type CriteriaKey,
  criteriaMetadata,
  userCriteria,
  othersCriteria,
  drugCriteriaScores,
  calculateTotalHarm,
} from '@/data/criteriaData';

// Data extracted from key MCDA studies - Harm to Users scores (normalized to 0-100 scale)
const harmData = [
  { drug: 'Heroin', nutt2010: 34, australia2019: 36, nz2023: 38, europe2015: 33, category: 'opioid' },
  { drug: 'Crack Cocaine', nutt2010: 37, australia2019: 34, nz2023: 35, europe2015: 35, category: 'stimulant' },
  { drug: 'Methamphetamine', nutt2010: 32, australia2019: 33, nz2023: 36, europe2015: 30, category: 'stimulant' },
  { drug: 'Alcohol', nutt2010: 26, australia2019: 29, nz2023: 27, europe2015: 25, category: 'depressant' },
  { drug: 'Cocaine', nutt2010: 27, australia2019: 25, nz2023: 24, europe2015: 26, category: 'stimulant' },
  { drug: 'Tobacco', nutt2010: 26, australia2019: 24, nz2023: 22, europe2015: 23, category: 'other' },
  { drug: 'Amphetamine', nutt2010: 23, australia2019: 21, nz2023: 22, europe2015: 20, category: 'stimulant' },
  { drug: 'Cannabis', nutt2010: 20, australia2019: 18, nz2023: 16, europe2015: 17, category: 'cannabinoid' },
  { drug: 'GHB', nutt2010: 18, australia2019: 16, nz2023: 15, europe2015: 16, category: 'depressant' },
  { drug: 'Benzodiazepines', nutt2010: 15, australia2019: 17, nz2023: 18, europe2015: 14, category: 'depressant' },
  { drug: 'Ketamine', nutt2010: 15, australia2019: 14, nz2023: 13, europe2015: 13, category: 'dissociative' },
  { drug: 'Methadone', nutt2010: 14, australia2019: 15, nz2023: 14, europe2015: 13, category: 'opioid' },
  { drug: 'Mephedrone', nutt2010: 13, australia2019: 12, nz2023: 11, europe2015: 12, category: 'stimulant' },
  { drug: 'Anabolic Steroids', nutt2010: 10, australia2019: 9, nz2023: 8, europe2015: 9, category: 'other' },
  { drug: 'MDMA (Ecstasy)', nutt2010: 9, australia2019: 8, nz2023: 9, europe2015: 8, category: 'stimulant' },
  { drug: 'Khat', nutt2010: 9, australia2019: 7, nz2023: 6, europe2015: 8, category: 'stimulant' },
  { drug: 'LSD', nutt2010: 7, australia2019: 6, nz2023: 5, europe2015: 6, category: 'psychedelic' },
  { drug: 'Buprenorphine', nutt2010: 8, australia2019: 9, nz2023: 8, europe2015: 7, category: 'opioid' },
  { drug: 'Psilocybin Mushrooms', nutt2010: 5, australia2019: 4, nz2023: 4, europe2015: 5, category: 'psychedelic' },
] as const;

type Category = (typeof harmData)[number]['category'];
type StudyKey = 'nutt2010' | 'australia2019' | 'nz2023' | 'europe2015';

const categoryColors: Record<Category, string> = {
  opioid: '#dc2626',
  stimulant: '#f97316',
  depressant: '#8b5cf6',
  cannabinoid: '#22c55e',
  dissociative: '#06b6d4',
  psychedelic: '#ec4899',
  other: '#6b7280',
};

const categoryLabels: Record<Category, string> = {
  opioid: 'Opioids',
  stimulant: 'Stimulants',
  depressant: 'Depressants',
  cannabinoid: 'Cannabinoids',
  dissociative: 'Dissociatives',
  psychedelic: 'Psychedelics',
  other: 'Other',
};

interface StudyInfo {
  name: string;
  fullName: string;
  journal: string;
  link: string;
  color: string;
  description: string;
  hasCriteriaData: boolean;
}

const studyInfo: Record<StudyKey, StudyInfo> = {
  nutt2010: {
    name: 'UK 2010',
    fullName: 'Nutt et al. (2010)',
    journal: 'The Lancet',
    link: 'https://doi.org/10.1016/S0140-6736(10)61462-6',
    color: '#6366f1',
    description:
      'The foundational gold-standard MCDA study. Used 16 harm criteria with swing weighting. Published in The Lancet (highest impact factor). Most cited drug harm ranking study.',
    hasCriteriaData: true,
  },
  australia2019: {
    name: 'Australia 2019',
    fullName: 'Bonomo et al. (2019)',
    journal: 'J Psychopharmacology',
    link: 'https://doi.org/10.1177/0269881119841569',
    color: '#22c55e',
    description:
      'Rigorous MCDA replication with diverse Australian experts. Added supplementary prevalence-adjusted analysis to account for local usage patterns. High methodological quality.',
    hasCriteriaData: false,
  },
  nz2023: {
    name: 'New Zealand 2023',
    fullName: 'Crossin et al. (2023)',
    journal: 'J Psychopharmacology',
    link: 'https://doi.org/10.1177/02698811231182012',
    color: '#f97316',
    description:
      'Most methodologically advanced study. Added culturally-relevant criteria including indigenous perspectives and youth-specific harm analysis. Most recent data reflects current drug landscape.',
    hasCriteriaData: false,
  },
  europe2015: {
    name: 'Europe 2015',
    fullName: 'van Amsterdam et al. (2015)',
    journal: 'J Psychopharmacology',
    link: 'https://doi.org/10.1177/0269881115581980',
    color: '#ec4899',
    description:
      'EU-wide expert panel providing international perspective. Results validated against original UK panel with high correlation (r=0.93). Demonstrates cross-cultural consistency of harm rankings across Western nations.',
    hasCriteriaData: false,
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
}

function StackedTooltip({ active, payload, label }: StackedTooltipProps) {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    const drugData = drugCriteriaScores.find((d) => d.drug === label);

    return (
      <div className="bg-slate-900/95 border border-slate-600/30 rounded-lg p-3 shadow-xl max-w-xs">
        <p className="font-mono font-bold text-sm text-slate-50 mb-1">{label}</p>
        {drugData && (
          <p
            className="font-mono text-xs mb-2 uppercase tracking-wide"
            style={{ color: categoryColors[drugData.category] }}
          >
            {categoryLabels[drugData.category]}
          </p>
        )}
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
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-600/30 rounded-lg p-3 shadow-xl">
        <p className="font-mono font-bold text-sm text-slate-50 mb-2">{label}</p>
        <p className="font-mono text-xs mb-2 uppercase tracking-wide" style={{ color: categoryColors[data.category] }}>
          {categoryLabels[data.category]}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="font-mono text-xs text-slate-400 my-1">
            {studyInfo[entry.dataKey as StudyKey]?.name}:{' '}
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

export default function DrugHarmChart() {
  const [selectedStudy, setSelectedStudy] = useState<StudyKey>('nutt2010');
  const [activeTab, setActiveTab] = useState<'single' | 'comparison'>('single');
  const [showCriteriaBreakdown, setShowCriteriaBreakdown] = useState(true);

  // Initialize with all criteria enabled
  const [enabledCriteria, setEnabledCriteria] = useState<Set<CriteriaKey>>(
    () => new Set(criteriaMetadata.map((c) => c.key))
  );

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

  const handleSelectAll = (category: 'user' | 'others' | 'all') => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      const criteria = category === 'all' ? criteriaMetadata : category === 'user' ? userCriteria : othersCriteria;
      criteria.forEach((c) => next.add(c.key));
      return next;
    });
  };

  const handleClearAll = (category: 'user' | 'others' | 'all') => {
    setEnabledCriteria((prev) => {
      const next = new Set(prev);
      const criteria = category === 'all' ? criteriaMetadata : category === 'user' ? userCriteria : othersCriteria;
      criteria.forEach((c) => next.delete(c.key));
      return next;
    });
  };

  // Prepare data for stacked chart (UK 2010 with criteria breakdown)
  const stackedData = useMemo(() => {
    return drugCriteriaScores
      .map((drug) => ({
        ...drug,
        total: calculateTotalHarm(drug, enabledCriteria),
      }))
      .sort((a, b) => b.total - a.total);
  }, [enabledCriteria]);

  // Get enabled criteria metadata for rendering bars
  const enabledCriteriaList = useMemo(() => {
    return criteriaMetadata.filter((c) => enabledCriteria.has(c.key));
  }, [enabledCriteria]);

  // Calculate max domain based on enabled criteria
  const maxStackedValue = useMemo(() => {
    const max = Math.max(...stackedData.map((d) => d.total));
    return Math.ceil(max / 10) * 10 + 5;
  }, [stackedData]);

  const sortedData = [...harmData].sort((a, b) => b[selectedStudy] - a[selectedStudy]);
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

  const showStackedChart = selectedStudy === 'nutt2010' && showCriteriaBreakdown;

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
              {(Object.entries(studyInfo) as [StudyKey, StudyInfo][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStudy(key)}
                  className="px-5 py-2.5 rounded-lg font-mono text-xs font-medium transition-all"
                  style={{
                    border: selectedStudy === key ? `2px solid ${info.color}` : '2px solid transparent',
                    background: selectedStudy === key ? `${info.color}20` : 'rgba(30, 41, 59, 0.6)',
                    color: selectedStudy === key ? info.color : '#94a3b8',
                  }}
                >
                  {info.name}
                  {info.hasCriteriaData && (
                    <span className="ml-1.5 text-[10px] opacity-70">*</span>
                  )}
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

            {/* Criteria Breakdown Toggle (only for UK 2010) */}
            {studyInfo[selectedStudy].hasCriteriaData && (
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCriteriaBreakdown}
                    onChange={(e) => setShowCriteriaBreakdown(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-sm font-mono text-slate-300">
                    Show criteria breakdown
                  </span>
                </label>
              </div>
            )}

            {/* Criteria Toggles */}
            {showStackedChart && (
              <CriteriaToggles
                enabledCriteria={enabledCriteria}
                onToggle={handleToggleCriterion}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
              />
            )}

            {/* Main Chart */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10 mb-6">
              {showStackedChart ? (
                // Stacked criteria chart for UK 2010
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-sm font-semibold text-slate-300">
                      Harm by Criteria (UK 2010)
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      {enabledCriteriaList.length} criteria selected
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={650}>
                    <BarChart data={stackedData} layout="vertical" margin={{ top: 0, right: 30, left: 140, bottom: 0 }}>
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
                        tick={{ fill: '#e2e8f0', fontSize: 12, fontFamily: 'var(--font-geist-mono)' }}
                        axisLine={{ stroke: '#334155' }}
                        tickLine={false}
                        width={130}
                      />
                      <Tooltip content={<StackedTooltip />} />
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
                // Original single-color chart for other studies
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
                    <Bar dataKey={selectedStudy} radius={[0, 4, 4, 0]} maxBarSize={20}>
                      {sortedData.map((entry, index) => (
                        <Cell key={index} fill={categoryColors[entry.category]} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Note about criteria data availability */}
            {!studyInfo[selectedStudy].hasCriteriaData && (
              <p className="text-xs text-slate-500 font-mono mb-6">
                * Detailed criteria breakdown is only available for UK 2010 study
              </p>
            )}
          </>
        )}

        {activeTab === 'comparison' && (
          <>
            {/* Cross-Study Comparison Chart */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10 mb-6">
              <h3 className="font-mono text-base font-semibold text-slate-50 mb-5">Harm Scores Across All Studies</h3>

              <ResponsiveContainer width="100%" height={650}>
                <BarChart
                  data={comparisonSortedData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 140, bottom: 0 }}
                  barCategoryGap="20%"
                >
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
                    tick={{ fill: '#e2e8f0', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    width={130}
                  />
                  <Tooltip content={<ComparisonTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => (
                      <span className="text-slate-400 text-xs font-mono">{studyInfo[value as StudyKey]?.name}</span>
                    )}
                  />
                  <Bar
                    dataKey="nutt2010"
                    name="nutt2010"
                    fill={studyInfo.nutt2010.color}
                    radius={[0, 2, 2, 0]}
                    maxBarSize={8}
                  />
                  <Bar
                    dataKey="australia2019"
                    name="australia2019"
                    fill={studyInfo.australia2019.color}
                    radius={[0, 2, 2, 0]}
                    maxBarSize={8}
                  />
                  <Bar
                    dataKey="nz2023"
                    name="nz2023"
                    fill={studyInfo.nz2023.color}
                    radius={[0, 2, 2, 0]}
                    maxBarSize={8}
                  />
                  <Bar
                    dataKey="europe2015"
                    name="europe2015"
                    fill={studyInfo.europe2015.color}
                    radius={[0, 2, 2, 0]}
                    maxBarSize={8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Study Legend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {(Object.entries(studyInfo) as [StudyKey, StudyInfo][]).map(([key, info]) => (
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
                  <p className="text-slate-500 text-xs mb-2">
                    {info.journal}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">{info.description}</p>
                </div>
              ))}
            </div>

            {/* Summary Table */}
            <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10">
              <h3 className="font-mono text-base font-semibold text-slate-50 mb-4">Detailed Score Comparison</h3>

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
                      <th className="text-center p-3 text-slate-500 text-xs font-mono uppercase border-b border-slate-700">
                        Range
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonSortedData.map((row, i) => {
                      const values = [row.nutt2010, row.australia2019, row.nz2023, row.europe2015];
                      const range = Math.max(...values) - Math.min(...values);
                      return (
                        <tr key={row.drug} className={i % 2 === 0 ? '' : 'bg-slate-800/30'}>
                          <td className="p-2.5 text-slate-200 text-sm font-mono">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-sm" style={{ background: categoryColors[row.category] }} />
                              {row.drug}
                            </div>
                          </td>
                          <td className="text-center p-2.5 text-slate-50 text-sm font-mono font-semibold">
                            {row.nutt2010}
                          </td>
                          <td className="text-center p-2.5 text-slate-50 text-sm font-mono font-semibold">
                            {row.australia2019}
                          </td>
                          <td className="text-center p-2.5 text-slate-50 text-sm font-mono font-semibold">
                            {row.nz2023}
                          </td>
                          <td className="text-center p-2.5 text-slate-50 text-sm font-mono font-semibold">
                            {row.europe2015}
                          </td>
                          <td className="text-center p-2.5 text-green-500 text-sm font-mono font-bold">
                            {averageHarm(row.drug)}
                          </td>
                          <td
                            className={`text-center p-2.5 text-sm font-mono ${range > 4 ? 'text-amber-400' : 'text-slate-500'}`}
                          >
                            ±{range}
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

        {/* Category Legend */}
        <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-center">
          {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: categoryColors[key] }} />
              <span className="text-slate-400 text-xs font-mono">{label}</span>
            </div>
          ))}
        </div>

        {/* Methodology Note */}
        <div className="mt-6 px-5 py-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
          <p className="text-indigo-300 text-xs leading-relaxed">
            <strong>Methodology:</strong> Scores use Multi-Criteria Decision Analysis with swing weighting. The 16
            criteria are divided into harm to users (9 criteria: mortality, physical damage, dependence, mental
            impairment, loss of tangibles/relationships) and harm to others (7 criteria: injury, crime, environmental
            damage, family adversities, international damage, economic cost, community impact). Scale: 0 (no harm) to
            100 (maximum possible harm).
          </p>
        </div>

        {/* Sources */}
        <div className="mt-4 text-slate-500 text-xs leading-relaxed">
          <p>
            <strong>Sources:</strong> Nutt DJ et al. (2010) The Lancet 376:1558-65; Bonomo Y et al. (2019) J
            Psychopharmacol 33(7):759-768; Crossin R et al. (2023) J Psychopharmacol 37(8):801-815; van Amsterdam J et
            al. (2015) J Psychopharmacol 29(6):655-60
          </p>
        </div>
      </div>
    </div>
  );
}
