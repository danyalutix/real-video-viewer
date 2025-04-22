
import axios from 'axios';
import { VideosResponse, VideoDetailResponse } from '@/types/video';

const API_URL = 'http://localhost:5000';

export const fetchVideos = async (): Promise<VideosResponse> => {
  try {
    const response = await axios.get<VideosResponse>(`${API_URL}/api/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const fetchVideoById = async (source: string, id: string): Promise<VideoDetailResponse> => {
  try {
    const response = await axios.get<VideoDetailResponse>(`${API_URL}/api/videos/${source}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video ${id} from ${source}:`, error);
    throw error;
  }
};
