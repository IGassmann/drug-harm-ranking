'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import CriteriaToggles from './CriteriaToggles';
import {
  type CriteriaKey,
  getCriteriaDataForStudy,
} from '@/data/criteriaData';
import { harmData, studyInfo, studyKeyToId, type ChartStudyKey } from '@/data/chartData';

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
  studyId: string;
}

function StackedTooltip({ active, payload, label, studyId }: StackedTooltipProps) {
  const { metadata: criteriaMetadata } = getCriteriaDataForStudy(studyId as 'uk2010' | 'australia2019' | 'newzealand2023' | 'europe2015');

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

interface SingleStudyViewProps {
  studyKey: ChartStudyKey;
}

export default function SingleStudyView({ studyKey }: SingleStudyViewProps) {
  // Get study-specific criteria data
  const studyId = studyKeyToId[studyKey];
  const {
    userMetadata: userCriteriaMetadata,
    othersMetadata: othersCriteriaMetadata,
    metadata: criteriaMetadata,
    scores: criteriaScores,
    hasCriteriaBreakdown,
  } = getCriteriaDataForStudy(studyId);

  // URL state for enabled criteria (stored as comma-separated string)
  const [enabledCriteriaParam, setEnabledCriteriaParam] = useQueryState(
    'criteria',
    parseAsArrayOf(parseAsString, ',').withDefault([])
  );

  // Convert URL param to Set for internal use
  const enabledCriteria = useMemo(() => {
    // If no criteria specified in URL, enable all
    if (enabledCriteriaParam.length === 0) {
      return new Set(criteriaMetadata.map((c) => c.key));
    }
    return new Set(enabledCriteriaParam as CriteriaKey[]);
  }, [enabledCriteriaParam, criteriaMetadata]);

  // Handlers for criteria toggles
  const updateCriteria = (newCriteria: Set<CriteriaKey>) => {
    const allKeys = criteriaMetadata.map((c) => c.key);
    const allEnabled = allKeys.every((key) => newCriteria.has(key));

    if (allEnabled || newCriteria.size === 0) {
      // Clear URL param when all enabled or none enabled
      setEnabledCriteriaParam(null);
    } else {
      setEnabledCriteriaParam(Array.from(newCriteria));
    }
  };

  const handleToggleCriterion = (key: CriteriaKey) => {
    const next = new Set(enabledCriteria);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    updateCriteria(next);
  };

  const handleSelectAll = () => {
    setEnabledCriteriaParam(null); // Clear param = all enabled
  };

  const handleClearAll = () => {
    setEnabledCriteriaParam([]);
  };

  const handleSelectAllUser = () => {
    const next = new Set(enabledCriteria);
    userCriteriaMetadata.forEach((c) => next.add(c.key));
    updateCriteria(next);
  };

  const handleClearAllUser = () => {
    const next = new Set(enabledCriteria);
    userCriteriaMetadata.forEach((c) => next.delete(c.key));
    updateCriteria(next);
  };

  const handleSelectAllOthers = () => {
    const next = new Set(enabledCriteria);
    othersCriteriaMetadata.forEach((c) => next.add(c.key));
    updateCriteria(next);
  };

  const handleClearAllOthers = () => {
    const next = new Set(enabledCriteria);
    othersCriteriaMetadata.forEach((c) => next.delete(c.key));
    updateCriteria(next);
  };

  // Build stacked data for criteria breakdown chart
  const stackedData = useMemo(() => {
    if (!hasCriteriaBreakdown || criteriaScores.length === 0) return [];

    return criteriaScores.map((drugScore) => {
      const dataPoint: Record<string, string | number> = { drug: drugScore.drug };
      let total = 0;

      criteriaMetadata.forEach((criterion) => {
        const key = criterion.key as keyof typeof drugScore;
        const value = typeof drugScore[key] === 'number' ? (drugScore[key] as number) : 0;
        const displayValue = enabledCriteria.has(criterion.key) ? value : 0;
        dataPoint[criterion.key] = displayValue;
        total += displayValue;
      });

      dataPoint.total = total;
      return dataPoint;
    });
  }, [criteriaScores, criteriaMetadata, enabledCriteria, hasCriteriaBreakdown]);

  // Filter and sort stacked data
  const enabledCriteriaList = useMemo(() => {
    return criteriaMetadata.filter((c) => enabledCriteria.has(c.key));
  }, [criteriaMetadata, enabledCriteria]);

  // Calculate max domain based on enabled criteria
  const maxStackedValue = useMemo(() => {
    if (stackedData.length === 0) return 50;
    const max = Math.max(...stackedData.map((d) => d.total as number));
    return Math.ceil(max / 10) * 10 + 5;
  }, [stackedData]);

  const sortedData = [...harmData].sort((a, b) => b[studyKey] - a[studyKey]);

  const info = studyInfo[studyKey];

  return (
    <>
      {/* Study Info Card */}
      <div className="bg-slate-800/40 rounded-xl p-5 mb-6" style={{ border: `1px solid ${info.color}40` }}>
        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <a
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-lg font-bold mb-1 block hover:underline"
              style={{ color: info.color }}
            >
              {info.fullName}
            </a>
            <p className="text-slate-500 text-xs mb-3">{info.journal}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{info.description}</p>
          </div>
        </div>
      </div>

      {/* Criteria Toggles */}
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

      {/* Chart */}
      <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-mono text-base font-semibold text-slate-50">
            {info.name} - Harm Scores
            {hasCriteriaBreakdown && ` (${enabledCriteria.size}/${criteriaMetadata.length} criteria)`}
          </h3>
        </div>

        {hasCriteriaBreakdown && stackedData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={600}>
              <BarChart
                data={[...stackedData].sort((a, b) => (b.total as number) - (a.total as number))}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 140, bottom: 0 }}
              >
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
                <Tooltip content={<StackedTooltip studyId={studyId} />} />
                {enabledCriteriaList.map((criterion) => (
                  <Bar
                    key={criterion.key}
                    dataKey={criterion.key}
                    stackId="criteria"
                    fill={criterion.color}
                    name={criterion.shortLabel}
                    maxBarSize={20}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>

            {/* Criteria Legend */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {enabledCriteriaList.map((criterion) => (
                  <div key={criterion.key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: criterion.color }} />
                    <span className="text-[10px] font-mono text-slate-500">{criterion.shortLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Fallback single-color chart for studies without criteria breakdown
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
              <Bar dataKey={studyKey} radius={[0, 4, 4, 0]} maxBarSize={20} fill={info.color} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
