# Agents instructions
You are an AI coding assistant working on the AstroFlim codebase. Keep responses short, actionable, and specific to this repository. NEVER CREATE DOCS OR TESTS.
You have given 2 MCP tool to help you:
- `search_astro_docs`: Search through Astro documentation
- `get_code_context_example`: Search relevant code in Github.

Project snapshot
- Framework: Astro (hybrid server + static); partial hydration used across components.
- UI: React components inside Astro (.tsx) + Astro components (.astro). Tailwind + Shadcn used for design.
- Data: External film API defined in `phim_api_instructions.md` and types params, responses in `src/types/`.

# AstroFilm Codebase Instructions

## Project Overview
**AstroFilm** is a movie discovery application built with **Astro 5 + React + Tailwind CSS**, using the [PhimAPI](https://phimapi.com) to serve Vietnamese movie content. It features server-side rendering with Vercel serverless deployment and ISR caching.

### Tech Stack
- **Framework:** Astro 5.14.8 with React 18 integration
- **Styling:** Tailwind CSS 3.4 + shadcn/ui components (@radix-ui)
- **API:** PhimAPI (Vietnamese movie database) - see `.github/instructions/phim_api.instructions.md`
- **Deployment:** Vercel serverless with ISR (6-hour cache)
- **Build Tool:** Bun (package manager)

---

## Architecture & Data Flow

### 1. **Page Routing & SSR**
All routes are in `src/pages/` (Astro file-based routing):
- `/` → `index.astro` - Homepage with movie grid + category selector
- `/[page].astro` - Pagination for homepage
- `/phim/[slug].astro` - Movie detail pages (fetches from PhimAPI)
- `/danh-sach/[type].astro` - List pages (series, movies, cartoons, etc.)
- `/danh-sach/[type]/[page].astro` - Paginated lists
- `/tim-kiem/[keyword].astro` - Search results

**Key Pattern:** Routes use `Astro.params` to get URL parameters and fetch data server-side before rendering.

### 2. **Component Hierarchy**
- **Astro Components** (`.astro`): Server-side rendering, fetch data, layout structure
  - `Layout.astro` - Wrapper with nav + search + footer (uses `ViewTransitions` for smooth page transitions)
  - `MovieGrid.astro` - Renders paginated movie list with `Pagination` UI component
  - `MovieDetailPage.astro` - Detail view (poster, info, episode selector, video player)
  - `MovieCard.astro` - Individual movie card (title, image, metadata)

- **React Components** (`.tsx`): Interactive elements with `client:idle` directive
  - `SearchForm.tsx` - Search input (navigates to `/tim-kiem/[keyword]`)
  - `MovieTypeSelector.tsx` - Category filter (client-side only)
  - `EpisodeSelector.tsx` - Episode picker for series
  - `VideoPlayer.tsx` - Embedded video playback

**Key Pattern:** Use Astro for data fetching/layout; React for interactivity. Use `client:idle` hydration to defer React component loading.

### 3. **API Integration**
All API calls to PhimAPI (base: `const PUBLIC_PHIM_MOI = getSecret("PUBLIC_PHIM_MOI");` from env):

**Common Endpoints:**
- `GET /danh-sach/phim-moi-cap-nhat?page=1` - Latest movies (cached 24h)
- `GET /phim/{slug}` - Movie details with episodes
- `GET /v1/api/danh-sach/{type}?page=X` - Filtered lists (series, cartoons, etc.)
- `GET /v1/api/tim-kiem?keyword=X` - Search
...

**Caching Strategy:** All fetches use `cache: "force-cache"` with 24-hour Cache-Control headers for ISR optimization.

### 4. **Type System**
`src/types/index.ts` and `src/pages/danh-sach/type.ts` define API response schemas:
- `MovieResponseDetail` - Movie detail response (single movie + episodes array)
- `DanhSachResponse` - List response (items + pagination)
- `PhimMoiCapNhatResponse` - Latest movies response
- Episode structure: `Episodes[] > server_name + server_data[] > link_embed/link_m3u8`

**Key Pattern:** Match types exactly to PhimAPI responses; both v1 and v3 endpoints return slightly different field names.

---

## Development Workflows

### **Local Development**
```bash
bun install      # Install dependencies
bun run dev      # Start dev server at localhost:3000
bun run build    # Build + type check (runs astro check first)
bun run preview  # Test production build locally
```

### **Build Process**
1. `astro check` - Runs TypeScript validation (no actual build)
2. `astro build` - Generates static + serverless routes
3. Output: `/dist/` folder deployed to Vercel

### **Environment Setup**
- `PUBLIC_PHIM_MOI` - PhimAPI base URL (must start with `PUBLIC_` for Astro SSR access)
- Set in `.env` or Vercel dashboard
- Example: `PUBLIC_PHIM_MOI=https://phimapi.com`

---

## Code Patterns & Conventions

### **Image Optimization**
All movie images pass through `wsrv.nl` CDN for WEBP conversion:
```astro
<Image src={`//wsrv.nl/?url=${thumb_url}&w=300&h=450&output=webp`} alt="..." />
```
This reduces image sizes for SEO + performance. Preload first movie on homepage.

### **Pagination**
Movies use client-side URL generation:
```astro
{currentPage: number, totalPages: number}
getPageUrl(pageNum) → pageNum === 1 ? '/' : `/${pageNum}`
```
No query strings; purely path-based routing.

### **Page Transitions**
Uses `ViewTransitions` (Astro 4+) + `astro-vtbot` progress bar for smooth navigation:
```astro
<ViewTransitions />
<ProgressBar />
```

### **UI Component Pattern**
All UI from `/src/components/ui/` (shadcn/ui + Radix UI):
- Import: `import { Button } from "@/components/ui/button"`
- Composition: `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader></Card>`
- Use `className` for Tailwind styling (CVA for variants)

### **Metadata & SEO**
Detail pages include:
- Page title via `<Layout title="Chi tiet">`
- Movie poster for preload (first item on homepage)
- TMDB/IMDb IDs in data for external links
- SeoOnPage data in API responses

---

## Important Files & Their Roles

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Vercel adapter, ISR config (6h cache), image domains |
| `src/types/index.ts` | All TypeScript interfaces for API responses |
| `src/pages/danh-sach/type.ts` | Extended API types (used by list pages) |
| `src/components/MovieGrid.astro` | Reusable pagination grid (used by many pages) |
| `src/layouts/Layout.astro` | Global nav + search + footer wrapper |
| `tailwind.config.mjs` | Tailwind theme (uses Radix UI presets) |
| `tsconfig.json` | Path alias: `@/*` → `./src/*` |
| `.env` | `PUBLIC_PHIM_MOI` (PhimAPI base URL) |

---

## Common Tasks & Quick Refs

**Add new movie list page:**
1. Create `src/pages/danh-sach/[type]/[page].astro`
2. Fetch from `/v1/api/danh-sach/{type}?page={page}`
3. Import & use `MovieGrid.astro` component with fetched data
4. Wrap with `Layout.astro`

**Add new search/filter:**
1. Create React `.tsx` component with form (use `SearchForm.tsx` as template)
2. Use `client:idle` directive in parent Astro file
3. Navigate via `window.location.href = `/path/${encodeURIComponent(value)}`
4. Create new route in `src/pages/` to handle the parameter

**Debug API responses:**
1. PhimAPI base: `import.meta.env.PUBLIC_PHIM_MOI`
2. All endpoints documented in `.github/instructions/phim_api.instructions.md`
3. Response shapes in `src/types/` files
4. Test in browser: `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1`

**Performance optimization:**
- ISR caching is automatic via Vercel (6h expiry set in `astro.config.mjs`)
- Image CDN: `wsrv.nl` (no additional config needed)
- Preload critical images on homepage (`MovieGrid.astro` line with `<link rel="preload">`)
- Use `client:idle` for React components (defer hydration until idle)

---

## Deployment Notes

- **Host:** Vercel serverless
- **Adapter:** `@astrojs/vercel`
- **Output:** Server-side rendering (`output: "server"`)
- **ISR:** 6-hour cache expiration for all routes (configurable in `astro.config.mjs`)
- **Domain restrictions:** Images only from `wsrv.nl` and `phimimg.com` (in `astro.config.mjs`)

---

## Known Limitations & TODOs

- API sometimes returns `items: null` in search responses (handle in templates)
- Movie data inconsistency between v1/v3 endpoints (check both type files)
- Manual ISR: No on-demand revalidation (6-hour window is fixed)
- No user authentication or favorites yet