
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
  // Additional optional fields for details
  performer?: string;
  likes?: string;
  dislikes?: string;
  tags?: string[];
  previewImages?: string[];
  backupThumbnail?: string;
  backupPreviews?: string[];
}

export interface VideosResponse {
  success: boolean;
  count: number;
  videos: Video[];
}

export interface VideoDetailResponse {
  success: boolean;
  video: Video | null;
}
