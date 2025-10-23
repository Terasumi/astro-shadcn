import React, { useEffect, useState } from 'react';
import type { Item } from '@/types';

interface LazySectionProps {
  typeList: string;
  title: string;
  subtitle: string;
  layout: 'landscape' | 'portrait';
}

const LazySection: React.FC<LazySectionProps> = ({ 
  typeList, 
  title, 
  subtitle, 
  layout 
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`section-${typeList}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [typeList]);

  useEffect(() => {
    if (inView && items.length === 0 && !loading) {
      fetchSectionData();
    }
  }, [inView]);

  const fetchSectionData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/sections/${typeList}?limit=10&sort_type=desc`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${typeList}`);
      }
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = (item: Item) => {
    const url = layout === 'landscape' 
      ? item.thumb_url || item.poster_url
      : item.poster_url || item.thumb_url;
    
    return url ? `https://wsrv.nl/?url=https://phimimg.com/${url}&w=400&h=225&output=webp` : null;
  };

  return (
    <section 
      id={`section-${typeList}`}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-white/60">
            {subtitle}
          </p>
        </div>
        <a
          href={`/danh-sach/${typeList}`}
          className="text-sm font-medium text-sky-300 transition hover:text-sky-100"
        >
          Xem tất cả →
        </a>
      </div>

      {loading && (
        <div className="flex gap-4 overflow-x-auto pb-2 pl-2 pr-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className={`shrink-0 rounded-xl bg-slate-800/60 animate-pulse ${
                layout === 'landscape' ? 'w-[350px] aspect-[16/9]' : 'w-[230px] aspect-[3/4]'
              }`}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-12 text-center text-sm text-white/70">
          {error}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div
          className={`-mx-2 flex gap-4 overflow-x-auto pb-2 pl-2 pr-4 ${
            layout === 'landscape' ? 'snap-x snap-mandatory' : ''
          }`}
        >
          {items.map((item) => {
            const imgUrl = imageUrl(item);
            
            return (
              <article
                key={item._id}
                className={`group relative shrink-0 overflow-hidden rounded-xl bg-slate-900/60 ring-white/10 transition duration-200 hover:ring-2 hover:ring-white/30 mt-2 ${
                  layout === 'landscape' ? 'w-[350px] snap-start' : 'w-[230px]'
                }`}
              >
                <a href={`/phim/${item.slug}`} className="block h-full">
                  <div
                    className={`${
                      layout === 'landscape' ? 'aspect-[16/9]' : 'aspect-[3/4]'
                    } relative`}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={225}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-white/50">
                        No Image
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10" />
                    <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-medium text-white/80">
                      {item.year ?? "N/A"}
                    </div>
                  </div>
                  {layout === 'portrait' && (
                    <div className="space-y-1 px-4 py-4">
                      <h3 className="line-clamp-2 text-sm font-semibold text-white transition group-hover:text-sky-200">
                        {item.name}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-1">
                        {item.origin_name}
                      </p>
                    </div>
                  )}
                </a>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LazySection;