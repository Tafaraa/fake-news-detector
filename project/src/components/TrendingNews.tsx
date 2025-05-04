// Component imports
import { TrendingUp, ExternalLink, Shield, AlertTriangle, Newspaper, Globe } from 'lucide-react';
import type { TrendingArticle } from '../types';

interface Props {
  articles: TrendingArticle[];
  loading?: boolean;
}

export function TrendingNews({ articles, loading = false }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/95 backdrop-blur-sm rounded-lg shadow p-4 animate-pulse z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="w-full">
                  <div className="w-3/4 h-5 bg-gray-200 rounded mb-2" />
                  <div className="flex gap-2">
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-32 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 bg-white/95 backdrop-blur-sm rounded-lg shadow z-10">
        <div className="text-gray-400 mb-3">
          <div className="relative">
            <Newspaper className="w-16 h-16 mx-auto text-indigo-100" />
            <TrendingUp className="w-8 h-8 text-indigo-500 absolute bottom-0 right-1/2 translate-x-4" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Trending News Available
        </h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          We're having trouble fetching the latest news. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Trending Articles</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
            <Shield className="w-4 h-4 text-green-500" />
            <span>High Credibility</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>Low Credibility</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/95 backdrop-blur-sm rounded-lg shadow p-4 hover:shadow-md transition-all border border-transparent hover:border-indigo-100 relative overflow-hidden group z-10"
          >
            {/* Credibility indicator */}
            <div 
              className={`absolute top-0 left-0 w-2 h-full ${article.credibility_score >= 0.7 ? 'bg-green-500' : article.credibility_score <= 0.3 ? 'bg-yellow-500' : 'bg-gray-300'}`}
            />
            
            <div className="flex items-start justify-between gap-3 pl-2">
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center flex-wrap gap-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{article.source}</span>
                  </div>
                  <span className="text-gray-400 hidden md:inline">•</span>
                  <span className="text-gray-500">
                    {new Date(article.published_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {article.credibility_score >= 0.7 ? (
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-500" />
                  </div>
                ) : article.credibility_score <= 0.3 ? (
                  <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                ) : null}
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{article.analysis_count} analyses</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}