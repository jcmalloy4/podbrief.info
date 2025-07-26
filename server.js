// Load environment variables from .env file in development
require('dotenv').config();

const express = require('express');
const path = require('path');
const axios = require('axios');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3000;

// Firebase Admin SDK setup
try {
  if (!admin.apps.length) {
    // Initialize with service account
    const serviceAccount = require('./firebase-service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.warn('Firebase Admin initialization failed:', error.message);
  console.warn('API integration will use fallback data');
}

// Backend API configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend-service.a.run.app';
const DEFAULT_IMAGE = 'https://podbrief.info/Assets/podbrief_preview.png';
const LOGO_IMAGE = 'https://podbrief.info/Assets/podbrief_logo.png'; // Add your logo URL

// Serve static files
app.use(express.static('.'));

// Helper function to get Firebase auth token for API calls
async function getAuthToken() {
  try {
    // Create a custom token for our service account user
    const uid = 'website-service-user';
    const customToken = await admin.auth().createCustomToken(uid, {
      isWebsiteService: true // Custom claim to identify this as our website service
    });
    
    // Exchange custom token for ID token using the Web API Key
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
      {
        token: customToken,
        returnSecureToken: true
      }
    );
    
    // Return the ID token that your backend can verify
    console.log('Successfully generated Firebase ID token');
    return response.data.idToken;
  } catch (error) {
    console.warn('Firebase auth not available:', error.message);
    return null;
  }
}

// Helper function to make authenticated API calls
async function apiCall(endpoint, params = {}) {
  try {
    const token = await getAuthToken();
    
    const url = `${BACKEND_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      params,
      timeout: 10000 // 10 second timeout
    };

    // Add authorization header if we have a token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`Making authenticated API call to: ${url}`);
    } else {
      console.log(`Making unauthenticated API call to: ${url} (development mode)`);
    }

    const response = await axios.get(url, config);
    console.log(`API call successful, got response with status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error.response?.status, error.response?.data || error.message);
    
    // If authentication failed, let's try to provide helpful information
    if (error.response?.status === 401) {
      console.log('Authentication failed. For production deployment, ensure Firebase Admin SDK is properly configured.');
    }
    
    return null;
  }
}

// Function to fetch podcast details
async function fetchPodcastDetails(feedId) {
  try {
    // First try to get episodes to get feed info
    const data = await apiCall(`/podcast-index/episodes/${feedId}`, { max: 1 });
    
    if (data && data.feed) {
      return {
        title: data.feed.title,
        description: data.feed.description,
        imageUrl: data.feed.image || DEFAULT_IMAGE,
        author: data.feed.author,
        websiteUrl: data.feed.link,
        episodeCount: data.feed.episodeCount
      };
    }
  } catch (error) {
    console.error('Error fetching podcast details:', error);
  }
  
  return null;
}

// Function to fetch episode details
async function fetchEpisodeDetails(feedId, episodeGuid) {
  try {
    const data = await apiCall(`/podcast-index/episodes/${feedId}`);
    
    if (data && data.items) {
      // Find the specific episode
      const episode = data.items.find(item => 
        item.guid === episodeGuid || 
        item.guid === decodeURIComponent(episodeGuid)
      );
      
      if (episode) {
        return {
          title: episode.title,
          description: episode.description,
          imageUrl: episode.image || data.feed?.image || DEFAULT_IMAGE,
          audioUrl: episode.enclosureUrl,
          publishedDate: episode.datePublishedPretty,
          duration: episode.duration,
          podcastTitle: data.feed?.title,
          podcastImage: data.feed?.image || DEFAULT_IMAGE
        };
      }
    }
  } catch (error) {
    console.error('Error fetching episode details:', error);
  }
  
  return null;
}

// Function to check if briefing exists
async function checkBriefingStatus(podcastId, episodeGuid) {
  try {
    const data = await apiCall('/check-briefing-status', {
      podcast_id: podcastId,
      episode_original_guid: episodeGuid
    });
    
    return data && data.exists;
  } catch (error) {
    console.error('Error checking briefing status:', error);
    return false;
  }
}

// Helper function to generate Apple Smart App Banner
function generateAppBanner(appId = '6748547717') {
  return `
    <!-- Apple Smart App Banner -->
    <meta name="apple-itunes-app" content="app-id=${appId}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  `;
}

// Helper function to create image composition with logo + podcast/episode image
function createImageComposition(contentImageUrl) {
  // In a full implementation, you might want to create a dynamic image service
  // that combines your logo with the podcast/episode image
  // For now, we'll use the content image as primary and mention it's from PodBrief
  return contentImageUrl || DEFAULT_IMAGE;
}

// Helper function to clean HTML from text
function cleanHtml(text) {
  if (!text) return '';
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Decode HTML entities
  cleaned = cleaned.replace(/&quot;/g, '"')
                  .replace(/&apos;/g, "'")
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&amp;/g, '&');
  return cleaned;
}

// Helper function to generate common HTML structure
function generatePageHTML({ title, description, imageUrl, url, content, deepLink, isEpisode = false }) {
  const compositeImage = imageUrl || DEFAULT_IMAGE;
  const cleanDescription = cleanHtml(description);
  
  return `
<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    ${generateAppBanner()}
    
    <!-- Open Graph metadata for rich previews -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${cleanDescription}">
    <meta property="og:image" content="${compositeImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${title}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="${isEpisode ? 'article' : 'website'}">
    <meta property="og:site_name" content="PodBrief">
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${cleanDescription}">
    <meta name="twitter:image" content="${compositeImage}">
    
    <!-- Additional meta tags for better SEO -->
    <meta name="description" content="${cleanDescription}">
    <meta name="keywords" content="podcast, AI, briefing, summary, ${isEpisode ? 'episode' : 'podcast'}">
    <meta name="author" content="PodBrief">
    
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
        }
        
        .logo-section {
            margin-bottom: 2rem;
            position: relative;
            width: 100%;
            max-width: 600px;
        }
        
        .logo-section img.logo {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            margin-bottom: 1rem;
        }
        
        .content-preview {
            max-width: 600px;
            margin: 2rem auto;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            position: relative;
        }
        
        .content-image-container {
            position: relative;
            margin-bottom: 1rem;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .content-image {
            width: 100%;
            border-radius: 12px;
            object-fit: cover;
            aspect-ratio: 1;
        }
        
        .logo-overlay {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .preview-title {
            color: #fff;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .preview-description {
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .podcast-meta {
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .cta-button {
            background: #6366f1;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: background 0.2s;
        }
        
        .cta-button:hover {
            background: #5b5bf6;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="logo-section">
            <img src="${LOGO_IMAGE}" alt="PodBrief Logo" class="logo" onerror="this.style.display='none'">
        </div>
        
        ${content ? `
        <div class="content-preview">
            ${content.replace(
              '<img src=',
              `<div class="content-image-container">
                <img src="${LOGO_IMAGE}" alt="PodBrief Logo" class="logo-overlay">
                <img src=`
            ).replace(
              'class="content-image">',
              'class="content-image"></div>'
            )}
        </div>
        ` : ''}
    </div>

    <script>
        // Automatic app redirect
        setTimeout(() => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            if (isIOS) {
                // Try to open app with deep link
                window.location.href = '${deepLink}';
                setTimeout(() => {
                                                window.location.href = 'https://apps.apple.com/app/podbrief/id6748547717';
                }, 2000);
            } else if (isAndroid) {
                // Android intent URL
                const intentUrl = '${deepLink.replace('podbrief://', 'intent://')}#Intent;scheme=podbrief;package=com.PodBrief;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.PodBrief;end';
                window.location.href = intentUrl;
            } else {
                // Desktop fallback - show install prompt
                document.querySelector('.loading-text').innerHTML = 'Get PodBrief on your phone to continue';
                document.querySelector('.loading-spinner').style.display = 'none';
            }
        }, 1000);
    </script>
</body>
</html>`;
}

// Podcast detail route
app.get('/podcast/:podcastId', async (req, res) => {
  const { podcastId } = req.params;
  
  try {
    // Fetch real podcast data from your API
    const podcastData = await fetchPodcastDetails(podcastId);
    
    if (podcastData) {
      const content = `
        ${podcastData.imageUrl && podcastData.imageUrl !== DEFAULT_IMAGE ? 
          `<img src="${podcastData.imageUrl}" alt="${podcastData.title}" class="content-image">` : ''
        }
        <div class="preview-title">${podcastData.title}</div>
        <div class="podcast-meta">
          ${podcastData.author ? `By ${podcastData.author}` : ''}
          ${podcastData.episodeCount ? ` • ${podcastData.episodeCount} episodes` : ''}
        </div>
        <div class="preview-description">${podcastData.description || 'Discover AI-powered briefings for all episodes of this podcast. Get instant summaries and key insights from every episode.'}</div>
        <a href="https://apps.apple.com/app/podbrief/id6748547717" class="cta-button">Open in PodBrief</a>
      `;
      
      const html = generatePageHTML({
        title: `${podcastData.title} - PodBrief`,
        description: podcastData.description || `Discover AI-powered briefings for ${podcastData.title}. Get instant summaries and key insights from every episode.`,
        imageUrl: podcastData.imageUrl,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        content: content,
        deepLink: `podbrief://podcast/${podcastId}`,
        isEpisode: false
      });
      
      res.send(html);
    } else {
      // Fallback to generic data if API call fails
      throw new Error('Podcast not found');
    }
  } catch (error) {
    console.error('Error in podcast route:', error);
    
    // Fallback with generic data
    const fallbackData = {
      title: `Podcast - PodBrief`,
      description: `Discover AI-powered briefings for all episodes of this podcast. Get instant summaries and key insights from every episode.`,
      imageUrl: DEFAULT_IMAGE
    };
    
    const content = `
      <img src="${fallbackData.imageUrl}" alt="PodBrief" class="content-image">
      <div class="preview-title">🎧 Podcast Details</div>
      <div class="preview-description">${fallbackData.description}</div>
      <a href="https://apps.apple.com/app/podbrief/id6748547717" class="cta-button">Get PodBrief App</a>
    `;
    
    const html = generatePageHTML({
      title: fallbackData.title,
      description: fallbackData.description,
      imageUrl: fallbackData.imageUrl,
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      content: content,
      deepLink: `podbrief://podcast/${podcastId}`,
      isEpisode: false
    });
    
    res.send(html);
  }
});

// Episode detail route
app.get('/episode/:id', async (req, res) => {
  const { id } = req.params;
  
  // Parse the ID: podcastId-episodeGuid (split at first hyphen)
  let podcastId, episodeGuid;
  
  if (id.includes('-')) {
    const parts = id.split('-');
    podcastId = parts[0];
    episodeGuid = parts.slice(1).join('-'); // In case GUID contains dashes
  } else {
    return res.status(404).send('Invalid episode format');
  }
  
  try {
    // Fetch real episode data from your API
    const episodeData = await fetchEpisodeDetails(podcastId, episodeGuid);
    
    if (episodeData) {
      const cleanedDescription = cleanHtml(episodeData.description);
      const content = `
        ${episodeData.imageUrl && episodeData.imageUrl !== DEFAULT_IMAGE ? 
          `<img src="${episodeData.imageUrl}" alt="${episodeData.title}" class="content-image">` : ''
        }
        <div class="preview-title">${episodeData.title}</div>
        <div class="podcast-meta">
          ${episodeData.podcastTitle ? `${episodeData.podcastTitle}` : ''}
          ${episodeData.publishedDate ? ` • ${episodeData.publishedDate}` : ''}
          ${episodeData.duration ? ` • ${Math.floor(episodeData.duration / 60)} min` : ''}
        </div>
        <div class="preview-description">${cleanedDescription || 'Listen to this podcast episode and get an AI-powered briefing with key insights, main topics, and takeaways.'}</div>
        <a href="https://apps.apple.com/app/podbrief/id6748547717" class="cta-button">Open in PodBrief</a>
      `;
      
      const html = generatePageHTML({
        title: `${episodeData.title}${episodeData.podcastTitle ? ` - ${episodeData.podcastTitle}` : ''} - PodBrief`,
        description: cleanedDescription || `Listen to this episode from ${episodeData.podcastTitle || 'this podcast'} and discover key insights with AI-powered briefing.`,
        imageUrl: episodeData.imageUrl,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        content: content,
        deepLink: `podbrief://episode/${podcastId}-${episodeGuid}`,
        isEpisode: true
      });
      
      res.send(html);
    } else {
      throw new Error('Episode not found');
    }
  } catch (error) {
    console.error('Error in episode route:', error);
    
    // Fallback with generic data
    const fallbackData = {
      title: `Episode - PodBrief`,
      description: `Listen to this podcast episode and get an AI-powered briefing with key insights, main topics, and takeaways.`,
      imageUrl: DEFAULT_IMAGE
    };
    
    const content = `
      <div class="preview-title">🎧 Episode Details</div>
      <div class="preview-description">${fallbackData.description}</div>
      <a href="https://apps.apple.com/app/podbrief/id6748547717" class="cta-button">Open in PodBrief</a>
    `;
    
    const html = generatePageHTML({
      title: fallbackData.title,
      description: fallbackData.description,
      imageUrl: fallbackData.imageUrl,
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      content: content,
      deepLink: `podbrief://episode/${podcastId}-${episodeGuid}`,
      isEpisode: true
    });
    
    res.send(html);
  }
});

// Dynamic briefing route handler (briefing sharing)
app.get('/briefing/:id', async (req, res) => {
  const { id } = req.params;
  
  // Parse the ID - could be either:
  // - "podcastId-episodeGuid" (new format)
  // - Handle old format via redirect
  let podcastId, episodeGuid;
  
  if (id.includes('-')) {
    // New format: podcastId-episodeGuid
    const parts = id.split('-');
    podcastId = parts[0];
    episodeGuid = parts.slice(1).join('-'); // In case GUID contains dashes
  } else {
    // If it's just a single ID, redirect to 404
    return res.status(404).send('Invalid briefing format');
  }
  
  try {
    // Fetch episode data and check briefing status
    const [episodeData, briefingExists] = await Promise.all([
      fetchEpisodeDetails(podcastId, episodeGuid),
      checkBriefingStatus(podcastId, episodeGuid)
    ]);
    
    if (episodeData) {
      const content = `
        ${episodeData.imageUrl && episodeData.imageUrl !== DEFAULT_IMAGE ? 
          `<img src="${episodeData.imageUrl}" alt="${episodeData.title}" class="content-image">` : ''
        }
        <div class="preview-title">🎧 ${briefingExists ? 'AI Briefing Ready' : 'Episode Briefing'}</div>
        <div class="podcast-meta">
          ${episodeData.title}
          ${episodeData.podcastTitle ? ` • ${episodeData.podcastTitle}` : ''}
        </div>
        <div class="preview-description">
          ${briefingExists 
            ? 'This AI-generated briefing contains the key insights, main topics, and important takeaways from this podcast episode.' 
            : 'Get an instant AI-powered briefing of this podcast episode with key insights and main topics.'
          }
        </div>
        <a href="https://apps.apple.com/app/podbrief/id6748547717" class="cta-button">
          ${briefingExists ? 'Read Full Briefing' : 'Generate Briefing'}
        </a>
      `;
      
      const html = generatePageHTML({
        title: `AI Briefing - ${episodeData.title}${episodeData.podcastTitle ? ` - ${episodeData.podcastTitle}` : ''} - PodBrief`,
        description: briefingExists 
          ? `Read the AI-generated briefing for "${episodeData.title}". Key insights, main topics, and takeaways in just minutes.`
          : `Get an instant AI-powered briefing of "${episodeData.title}". Key insights, main topics, and takeaways in just minutes.`,
        imageUrl: episodeData.imageUrl,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        content: content,
        deepLink: `podbrief://briefing/${podcastId}/${episodeGuid}`,
        isEpisode: true
      });
      
      res.send(html);
    } else {
      throw new Error('Episode not found for briefing');
    }
  } catch (error) {
    console.error('Error in briefing route:', error);
    
    // Fallback with generic data
    const fallbackData = {
      title: `AI Briefing - PodBrief`,
      description: `Get an instant AI-powered briefing of this podcast episode. Key insights, main topics, and takeaways in just minutes.`,
      imageUrl: DEFAULT_IMAGE
    };
    
    const content = `
      <div class="preview-title">🎧 Episode Briefing</div>
      <div class="preview-description">${fallbackData.description}</div>
      <a href="https://apps.apple.com/app/podbrief/id6748547717" class="cta-button">Read Full Briefing</a>
    `;
    
    const html = generatePageHTML({
      title: fallbackData.title,
      description: fallbackData.description,
      imageUrl: fallbackData.imageUrl,
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      content: content,
      deepLink: `podbrief://briefing/${podcastId}/${episodeGuid}`,
      isEpisode: true
    });
    
    res.send(html);
  }
});

// Handle old format URLs with redirect
app.get('/briefing/:podcastId/:episodeGuid', (req, res) => {
  const { podcastId, episodeGuid } = req.params;
  // Redirect to new format
  res.redirect(301, `/briefing/${podcastId}-${episodeGuid}`);
});

// Handle root and other static routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`PodBrief server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
  console.log(`Backend API: ${BACKEND_URL}`);
}); 