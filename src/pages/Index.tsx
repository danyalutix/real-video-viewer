
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

// Define main categories to display in the UI (reduced to 5-7 for better UI)
const MAIN_CATEGORIES = [
  "Asian", "Teen", "MILF", "Amateur", "Lesbian" 
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

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('views');
  const [duration, setDuration] = useState('any_duration');
  const [filterCategory, setFilterCategory] = useState('all_categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  // Reset page when filters change
  useEffect(() => { 
    setPage(1); 
  }, [search, sort, duration, filterCategory, selectedCategory]);

  // Show error toast if needed
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

  // Extract all categories from the data
  const allCategories = useMemo(() => {
    if (!data?.videos) return [];
    const cats = data.videos.flatMap(v => v.categories || []);
    return Array.from(new Set([...POPULAR_CATEGORIES, ...cats]));
  }, [data]);

  // Create subcategory mapping
  const subCategoryMap = useMemo(() => {
    const result: Record<string, string[]> = {};
    MAIN_CATEGORIES.forEach(main => { result[main] = []; });
    if (data?.videos) {
      data.videos.forEach(v => {
        v.categories.forEach(cat => {
          if (MAIN_CATEGORIES.includes(cat)) {
            if (!result[cat].includes(cat)) result[cat].push();
          } else {
            const bucket = v.categories.find(main => MAIN_CATEGORIES.includes(main));
            if (bucket) {
              if (!result[bucket].includes(cat)) result[bucket].push(cat);
            }
          }
        });
      });
    }
    MAIN_CATEGORIES.forEach(main => {
      result[main] = Array.from(new Set(result[main].filter(Boolean)));
    });
    return result;
  }, [data]);

  // Apply filters to videos
  const filteredVideos = useMemo(() => {
    setIsFiltering(true);
    if (!data?.videos) return [];
    
    let videos = data.videos as Video[];
    
    if (search.trim()) {
      const qs = search.trim().toLowerCase();
      videos = videos.filter(
        v =>
          v.title.toLowerCase().includes(qs) ||
          v.categories.some(c => c.toLowerCase().includes(qs))
      );
    }
    
    if (filterCategory && filterCategory !== 'all_categories') {
      videos = videos.filter(v => v.categories.includes(filterCategory));
    } else if (selectedCategory) {
      videos = videos.filter(v =>
        v.categories.includes(selectedCategory)
      );
    }
    
    if (duration === "short") videos = videos.filter(v => Number(v.duration) < 300);
    else if (duration === "medium") videos = videos.filter(v => Number(v.duration) >= 300 && Number(v.duration) <= 900);
    else if (duration === "long") videos = videos.filter(v => Number(v.duration) > 900);

    if (sort === "views") videos.sort((a, b) => Number(b.views) - Number(a.views));
    else if (sort === "date") videos.sort((a, b) => (b.uploadDate || "").localeCompare(a.uploadDate || ""));
    else if (sort === "rating") videos.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

    setIsFiltering(false);
    return videos;
  }, [data, search, selectedCategory, filterCategory, duration, sort]);

  // Get the videos for the current page
  const pagedVideos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE;
    return filteredVideos.slice(start, end);
  }, [filteredVideos, page]);

  // Handle search and filter changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on new search
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setSelectedCategory(null); // Reset accordion selection
    setPage(1);
  };

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    setFilterCategory('all_categories'); // Reset dropdown if user clicks on accordion
    setPage(1);
  };

  const renderSkeletons = () => Array(PAGE_SIZE).fill(0).map((_, i) => (
    <VideoCardSkeleton key={`skeleton-${i}`} />
  ));

  // Reset all filters
  const resetAllFilters = () => {
    setSearch('');
    setFilterCategory('all_categories');
    setSelectedCategory(null);
    setDuration('any_duration');
    setSort('views');
    setPage(1);
  };

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
        <CategoryFilters
          search={search}
          setSearch={handleSearch}
          sort={sort}
          setSort={handleSortChange}
          duration={duration}
          setDuration={handleDurationChange}
          categories={allCategories}
          category={filterCategory}
          setCategory={handleCategoryChange}
        />
        <CategoryAccordion
          mainCategories={MAIN_CATEGORIES}
          subCategoryMap={subCategoryMap}
          expandedCount={5}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
        <hr className="my-6 border-border" />
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-semibold tracking-tight font-roboto">
              Trending Adult Videos
            </span>
            {(selectedCategory || filterCategory !== 'all_categories') && (
              <span className="ml-2 text-base text-primary font-bold">
                {filterCategory !== 'all_categories' ? filterCategory : selectedCategory}
              </span>
            )}
          </div>
          <div className="w-full flex justify-center mb-8">
            <div className="bg-gray-800 text-white text-center flex items-center justify-center" style={{ width: 728, height: 90, borderRadius: 8 }}>
              Ad Placeholder (728x90)
            </div>
          </div>
          
          {/* Loading indicator when filtering */}
          {isFiltering && (
            <div className="flex justify-center my-4">
              <div className="animate-pulse bg-primary/20 text-primary px-4 py-2 rounded">
                Filtering videos...
              </div>
            </div>
          )}
          
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
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {!isLoading && filteredVideos.length > PAGE_SIZE && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={page <= 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 py-2">
                      Page {page} of {Math.ceil(filteredVideos.length / PAGE_SIZE)}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(p => p + 1)}
                      className={page >= Math.ceil(filteredVideos.length / PAGE_SIZE) ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
