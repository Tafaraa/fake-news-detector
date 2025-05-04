// Component imports
import { AlertTriangle, CheckCircle, ExternalLink, Calendar, History, Newspaper } from 'lucide-react';
import type { Article } from '../types';

interface Props {
  articles: Article[];
  loading?: boolean;
}

export function HistoryList({ articles, loading = false }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/95 backdrop-blur-sm rounded-lg shadow p-4 animate-pulse z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-24 h-3 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="text-right">
                <div className="w-20 h-4 bg-gray-200 rounded mb-2" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-2/3 h-4 bg-gray-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white/95 backdrop-blur-sm rounded-lg shadow z-10">
        <div className="text-gray-400 mb-3">
          <div className="relative">
            <Newspaper className="w-16 h-16 mx-auto text-indigo-100" />
            <History className="w-8 h-8 text-indigo-500 absolute bottom-0 right-1/2 translate-x-4" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Analysis History
        </h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          Articles you analyze will appear here. Start by analyzing your first article!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-white/95 backdrop-blur-sm rounded-lg shadow p-4 hover:shadow-md transition-shadow z-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {article.prediction === 'real' ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              )}
              <div>
                <div className="font-medium">
                  {article.url ? (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      {new URL(article.url).hostname}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    'Text Analysis'
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {article.confidence.toFixed(1)}% confidence
              </div>
              <div className="text-sm text-gray-500">
                {article.prediction.charAt(0).toUpperCase() + 
                 article.prediction.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-gray-700 text-sm line-clamp-2">
              {article.content}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs text-indigo-700 shadow-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}