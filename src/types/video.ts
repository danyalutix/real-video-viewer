
export interface Video {
  id: string;
  title: string;
  duration: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
  embedUrl: string;
  categories: string[];
  source: 'Pornhub' | 'XVideos';
  // Adding these optional properties to fix the type errors
  rating?: string;
  uploadDate?: string;
}

export interface VideosResponse {
  success: boolean;
  count: number;
  videos: Video[];
}

export interface VideoDetailResponse {
  success: boolean;
  video: VideoDetail;
}

export interface VideoDetail extends Video {
  // These properties are now inherited from Video interface
  // No need to redefine them here since they're in the base interface
}
