import type { APIResponse, RepositoryData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const githubApi = {
  analyzeRepository: async (url: string): Promise<APIResponse<RepositoryData>> => {
    const token = localStorage.getItem('github_pat');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/repository/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
    });

    return response.json();
  },

  fetchMoreCommits: async (owner: string, repo: string, page: number): Promise<APIResponse<any[]>> => {
    const token = localStorage.getItem('github_pat');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/repository/commits?owner=${owner}&repo=${repo}&page=${page}`, {
      method: 'GET',
      headers,
    });
    return response.json();
  },
};


