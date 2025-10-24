export type WsrvFit =
    | "cover"
    | "contain"
    | "inside"
    | "outside";

export type WsrvOutput = "webp" | "jpeg" | "png" | "avif";

export interface WsrvOptions {
    width?: number;
    height?: number;
    dpr?: number;
    fit?: WsrvFit;
    containBackground?: string;
    withoutEnlargement?: boolean;
    align?: string;
    crop?: string;
    preCrop?: string;
    trim?: boolean | string;
    mask?: string;
    maskTrim?: boolean;
    maskBackground?: string;
    flip?: boolean;
    flop?: boolean;
    rotation?: number;
    rotationBackground?: string;
    background?: string;
    blur?: number;
    sharpen?: number;
    contrast?: number;
    filter?: string;
    gamma?: number;
    modulate?: string;
    saturation?: number;
    hue?: number;
    tint?: string;
    adaptiveFilter?: boolean;
    output?: WsrvOutput;
    quality?: number;
    cacheMaxAge?: number;
    compressionLevel?: number;
    lossless?: boolean;
    defaultImage?: string;
    filename?: string;
    interlace?: boolean;
    pages?: number;
    page?: number;
    extraParams?: Record<string, string | number | boolean | null | undefined>;
}

export interface WsrvSrcSetVariant extends WsrvOptions {
    descriptor?: string;
}

const BASE_URL = "https://wsrv.nl/?url=";
const IMAGE_ORIGIN = "https://phimimg.com/";

/**
 * Builds a wsrv.nl image URL with sensible defaults for AstroFilm assets.
 * Accepts relative paths returned by PhimAPI or absolute URLs.
 */
export function wsrv(source: string | null | undefined, options: WsrvOptions = {}) {
    if (!source) {
        return null;
    }

    const normalizedSource = source.startsWith("http")
        ? source
        : `${IMAGE_ORIGIN}${source.replace(/^\/+/, "")}`;

    const params = new URLSearchParams();

    const setParam = (key: string, value: string | number | boolean | null | undefined) => {
        if (value === undefined || value === null) return;
        if (typeof value === "boolean") {
            if (value) params.set(key, "true");
            return;
        }
        params.set(key, String(value));
    };

    setParam("w", options.width);
    setParam("h", options.height);
    setParam("dpr", options.dpr);
    setParam("fit", options.fit ?? "cover");
    setParam("cbg", options.containBackground);
    if (options.withoutEnlargement) {
        params.set("we", "true");
    }
    setParam("a", options.align);
    setParam("crop", options.crop);
    setParam("precrop", options.preCrop);
    if (options.trim !== undefined) {
        setParam("trim", options.trim === true ? "auto" : options.trim);
    }
    setParam("mask", options.mask);
    if (options.maskTrim) {
        params.set("mtrim", "true");
    }
    setParam("mbg", options.maskBackground);
    if (options.flip) {
        params.set("flip", "true");
    }
    if (options.flop) {
        params.set("flop", "true");
    }
    setParam("ro", options.rotation);
    setParam("rbg", options.rotationBackground);
    setParam("bg", options.background);
    setParam("blur", options.blur);
    setParam("sharp", options.sharpen);
    setParam("con", options.contrast);
    setParam("filt", options.filter);
    setParam("gam", options.gamma);
    setParam("mod", options.modulate);
    setParam("sat", options.saturation);
    setParam("hue", options.hue);
    setParam("tint", options.tint);
    if (options.adaptiveFilter) {
        params.set("af", "true");
    }
    setParam("output", options.output ?? "webp");
    setParam("q", options.quality);
    setParam("maxage", options.cacheMaxAge);
    setParam("l", options.compressionLevel);
    if (options.lossless) {
        params.set("ll", "true");
    }
    setParam("default", options.defaultImage);
    setParam("filename", options.filename);
    if (options.interlace) {
        params.set("il", "true");
    }
    setParam("n", options.pages);
    setParam("page", options.page);

    if (options.extraParams) {
        Object.entries(options.extraParams).forEach(([key, value]) => {
            setParam(key, value);
        });
    }

    const query = params.toString();
    return `${BASE_URL}${encodeURIComponent(normalizedSource)}${query ? `&${query}` : ""}`;
}

export function wsrvSrcSet(source: string | null | undefined, variants: WsrvSrcSetVariant[]) {
    if (!source) {
        return null;
    }

    const entries = variants
        .map((variant) => {
            const { descriptor, ...options } = variant;
            const url = wsrv(source, options);
            if (!url) return null;

            const finalDescriptor =
                descriptor ??
                (variant.width ? `${variant.width}w` : variant.dpr ? `${variant.dpr}x` : null);

            if (!finalDescriptor) return null;
            return `${url} ${finalDescriptor}`;
        })
        .filter(Boolean);

    if (!entries.length) {
        return null;
    }

    return entries.join(", ");
}
