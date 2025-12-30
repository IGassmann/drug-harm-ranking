'use client';

import { type CriteriaKey, criteriaMetadata, userCriteria, othersCriteria } from '@/data/criteriaData';

interface CriteriaTogglesProps {
  enabledCriteria: Set<CriteriaKey>;
  onToggle: (key: CriteriaKey) => void;
  onSelectAll: (category: 'user' | 'others' | 'all') => void;
  onClearAll: (category: 'user' | 'others' | 'all') => void;
}

export default function CriteriaToggles({
  enabledCriteria,
  onToggle,
  onSelectAll,
  onClearAll,
}: CriteriaTogglesProps) {
  const userEnabled = userCriteria.filter((c) => enabledCriteria.has(c.key)).length;
  const othersEnabled = othersCriteria.filter((c) => enabledCriteria.has(c.key)).length;

  return (
    <div className="bg-slate-800/40 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm font-semibold text-slate-300">
          Criteria Selection
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectAll('all')}
            className="px-3 py-1 text-xs font-mono rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={() => onClearAll('all')}
            className="px-3 py-1 text-xs font-mono rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Harm to Users */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono uppercase tracking-wide text-slate-400">
              Harm to Users ({userEnabled}/{userCriteria.length})
            </h4>
            <div className="flex gap-1">
              <button
                onClick={() => onSelectAll('user')}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/50 text-slate-400 hover:bg-slate-600 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => onClearAll('user')}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/50 text-slate-400 hover:bg-slate-600 transition-colors"
              >
                None
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            {userCriteria.map((criterion) => (
              <CriteriaToggleItem
                key={criterion.key}
                criterion={criterion}
                enabled={enabledCriteria.has(criterion.key)}
                onToggle={() => onToggle(criterion.key)}
              />
            ))}
          </div>
        </div>

        {/* Harm to Others */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono uppercase tracking-wide text-slate-400">
              Harm to Others ({othersEnabled}/{othersCriteria.length})
            </h4>
            <div className="flex gap-1">
              <button
                onClick={() => onSelectAll('others')}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/50 text-slate-400 hover:bg-slate-600 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => onClearAll('others')}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/50 text-slate-400 hover:bg-slate-600 transition-colors"
              >
                None
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            {othersCriteria.map((criterion) => (
              <CriteriaToggleItem
                key={criterion.key}
                criterion={criterion}
                enabled={enabledCriteria.has(criterion.key)}
                onToggle={() => onToggle(criterion.key)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CriteriaToggleItemProps {
  criterion: (typeof criteriaMetadata)[number];
  enabled: boolean;
  onToggle: () => void;
}

function CriteriaToggleItem({ criterion, enabled, onToggle }: CriteriaToggleItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all text-left ${
        enabled
          ? 'bg-slate-700/60 hover:bg-slate-700'
          : 'bg-slate-800/40 hover:bg-slate-800/60 opacity-50'
      }`}
      title={criterion.description}
    >
      <div
        className={`w-3 h-3 rounded-sm flex-shrink-0 transition-opacity ${
          enabled ? 'opacity-100' : 'opacity-30'
        }`}
        style={{ backgroundColor: criterion.color }}
      />
      <span
        className={`text-xs font-mono flex-1 truncate ${
          enabled ? 'text-slate-200' : 'text-slate-500'
        }`}
      >
        {criterion.shortLabel}
      </span>
      <span
        className={`text-[10px] font-mono ${
          enabled ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        {criterion.weight.toFixed(1)}
      </span>
    </button>
  );
}
