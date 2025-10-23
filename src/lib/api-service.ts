// Batched API service for optimized performance
import { getSecret } from "astro:env/server";
import { CACHE_CONFIGS, getCacheHeaders } from "./cache";
import type { Item } from "@/types";

export interface SectionRequest {
  key: string;
  typeList: string;
  params: Record<string, string>;
}

export interface SectionResponse {
  key: string;
  items: Item[];
  error?: string;
}

export interface BatchedResponse {
  sections: SectionResponse[];
}

const PUBLIC_PHIM_MOI = getSecret("PUBLIC_PHIM_MOI");

/**
 * Fetch multiple sections in a single API call
 */
export async function fetchBatchedSections(requests: SectionRequest[]): Promise<BatchedResponse> {
  if (!PUBLIC_PHIM_MOI) {
    return {
      sections: requests.map(req => ({
        key: req.key,
        items: [],
        error: "Thiếu cấu hình API."
      }))
    };
  }

  // For now, we'll make individual calls but with better caching
  // In the future, we could implement a batched endpoint on the API side
  const promises = requests.map(async (req) => {
    try {
      const requestUrl = new URL(`/v1/api/danh-sach/${req.typeList}`, PUBLIC_PHIM_MOI);
      const searchParams = new URLSearchParams(req.params);
      requestUrl.search = searchParams.toString();

      const response = await fetch(requestUrl.toString(), {
        cache: "force-cache",
        headers: getCacheHeaders(CACHE_CONFIGS.SECTION_DATA),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return {
        key: req.key,
        items: data.data?.items ?? [],
      };
    } catch (error: any) {
      return {
        key: req.key,
        items: [],
        error: error?.message ?? "Không thể tải dữ liệu.",
      };
    }
  });

  const sections = await Promise.all(promises);
  return { sections };
}

/**
 * Get section data with optimized caching
 */
export async function getOptimizedSectionData(config: SectionRequest): Promise<SectionResponse> {
  const result = await fetchBatchedSections([config]);
  return result.sections[0];
}