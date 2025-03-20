export type ContentType = 'paper' | 'guideline' | 'news' | 'meta' | 'case';

export type EvidenceLevel = 'high' | 'moderate' | 'low';

export type RecencyFilter = 'recent' | 'all';

export type ReadingTimeFilter = 'short' | 'medium' | 'long';

export interface FilterOptions {
  evidenceLevel: EvidenceLevel[];
  recency: RecencyFilter | null;
  specialty: string[];
  source: string[];
  readingTime: ReadingTimeFilter | null;
}

export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  source: string;
  publicationDate: string;
  contentType: ContentType;
  evidenceLevel: EvidenceLevel;
  specialty: string[];
  abstract: string;
  keyPoints: string[];
  url: string;
  citationCount: number;
  readingTimeMinutes: number;
}

export interface SavedItem extends SearchResult {
  dateAdded: string;
  notes?: string;
  highlights?: SavedHighlight[];
  collectionIds: string[];
}

export interface SavedHighlight {
  id: string;
  text: string;
  position: number;
  note?: string;
}

export interface UserCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
  itemIds: string[];
  isShared: boolean;
  collaboratorIds: string[];
}

export interface TabCounts {
  all?: number;
  paper?: number;
  guideline?: number;
  news?: number;
  meta?: number;
  case?: number;
}

export interface APISearchParams {
  query: string;
  filters?: Partial<FilterOptions>;
  page?: number;
  limit?: number;
}

export interface APISearchResponse {
  results: SearchResult[];
  totalCount: number;
  hasMore: boolean;
  errors?: string[];
} 