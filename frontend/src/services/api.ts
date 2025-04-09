const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export async function fetchFromAPI<T>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<T> {
  try {
    console.log(`Making ${options.method || 'GET'} request to ${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 