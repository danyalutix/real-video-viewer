
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
  rating?: string;
  uploadDate?: string;
}
