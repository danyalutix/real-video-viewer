import axios from 'axios';
import { VideosResponse, Video, VideoDetailResponse } from '@/types/video';

const CSV_URL = 'https://raw.githubusercontent.com/danyalutix/real-video-viewer/main/part_1.csv';

// Sample fallback rows for offline/manual use
const SAMPLE_ROWS = [
  // Each entry is a pipe-separated string (simulate real CSV format)
  `<iframe src="https://www.xvideos.com/embedframe/123456" frameborder="0"></iframe>|https://img.xvideos.com/videos/thumbslll/12/34/56/123456/123456.15.jpg|https://img.xvideos.com/videos/thumbslll/12/34/56/123456/123456.1.jpg;https://img.xvideos.com/videos/thumbslll/12/34/56/123456/123456.2.jpg|Sample Video Title 1|tagA;tagB|Teen;Amateur|Jane Doe|231|12456|789|12|https://img.xvideos.com/videos/thumbslll/12/34/56/123456/123456.15.jpg|https://img.xvideos.com/videos/thumbslll/12/34/56/123456/123456.3.jpg;https://img.xvideos.com/videos/thumbslll/12/34/56/123456/123456.4.jpg`,
  `<iframe src="https://www.pornhub.com/embed/654321" frameborder="0"></iframe>|https://di.phncdn.com/videos/202405/654321/original/1.jpg|https://di.phncdn.com/videos/202405/654321/original/2.jpg;https://di.phncdn.com/videos/202405/654321/original/3.jpg|Sample Video Title 2|tagC;tagD|MILF;Big Tits|Anna Smith|1080|985442|2521|432|https://di.phncdn.com/videos/202405/654321/original/backup.jpg|https://di.phncdn.com/videos/202405/654321/original/4.jpg;https://di.phncdn.com/videos/202405/654321/original/5.jpg`
];

const parseCSV = (csvText: string): Video[] => {
  // Split by new lines
  const lines = csvText.split('\n').filter((line) => line.trim().length > 0);
  // Map each row to a Video object
  return lines.map((row, idx) => {
    const fields = row.split('|');
    // Fallback defaults
    const [
      embedHTML,
      mainThumbnail,
      previewImagesRaw,
      title,
      tagsRaw,
      categoriesRaw,
      performer,
      durationSecs,
      views,
      likes,
      dislikes,
      backupThumbnail,
      backupPreviewsRaw,
    ] = fields;

    // Extract video source & video id
    let source: 'Pornhub' | 'XVideos' = 'XVideos';
    let id = `${idx}`;
    let embedUrl = '';
    let videoUrl = '';

    if (embedHTML && embedHTML.includes('pornhub')) {
      source = 'Pornhub';
      // Extract ID from embed URL e.g. ...embed/654321"
      const match = embedHTML.match(/embed\/(\d+)/);
      if (match) id = match[1];
      // Grab src from iframe
      const srcMatch = embedHTML.match(/src="([^"]+)"/);
      if (srcMatch) {
        embedUrl = srcMatch[1];
        videoUrl = srcMatch[1];
      }
    } else if (embedHTML && embedHTML.includes('xvideos')) {
      source = 'XVideos';
      const match = embedHTML.match(/embedframe\/(\d+)/); // ...embedframe/123456
      if (match) id = match[1];
      const srcMatch = embedHTML.match(/src="([^"]+)"/);
      if (srcMatch) {
        embedUrl = srcMatch[1];
        videoUrl = srcMatch[1];
      }
    }

    const categories = (categoriesRaw || '').split(';').map(s => s.trim()).filter(Boolean);
    const tags = (tagsRaw || '').split(';').map(s => s.trim()).filter(Boolean);
    const previewImages = (previewImagesRaw || '').split(';').map(s => s.trim()).filter(Boolean);
    const backupPreviews = (backupPreviewsRaw || '').split(';').map(s => s.trim()).filter(Boolean);

    return {
      id,
      title: title || `Video ${id}`,
      duration: durationSecs ? String(Math.round(Number(durationSecs))) : '0',
      views: views ? String(views) : '0',
      thumbnail: mainThumbnail || backupThumbnail || '',
      videoUrl: videoUrl || '',
      embedUrl: embedHTML || '', // pass the full HTML for legacy compatibility
      categories: categories,
      source: source,
      // Not part of strict Video type but useful for detail view in custom types:
      performer: performer || '',
      likes: likes ? String(likes) : '0',
      dislikes: dislikes ? String(dislikes) : '0',
      tags,
      previewImages,
      backupThumbnail: backupThumbnail || '',
      backupPreviews,
    } as Video;
  });
};

export const fetchVideos = async (): Promise<VideosResponse> => {
  try {
    const res = await axios.get(CSV_URL, { responseType: 'text' });
    const rawCSV: string = res.data;
    const videos = parseCSV(rawCSV);
    return {
      success: true,
      count: videos.length,
      videos
    };
  } catch (error) {
    // Fallback to sample data if fetch failed
    console.error('Error fetching CSV, using sample data:', error);
    const videos = parseCSV(SAMPLE_ROWS.join('\n'));
    return {
      success: true,
      count: videos.length,
      videos
    };
  }
};

export const fetchVideoById = async (source: string, id: string): Promise<VideoDetailResponse> => {
  try {
    // First fetch all videos
    const allVideosResponse = await fetchVideos();
    
    if (!allVideosResponse.success) {
      return { success: false, video: null };
    }
    
    // Find the video that matches the source and id
    const video = allVideosResponse.videos.find(
      (v) => v.source.toLowerCase() === source.toLowerCase() && v.id === id
    );
    
    if (!video) {
      return { success: false, video: null };
    }
    
    return {
      success: true,
      video
    };
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return { success: false, video: null };
  }
};
