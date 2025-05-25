'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateSummary } from '@/lib/gemini';
import GeminiResponse from '@/components/ui/GeminiResponse';

export default function SummarizerPage() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState({ original: 0, summarized: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    
    // Calculate original word count
    const originalCount = content.trim().split(/\s+/).length;
    
    try {
      // Call the Gemini API to generate summary
      const generatedSummary = await generateSummary(content);
      
      // Calculate summarized word count
      const summarizedCount = generatedSummary.trim().split(/\s+/).length;
      
      setSummary(generatedSummary);
      setWordCount({
        original: originalCount,
        summarized: summarizedCount
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary. Please try again with different content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setSummary('');
    setWordCount({ original: 0, summarized: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Summarizer</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Original Content</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="Paste your article, document, or any text content here..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Clear
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !content.trim()}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Summarizing...' : 'Summarize'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Output Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Summary</h2>
              
              <GeminiResponse 
                content={summary} 
                isLoading={isLoading} 
                className="min-h-[300px]" 
              />
              
              {summary && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Original: {wordCount.original} words</span>
                    <span>Summary: {wordCount.summarized} words</span>
                    <span>Reduction: {Math.round((1 - wordCount.summarized / wordCount.original) * 100)}%</span>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(summary);
                        alert('Summary copied to clipboard!');
                      }}
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}