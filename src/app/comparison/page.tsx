import { Suspense } from 'react';
import ChartLayout from '@/components/ChartLayout';
import ComparisonView from '@/components/ComparisonView';

export default function ComparisonPage() {
  return (
    <ChartLayout>
      <Suspense fallback={<div className="animate-pulse bg-slate-800/40 rounded-xl h-96" />}>
        <ComparisonView />
      </Suspense>
    </ChartLayout>
  );
}
