'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQueryState, parseAsBoolean } from 'nuqs';
import {
  getCriteriaDataForStudy,
  calculateUserHarm,
  calculateOthersHarm,
} from '@/data/criteriaData';
import { studyInfo, type ChartStudyKey, type StudyInfo } from '@/data/chartData';

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

export default function ComparisonView() {
  // URL state for comparison toggles
  const [showUsers, setShowUsers] = useQueryState(
    'users',
    parseAsBoolean.withDefault(true)
  );
  const [showOthers, setShowOthers] = useQueryState(
    'others',
    parseAsBoolean.withDefault(true)
  );

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
        uk2010_users: showUsers && ukScore ? calculateUserHarm(ukScore, undefined, 'uk2010') : 0,
        uk2010_others: showOthers && ukScore ? calculateOthersHarm(ukScore, undefined, 'uk2010') : 0,
        // Australia 2019
        aus2019_users: showUsers && ausScore ? calculateUserHarm(ausScore, undefined, 'australia2019') : 0,
        aus2019_others: showOthers && ausScore ? calculateOthersHarm(ausScore, undefined, 'australia2019') : 0,
        // New Zealand 2023
        nz2023_users: showUsers && nzScore ? calculateUserHarm(nzScore, undefined, 'newzealand2023') : 0,
        nz2023_others: showOthers && nzScore ? calculateOthersHarm(nzScore, undefined, 'newzealand2023') : 0,
        // Europe 2015
        eu2015_users: showUsers && euScore ? calculateUserHarm(euScore, undefined, 'europe2015') : 0,
        eu2015_others: showOthers && euScore ? calculateOthersHarm(euScore, undefined, 'europe2015') : 0,
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
  }, [showUsers, showOthers]);

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

  return (
    <>
      {/* Harm Type Toggles */}
      <div className="bg-slate-800/40 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm font-semibold text-slate-300">Harm Category Selection</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                showUsers
                  ? 'bg-pink-500/20 border border-pink-500/40'
                  : 'bg-slate-800/40 border border-slate-700/40 opacity-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-sm bg-pink-500 ${showUsers ? 'opacity-100' : 'opacity-30'}`} />
              <span className={`text-xs font-mono ${showUsers ? 'text-pink-300' : 'text-slate-500'}`}>
                Harm to Users
              </span>
            </button>
            <button
              onClick={() => setShowOthers(!showOthers)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                showOthers
                  ? 'bg-cyan-500/20 border border-cyan-500/40'
                  : 'bg-slate-800/40 border border-slate-700/40 opacity-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-sm bg-cyan-500 ${showOthers ? 'opacity-100' : 'opacity-30'}`} />
              <span className={`text-xs font-mono ${showOthers ? 'text-cyan-300' : 'text-slate-500'}`}>
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
          {showUsers && showOthers
            ? 'Each bar shows harm to users (solid) and harm to others (faded)'
            : showUsers
              ? 'Showing harm to users only'
              : showOthers
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
          {showUsers && showOthers ? (
            <>Format: <span className="text-pink-400">Users</span> + <span className="text-cyan-400">Others</span> = <span className="text-slate-200">Total</span></>
          ) : showUsers ? (
            <>Showing: <span className="text-pink-400">Harm to Users</span> only</>
          ) : showOthers ? (
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
                  if (showUsers && showOthers) {
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
                  if (showUsers) {
                    return <span className="text-pink-400 font-semibold">{users}</span>;
                  }
                  if (showOthers) {
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
  );
}
