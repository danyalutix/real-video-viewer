
import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '@/types/video';
import { cn } from '@/lib/utils';
import { formatViewCount } from '@/lib/videoUtils';

interface VideoCardProps {
  video: Video;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, className }) => {
  // Pick first category for badge (if any)
  const mainCategory = video.categories?.[0] || "Uncategorized";
  return (
    <Link 
      to={`/video/${video.source.toLowerCase()}/${video.id}`}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl bg-card border border-border",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=cover&w=320&q=60";
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs py-1 px-2 rounded font-semibold tracking-wide">
          {video.duration}
        </div>
        <div className={cn(
          "absolute top-2 left-2 text-xs py-1 px-2 rounded font-semibold tracking-wide shadow-sm",
          video.source === 'Pornhub'
            ? "bg-[#ff9000] text-black"
            : "bg-[#c72128] text-white"
        )}>
          {video.source}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-base leading-tight mb-1 line-clamp-2 text-card-foreground font-roboto">
          {video.title}
        </h3>
        <div className="flex items-center flex-wrap gap-2 mt-1">
          <div className="bg-accent text-accent-foreground rounded px-2 py-0.5 text-xs font-medium truncate">
            {mainCategory}
          </div>
          <div className="text-xs text-muted-foreground ml-auto">
            {formatViewCount(video.views)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
