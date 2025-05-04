import React, { useState, useEffect } from 'react';
import { Newspaper, History, ArrowLeft, Home, BarChart2, Search, Share2, Info, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { loadModels, analyzeText, extractTextFromUrl } from './lib/detector';
import { saveArticle, getArticleHistory, getTrendingNews } from './lib/storage';
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
  const [activeTab, setActiveTab] = useState('home');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Check screen size for mobile view
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Load models
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
      
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
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
      // Ensure the prediction is the correct type before setting state
      setResult({
        ...analysis,
        prediction: analysis.prediction as 'real' | 'fake'
      });
      setShowResult(true);

      // Save to database
      const article = await saveArticle({
        url,
        content: textToAnalyze,
        prediction: analysis.prediction as 'real' | 'fake',
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
    setActiveTab('home');
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'home') {
      setShowHistory(false);
      setShowResult(false);
    } else if (tab === 'history') {
      setShowHistory(true);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60" 
        style={{ 
          backgroundImage: 'url(/images/news-background.svg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} 
        aria-hidden="true"
      />
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Fake News Detector
              </h1>
            </div>
            {!isSmallScreen && (
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowResult(false);
                  setResult(null);
                  setInput('');
                  setActiveTab(showHistory ? 'home' : 'history');
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <History className="w-5 h-5" />
                {showHistory ? 'New Analysis' : 'History'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 flex-grow overflow-y-auto pb-20">
        {showHistory ? (
          <HistoryList articles={history} loading={historyLoading} />
        ) : loading ? (
          <LoadingAnimation />
        ) : showResult && result ? (
          <AnalysisResult result={result} />
        ) : (
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-5 md:p-6 z-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Newspaper className="w-5 h-5 text-indigo-600 mr-2" />
                Fake News Detector
              </h2>
              
              <div className="mb-4">
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="input"
                      className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter URL or paste article text..."
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <div className="h-full border-l border-gray-300 mx-1" />
                      <button 
                        onClick={() => setInput('')}
                        className="p-1 rounded-full hover:bg-gray-100 mr-1"
                        title="Clear input"
                      >
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !input}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Paste full text for best results</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setInput('https://example.com/sample-article');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Try a sample URL
                    </button>
                    <button 
                      onClick={() => {
                        setInput('Scientists have discovered a new renewable energy source that could revolutionize how we power our homes and vehicles. The breakthrough, published today in the journal Nature, demonstrates a highly efficient method of converting ambient heat into electricity using novel nanomaterials.');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Try sample text
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <TrendingNews articles={trending} loading={trendingLoading} />
          </div>
        )}
      </main>
      
      {isSmallScreen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <History className="w-6 h-6" />
              <span className="text-xs mt-1">History</span>
            </button>
            <button
              onClick={() => {
                if (activeTab !== 'info') {
                  toast.success('Fake News Detector v1.0', {
                    icon: <AlertTriangle className="w-5 h-5 text-indigo-600" />,
                    duration: 3000
                  });
                  setActiveTab('info');
                }
              }}
              className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'info' ? 'text-indigo-600' : 'text-gray-500'}`}
            >
              <Info className="w-6 h-6" />
              <span className="text-xs mt-1">About</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App