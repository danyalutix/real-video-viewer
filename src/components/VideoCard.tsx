
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
  return (
    <Link 
      to={`/video/${video.source.toLowerCase()}/${video.id}`}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl bg-card",
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
            target.src = 'https://via.placeholder.com/320x180?text=No+Image';
          }}
        />
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs py-1 px-2 rounded font-medium">
          {video.duration}
        </div>
        
        {/* Source badge */}
        <div className={cn(
          "absolute top-2 left-2 text-xs py-1 px-2 rounded font-medium",
          video.source === 'Pornhub' ? "bg-[#ff9000] text-black" : "bg-[#c72128] text-white"
        )}>
          {video.source}
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] text-card-foreground">
          {video.title}
        </h3>
        <div className="mt-1 text-xs text-muted-foreground">
          {formatViewCount(video.views)}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
