export type CatalogEntProfile = 'all' | 'fizmat' | 'biohim' | 'humanities';

export interface CatalogProgram {
  id: string;
  region: string;
  city: string;
  universityId: string;
  universityName: string;
  programCode: string;
  programName: string;
  degree: string;
  duration: string;
  languages: string[];
  grantCount: number;
  passingScore: number;
  entProfile: CatalogEntProfile;
  profileSubjects: string[];
}

export interface CatalogFiltersState {
  search: string;
  selectedRegions: string[];
  entProfile: CatalogEntProfile;
  maxPassingScore: number;
}
