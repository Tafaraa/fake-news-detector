import type { Article, TrendingArticle } from '../types';

// In-memory storage for development
const mockArticles: Article[] = [
  {
    id: '1',
    content: 'This is a sample article for testing',
    prediction: 'real',
    confidence: 85,
    created_at: new Date().toISOString(),
    keywords: ['sample', 'test', 'article', 'development', 'mock'],
    credibility_score: 0.8
  },
  {
    id: '2',
    content: 'Another sample article with fake news content',
    prediction: 'fake',
    confidence: 92,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    keywords: ['fake', 'news', 'sample', 'test', 'mock'],
    credibility_score: 0.3
  }
];

// Sample trending articles
const mockTrending: TrendingArticle[] = [
  {
    id: 't1',
    title: 'Scientists Discover New Renewable Energy Source',
    url: 'https://example.com/science/renewable-energy',
    source: 'Science Daily',
    credibility_score: 0.9,
    published_at: new Date().toISOString(),
    analysis_count: 245
  },
  {
    id: 't2',
    title: 'Global Markets Show Signs of Recovery',
    url: 'https://example.com/finance/markets-recovery',
    source: 'Financial Times',
    credibility_score: 0.85,
    published_at: new Date(Date.now() - 3600000).toISOString(),
    analysis_count: 189
  },
  {
    id: 't3',
    title: 'Celebrity Claims Aliens Visited Their Home',
    url: 'https://example.com/entertainment/celebrity-aliens',
    source: 'Entertainment Weekly',
    credibility_score: 0.2,
    published_at: new Date(Date.now() - 7200000).toISOString(),
    analysis_count: 523
  },
  {
    id: 't4',
    title: 'New Study Shows Benefits of Mediterranean Diet',
    url: 'https://example.com/health/mediterranean-diet',
    source: 'Health Journal',
    credibility_score: 0.75,
    published_at: new Date(Date.now() - 10800000).toISOString(),
    analysis_count: 127
  }
];

// Use localStorage to persist articles between sessions
const STORAGE_KEY = 'fake-news-detector-articles';

// Initialize from localStorage if available
try {
  const storedArticles = localStorage.getItem(STORAGE_KEY);
  if (storedArticles) {
    const parsed = JSON.parse(storedArticles);
    if (Array.isArray(parsed) && parsed.length > 0) {
      mockArticles.splice(0, mockArticles.length, ...parsed);
    }
  }
} catch (error) {
  console.error('Failed to load articles from localStorage:', error);
}

// Save to localStorage
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockArticles));
  } catch (error) {
    console.error('Failed to save articles to localStorage:', error);
  }
}

export async function saveArticle(article: Omit<Article, 'id' | 'created_at'>) {
  const newArticle: Article = {
    ...article,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  
  mockArticles.unshift(newArticle);
  saveToLocalStorage();
  
  return newArticle;
}

export async function getArticleHistory() {
  return mockArticles;
}

export async function getTrendingNews() {
  return mockTrending;
}
