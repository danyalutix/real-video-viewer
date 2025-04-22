
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Play } from 'lucide-react';
import { fetchVideoById } from '@/api/videosApi';
import { cn } from '@/lib/utils';
import { formatViewCount } from '@/lib/videoUtils';

const VideoDetail = () => {
  const { source, id } = useParams<{ source: string; id: string }>();
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['video', source, id],
    queryFn: () => fetchVideoById(source!, id!),
    enabled: !!source && !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error('Failed to load video', {
        description: 'Please try again later or check your connection.',
        action: {
          label: 'Retry',
          onClick: () => refetch(),
        },
      });
    }
  }, [isError, error, refetch]);

  const video = data?.video;

  // Loading skeleton for video content
  const renderSkeleton = () => (
    <>
      <div className="aspect-video bg-muted animate-pulse rounded-lg"></div>
      <div className="mt-6 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded"></div>
        <div className="h-20 bg-muted animate-pulse rounded"></div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="flex items-center mr-4 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-semibold truncate">
            {isLoading ? 'Loading video...' : video?.title || 'Video not found'}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col-reverse lg:flex-row gap-8">
        <div className="flex-1 max-w-5xl mx-auto w-full">
          {isLoading ? (
            renderSkeleton()
          ) : video ? (
            <>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                {video.embedUrl.startsWith('<iframe') ? (
                  // For legacy data that contains the full iframe HTML
                  <div dangerouslySetInnerHTML={{ __html: video.embedUrl }} />
                ) : (
                  // For direct embed URLs
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                  ></iframe>
                )}
              </div>

              <div className="mt-6">
                <h1 className="text-2xl font-bold">{video.title}</h1>
                
                <div className="flex items-center mt-2 text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Play size={16} className="mr-1" />
                    <span>{formatViewCount(video.views)}</span>
                  </div>
                  <div>
                    <span>Duration: {video.duration}</span>
                  </div>
                  <div className={cn(
                    "text-xs py-1 px-2 rounded font-medium",
                    video.source === 'Pornhub' ? "bg-[#ff9000] text-black" : "bg-[#c72128] text-white"
                  )}>
                    {video.source}
                  </div>
                </div>

                {video.categories && video.categories.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.categories.map((category, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-secondary text-secondary-foreground py-1 px-2 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {video.uploadDate && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span>Uploaded: {video.uploadDate}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-bold mb-2">Video not found</h2>
              <p className="text-muted-foreground mb-6">The video you're looking for doesn't exist or has been removed.</p>
              <Link 
                to="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go back to homepage
              </Link>
            </div>
          )}
        </div>
        {/* Right sidebar (shows on lg+) */}
        <aside className="w-full lg:w-[300px] flex-shrink-0 flex justify-center">
          <div
            className="bg-gray-800 text-white text-center flex items-center justify-center"
            style={{ width: 300, height: 250, borderRadius: 8 }}
          >
            Ad Placeholder (300x250)
          </div>
        </aside>
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VideoHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default VideoDetail;
