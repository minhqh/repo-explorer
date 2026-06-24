import type { APIResponse, RepositoryData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const githubApi = {
  analyzeRepository: async (url: string): Promise<APIResponse<RepositoryData>> => {
    const response = await fetch(`${API_BASE_URL}/repository/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    return response.json();
  }
};