'use client';

import { useState } from 'react';
import PlayerForm from '@/components/PlayerForm';
import { fetchFromAPI } from '@/services/api';

interface PlayerData {
  age: number;
  position: string;
  weight: number;
  height: number;
  description: string;
}

export default function PlayerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (data: PlayerData) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    setAnalysis(null);
    setDebugInfo(null);
    
    try {
      console.log('Submitting data:', data);
      
      // Send data to your API
      const response = await fetchFromAPI<ApiResponse>('/api/players', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      console.log('API Response:', response);
      setDebugInfo(JSON.stringify(response, null, 2));
      
      if (response.success) {
        setMessage(response.message || 'Submission successful');
        
        // If there's an analysis, set it
        if (response.analysis) {
          setAnalysis(response.analysis);
        } else {
          setError('No analysis was returned from the API');
        }
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Failed to submit player information: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Rugby Player Information
        </h1>
        
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <PlayerForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          {analysis ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-black">AI Analysis</h2>
              <div className="prose text-black whitespace-pre-line">
                {analysis}
              </div>
            </div>
          ) : debugInfo && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Debug Information</h2>
              <pre className="text-xs overflow-auto max-h-96 p-2 bg-gray-100 rounded">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 