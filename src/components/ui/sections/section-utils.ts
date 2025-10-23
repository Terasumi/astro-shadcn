import type { Item, ResponseFlimType } from "@/types";
import { getSecret } from "astro:env/server";
import { CACHE_CONFIGS, getCacheHeaders } from "@/lib/cache";
import { getOptimizedSectionData, type SectionRequest } from "@/lib/api-service";

export type SectionLayout = "landscape" | "portrait";

export interface SectionConfig {
    key: string;
    title: string;
    subtitle: string;
    typeList: string;
    layout: SectionLayout;
    params: Record<string, string>;
}

export interface SectionData extends SectionConfig {
    items: Item[];
    error?: string;
}

const PUBLIC_PHIM_MOI = getSecret("PUBLIC_PHIM_MOI");

export function formatYear(item: Item) {
    if (!item?.year) return null;
    return String(item.year);
}

export async function getSectionData(config: SectionConfig): Promise<SectionData> {
    if (!PUBLIC_PHIM_MOI) {
        return { ...config, items: [], error: "Thiếu cấu hình API." };
    }

    const sectionRequest: SectionRequest = {
        key: config.key,
        typeList: config.typeList,
        params: config.params
    };

    try {
        const result = await getOptimizedSectionData(sectionRequest);
        return { 
            ...config, 
            items: result.items ?? [],
            error: result.error
        };
    } catch (error: any) {
        return {
            ...config,
            items: [],
            error: error?.message ?? "Không thể tải dữ liệu.",
        };
    }
}
