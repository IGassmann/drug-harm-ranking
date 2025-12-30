'use client';

import { type CriteriaKey, type CriteriaMetadata } from '@/data/criteriaData';

interface CriteriaTogglesProps {
  userCriteriaMetadata: CriteriaMetadata[];
  othersCriteriaMetadata: CriteriaMetadata[];
  enabledCriteria: Set<CriteriaKey>;
  onToggle: (key: CriteriaKey) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectAllUser: () => void;
  onClearAllUser: () => void;
  onSelectAllOthers: () => void;
  onClearAllOthers: () => void;
}

export default function CriteriaToggles({
  userCriteriaMetadata,
  othersCriteriaMetadata,
  enabledCriteria,
  onToggle,
  onSelectAll,
  onClearAll,
  onSelectAllUser,
  onClearAllUser,
  onSelectAllOthers,
  onClearAllOthers,
}: CriteriaTogglesProps) {
  const userEnabledCount = userCriteriaMetadata.filter((c) => enabledCriteria.has(c.key)).length;
  const othersEnabledCount = othersCriteriaMetadata.filter((c) => enabledCriteria.has(c.key)).length;

  return (
    <div className="bg-slate-800/40 rounded-xl p-4 mb-6">
      {/* Header with global Select All / Clear All */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm font-semibold text-slate-300">Criteria Selection</h3>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="px-3 py-1 text-xs font-mono rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            className="px-3 py-1 text-xs font-mono rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Side-by-side columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Harm to Users Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-mono text-xs font-medium text-slate-400 uppercase tracking-wide">
              Harm to Users ({userEnabledCount}/{userCriteriaMetadata.length})
            </h4>
            <div className="flex gap-1">
              <button
                onClick={onSelectAllUser}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/60 text-slate-400 hover:bg-slate-600 hover:text-slate-300 transition-colors"
              >
                All
              </button>
              <button
                onClick={onClearAllUser}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/60 text-slate-400 hover:bg-slate-600 hover:text-slate-300 transition-colors"
              >
                None
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {userCriteriaMetadata.map((criterion) => (
              <CriteriaToggleItem
                key={criterion.key}
                criterion={criterion}
                enabled={enabledCriteria.has(criterion.key)}
                onToggle={() => onToggle(criterion.key)}
              />
            ))}
          </div>
        </div>

        {/* Harm to Others Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-mono text-xs font-medium text-slate-400 uppercase tracking-wide">
              Harm to Others ({othersEnabledCount}/{othersCriteriaMetadata.length})
            </h4>
            <div className="flex gap-1">
              <button
                onClick={onSelectAllOthers}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/60 text-slate-400 hover:bg-slate-600 hover:text-slate-300 transition-colors"
              >
                All
              </button>
              <button
                onClick={onClearAllOthers}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700/60 text-slate-400 hover:bg-slate-600 hover:text-slate-300 transition-colors"
              >
                None
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {othersCriteriaMetadata.map((criterion) => (
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
  criterion: CriteriaMetadata;
  enabled: boolean;
  onToggle: () => void;
}

function CriteriaToggleItem({ criterion, enabled, onToggle }: CriteriaToggleItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all text-left ${
        enabled ? 'bg-slate-700/60 hover:bg-slate-700' : 'bg-slate-800/40 hover:bg-slate-800/60 opacity-50'
      }`}
      title={criterion.description}
    >
      <div
        className={`w-3 h-3 rounded-sm flex-shrink-0 transition-opacity ${enabled ? 'opacity-100' : 'opacity-30'}`}
        style={{ backgroundColor: criterion.color }}
      />
      <span className={`text-xs font-mono flex-1 truncate ${enabled ? 'text-slate-200' : 'text-slate-500'}`}>
        {criterion.shortLabel}
      </span>
      <span className={`text-[10px] font-mono tabular-nums ${enabled ? 'text-slate-400' : 'text-slate-600'}`}>
        {criterion.weight.toFixed(1)}
      </span>
    </button>
  );
}
