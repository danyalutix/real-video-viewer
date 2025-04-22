
import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchVideos } from '@/api/videosApi';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import { Video } from '@/types/video';
import CategoriesBar from '@/components/CategoriesBar';

const POPULAR_CATEGORIES = [
  "Blonde", "MILF", "Lesbian", "Teen", "Massage", "Big Tits", "Anal", "Amateur", "Asian", "BBW", "Ebony", "POV", "Public", "Threesome", "Redhead"
];

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

  // Category filtering state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Gather all categories from loaded videos
  const discoveredCategories = useMemo(() => {
    if (!data?.videos) return [];
    const all = data.videos.flatMap(v => v.categories || []);
    return Array.from(new Set([...POPULAR_CATEGORIES, ...all]));
  }, [data]);

  // Filter videos by selected category if any
  const filteredVideos = useMemo(() => {
    if (!data?.videos) return [];
    if (!selectedCategory) return data.videos;
    return data.videos.filter(video =>
      video.categories?.includes(selectedCategory)
    );
  }, [data, selectedCategory]);

  // Define skeleton loading UI
  const renderSkeletons = () => {
    return Array(12).fill(0).map((_, index) => (
      <VideoCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">VideoHub</h1>
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
        <section>
          {/* 728x90 banner above grid */}
          <div className="w-full flex justify-center mb-8">
            <div className="bg-gray-800 text-white text-center flex items-center justify-center" style={{ width: 728, height: 90, borderRadius: 8 }}>
              Ad Placeholder (728x90)
            </div>
          </div>
          {/* Categories Scrollbar */}
          <CategoriesBar
            categories={discoveredCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <h2 className="text-xl font-semibold mb-6">Trending Videos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              renderSkeletons()
            ) : filteredVideos.length > 0 ? (
              filteredVideos.map((video: Video) => (
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
        </section>
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
