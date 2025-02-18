export interface Article {
  id: string;
  url?: string;
  content: string;
  prediction: 'real' | 'fake';
  confidence: number;
  created_at: string;
  keywords: string[];
  credibility_score?: number;
}

export interface AnalysisResult {
  prediction: 'real' | 'fake';
  confidence: number;
  keywords: string[];
  credibility_score?: number;
}

export interface TrendingArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  credibility_score: number;
  published_at: string;
  analysis_count: number;
}