import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { CACHE_CONFIGS, getCacheHeaders } from '@/lib/cache';

const PUBLIC_PHIM_MOI = getSecret('PUBLIC_PHIM_MOI');

export const GET: APIRoute = async ({ params, request }) => {
  const { typeList } = params;
  
  if (!typeList) {
    return new Response(JSON.stringify({ error: 'Missing typeList parameter' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    
    // Build API URL
    const apiUrl = new URL(`/v1/api/danh-sach/${typeList}`, PUBLIC_PHIM_MOI);
    
    // Add default params
    const defaultParams = {
      page: '1',
      sort_type: 'desc',
      limit: '10',
    };

    // Merge default params with query params
    const finalParams: Record<string, string> = { ...defaultParams };
    for (const [key, value] of searchParams.entries()) {
      finalParams[key] = value;
    }

    // Set search params
    apiUrl.search = new URLSearchParams(finalParams).toString();

    const response = await fetch(apiUrl.toString(), {
      cache: 'force-cache',
      headers: getCacheHeaders(CACHE_CONFIGS.SECTION_DATA),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      items: data.data?.items || [],
      totalPages: data.data?.params?.pagination?.totalPages || 1,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...getCacheHeaders(CACHE_CONFIGS.SECTION_DATA),
      },
    });

  } catch (error) {
    console.error(`Error fetching ${typeList}:`, error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch data',
      items: [] 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};