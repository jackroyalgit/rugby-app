const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 