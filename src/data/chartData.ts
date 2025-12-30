import { type StudyId } from './criteriaData';

// Data extracted from key MCDA studies - Harm to Users scores (normalized to 0-100 scale)
export const harmData = [
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

export type ChartStudyKey = 'nutt2010' | 'australia2019' | 'nz2023' | 'europe2015';

// URL-friendly slugs for routing
export type StudySlug = 'uk-2010' | 'australia-2019' | 'new-zealand-2023' | 'europe-2015';

export const studySlugToKey: Record<StudySlug, ChartStudyKey> = {
  'uk-2010': 'nutt2010',
  'australia-2019': 'australia2019',
  'new-zealand-2023': 'nz2023',
  'europe-2015': 'europe2015',
};

export const studyKeyToSlug: Record<ChartStudyKey, StudySlug> = {
  nutt2010: 'uk-2010',
  australia2019: 'australia-2019',
  nz2023: 'new-zealand-2023',
  europe2015: 'europe-2015',
};

export const studySlugs: StudySlug[] = ['uk-2010', 'australia-2019', 'new-zealand-2023', 'europe-2015'];

// Map chart study keys to StudyId
export const studyKeyToId: Record<ChartStudyKey, StudyId> = {
  nutt2010: 'uk2010',
  australia2019: 'australia2019',
  nz2023: 'newzealand2023',
  europe2015: 'europe2015',
};

export interface StudyInfo {
  name: string;
  fullName: string;
  journal: string;
  link: string;
  color: string;
  description: string;
}

export const studyInfo: Record<ChartStudyKey, StudyInfo> = {
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
