import { Plugin, SearchResponse } from '../types';

export async function searchPlugins(query: string = '', category: string = ''): Promise<SearchResponse> {
  const params = new URLSearchParams({ query, category });
  const response = await fetch(`/api/plugins/search?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to search plugins');
  return response.json();
}

export async function getPluginDetails(id: string): Promise<Plugin> {
  const response = await fetch(`/api/plugins/${id}`);
  if (!response.ok) throw new Error('Failed to fetch plugin details');
  return response.json();
}
