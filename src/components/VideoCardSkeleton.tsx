
import React from 'react';
import { cn } from '@/lib/utils';

interface VideoCardSkeletonProps {
  className?: string;
}

const VideoCardSkeleton: React.FC<VideoCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn(
      "relative flex flex-col rounded-lg overflow-hidden bg-card/60",
      className
    )}>
      <div className="relative aspect-video bg-muted animate-pulse"></div>
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
        <div className="h-3 w-1/3 mt-1 bg-muted/80 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
