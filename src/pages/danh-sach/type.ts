export interface PhimMoiCapNhatResponse {
    status: boolean;
    msg: string;
    items: PhimMoiCapNhatItem[];
    pagination: Pagination;
}

export interface PhimDetailResponse {
    status: boolean;
    msg: string;
    movie: PhimDetailItem;
    episodes?: Episodes[];
}

export interface PhimDetailItem {
    tmdb: {
        type: string;
        id: string;
        season: number | null;
        vote_average: number;
        vote_count: number;
    };
    imdb: {
        id: string | null;
    };
    created: {
        time: string;
    };
    modified: {
        time: string;
    };
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    content: string;
    type: string;
    status: string;
    poster_url: string;
    thumb_url: string;
    is_copyright: boolean;
    sub_docquyen: boolean;
    chieurap: boolean;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    notify?: string;
    showtimes?: string;
    year: number;
    view: number;
    actor: string[];
    director: string[];
    category: CategoryItem[];
    country: CountryItem[];
    episodes?: Episodes[];
}

export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
}

export interface CountryItem {
    id: string;
    name: string;
    slug: string;
}

export interface Episodes {
    server_name: string;
    server_data: EpisodeItem[];
}

export interface EpisodeItem {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
}

export interface Paginate {
    current_page: number;
    total_page: number;
    total_items: number;
    items_per_page: number;
}

export interface Pagination {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
    updateToday?: number;
}

export interface PhimMoiCapNhatItem {
    tmdb: {
        type: string;
        id: string;
        season: number | null;
        vote_average: number;
        vote_count: number;
    };
    imdb: {
        id: string | null;
    };
    modified: {
        time: string;
    };
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    poster_url: string;
    thumb_url: string;
    year: number;
    // V3 fields
    type?: string;
    sub_docquyen?: boolean;
    time?: string;
    episode_current?: string;
    quality?: string;
    lang?: string;
    category?: CategoryItem[];
    country?: CountryItem[];
}

export interface MovieItem {
    id: string;
    name: string;
    slug: string;
    original_name: string;
    thumb_url: string;
    poster_url: string;
    created: string;
    modified: string;
    description: string;
    total_episodes: number;
    current_episode: string;
    time: string;
    quality: string;
    language: string;
    director: string;
    casts: string;
}

// API Response for /v1/api/danh-sach/{type_list}
export interface DanhSachResponse {
    status: boolean;
    msg: string;
    data: {
        seoOnPage: SeoOnPage;
        breadCrumb: BreadCrumb[];
        titlePage: string;
        items: DanhSachItem[];
        params: DanhSachParams;
        type_list: string;
        APP_DOMAIN_FRONTEND: string;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}

export interface SeoOnPage {
    og_type: string;
    titleHead: string;
    descriptionHead: string;
    og_image: string[] | null;
    og_url: string;
}

export interface BreadCrumb {
    name: string;
    slug: string;
    isCurrent: boolean;
    position: number;
}

export interface DanhSachItem {
    tmdb: {
        type: string | null;
        id: string | null;
        season: number | null;
        vote_average: number;
        vote_count: number;
    };
    imdb: {
        id: string | null;
    };
    created: {
        time: string;
    };
    modified: {
        time: string;
    };
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    type: string;
    poster_url: string;
    thumb_url: string;
    sub_docquyen: boolean;
    chieurap: boolean;
    time: string;
    episode_current: string;
    quality: string;
    lang: string;
    year: number;
    category: CategoryItem[];
    country: CountryItem[];
}

export interface DanhSachParams {
    type_slug: string;
    keyword?: string;
    filterCategory: string[];
    filterCountry: string[];
    filterYear: string[];
    filterType: string[];
    sortField: string;
    sortType: string;
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface TheLoaiParams {
    type_slug: string;
    slug: string;
    filterCategory: string[];
    filterCountry: string[];
    filterYear: string[];
    filterType: string[];
    sortField: string;
    sortType: string;
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface QuocGiaParams {
    type_slug: string;
    slug: string;
    filterCategory: string[];
    filterCountry: string[];
    filterYear: string[];
    filterType: string[];
    sortField: string;
    sortType: string;
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface NamParams {
    type_slug: string;
    filterCategory: string[];
    filterCountry: string[];
    filterYear: string | string[];
    filterType: string;
    sortField: string;
    sortType: string;
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
    };
}

// API Response for /v1/api/the-loai/{category}
export interface TheLoaiResponse {
    status: boolean;
    msg: string;
    data: {
        seoOnPage: SeoOnPage;
        breadCrumb: BreadCrumb[];
        titlePage: string;
        items: DanhSachItem[];
        params: TheLoaiParams;
        type_list: string;
        APP_DOMAIN_FRONTEND: string;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}

// API Response for /v1/api/tim-kiem
export interface TimKiemResponse {
    status: string;
    msg: string;
    data: {
        seoOnPage: SeoOnPage;
        breadCrumb: BreadCrumb[];
        titlePage: string;
        items: DanhSachItem[] | null;
        params: DanhSachParams;
        type_list: string;
        APP_DOMAIN_FRONTEND: string;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}

// API Response for /v1/api/quoc-gia/{country}
export interface QuocGiaResponse {
    status: string;
    msg: string;
    data: {
        seoOnPage: SeoOnPage;
        breadCrumb: BreadCrumb[];
        titlePage: string;
        items: DanhSachItem[];
        params: QuocGiaParams;
        type_list: string;
        APP_DOMAIN_FRONTEND: string;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}

// API Response for /v1/api/nam/{year}
export interface NamResponse {
    status: boolean;
    msg: string;
    data: {
        seoOnPage: SeoOnPage;
        breadCrumb: BreadCrumb[];
        titlePage: string;
        items: DanhSachItem[];
        params: NamParams;
        type_list: string;
        APP_DOMAIN_FRONTEND: string;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}
