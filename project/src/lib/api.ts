import type { TrendingArticle } from '../types';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE = 'https://newsapi.org/v2';

export async function fetchTrendingNews(): Promise<TrendingArticle[]> {
  try {
    const apiUrl = import.meta.env.DEV 
      ? '/api/news/trending'
      : `${NEWS_API_BASE}/top-headlines?country=us&pageSize=10`;

    const headers: Record<string, string> = import.meta.env.DEV 
      ? {} 
      : { 'X-Api-Key': NEWS_API_KEY };

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      console.error('News API Error:', response.status, response.statusText);
      return getMockTrendingNews();
    }

    const data = await response.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format');
    }

    return data.articles.map((article: { [key: string]: unknown }) => ({
      id: article.url as string,
      title: (article.title as string) || 'Untitled',
      url: article.url as string,
      source: (article.source?.name as string) || 'Unknown Source',
      credibility_score: calculateCredibilityScore(article.source?.name as string),
      published_at: (article.publishedAt as string) || new Date().toISOString(),
      analysis_count: Math.floor(Math.random() * 1000)
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return getMockTrendingNews();
  }
}

function getMockTrendingNews(): TrendingArticle[] {
  return [
    {
      id: '1',
      title: 'Global Climate Summit Reaches Historic Agreement',
      url: 'https://example.com/climate-summit',
      source: 'Reuters',
      credibility_score: 0.95,
      published_at: new Date().toISOString(),
      analysis_count: 856
    },
    {
      id: '2',
      title: 'New Medical Breakthrough in Cancer Research',
      url: 'https://example.com/cancer-research',
      source: 'Nature',
      credibility_score: 0.95,
      published_at: new Date().toISOString(),
      analysis_count: 743
    },
    {
      id: '3',
      title: 'Tech Giants Announce AI Ethics Coalition',
      url: 'https://example.com/ai-ethics',
      source: 'The New York Times',
      credibility_score: 0.85,
      published_at: new Date().toISOString(),
      analysis_count: 621
    },
    {
      id: '4',
      title: 'Renewable Energy Surpasses Coal in Global Power Generation',
      url: 'https://example.com/renewable-energy',
      source: 'Bloomberg',
      credibility_score: 0.8,
      published_at: new Date().toISOString(),
      analysis_count: 534
    }
  ];
}

function calculateCredibilityScore(source: string): number {
  const reliableSources = new Map([
    ['Reuters', 0.95],
    ['Associated Press', 0.95],
    ['BBC News', 0.9],
    ['The New York Times', 0.85],
    ['The Washington Post', 0.85],
    ['The Guardian', 0.85],
    ['NPR', 0.85],
    ['Bloomberg', 0.8],
    ['The Wall Street Journal', 0.8],
    ['CNN', 0.75],
    ['NBC News', 0.75],
    ['CBS News', 0.75],
    ['ABC News', 0.75],
    ['USA Today', 0.7],
    ['Time', 0.7],
    ['The Atlantic', 0.7],
    ['Politico', 0.7],
    ['The Economist', 0.85],
    ['Scientific American', 0.9],
    ['Nature', 0.95],
    ['Science', 0.95]
  ]);

  return reliableSources.get(source) || 0.5;
}
