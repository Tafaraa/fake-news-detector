import type { TrendingArticle } from '../types';

// News API key - in production, this should be in an environment variable
// For local development, we'll use a placeholder
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'your-api-key-here';

// Base URL for News API
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Function to calculate a mock credibility score based on source and content
function calculateCredibilityScore(source: string, title: string, description: string): number {
  // This is a simplified mock algorithm - in a real app, you'd use ML or a more sophisticated approach
  // Higher tier news sources get a baseline boost
  const highCredibilitySources = [
    'bbc', 'reuters', 'associated press', 'ap', 'bloomberg', 'the economist',
    'financial times', 'wall street journal', 'wsj', 'new york times', 'washington post',
    'cnn', 'al jazeera', 'nation', 'standard', 'daily nation', 'business daily'
  ];
  
  // Calculate base score from source
  let score = 0.5; // Default middle score
  
  // Check if source is in high credibility list
  const sourceLower = source.toLowerCase();
  for (const credSource of highCredibilitySources) {
    if (sourceLower.includes(credSource)) {
      score += 0.2;
      break;
    }
  }
  
  // Check for clickbait patterns in title (simplified)
  const clickbaitPatterns = [
    'you won\'t believe', 'shocking', 'mind blowing', 'jaw dropping', 
    'amazing', 'incredible', 'unbelievable', '!!!!', '???', 'secret', 
    'they don\'t want you to know', 'this will change', 'never seen before'
  ];
  
  const titleAndDesc = (title + ' ' + (description || '')).toLowerCase();
  for (const pattern of clickbaitPatterns) {
    if (titleAndDesc.includes(pattern)) {
      score -= 0.15;
    }
  }
  
  // Ensure score is between 0.1 and 0.95
  return Math.max(0.1, Math.min(0.95, score));
}

// Function to transform NewsAPI article to our TrendingArticle format
function transformArticle(article: any, index: number): TrendingArticle {
  const credibilityScore = calculateCredibilityScore(
    article.source.name || '',
    article.title || '',
    article.description || ''
  );
  
  return {
    id: `news-${Date.now()}-${index}`,
    title: article.title || 'Untitled Article',
    url: article.url || '#',
    source: article.source.name || 'Unknown Source',
    credibility_score: credibilityScore,
    published_at: article.publishedAt || new Date().toISOString(),
    analysis_count: Math.floor(Math.random() * 500) + 50 // Mock data
  };
}

// Function to fetch global top headlines
export async function fetchGlobalNews(pageSize = 4): Promise<TrendingArticle[]> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?pageSize=${pageSize}&language=en`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch global news');
    }
    
    const data = await response.json();
    return data.articles.map(transformArticle);
  } catch (error) {
    console.error('Error fetching global news:', error);
    return getMockGlobalNews();
  }
}

// Function to fetch African news
export async function fetchAfricanNews(pageSize = 4): Promise<TrendingArticle[]> {
  try {
    // Using sources from major African news outlets
    // You can expand this list with more African news sources
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?pageSize=${pageSize}&country=za,ng,ke,eg,gh&language=en`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch African news');
    }
    
    const data = await response.json();
    return data.articles.map(transformArticle);
  } catch (error) {
    console.error('Error fetching African news:', error);
    return getMockAfricanNews();
  }
}

// Function to get all trending news (global and African)
export async function getAllTrendingNews(): Promise<{
  global: TrendingArticle[];
  african: TrendingArticle[];
}> {
  try {
    // Check if we need to refresh the cache
    const cachedNews = getCachedNews();
    if (cachedNews) {
      return cachedNews;
    }
    
    // Fetch both global and African news in parallel
    const [global, african] = await Promise.all([
      fetchGlobalNews(),
      fetchAfricanNews()
    ]);
    
    // Cache the results
    cacheNewsResults({ global, african });
    
    return { global, african };
  } catch (error) {
    console.error('Error fetching all trending news:', error);
    return {
      global: getMockGlobalNews(),
      african: getMockAfricanNews()
    };
  }
}

// Cache management
const CACHE_KEY = 'news-cache';
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

interface CachedNewsData {
  timestamp: number;
  global: TrendingArticle[];
  african: TrendingArticle[];
}

function getCachedNews(): { global: TrendingArticle[]; african: TrendingArticle[] } | null {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    
    const parsedData: CachedNewsData = JSON.parse(cachedData);
    const now = Date.now();
    
    // Check if cache is still valid (less than CACHE_DURATION old)
    if (now - parsedData.timestamp < CACHE_DURATION) {
      return {
        global: parsedData.global,
        african: parsedData.african
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading news cache:', error);
    return null;
  }
}

function cacheNewsResults(data: { global: TrendingArticle[]; african: TrendingArticle[] }): void {
  try {
    const cacheData: CachedNewsData = {
      timestamp: Date.now(),
      global: data.global,
      african: data.african
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching news results:', error);
  }
}

// Mock data for fallback
function getMockGlobalNews(): TrendingArticle[] {
  return [
    {
      id: 'global-1',
      title: 'Scientists Discover New Renewable Energy Source',
      url: 'https://example.com/science/renewable-energy',
      source: 'Science Daily',
      credibility_score: 0.9,
      published_at: new Date().toISOString(),
      analysis_count: 245
    },
    {
      id: 'global-2',
      title: 'Global Markets Show Signs of Recovery',
      url: 'https://example.com/finance/markets-recovery',
      source: 'Financial Times',
      credibility_score: 0.85,
      published_at: new Date(Date.now() - 3600000).toISOString(),
      analysis_count: 189
    },
    {
      id: 'global-3',
      title: 'New Study Shows Benefits of Mediterranean Diet',
      url: 'https://example.com/health/mediterranean-diet',
      source: 'Health Journal',
      credibility_score: 0.75,
      published_at: new Date(Date.now() - 10800000).toISOString(),
      analysis_count: 127
    },
    {
      id: 'global-4',
      title: 'Tech Giants Announce Collaboration on AI Ethics',
      url: 'https://example.com/tech/ai-ethics-collaboration',
      source: 'Tech Review',
      credibility_score: 0.8,
      published_at: new Date(Date.now() - 7200000).toISOString(),
      analysis_count: 312
    }
  ];
}

function getMockAfricanNews(): TrendingArticle[] {
  return [
    {
      id: 'africa-1',
      title: 'African Union Announces New Climate Initiative',
      url: 'https://example.com/africa/climate-initiative',
      source: 'African News Network',
      credibility_score: 0.87,
      published_at: new Date().toISOString(),
      analysis_count: 178
    },
    {
      id: 'africa-2',
      title: 'Kenya Leads in Renewable Energy Adoption',
      url: 'https://example.com/kenya/renewable-energy',
      source: 'Daily Nation',
      credibility_score: 0.82,
      published_at: new Date(Date.now() - 5400000).toISOString(),
      analysis_count: 145
    },
    {
      id: 'africa-3',
      title: "Nigeria's Tech Startup Ecosystem Continues to Grow",
      url: 'https://example.com/nigeria/tech-startups',
      source: 'Business Daily Africa',
      credibility_score: 0.78,
      published_at: new Date(Date.now() - 9000000).toISOString(),
      analysis_count: 203
    },
    {
      id: 'africa-4',
      title: 'South African Researchers Make Medical Breakthrough',
      url: 'https://example.com/southafrica/medical-research',
      source: 'Cape Times',
      credibility_score: 0.88,
      published_at: new Date(Date.now() - 12600000).toISOString(),
      analysis_count: 167
    }
  ];
}
