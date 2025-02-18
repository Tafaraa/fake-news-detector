import React from 'react';
import { TrendingUp, ExternalLink, Shield, AlertTriangle, Newspaper } from 'lucide-react';
import type { TrendingArticle } from '../types';

interface Props {
  articles: TrendingArticle[];
  loading?: boolean;
}

export function TrendingNews({ articles, loading = false }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="w-3/4 h-5 bg-gray-200 rounded mb-2" />
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Trending Articles</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-green-500" />
            High Credibility
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Low Credibility
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
            className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">{article.source}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {new Date(article.published_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {article.credibility_score >= 0.7 ? (
                  <Shield className="w-5 h-5 text-green-500" />
                ) : article.credibility_score <= 0.3 ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : null}
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{article.analysis_count} analyses</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}