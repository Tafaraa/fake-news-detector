import React, { useState, useEffect } from 'react';
import { Newspaper, History, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { loadModels, analyzeText, extractTextFromUrl, getTrendingNews } from './lib/detector';
import { saveArticle, getArticleHistory } from './lib/supabase';
import { AnalysisResult } from './components/AnalysisResult';
import { HistoryList } from './components/HistoryList';
import { LoadingAnimation } from './components/LoadingAnimation';
import { TrendingNews } from './components/TrendingNews';
import type { AnalysisResult as AnalysisResultType, Article, TrendingArticle } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [history, setHistory] = useState<Article[]>([]);
  const [trending, setTrending] = useState<TrendingArticle[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadModels().then(success => {
      if (!success) {
        toast.error('Failed to load AI models');
      }
    });
    
    // Load history
    getArticleHistory()
      .then(articles => {
        setHistory(articles);
        setHistoryLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load history');
        setHistoryLoading(false);
      });

    // Load trending news
    getTrendingNews()
      .then(articles => {
        setTrending(articles);
        setTrendingLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load trending news');
        setTrendingLoading(false);
      });
  }, []);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      let textToAnalyze = input;
      let url: string | undefined;

      if (input.startsWith('http')) {
        url = input;
        textToAnalyze = await extractTextFromUrl(input);
      }

      const analysis = await analyzeText(textToAnalyze);
      setResult(analysis);
      setShowResult(true);

      // Save to database
      const article = await saveArticle({
        url,
        content: textToAnalyze,
        prediction: analysis.prediction,
        confidence: analysis.confidence,
        keywords: analysis.keywords,
        credibility_score: analysis.credibility_score,
      });

      // Update history
      setHistory(prev => [article, ...prev]);
    } catch {
      toast.error('Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      setResult(null);
      setInput('');
    } else if (showHistory) {
      setShowHistory(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(showHistory || showResult) && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <Newspaper className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Fake News Detector
              </h1>
            </div>
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setShowResult(false);
                setResult(null);
                setInput('');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <History className="w-5 h-5" />
              {showHistory ? 'New Analysis' : 'History'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showHistory ? (
          <HistoryList articles={history} loading={historyLoading} />
        ) : loading ? (
          <LoadingAnimation />
        ) : showResult && result ? (
          <AnalysisResult result={result} />
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <label
                  htmlFor="input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter news article text or URL
                </label>
                <textarea
                  id="input"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste article text or URL here..."
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !input}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>

            <TrendingNews articles={trending} loading={trendingLoading} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App