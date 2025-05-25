'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateContent } from '@/lib/gemini';
import GeminiResponse from '@/components/ui/GeminiResponse';

export default function WritingToolPage() {
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'blog',
    tone: 'professional',
    wordCount: '500',
    keywords: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contentTypes = [
    { value: 'blog', label: 'Blog Post' },
    { value: 'article', label: 'Article' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media Post' },
    { value: 'ad', label: 'Advertisement' },
    { value: 'product', label: 'Product Description' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'formal', label: 'Formal' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    setIsLoading(true);
    
    try {
      // Call the Gemini API to generate content
      const content = await generateContent(formData);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent(`# Error Generating Content\n\nSorry, I encountered an error while generating content for "${formData.topic}". Please try again with a different topic or parameters.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      topic: '',
      contentType: 'blog',
      tone: 'professional',
      wordCount: '500',
      keywords: ''
    });
    setGeneratedContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Writing Tool</h1>
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
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Content Parameters</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic or Title</label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="Enter the main topic or title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content Type</label>
                    <select
                      id="contentType"
                      name="contentType"
                      value={formData.contentType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {contentTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tone</label>
                    <select
                      id="tone"
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {tones.map((tone) => (
                        <option key={tone.value} value={tone.value}>{tone.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Approximate Word Count</label>
                  <select
                    id="wordCount"
                    name="wordCount"
                    value={formData.wordCount}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="300">Short (~300 words)</option>
                    <option value="500">Medium (~500 words)</option>
                    <option value="1000">Long (~1000 words)</option>
                    <option value="1500">Very Long (~1500 words)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords (optional, comma separated)</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    placeholder="Enter keywords to include in the content"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Clear
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !formData.topic.trim()}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Generating...' : 'Generate Content'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Output Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Generated Content</h2>
              
              <GeminiResponse 
                content={generatedContent} 
                isLoading={isLoading} 
                className="h-[500px]" 
              />
              
              {generatedContent && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      alert('Content copied to clipboard!');
                    }}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}