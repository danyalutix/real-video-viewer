
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { parse } = require('node-html-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_VIDEOS = parseInt(process.env.MAX_VIDEOS_PER_SOURCE || '20', 10);
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '10000', 10);

// Configure axios default timeout
axios.defaults.timeout = REQUEST_TIMEOUT;

// Middleware
app.use(cors({
  origin: process.env.ALLOW_ORIGIN || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Utility functions for parsing video data
const parseVideosFromPornhub = async () => {
  try {
    const response = await axios.get('https://www.pornhub.com/video?o=mv', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });
    
    const $ = cheerio.load(response.data);
    const videos = [];
    
    $('li.videoBox').each((i, el) => {
      if (i >= MAX_VIDEOS) return false; // Limit videos per configuration
      
      const title = $(el).find('span.title a').text().trim();
      const duration = $(el).find('var.duration').text().trim();
      const views = $(el).find('span.views').text().trim();
      const thumbnail = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
      const videoUrl = 'https://www.pornhub.com' + $(el).find('a').attr('href');
      const videoId = videoUrl.split('viewkey=')[1];
      
      // Create embed URL from video ID
      const embedUrl = `https://www.pornhub.com/embed/${videoId}`;
      
      // Extract categories if available
      const categories = [];
      $(el).find('.videoCategory').each((i, cat) => {
        categories.push($(cat).text().trim());
      });
      
      videos.push({
        id: videoId,
        title,
        duration,
        views,
        thumbnail,
        videoUrl,
        embedUrl,
        categories,
        source: 'Pornhub'
      });
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching Pornhub videos:', error);
    return [];
  }
};

const parseVideosFromXVideos = async () => {
  try {
    const response = await axios.get('https://www.xvideos.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });
    
    const root = parse(response.data);
    const videos = [];
    
    const videoElements = root.querySelectorAll('.thumb-block');
    
    videoElements.forEach((el, i) => {
      if (i >= MAX_VIDEOS) return; // Limit videos per configuration
      
      try {
        const title = el.querySelector('.title a').text.trim();
        const duration = el.querySelector('.duration').text.trim();
        const viewsText = el.querySelector('.views').text.trim();
        const views = viewsText.replace(/\D/g, '');
        const thumbnail = el.querySelector('img').getAttribute('data-src') || el.querySelector('img').getAttribute('src');
        const videoPath = el.querySelector('a').getAttribute('href');
        const videoId = videoPath.split('/')[2]; // Extract video ID from URL path
        
        // Create embed URL
        const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;
        
        videos.push({
          id: videoId,
          title,
          duration,
          views,
          thumbnail,
          videoUrl: `https://www.xvideos.com${videoPath}`,
          embedUrl,
          categories: [], // XVideos doesn't show categories on the main page
          source: 'XVideos'
        });
      } catch (err) {
        console.error(`Error parsing video element ${i}:`, err);
      }
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching XVideos videos:', error);
    return [];
  }
};

// API endpoint to get videos from both sources
app.get('/api/videos', async (req, res) => {
  try {
    const [pornhubVideos, xVideosVideos] = await Promise.allSettled([
      parseVideosFromPornhub(),
      parseVideosFromXVideos()
    ]);
    
    const videos = [
      ...(pornhubVideos.status === 'fulfilled' ? pornhubVideos.value : []),
      ...(xVideosVideos.status === 'fulfilled' ? xVideosVideos.value : [])
    ];
    
    // Shuffle the videos to mix sources
    const shuffledVideos = videos.sort(() => Math.random() - 0.5);
    
    res.json({ 
      success: true, 
      count: shuffledVideos.length,
      videos: shuffledVideos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch videos', 
      error: error.message 
    });
  }
});

// API endpoint to get a specific video by ID and source
app.get('/api/videos/:source/:id', async (req, res) => {
  const { source, id } = req.params;
  
  try {
    let videoData = null;
    
    if (source.toLowerCase() === 'pornhub') {
      const response = await axios.get(`https://www.pornhub.com/view_video.php?viewkey=${id}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      
      const $ = cheerio.load(response.data);
      
      videoData = {
        id,
        title: $('h1.title').text().trim(),
        views: $('.count').first().text().trim(),
        rating: $('.percent').text().trim(),
        duration: $('span.duration').text().trim(),
        uploadDate: $('.uploadDate').text().trim(),
        embedUrl: `https://www.pornhub.com/embed/${id}`,
        categories: [],
        source: 'Pornhub'
      };
      
      // Extract categories
      $('.categoriesWrapper a.item').each((i, el) => {
        const category = $(el).text().trim();
        if (category) videoData.categories.push(category);
      });
      
    } else if (source.toLowerCase() === 'xvideos') {
      const response = await axios.get(`https://www.xvideos.com/video${id}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      
      const root = parse(response.data);
      
      videoData = {
        id,
        title: root.querySelector('h2.page-title').text.trim(),
        views: root.querySelector('.mobile-hide .views-value').text.trim(),
        duration: root.querySelector('.duration').text.trim(),
        embedUrl: `https://www.xvideos.com/embedframe/${id}`,
        categories: [],
        source: 'XVideos'
      };
      
      // Extract categories (tags)
      const tagElements = root.querySelectorAll('.video-tags-list a');
      tagElements.forEach(el => {
        const category = el.text.trim();
        if (category) videoData.categories.push(category);
      });
    }
    
    if (videoData) {
      res.json({ success: true, video: videoData });
    } else {
      res.status(404).json({ success: false, message: 'Video not found' });
    }
  } catch (error) {
    console.error(`Error fetching ${source} video ${id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to fetch ${source} video ${id}`, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
