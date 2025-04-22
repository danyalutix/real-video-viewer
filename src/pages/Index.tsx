
import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchVideos } from '@/api/videosApi';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import { Video } from '@/types/video';
import CategoryAccordion from '@/components/CategoryAccordion';
import CategoryFilters from '@/components/CategoryFilters';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const MAIN_CATEGORIES = [
  "Asian", "Teen", "MILF", "Amateur", "Lesbian", "Public", "Redhead"
];

const POPULAR_CATEGORIES = [
  "Blonde", "MILF", "Lesbian", "Teen", "Massage", "Big Tits", "Anal", "Amateur", "Asian", "BBW", "Ebony", "POV", "Public", "Threesome", "Redhead"
];

const PAGE_SIZE = 20;

const Index = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // FILTER/SEARCH state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('views');
  const [duration, setDuration] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  // Category Accordion selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // PAGINATION state
  const [page, setPage] = useState(1);

  // When filters/search change, reset to the first page
  useEffect(() => { setPage(1); }, [search, sort, duration, filterCategory, selectedCategory]);

  // Toasts for loading error
  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error('Failed to load videos', {
        description: 'Please try again later or check your connection.',
        action: {
          label: 'Retry',
          onClick: () => refetch(),
        },
      });
    }
  }, [isError, error, refetch]);

  // COLLATE categories
  const allCategories = useMemo(() => {
    if (!data?.videos) return [];
    const cats = data.videos.flatMap(v => v.categories || []);
    return Array.from(new Set([...POPULAR_CATEGORIES, ...cats]));
  }, [data]);

  // Build main-subcategory map based on videos
  const subCategoryMap = useMemo(() => {
    // For this demo, treat every category that is not a MAIN as subcategory under its matching main (if possible)
    const result: Record<string, string[]> = {};
    MAIN_CATEGORIES.forEach(main => { result[main] = []; });
    if (data?.videos) {
      data.videos.forEach(v => {
        v.categories.forEach(cat => {
          if (MAIN_CATEGORIES.includes(cat)) {
            // Add only unique
            if (!result[cat].includes(cat)) result[cat].push();
          } else {
            // assign to a main if MacGyver; fallback to "Other"
            const bucket = v.categories.find(main => MAIN_CATEGORIES.includes(main));
            if (bucket) {
              if (!result[bucket].includes(cat)) result[bucket].push(cat);
            }
          }
        });
      });
    }
    MAIN_CATEGORIES.forEach(main => {
      // Remove empty/undefined
      result[main] = Array.from(new Set(result[main].filter(Boolean)));
    });
    return result;
  }, [data]);

  // Video LIST filtering logic
  const filteredVideos = useMemo(() => {
    if (!data?.videos) return [];
    // Search
    let videos = data.videos as Video[];
    if (search.trim()) {
      const qs = search.trim().toLowerCase();
      videos = videos.filter(
        v =>
          v.title.toLowerCase().includes(qs) ||
          v.categories.some(c => c.toLowerCase().includes(qs))
      );
    }
    // Filter category via dropdown (supersedes selectedCategory)
    if (filterCategory) {
      videos = videos.filter(v => v.categories.includes(filterCategory));
    } else if (selectedCategory) {
      videos = videos.filter(v =>
        v.categories.includes(selectedCategory)
      );
    }
    // Filter by duration
    if (duration === "short") videos = videos.filter(v => Number(v.duration) < 300);
    else if (duration === "medium") videos = videos.filter(v => Number(v.duration) >= 300 && Number(v.duration) <= 900);
    else if (duration === "long") videos = videos.filter(v => Number(v.duration) > 900);

    // Sort
    if (sort === "views") videos.sort((a, b) => Number(b.views) - Number(a.views));
    else if (sort === "date") videos.sort((a, b) => (b.uploadDate || "").localeCompare(a.uploadDate || ""));
    else if (sort === "rating") videos.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

    return videos;
  }, [data, search, selectedCategory, filterCategory, duration, sort]);

  // Pagination logic
  const pagedVideos = useMemo(() => {
    const start = 0;
    const end = page * PAGE_SIZE;
    return filteredVideos.slice(start, end);
  }, [filteredVideos, page]);

  // Display skeletons
  const renderSkeletons = () => Array(PAGE_SIZE).fill(0).map((_, i) => (
    <VideoCardSkeleton key={`skeleton-${i}`} />
  ));

  return (
    <div className="min-h-screen bg-background font-roboto">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight font-roboto">
            VideoHub
          </h1>
          <div className="flex items-center space-x-4">
            {!isLoading && data && (
              <span className="text-sm text-muted-foreground">
                {filteredVideos.length} videos found
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <CategoryFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          duration={duration}
          setDuration={setDuration}
          categories={allCategories}
          category={filterCategory}
          setCategory={setFilterCategory}
        />
        {/* Collapsible Categories */}
        <CategoryAccordion
          mainCategories={MAIN_CATEGORIES}
          subCategoryMap={subCategoryMap}
          selected={selectedCategory}
          onSelect={val => {
            setSelectedCategory(val);
            setFilterCategory(''); // Reset dropdown if user clicks on accordion
          }}
        />
        <hr className="my-6 border-border" />
        <section>
          {/* Section header */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-semibold tracking-tight font-roboto">
              Trending Adult Videos
            </span>
            {(selectedCategory || filterCategory) && (
              <span className="ml-2 text-base text-primary font-bold">
                {filterCategory || selectedCategory}
              </span>
            )}
          </div>
          <div className="w-full flex justify-center mb-8">
            <div className="bg-gray-800 text-white text-center flex items-center justify-center" style={{ width: 728, height: 90, borderRadius: 8 }}>
              Ad Placeholder (728x90)
            </div>
          </div>
          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              renderSkeletons()
            ) : pagedVideos.length > 0 ? (
              pagedVideos.map((video: Video) => (
                <VideoCard key={`${video.source}-${video.id}`} video={video} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <h3 className="text-lg font-medium mb-2">No videos found</h3>
                <p className="text-muted-foreground mb-4">
                  Unable to load videos at this time.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
          {/* Pagination / Load More */}
          {!isLoading && filteredVideos.length > pagedVideos.length && (
            <div className="flex justify-center py-8">
              <button
                onClick={() => setPage(page + 1)}
                className="px-8 py-2 rounded bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>
        <hr className="my-8 border-border" />
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VideoHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
