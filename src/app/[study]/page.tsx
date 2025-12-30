import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ChartLayout from '@/components/ChartLayout';
import SingleStudyView from '@/components/SingleStudyView';
import { studySlugToKey, studySlugs, type StudySlug } from '@/data/chartData';

interface StudyPageProps {
  params: Promise<{
    study: string;
  }>;
}

export function generateStaticParams() {
  return studySlugs.map((slug) => ({
    study: slug,
  }));
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { study } = await params;

  // Validate the study slug
  if (!studySlugs.includes(study as StudySlug)) {
    notFound();
  }

  const studyKey = studySlugToKey[study as StudySlug];

  return (
    <ChartLayout>
      <Suspense fallback={<div className="animate-pulse bg-slate-800/40 rounded-xl h-96" />}>
        <SingleStudyView studyKey={studyKey} />
      </Suspense>
    </ChartLayout>
  );
}
