'use client';

import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../services/api';
import Link from 'next/link';

interface ApiResponse {
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApiMessage = async () => {
      try {
        const data = await fetchFromAPI<ApiResponse>('/api/hello');
        setMessage(data.message);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch from API');
        setLoading(false);
      }
    };

    getApiMessage();
  }, []);

  useEffect(() => {
    const testCORS = async () => {
      try {
        console.log('Testing CORS...');
        const response = await fetch('http://localhost:8888/api/test-cors');
        const data = await response.json();
        console.log('CORS test successful:', data);
      } catch (err) {
        console.error('CORS test failed:', err);
      }
    };
    
    testCORS();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Rugby App</h1>
        
        {loading ? (
          <p className="text-lg">Loading data from API...</p>
        ) : error ? (
          <p className="text-lg text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-2">API Response:</h2>
            <p className="text-gray-700">{message}</p>
          </div>
        )}
        
        <div className="mt-8">
          <Link 
            href="/player" 
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Player Information
          </Link>
        </div>
      </div>
    </main>
  );
}
