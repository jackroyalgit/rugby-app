'use client';

import { useState } from 'react';
import PlayerForm from '@/components/PlayerForm';
import { fetchFromAPI } from '@/services/api';

interface PlayerData {
  age: number;
  position: string;
  weight: number;
  height: number;
}

export default function PlayerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PlayerData) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      // In a real app, you would send this to your API
      // const response = await fetchFromAPI<{success: boolean}>('/api/players', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // For now, we'll just simulate an API call
      console.log('Submitting player data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Player information submitted successfully!');
    } catch (err) {
      setError('Failed to submit player information. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
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
        
        <PlayerForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
} 