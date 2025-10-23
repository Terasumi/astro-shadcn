import type { Item, ResponseFlimType } from "@/types";
import { getSecret } from "astro:env/server";
import { CACHE_CONFIGS, getCacheHeaders } from "@/lib/cache";

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

    const requestUrl = new URL(`/v1/api/danh-sach/${config.typeList}`, PUBLIC_PHIM_MOI);
    const searchParams = new URLSearchParams(config.params);
    requestUrl.search = searchParams.toString();

    try {
        const response = await fetch(requestUrl.toString(), {
            cache: "force-cache",
            headers: getCacheHeaders(CACHE_CONFIGS.SECTION_DATA),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return { ...config, items: data.data?.items ?? [] };
    } catch (error: any) {
        return {
            ...config,
            items: [],
            error: error?.message ?? "Không thể tải dữ liệu.",
        };
    }
}
