export interface Paginate {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    totalItemsPerPage: number;
}

export interface Modify {
    time: string;
}

export interface Item {
    "modified": Modify,
    "_id": string,
    "name": string,
    "slug": string,
    "origin_name": string,
    "poster_url": string,
    "thumb_url": string,
    "year": number
}

export interface ResponseFlimType {
    status: string;
    pagination: Paginate;
    items: Item[];
}

export interface MovieCategory {
    [key: string]: {
        group: {
            id: string;
            name: string;
        };
        list: {
            id: string;
            name: string;
        }[];
    };
}

export interface EpisodeItem {
    name: string;
    slug: string;
    embed: string;
    m3u8: string;
}

export interface Episode {
    server_name: string;
    items: EpisodeItem[];
}

export interface Movie {
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
    category: MovieCategory;
    episodes: Episode[];
}

// export interface MovieResponse {
//     status: string;
//     movie: Movie;
// }

// export interface SearchFlimResponse {
//     status: string;
//     paginate: Paginate;
//     items: Item[];
// }

export interface Tmdb {
    type: string;
    id: string;
    season: number | null;
    vote_average: number;
    vote_count: number;
}

export interface Imdb {
    id: string | null;
}

export interface Created {
    time: string;
}

export interface Modified {
    time: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Country {
    id: string;
    name: string;
    slug: string;
}

export interface MovieDetail {
    tmdb: Tmdb;
    imdb: Imdb;
    created: Created;
    modified: Modified;
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
    notify: string;
    showtimes: string;
    year: number;
    view: number;
    actor: string[];
    director: string[];
    category: Category[];
    country: Country[];
}

export interface ServerData {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
}

export interface Episode {
    server_name: string;
    server_data: ServerData[];
}

export interface MovieResponseDetail {
    status: boolean;
    msg: string;
    movie: MovieDetail;
    episodes: Episode[];
}