'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateContent } from '@/lib/gemini';
import GeminiResponse from '@/components/ui/GeminiResponse';

export default function MessageGeneratorPage() {
  const [formData, setFormData] = useState({
    messageType: 'email',
    tone: 'formal',
    subject: '',
    context: '',
    recipient: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messageTypes = [
    { value: 'email', label: 'Email' },
    { value: 'text', label: 'Text Message' },
    { value: 'dm', label: 'Direct Message' },
  ];

  const tones = [
    { value: 'formal', label: 'Formal' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'apologetic', label: 'Apologetic' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'romantic', label: 'Romantic' },
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
    if (!formData.context.trim()) return;

    setIsLoading(true);
    
    try {
      const prompt = `Generate a ${formData.messageType} ${formData.subject ? `with subject: "${formData.subject}"` : ''} 
      in a ${formData.tone} tone for ${formData.recipient || 'the recipient'}.
      Context: ${formData.context}
      ${formData.messageType === 'email' ? 'Format the output in a professional email structure.' : 'Keep it concise and appropriate for the message type.'}`;

      const content = await generateContent({
        topic: prompt,
        contentType: formData.messageType,
        tone: formData.tone,
        wordCount: formData.messageType === 'email' ? '300' : '100',
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating message:', error);
      setGeneratedContent('Error generating message. Please try again with different parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      messageType: 'email',
      tone: 'formal',
      subject: '',
      context: '',
      recipient: '',
    });
    setGeneratedContent('');
  };

  const regenerateWithTone = async (newTone: string) => {
    setFormData(prev => ({ ...prev, tone: newTone }));
    if (!formData.context.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Generate a ${formData.messageType} ${formData.subject ? `with subject: "${formData.subject}"` : ''} 
      in a ${newTone} tone for ${formData.recipient || 'the recipient'}.
      Context: ${formData.context}
      ${formData.messageType === 'email' ? 'Format the output in a professional email structure.' : 'Keep it concise and appropriate for the message type.'}`;

      const content = await generateContent({
        topic: prompt,
        contentType: formData.messageType,
        tone: newTone,
        wordCount: formData.messageType === 'email' ? '300' : '100',
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error regenerating message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Message Draft Generator</h1>
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
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Message Parameters</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="messageType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message Type</label>
                    <select
                      id="messageType"
                      name="messageType"
                      value={formData.messageType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {messageTypes.map((type) => (
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

                {formData.messageType === 'email' && (
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject Line</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter email subject"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient (optional)</label>
                  <input
                    type="text"
                    id="recipient"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Enter recipient name or role"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message Context</label>
                  <textarea
                    id="context"
                    name="context"
                    value={formData.context}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the purpose and context of your message..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
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
                    disabled={isLoading || !formData.context.trim()}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Generating...' : 'Generate Message'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Output Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Generated Message</h2>
              
              <GeminiResponse 
                content={generatedContent} 
                isLoading={isLoading} 
                className="min-h-[300px]" 
              />
              
              {generatedContent && (
                <div className="space-y-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {tones.map(tone => (
                      <button
                        key={tone.value}
                        onClick={() => regenerateWithTone(tone.value)}
                        className={`px-3 py-1 text-xs rounded-full ${formData.tone === tone.value ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                        alert('Message copied to clipboard!');
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