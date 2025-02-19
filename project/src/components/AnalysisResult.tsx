import React from 'react';
import { AlertTriangle, CheckCircle, Share2 } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

export function AnalysisResult({ result }: Props) {
  const isReal = result.prediction === 'real';
  
  const handleShare = async () => {
    const text = `Fake News Analysis Result:\n` +
      `Verdict: ${isReal ? 'Real News' : 'Fake News'}\n` +
      `Confidence: ${result.confidence.toFixed(1)}%\n` +
      `Key Indicators: ${result.keywords.join(', ')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Analysis copied to clipboard');
    } catch {
      toast.error('Failed to copy analysis');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          {isReal ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-500" />
          )}
          <h2 className="text-2xl font-bold">
            {isReal ? 'Real News' : 'Fake News'}
          </h2>
        </div>
        
        <div className="mb-6">
          <div className="text-lg mb-2">Confidence Score</div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${
                isReal ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-600 mt-1">
            {result.confidence.toFixed(1)}%
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Indicators</h3>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        <Share2 className="w-5 h-5" />
        Share Analysis
      </button>
    </div>
  );
}