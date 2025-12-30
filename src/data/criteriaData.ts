// Multi-study harm criteria definitions and scores
// Studies: UK 2010 (Nutt et al.), Australia 2019 (Bonomo et al.), New Zealand 2023 (Crossin et al.)

// =============================================================================
// TYPES
// =============================================================================

// UK 2010 & Australia 2019 share the same 9 harm-to-users criteria
export type UKUserCriteriaKey =
  | 'drugSpecificMortality'
  | 'drugRelatedMortality'
  | 'drugSpecificDamage'
  | 'drugRelatedDamage'
  | 'dependence'
  | 'drugSpecificMentalImpairment'
  | 'drugRelatedMentalImpairment'
  | 'lossOfTangibles'
  | 'lossOfRelationships';

// UK 2010 & Australia 2019 share the same 7 harm-to-others criteria
export type UKOthersCriteriaKey =
  | 'injury'
  | 'crime'
  | 'environmentalDamage'
  | 'familyAdversities'
  | 'internationalDamage'
  | 'economicCost'
  | 'community';

// NZ 2023 has modified harm-to-users criteria
export type NZUserCriteriaKey =
  | 'drugSpecificMortality'
  | 'drugRelatedMortality'
  | 'drugSpecificDamage'
  | 'drugRelatedDamage'
  | 'dependence'
  | 'mentalImpairment' // Combined drug-specific and drug-related
  | 'lossOfTangibles'
  | 'lossOfRelationships'
  | 'nonPhysicalSpiritualDamage'; // New criterion

// NZ 2023 has modified harm-to-others criteria (added intergenerational harm)
export type NZOthersCriteriaKey =
  | 'injury'
  | 'crime'
  | 'environmentalDamage'
  | 'familyAdversities'
  | 'internationalDamage'
  | 'economicCost'
  | 'community'
  | 'intergenerationalHarm'; // New criterion

// Combined types
export type UKCriteriaKey = UKUserCriteriaKey | UKOthersCriteriaKey;
export type NZCriteriaKey = NZUserCriteriaKey | NZOthersCriteriaKey;

// Union type for all possible criteria keys
export type CriteriaKey = UKCriteriaKey | NZCriteriaKey;

export type StudyId = 'uk2010' | 'australia2019' | 'newzealand2023' | 'europe2015';

export interface CriteriaMetadata {
  key: CriteriaKey;
  label: string;
  shortLabel: string;
  description: string;
  weight: number;
  color: string;
}

export interface DrugCategory {
  category: 'opioid' | 'stimulant' | 'depressant' | 'cannabinoid' | 'dissociative' | 'psychedelic' | 'other';
}

// =============================================================================
// UK 2010 CRITERIA & DATA (Nutt et al. - The Lancet)
// =============================================================================

export const ukUserCriteriaMetadata: CriteriaMetadata[] = [
  {
    key: 'drugSpecificMortality',
    label: 'Drug-specific mortality',
    shortLabel: 'Mortality (direct)',
    description: 'Intrinsic lethality expressed as ratio of lethal dose to standard dose',
    weight: 5.1,
    color: '#dc2626',
  },
  {
    key: 'drugRelatedMortality',
    label: 'Drug-related mortality',
    shortLabel: 'Mortality (related)',
    description: 'Life shortened by drug use (accidents, cancers, HIV, suicide)',
    weight: 6.4,
    color: '#ef4444',
  },
  {
    key: 'drugSpecificDamage',
    label: 'Drug-specific damage',
    shortLabel: 'Physical (direct)',
    description: 'Direct physical damage (cirrhosis, seizures, strokes, cardiomyopathy)',
    weight: 4.1,
    color: '#f97316',
  },
  {
    key: 'drugRelatedDamage',
    label: 'Drug-related damage',
    shortLabel: 'Physical (related)',
    description: 'Indirect physical damage (blood-borne viruses, cutting agents, emphysema)',
    weight: 4.1,
    color: '#fb923c',
  },
  {
    key: 'dependence',
    label: 'Dependence',
    shortLabel: 'Dependence',
    description: 'Propensity to continue use despite adverse consequences',
    weight: 5.7,
    color: '#eab308',
  },
  {
    key: 'drugSpecificMentalImpairment',
    label: 'Drug-specific mental impairment',
    shortLabel: 'Mental (direct)',
    description: 'Direct mental effects (psychosis, intoxication)',
    weight: 5.7,
    color: '#a855f7',
  },
  {
    key: 'drugRelatedMentalImpairment',
    label: 'Drug-related mental impairment',
    shortLabel: 'Mental (related)',
    description: 'Secondary mental effects (mood disorders from lifestyle)',
    weight: 5.7,
    color: '#c084fc',
  },
  {
    key: 'lossOfTangibles',
    label: 'Loss of tangibles',
    shortLabel: 'Loss tangibles',
    description: 'Loss of income, housing, job, educational achievements, criminal record',
    weight: 4.5,
    color: '#ec4899',
  },
  {
    key: 'lossOfRelationships',
    label: 'Loss of relationships',
    shortLabel: 'Loss relationships',
    description: 'Loss of family and friend relationships',
    weight: 4.5,
    color: '#f472b6',
  },
];

export const ukOthersCriteriaMetadata: CriteriaMetadata[] = [
  {
    key: 'injury',
    label: 'Injury',
    shortLabel: 'Injury',
    description: 'Physical harm caused to others by drug users (violence, accidents)',
    weight: 4.2,
    color: '#0ea5e9',
  },
  {
    key: 'crime',
    label: 'Crime',
    shortLabel: 'Crime',
    description: 'Drug-related crime (acquisitive crime, drug dealing)',
    weight: 4.2,
    color: '#06b6d4',
  },
  {
    key: 'environmentalDamage',
    label: 'Environmental damage',
    shortLabel: 'Environment',
    description: 'Local environmental damage (discarded needles, drug litter)',
    weight: 2.1,
    color: '#14b8a6',
  },
  {
    key: 'familyAdversities',
    label: 'Family adversities',
    shortLabel: 'Family harm',
    description: 'Effects on family cohesion, child welfare, neglect',
    weight: 4.7,
    color: '#10b981',
  },
  {
    key: 'internationalDamage',
    label: 'International damage',
    shortLabel: 'International',
    description: 'Contribution to international drug trade and related harms',
    weight: 2.1,
    color: '#22c55e',
  },
  {
    key: 'economicCost',
    label: 'Economic cost',
    shortLabel: 'Economic cost',
    description: 'Costs to healthcare, police, prisons, social services',
    weight: 4.2,
    color: '#84cc16',
  },
  {
    key: 'community',
    label: 'Community',
    shortLabel: 'Community',
    description: 'Effects on social cohesion, community decline',
    weight: 3.0,
    color: '#a3e635',
  },
];

// Combined UK criteria metadata
export const ukCriteriaMetadata: CriteriaMetadata[] = [
  ...ukUserCriteriaMetadata,
  ...ukOthersCriteriaMetadata,
];

export interface UKDrugCriteriaScores extends DrugCategory {
  drug: string;
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

// UK 2010 scores estimated from Figure 4 of Nutt et al.
export const ukDrugCriteriaScores: UKDrugCriteriaScores[] = [
  {
    drug: 'Alcohol',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 5,
    drugSpecificDamage: 5,
    drugRelatedDamage: 2,
    dependence: 4,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 2,
    // Harm to others
    injury: 7,
    crime: 6,
    environmentalDamage: 2,
    familyAdversities: 8,
    internationalDamage: 1,
    economicCost: 7,
    community: 6,
  },
  {
    drug: 'Heroin',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 5,
    drugRelatedMortality: 5,
    drugSpecificDamage: 3,
    drugRelatedDamage: 4,
    dependence: 5,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 3,
    lossOfTangibles: 3,
    lossOfRelationships: 3,
    // Harm to others
    injury: 3,
    crime: 7,
    environmentalDamage: 3,
    familyAdversities: 5,
    internationalDamage: 4,
    economicCost: 5,
    community: 5,
  },
  {
    drug: 'Crack Cocaine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 3,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 4,
    dependence: 5,
    drugSpecificMentalImpairment: 5,
    drugRelatedMentalImpairment: 4,
    lossOfTangibles: 5,
    lossOfRelationships: 4,
    // Harm to others
    injury: 4,
    crime: 7,
    environmentalDamage: 2,
    familyAdversities: 5,
    internationalDamage: 3,
    economicCost: 5,
    community: 5,
  },
  {
    drug: 'Methamphetamine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 3,
    drugSpecificDamage: 3,
    drugRelatedDamage: 3,
    dependence: 5,
    drugSpecificMentalImpairment: 5,
    drugRelatedMentalImpairment: 4,
    lossOfTangibles: 4,
    lossOfRelationships: 3,
    // Harm to others
    injury: 2,
    crime: 3,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 2,
    economicCost: 2,
    community: 2,
  },
  {
    drug: 'Cocaine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 1,
    // Harm to others
    injury: 2,
    crime: 4,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 4,
    economicCost: 3,
    community: 2,
  },
  {
    drug: 'Tobacco',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 6,
    drugSpecificDamage: 4,
    drugRelatedDamage: 2,
    dependence: 4,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 1,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 5,
    community: 0,
  },
  {
    drug: 'Amphetamine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 1,
    crime: 3,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 2,
    economicCost: 2,
    community: 1,
  },
  {
    drug: 'Cannabis',
    category: 'cannabinoid',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 2,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 2,
    economicCost: 2,
    community: 1,
  },
  {
    drug: 'GHB',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 3,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 2,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'Benzodiazepines',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 2,
    community: 1,
  },
  {
    drug: 'Ketamine',
    category: 'dissociative',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 1,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 1,
    community: 1,
  },
  {
    drug: 'Methadone',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 3,
    drugRelatedMortality: 2,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 1,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 0,
    economicCost: 1,
    community: 1,
  },
  {
    drug: 'Mephedrone',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'Butane',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 4,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Khat',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 1,
    community: 1,
  },
  {
    drug: 'Anabolic Steroids',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'MDMA (Ecstasy)',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'LSD',
    category: 'psychedelic',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 0,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Buprenorphine',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Psilocybin Mushrooms',
    category: 'psychedelic',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 0,
    drugSpecificDamage: 0,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
];

// =============================================================================
// AUSTRALIA 2019 CRITERIA & DATA (Bonomo et al.)
// Uses same criteria structure as UK 2010
// =============================================================================

export const australiaUserCriteriaMetadata = ukUserCriteriaMetadata;
export const australiaOthersCriteriaMetadata = ukOthersCriteriaMetadata;
export const australiaCriteriaMetadata = ukCriteriaMetadata;

// Australia 2019 scores estimated from Figure 3 of Bonomo et al.
export const australiaDrugCriteriaScores: UKDrugCriteriaScores[] = [
  {
    drug: 'Alcohol',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 6,
    drugSpecificDamage: 6,
    drugRelatedDamage: 4,
    dependence: 4,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 3,
    lossOfTangibles: 4,
    lossOfRelationships: 4,
    // Harm to others
    injury: 8,
    crime: 5,
    environmentalDamage: 2,
    familyAdversities: 7,
    internationalDamage: 1,
    economicCost: 6,
    community: 5,
  },
  {
    drug: 'Crystal Meth',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 4,
    drugSpecificDamage: 5,
    drugRelatedDamage: 4,
    dependence: 5,
    drugSpecificMentalImpairment: 7,
    drugRelatedMentalImpairment: 6,
    lossOfTangibles: 5,
    lossOfRelationships: 4,
    // Harm to others
    injury: 5,
    crime: 6,
    environmentalDamage: 2,
    familyAdversities: 6,
    internationalDamage: 3,
    economicCost: 5,
    community: 5,
  },
  {
    drug: 'Heroin',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 10,
    drugRelatedMortality: 6,
    drugSpecificDamage: 5,
    drugRelatedDamage: 5,
    dependence: 5,
    drugSpecificMentalImpairment: 4,
    drugRelatedMentalImpairment: 3,
    lossOfTangibles: 4,
    lossOfRelationships: 3,
    // Harm to others
    injury: 3,
    crime: 6,
    environmentalDamage: 3,
    familyAdversities: 5,
    internationalDamage: 4,
    economicCost: 5,
    community: 4,
  },
  {
    drug: 'Fentanyls',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 15,
    drugRelatedMortality: 6,
    drugSpecificDamage: 5,
    drugRelatedDamage: 5,
    dependence: 5,
    drugSpecificMentalImpairment: 4,
    drugRelatedMentalImpairment: 3,
    lossOfTangibles: 4,
    lossOfRelationships: 3,
    // Harm to others
    injury: 2,
    crime: 5,
    environmentalDamage: 2,
    familyAdversities: 4,
    internationalDamage: 4,
    economicCost: 4,
    community: 3,
  },
  {
    drug: 'Cigarettes',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 7,
    drugSpecificDamage: 4,
    drugRelatedDamage: 2,
    dependence: 4,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 2,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 6,
    community: 0,
  },
  {
    drug: 'Methadone',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 6,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 3,
    dependence: 4,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 3,
    lossOfRelationships: 2,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 1,
    economicCost: 2,
    community: 2,
  },
  {
    drug: 'Prescription Opioids',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 5,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 3,
    dependence: 4,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 1,
    economicCost: 3,
    community: 1,
  },
  {
    drug: 'Solvents & Fuels',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 6,
    drugRelatedMortality: 4,
    drugSpecificDamage: 4,
    drugRelatedDamage: 3,
    dependence: 3,
    drugSpecificMentalImpairment: 4,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 0,
    economicCost: 1,
    community: 2,
  },
  {
    drug: 'Synthetic Cannabis',
    category: 'cannabinoid',
    // Harm to users
    drugSpecificMortality: 4,
    drugRelatedMortality: 3,
    drugSpecificDamage: 3,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 4,
    drugRelatedMentalImpairment: 3,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 2,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 1,
    community: 2,
  },
  {
    drug: 'Amphetamine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 1,
    // Harm to others
    injury: 2,
    crime: 3,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 2,
    economicCost: 2,
    community: 2,
  },
  {
    drug: 'Cocaine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 3,
    drugSpecificDamage: 3,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 3,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 2,
    // Harm to others
    injury: 2,
    crime: 3,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 4,
    economicCost: 2,
    community: 2,
  },
  {
    drug: 'Buprenorphine',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 4,
    drugRelatedMortality: 3,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 1,
    // Harm to others
    injury: 0,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 0,
    economicCost: 1,
    community: 1,
  },
  {
    drug: 'Cannabis',
    category: 'cannabinoid',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 2,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 2,
    economicCost: 2,
    community: 1,
  },
  {
    drug: 'Benzodiazepines',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 2,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 0,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 2,
    community: 1,
  },
  {
    drug: 'GHB',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 3,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 2,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 2,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'PIEDs',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 3,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Ketamine',
    category: 'dissociative',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'Ecstasy',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Anti-Psychotics',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 1,
    drugRelatedMentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
  },
  {
    drug: 'LSD & Mushrooms',
    category: 'psychedelic',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 0,
    drugRelatedDamage: 1,
    dependence: 1,
    drugSpecificMentalImpairment: 2,
    drugRelatedMentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'ENDs',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 0,
    dependence: 1,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
  {
    drug: 'Kava',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 0,
    drugSpecificDamage: 1,
    drugRelatedDamage: 0,
    dependence: 0,
    drugSpecificMentalImpairment: 0,
    drugRelatedMentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
  },
];

// =============================================================================
// NEW ZEALAND 2023 CRITERIA & DATA (Crossin et al.)
// Modified criteria: combined mental impairment, added non-physical/spiritual
// Added intergenerational harm in harm-to-others
// =============================================================================

export const nzUserCriteriaMetadata: CriteriaMetadata[] = [
  {
    key: 'drugSpecificMortality',
    label: 'Drug-specific mortality',
    shortLabel: 'Mortality (direct)',
    description: 'Intrinsic lethality of the drug expressed as ratio of lethal dose to standard dose',
    weight: 5.0,
    color: '#dc2626',
  },
  {
    key: 'drugRelatedMortality',
    label: 'Drug-related mortality',
    shortLabel: 'Mortality (related)',
    description: 'Life shortened by drug use (road accidents, lung cancers, HIV, suicide)',
    weight: 6.0,
    color: '#ef4444',
  },
  {
    key: 'drugSpecificDamage',
    label: 'Drug-specific damage',
    shortLabel: 'Physical (direct)',
    description: 'Direct physical damage (cirrhosis, seizures, strokes, cardiomyopathy)',
    weight: 4.0,
    color: '#f97316',
  },
  {
    key: 'drugRelatedDamage',
    label: 'Drug-related damage',
    shortLabel: 'Physical (related)',
    description: 'Related physical damage including consequences of unwanted sexual activities, self-harm, blood-borne viruses',
    weight: 4.0,
    color: '#fb923c',
  },
  {
    key: 'dependence',
    label: 'Dependence',
    shortLabel: 'Dependence',
    description: 'Propensity to continue use despite adverse consequences',
    weight: 5.5,
    color: '#eab308',
  },
  {
    key: 'mentalImpairment',
    label: 'Impairment of mental functioning',
    shortLabel: 'Mental impairment',
    description: 'Drug-specific and drug-related impairment of mental functioning (psychosis, mood disorders)',
    weight: 6.0,
    color: '#a855f7',
  },
  {
    key: 'lossOfTangibles',
    label: 'Loss of tangibles',
    shortLabel: 'Loss tangibles',
    description: 'Loss of income, housing, job, educational achievements, criminal record',
    weight: 4.5,
    color: '#ec4899',
  },
  {
    key: 'lossOfRelationships',
    label: 'Loss of relationships',
    shortLabel: 'Loss relationships',
    description: 'Loss of relationship or connections with family/whānau, friends, social or community groups',
    weight: 4.5,
    color: '#f472b6',
  },
  {
    key: 'nonPhysicalSpiritualDamage',
    label: 'Non-physical/spiritual damage',
    shortLabel: 'Spiritual',
    description: 'Impacts on mana, reputation, identity, potential; reduced ability to fulfil cultural obligations',
    weight: 5.0,
    color: '#8b5cf6',
  },
];

export const nzOthersCriteriaMetadata: CriteriaMetadata[] = [
  {
    key: 'injury',
    label: 'Injury',
    shortLabel: 'Injury',
    description: 'Physical harm caused to others by drug users (violence, accidents)',
    weight: 4.0,
    color: '#0ea5e9',
  },
  {
    key: 'crime',
    label: 'Crime',
    shortLabel: 'Crime',
    description: 'Drug-related crime (acquisitive crime, drug dealing)',
    weight: 4.0,
    color: '#06b6d4',
  },
  {
    key: 'environmentalDamage',
    label: 'Environmental damage',
    shortLabel: 'Environment',
    description: 'Local environmental damage (discarded needles, drug litter)',
    weight: 2.0,
    color: '#14b8a6',
  },
  {
    key: 'familyAdversities',
    label: 'Family/whānau adversities',
    shortLabel: 'Family harm',
    description: 'Effects on family/whānau cohesion, child welfare, neglect',
    weight: 4.5,
    color: '#10b981',
  },
  {
    key: 'internationalDamage',
    label: 'International damage',
    shortLabel: 'International',
    description: 'Contribution to international drug trade and related harms',
    weight: 2.0,
    color: '#22c55e',
  },
  {
    key: 'economicCost',
    label: 'Economic cost',
    shortLabel: 'Economic cost',
    description: 'Costs to healthcare, police, prisons, social services',
    weight: 4.0,
    color: '#84cc16',
  },
  {
    key: 'community',
    label: 'Community',
    shortLabel: 'Community',
    description: 'Effects on social cohesion, community decline',
    weight: 3.0,
    color: '#a3e635',
  },
  {
    key: 'intergenerationalHarm',
    label: 'Intergenerational harm',
    shortLabel: 'Intergenerational',
    description: 'Harm passed on to future generations (trauma, addiction patterns, developmental effects)',
    weight: 4.5,
    color: '#65a30d',
  },
];

// Combined NZ criteria metadata
export const nzCriteriaMetadata: CriteriaMetadata[] = [
  ...nzUserCriteriaMetadata,
  ...nzOthersCriteriaMetadata,
];

export interface NZDrugCriteriaScores extends DrugCategory {
  drug: string;
  // Harm to users
  drugSpecificMortality: number;
  drugRelatedMortality: number;
  drugSpecificDamage: number;
  drugRelatedDamage: number;
  dependence: number;
  mentalImpairment: number;
  lossOfTangibles: number;
  lossOfRelationships: number;
  nonPhysicalSpiritualDamage: number;
  // Harm to others
  injury: number;
  crime: number;
  environmentalDamage: number;
  familyAdversities: number;
  internationalDamage: number;
  economicCost: number;
  community: number;
  intergenerationalHarm: number;
}

// NZ 2023 scores estimated from Figure 2 of Crossin et al.
export const nzDrugCriteriaScores: NZDrugCriteriaScores[] = [
  {
    drug: 'Alcohol',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 7,
    drugSpecificDamage: 5,
    drugRelatedDamage: 5,
    dependence: 4,
    mentalImpairment: 3,
    lossOfTangibles: 3,
    lossOfRelationships: 2,
    nonPhysicalSpiritualDamage: 2,
    // Harm to others
    injury: 8,
    crime: 5,
    environmentalDamage: 2,
    familyAdversities: 8,
    internationalDamage: 1,
    economicCost: 6,
    community: 5,
    intergenerationalHarm: 7,
  },
  {
    drug: 'Methamphetamine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 3,
    drugSpecificDamage: 4,
    drugRelatedDamage: 4,
    dependence: 6,
    mentalImpairment: 8,
    lossOfTangibles: 5,
    lossOfRelationships: 3,
    nonPhysicalSpiritualDamage: 3,
    // Harm to others
    injury: 6,
    crime: 7,
    environmentalDamage: 2,
    familyAdversities: 7,
    internationalDamage: 3,
    economicCost: 5,
    community: 5,
    intergenerationalHarm: 6,
  },
  {
    drug: 'Synthetic Cannabinoids',
    category: 'cannabinoid',
    // Harm to users
    drugSpecificMortality: 8,
    drugRelatedMortality: 4,
    drugSpecificDamage: 5,
    drugRelatedDamage: 4,
    dependence: 5,
    mentalImpairment: 6,
    lossOfTangibles: 4,
    lossOfRelationships: 2,
    nonPhysicalSpiritualDamage: 2,
    // Harm to others
    injury: 3,
    crime: 4,
    environmentalDamage: 1,
    familyAdversities: 4,
    internationalDamage: 2,
    economicCost: 3,
    community: 4,
    intergenerationalHarm: 3,
  },
  {
    drug: 'Tobacco',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 8,
    drugSpecificDamage: 5,
    drugRelatedDamage: 2,
    dependence: 5,
    mentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 2,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 6,
    community: 0,
    intergenerationalHarm: 4,
  },
  {
    drug: 'Non-prescription Opioids',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 8,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 4,
    dependence: 5,
    mentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 2,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 2,
    crime: 5,
    environmentalDamage: 2,
    familyAdversities: 4,
    internationalDamage: 3,
    economicCost: 4,
    community: 3,
    intergenerationalHarm: 4,
  },
  {
    drug: 'Illegal Fentanyls',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 10,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 4,
    dependence: 5,
    mentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 4,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 4,
    economicCost: 3,
    community: 2,
    intergenerationalHarm: 3,
  },
  {
    drug: 'Opioid Substitution Products',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 5,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 3,
    dependence: 4,
    mentalImpairment: 2,
    lossOfTangibles: 3,
    lossOfRelationships: 2,
    nonPhysicalSpiritualDamage: 1,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 0,
    economicCost: 2,
    community: 2,
    intergenerationalHarm: 3,
  },
  {
    drug: 'Prescription Opioids',
    category: 'opioid',
    // Harm to users
    drugSpecificMortality: 5,
    drugRelatedMortality: 4,
    drugSpecificDamage: 3,
    drugRelatedDamage: 3,
    dependence: 4,
    mentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 1,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 3,
    community: 1,
    intergenerationalHarm: 2,
  },
  {
    drug: 'Solvents & Fuels',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 6,
    drugRelatedMortality: 4,
    drugSpecificDamage: 5,
    drugRelatedDamage: 3,
    dependence: 2,
    mentalImpairment: 5,
    lossOfTangibles: 2,
    lossOfRelationships: 2,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 0,
    economicCost: 2,
    community: 2,
    intergenerationalHarm: 4,
  },
  {
    drug: 'Cannabis',
    category: 'cannabinoid',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 3,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    mentalImpairment: 4,
    lossOfTangibles: 3,
    lossOfRelationships: 2,
    nonPhysicalSpiritualDamage: 2,
    // Harm to others
    injury: 2,
    crime: 3,
    environmentalDamage: 1,
    familyAdversities: 3,
    internationalDamage: 2,
    economicCost: 3,
    community: 2,
    intergenerationalHarm: 3,
  },
  {
    drug: 'Benzodiazepines',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 2,
    drugRelatedMortality: 3,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    mentalImpairment: 2,
    lossOfTangibles: 2,
    lossOfRelationships: 1,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 2,
    environmentalDamage: 0,
    familyAdversities: 2,
    internationalDamage: 1,
    economicCost: 2,
    community: 1,
    intergenerationalHarm: 2,
  },
  {
    drug: 'Amphetamine-type Substances',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 3,
    mentalImpairment: 4,
    lossOfTangibles: 2,
    lossOfRelationships: 1,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 2,
    crime: 3,
    environmentalDamage: 1,
    familyAdversities: 2,
    internationalDamage: 2,
    economicCost: 2,
    community: 2,
    intergenerationalHarm: 2,
  },
  {
    drug: 'Cocaine',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 2,
    drugSpecificDamage: 2,
    drugRelatedDamage: 2,
    dependence: 2,
    mentalImpairment: 2,
    lossOfTangibles: 1,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 3,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 4,
    economicCost: 2,
    community: 1,
    intergenerationalHarm: 1,
  },
  {
    drug: 'GHB/GBL',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 3,
    drugRelatedMortality: 2,
    drugSpecificDamage: 1,
    drugRelatedDamage: 2,
    dependence: 1,
    mentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 2,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'Synthetic Cathinones',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 2,
    mentalImpairment: 2,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'ENDs/Vapes',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 0,
    dependence: 3,
    mentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 1,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 1,
    familyAdversities: 1,
    internationalDamage: 0,
    economicCost: 1,
    community: 0,
    intergenerationalHarm: 1,
  },
  {
    drug: 'Ketamine',
    category: 'dissociative',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 1,
    mentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 1,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'MDMA',
    category: 'stimulant',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 1,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 0,
    mentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 0,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'PIEDs',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 2,
    drugRelatedDamage: 0,
    dependence: 1,
    mentalImpairment: 1,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 1,
    crime: 1,
    environmentalDamage: 0,
    familyAdversities: 1,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'Nitrite-based Inhalants',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 1,
    drugRelatedMortality: 0,
    drugSpecificDamage: 1,
    drugRelatedDamage: 1,
    dependence: 0,
    mentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'Hallucinogens',
    category: 'psychedelic',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 1,
    drugSpecificDamage: 0,
    drugRelatedDamage: 1,
    dependence: 0,
    mentalImpairment: 2,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 1,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'Kava',
    category: 'depressant',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 0,
    drugSpecificDamage: 1,
    drugRelatedDamage: 0,
    dependence: 1,
    mentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
  {
    drug: 'Nitrous Oxide',
    category: 'other',
    // Harm to users
    drugSpecificMortality: 0,
    drugRelatedMortality: 0,
    drugSpecificDamage: 1,
    drugRelatedDamage: 0,
    dependence: 0,
    mentalImpairment: 0,
    lossOfTangibles: 0,
    lossOfRelationships: 0,
    nonPhysicalSpiritualDamage: 0,
    // Harm to others
    injury: 0,
    crime: 0,
    environmentalDamage: 0,
    familyAdversities: 0,
    internationalDamage: 0,
    economicCost: 0,
    community: 0,
    intergenerationalHarm: 0,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export type StudyCriteriaData = {
  userMetadata: CriteriaMetadata[];
  othersMetadata: CriteriaMetadata[];
  metadata: CriteriaMetadata[]; // Combined for backwards compatibility
  scores: (UKDrugCriteriaScores | NZDrugCriteriaScores)[];
  hasCriteriaBreakdown: boolean;
};

export function getCriteriaDataForStudy(studyId: StudyId): StudyCriteriaData {
  switch (studyId) {
    case 'uk2010':
      return {
        userMetadata: ukUserCriteriaMetadata,
        othersMetadata: ukOthersCriteriaMetadata,
        metadata: ukCriteriaMetadata,
        scores: ukDrugCriteriaScores,
        hasCriteriaBreakdown: true,
      };
    case 'australia2019':
      return {
        userMetadata: australiaUserCriteriaMetadata,
        othersMetadata: australiaOthersCriteriaMetadata,
        metadata: australiaCriteriaMetadata,
        scores: australiaDrugCriteriaScores,
        hasCriteriaBreakdown: true,
      };
    case 'newzealand2023':
      return {
        userMetadata: nzUserCriteriaMetadata,
        othersMetadata: nzOthersCriteriaMetadata,
        metadata: nzCriteriaMetadata,
        scores: nzDrugCriteriaScores,
        hasCriteriaBreakdown: true,
      };
    case 'europe2015':
      // Europe 2015 does not have criteria breakdown data available
      return {
        userMetadata: [],
        othersMetadata: [],
        metadata: [],
        scores: [],
        hasCriteriaBreakdown: false,
      };
    default:
      return {
        userMetadata: [],
        othersMetadata: [],
        metadata: [],
        scores: [],
        hasCriteriaBreakdown: false,
      };
  }
}

// Calculate harm to users for a drug
export function calculateUserHarm(
  scores: UKDrugCriteriaScores | NZDrugCriteriaScores,
  enabledCriteria?: Set<CriteriaKey>,
  studyId: StudyId = 'uk2010'
): number {
  if (studyId === 'newzealand2023') {
    const nzScores = scores as NZDrugCriteriaScores;
    const nzUserKeys: NZUserCriteriaKey[] = [
      'drugSpecificMortality',
      'drugRelatedMortality',
      'drugSpecificDamage',
      'drugRelatedDamage',
      'dependence',
      'mentalImpairment',
      'lossOfTangibles',
      'lossOfRelationships',
      'nonPhysicalSpiritualDamage',
    ];
    return nzUserKeys.reduce((sum, key) => {
      if (!enabledCriteria || enabledCriteria.has(key)) {
        return sum + (nzScores[key] ?? 0);
      }
      return sum;
    }, 0);
  }

  // UK and Australia use the same structure
  const ukScores = scores as UKDrugCriteriaScores;
  const ukUserKeys: UKUserCriteriaKey[] = [
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
  return ukUserKeys.reduce((sum, key) => {
    if (!enabledCriteria || enabledCriteria.has(key)) {
      return sum + (ukScores[key] ?? 0);
    }
    return sum;
  }, 0);
}

// Calculate harm to others for a drug
export function calculateOthersHarm(
  scores: UKDrugCriteriaScores | NZDrugCriteriaScores,
  enabledCriteria?: Set<CriteriaKey>,
  studyId: StudyId = 'uk2010'
): number {
  if (studyId === 'newzealand2023') {
    const nzScores = scores as NZDrugCriteriaScores;
    const nzOthersKeys: NZOthersCriteriaKey[] = [
      'injury',
      'crime',
      'environmentalDamage',
      'familyAdversities',
      'internationalDamage',
      'economicCost',
      'community',
      'intergenerationalHarm',
    ];
    return nzOthersKeys.reduce((sum, key) => {
      if (!enabledCriteria || enabledCriteria.has(key)) {
        return sum + (nzScores[key] ?? 0);
      }
      return sum;
    }, 0);
  }

  // UK and Australia use the same structure
  const ukScores = scores as UKDrugCriteriaScores;
  const ukOthersKeys: UKOthersCriteriaKey[] = [
    'injury',
    'crime',
    'environmentalDamage',
    'familyAdversities',
    'internationalDamage',
    'economicCost',
    'community',
  ];
  return ukOthersKeys.reduce((sum, key) => {
    if (!enabledCriteria || enabledCriteria.has(key)) {
      return sum + (ukScores[key] ?? 0);
    }
    return sum;
  }, 0);
}

// Calculate total harm (user + others)
export function calculateTotalHarm(
  scores: UKDrugCriteriaScores | NZDrugCriteriaScores,
  enabledCriteria?: Set<CriteriaKey>,
  studyId: StudyId = 'uk2010'
): number {
  return (
    calculateUserHarm(scores, enabledCriteria, studyId) +
    calculateOthersHarm(scores, enabledCriteria, studyId)
  );
}

// =============================================================================
// BACKWARDS COMPATIBILITY - Legacy exports for existing code
// =============================================================================

// Legacy type alias
export type DrugCriteriaScores = UKDrugCriteriaScores;

// Legacy exports - point to UK data for backwards compatibility
export const criteriaMetadata = ukCriteriaMetadata;
export const drugCriteriaScores = ukDrugCriteriaScores;
export const userCriteria = ukUserCriteriaMetadata;
export const othersCriteria = ukOthersCriteriaMetadata;
