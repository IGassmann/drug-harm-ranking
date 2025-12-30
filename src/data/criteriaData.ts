// Harm criteria definitions and scores from Nutt et al. (2010) - The Lancet
// Scores estimated from Figure 4 of the original study

export type CriteriaKey =
  | 'drugSpecificMortality'
  | 'drugRelatedMortality'
  | 'drugSpecificDamage'
  | 'drugRelatedDamage'
  | 'dependence'
  | 'drugSpecificMentalImpairment'
  | 'drugRelatedMentalImpairment'
  | 'lossOfTangibles'
  | 'lossOfRelationships'
  | 'injury'
  | 'crime'
  | 'environmentalDamage'
  | 'familyAdversities'
  | 'internationalDamage'
  | 'economicCost'
  | 'community';

export interface CriteriaMetadata {
  key: CriteriaKey;
  label: string;
  shortLabel: string;
  description: string;
  weight: number;
  color: string;
  category: 'user' | 'others';
}

// Criteria metadata with colors and weights from the study
export const criteriaMetadata: CriteriaMetadata[] = [
  // Harm to Users (9 criteria, cumulative weight 46%)
  {
    key: 'drugSpecificMortality',
    label: 'Drug-specific mortality',
    shortLabel: 'Mortality (direct)',
    description: 'Intrinsic lethality expressed as ratio of lethal dose to standard dose',
    weight: 5.1,
    color: '#dc2626', // red-600
    category: 'user',
  },
  {
    key: 'drugRelatedMortality',
    label: 'Drug-related mortality',
    shortLabel: 'Mortality (related)',
    description: 'Life shortened by drug use (accidents, cancers, HIV, suicide)',
    weight: 6.4,
    color: '#ef4444', // red-500
    category: 'user',
  },
  {
    key: 'drugSpecificDamage',
    label: 'Drug-specific damage',
    shortLabel: 'Physical (direct)',
    description: 'Direct physical damage (cirrhosis, seizures, strokes, cardiomyopathy)',
    weight: 4.1,
    color: '#f97316', // orange-500
    category: 'user',
  },
  {
    key: 'drugRelatedDamage',
    label: 'Drug-related damage',
    shortLabel: 'Physical (related)',
    description: 'Indirect physical damage (blood-borne viruses, cutting agents, emphysema)',
    weight: 4.1,
    color: '#fb923c', // orange-400
    category: 'user',
  },
  {
    key: 'dependence',
    label: 'Dependence',
    shortLabel: 'Dependence',
    description: 'Propensity to continue use despite adverse consequences',
    weight: 5.7,
    color: '#eab308', // yellow-500
    category: 'user',
  },
  {
    key: 'drugSpecificMentalImpairment',
    label: 'Drug-specific mental impairment',
    shortLabel: 'Mental (direct)',
    description: 'Direct mental effects (psychosis, intoxication)',
    weight: 5.7,
    color: '#a855f7', // purple-500
    category: 'user',
  },
  {
    key: 'drugRelatedMentalImpairment',
    label: 'Drug-related mental impairment',
    shortLabel: 'Mental (related)',
    description: 'Secondary mental effects (mood disorders from lifestyle)',
    weight: 5.7,
    color: '#c084fc', // purple-400
    category: 'user',
  },
  {
    key: 'lossOfTangibles',
    label: 'Loss of tangibles',
    shortLabel: 'Loss tangibles',
    description: 'Loss of income, housing, job, educational achievements, criminal record',
    weight: 4.5,
    color: '#ec4899', // pink-500
    category: 'user',
  },
  {
    key: 'lossOfRelationships',
    label: 'Loss of relationships',
    shortLabel: 'Loss relationships',
    description: 'Loss of family and friend relationships',
    weight: 4.5,
    color: '#f472b6', // pink-400
    category: 'user',
  },
  // Harm to Others (7 criteria, cumulative weight 54%)
  {
    key: 'injury',
    label: 'Injury',
    shortLabel: 'Injury',
    description: 'Violence, traffic accidents, fetal harm, drug waste',
    weight: 11.5,
    color: '#3b82f6', // blue-500
    category: 'others',
  },
  {
    key: 'crime',
    label: 'Crime',
    shortLabel: 'Crime',
    description: 'Acquisitive crime volume at population level',
    weight: 10.2,
    color: '#60a5fa', // blue-400
    category: 'others',
  },
  {
    key: 'environmentalDamage',
    label: 'Environmental damage',
    shortLabel: 'Environment',
    description: 'Toxic waste, discarded needles, local pollution',
    weight: 3.8,
    color: '#10b981', // emerald-500
    category: 'others',
  },
  {
    key: 'familyAdversities',
    label: 'Family adversities',
    shortLabel: 'Family',
    description: 'Family breakdown, child neglect, economic/emotional wellbeing',
    weight: 8.9,
    color: '#06b6d4', // cyan-500
    category: 'others',
  },
  {
    key: 'internationalDamage',
    label: 'International damage',
    shortLabel: 'International',
    description: 'Deforestation, country destabilization, international crime',
    weight: 3.8,
    color: '#34d399', // emerald-400
    category: 'others',
  },
  {
    key: 'economicCost',
    label: 'Economic cost',
    shortLabel: 'Economic',
    description: 'Healthcare, police, prisons, social services, lost productivity',
    weight: 12.8,
    color: '#6366f1', // indigo-500
    category: 'others',
  },
  {
    key: 'community',
    label: 'Community',
    shortLabel: 'Community',
    description: 'Social cohesion decline, reputation damage',
    weight: 3.2,
    color: '#22d3ee', // cyan-400
    category: 'others',
  },
];

export const userCriteria = criteriaMetadata.filter((c) => c.category === 'user');
export const othersCriteria = criteriaMetadata.filter((c) => c.category === 'others');

// Per-drug scores on each criterion (estimated from Figure 4 of Nutt et al. 2010)
// These are weighted scores that sum to the total harm score shown in the paper
export interface DrugCriteriaScores {
  drug: string;
  category: 'opioid' | 'stimulant' | 'depressant' | 'cannabinoid' | 'dissociative' | 'psychedelic' | 'other';
  // Harm to users
  drugSpecificMortality: number;
  drugRelatedMortality: number;
  drugSpecificDamage: number;
  drugRelatedDamage: number;
  dependence: number;
  drugSpecificMentalImpairment: number;
  drugRelatedMentalImpairment: number;
  lossOfTangibles: number;
  lossOfRelationships: number;
  // Harm to others
  injury: number;
  crime: number;
  environmentalDamage: number;
  familyAdversities: number;
  internationalDamage: number;
  economicCost: number;
  community: number;
}

// Scores estimated from Figure 4 visual analysis
// Total scores match the paper: Alcohol=72, Heroin=55, Crack=54, etc.
export const drugCriteriaScores: DrugCriteriaScores[] = [
  {
    drug: 'Alcohol',
    category: 'depressant',
    // Harm to users (total ~26)
    drugSpecificMortality: 2,
    drugRelatedMortality: 5,
    drugSpecificDamage: 5,
    drugRelatedDamage: 2,
    dependence: 4,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 2,
    // Harm to others (total ~46)
    injury: 11,
    crime: 8,
    environmentalDamage: 1,
    familyAdversities: 8,
    internationalDamage: 1,
    economicCost: 14,
    community: 3,
  },
  {
    drug: 'Heroin',
    category: 'opioid',
    // Harm to users (total ~34)
    drugSpecificMortality: 5,
    drugRelatedMortality: 5,
    drugSpecificDamage: 3,
    drugRelatedDamage: 4,
    dependence: 5,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 3,
    lossOfTangibles: 3,
    lossOfRelationships: 3,
    // Harm to others (total ~21)
    injury: 3,
    crime: 6,
    environmentalDamage: 2,
    familyAdversities: 4,
    internationalDamage: 2,
    economicCost: 3,
    community: 1,
  },
  {
    drug: 'Crack Cocaine',
    category: 'stimulant',
    // Harm to users (total ~37)
    drugSpecificMortality: 3,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 4,
    dependence: 5,
    drugSpecificMentalImpairment: 5,
    drugRelatedMentalImpairment: 4,
    lossOfTangibles: 5,
    lossOfRelationships: 4,
    // Harm to others (total ~17)
    injury: 4,
    crime: 5,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 1,
    economicCost: 2,
    community: 1,
  },
  {
    drug: 'Methamphetamine',
    category: 'stimulant',
    // Harm to users (total ~32)
    drugSpecificMortality: 2,
    drugRelatedMortality: 3,
    drugSpecificDamage: 3,
    drugRelatedDamage: 3,
    dependence: 5,
    drugSpecificMentalImpairment: 5,
    drugRelatedMentalImpairment: 4,
    lossOfTangibles: 4,
    lossOfRelationships: 3,
    // Harm to others (total ~1)
    injury: 0,
    crime: 0,
    environmentalDamage: 1,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Cocaine',
    category: 'stimulant',
    // Harm to users (total ~17)
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 1,
    // Harm to others (total ~10)
    injury: 2,
    crime: 2,
    environmentalDamage: 0,
    familyAdversities: 2,
    internationalDamage: 2,
    economicCost: 1,
    community: 1,
  },
  {
    drug: 'Tobacco',
    category: 'other',
    // Harm to users (total ~20)
    drugSpecificMortality: 1,
    drugRelatedMortality: 6,
    drugSpecificDamage: 4,
    drugRelatedDamage: 2,
    dependence: 4,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others (total ~6)
    injury: 1,
    crime: 0,
    environmentalDamage: 1,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 3,
    community: 0,
  },
  {
    drug: 'Amphetamine',
    category: 'stimulant',
    // Harm to users (total ~17)
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others (total ~6)
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'Cannabis',
    category: 'cannabinoid',
    // Harm to users (total ~11)
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 2,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~9)
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 3,
    community: 1,
  },
  {
    drug: 'GHB',
    category: 'depressant',
    // Harm to users (total ~15)
    drugSpecificMortality: 3,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others (total ~4)
    injury: 2,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Benzodiazepines',
    category: 'depressant',
    // Harm to users (total ~10)
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~5)
    injury: 2,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'Ketamine',
    category: 'dissociative',
    // Harm to users (total ~12)
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~3)
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Methadone',
    category: 'opioid',
    // Harm to users (total ~11)
    drugSpecificMortality: 3,
    drugRelatedMortality: 2,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~3)
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Mephedrone',
    category: 'stimulant',
    // Harm to users (total ~10)
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~3)
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Butane',
    category: 'other',
    // Harm to users (total ~10)
    drugSpecificMortality: 4,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others (total ~1)
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Khat',
    category: 'stimulant',
    // Harm to users (total ~7)
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~2)
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'Anabolic Steroids',
    category: 'other',
    // Harm to users (total ~8)
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others (total ~2)
    injury: 1,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'MDMA (Ecstasy)',
    category: 'stimulant',
    // Harm to users (total ~7)
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others (total ~2)
    injury: 1,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'LSD',
    category: 'psychedelic',
    // Harm to users (total ~6)
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 0,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others (total ~1)
    injury: 1,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Buprenorphine',
    category: 'opioid',
    // Harm to users (total ~6)
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others (total ~1)
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Psilocybin Mushrooms',
    category: 'psychedelic',
    // Harm to users (total ~5)
    drugSpecificMortality: 0,
    drugRelatedMortality: 0,
    drugSpecificDamage: 0,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others (total ~1)
    injury: 1,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
];

// Helper to calculate total harm to users for a drug
export function calculateUserHarm(scores: DrugCriteriaScores, enabledCriteria?: Set<CriteriaKey>): number {
  const userKeys: CriteriaKey[] = [
    'drugSpecificMortality',
    'drugRelatedMortality',
    'drugSpecificDamage',
    'drugRelatedDamage',
    'dependence',
    'drugSpecificMentalImpairment',
    'drugRelatedMentalImpairment',
    'lossOfTangibles',
    'lossOfRelationships',
  ];

  return userKeys.reduce((sum, key) => {
    if (!enabledCriteria || enabledCriteria.has(key)) {
      return sum + scores[key];
    }
    return sum;
  }, 0);
}

// Helper to calculate total harm to others for a drug
export function calculateOthersHarm(scores: DrugCriteriaScores, enabledCriteria?: Set<CriteriaKey>): number {
  const othersKeys: CriteriaKey[] = [
    'injury',
    'crime',
    'environmentalDamage',
    'familyAdversities',
    'internationalDamage',
    'economicCost',
    'community',
  ];

  return othersKeys.reduce((sum, key) => {
    if (!enabledCriteria || enabledCriteria.has(key)) {
      return sum + scores[key];
    }
    return sum;
  }, 0);
}

// Helper to calculate total harm for a drug
export function calculateTotalHarm(scores: DrugCriteriaScores, enabledCriteria?: Set<CriteriaKey>): number {
  return calculateUserHarm(scores, enabledCriteria) + calculateOthersHarm(scores, enabledCriteria);
}
