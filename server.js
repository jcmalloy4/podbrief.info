const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Helper function to generate Apple Smart App Banner
function generateAppBanner(appId = 'your-app-id') {
  return `
    <!-- Apple Smart App Banner -->
    <meta name="apple-itunes-app" content="app-id=${appId}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  `;
}

// Helper function to generate common HTML structure
function generatePageHTML({ title, description, imageUrl, url, content, deepLink, isEpisode = false }) {
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
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${title}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="${isEpisode ? 'article' : 'website'}">
    <meta property="og:site_name" content="PodBrief">
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Additional meta tags for better SEO -->
    <meta name="description" content="${description}">
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
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #333;
            border-radius: 50%;
            border-top-color: #6366f1;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loading-text {
            color: #888;
            margin-bottom: 2rem;
        }
        
        .content-preview {
            max-width: 600px;
            margin: 2rem auto;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            backdrop-filter: blur(10px);
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
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Opening PodBrief App...</p>
        
        ${content ? `
        <div class="content-preview">
            ${content}
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
                    window.location.href = 'https://apps.apple.com/app/your-app-id';
                }, 2000);
            } else if (isAndroid) {
                // Android intent URL
                const intentUrl = '${deepLink.replace('podbrief://', 'intent://')}#Intent;scheme=podbrief;package=com.johncmalloy4.PodBrief;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.johncmalloy4.PodBrief;end';
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
  
  // In a real app, fetch podcast data from Firestore
  // For now, we'll use generic data with podcast-specific info
  const podcastData = {
    title: `Podcast ${podcastId} - PodBrief`,
    description: `Discover AI-powered briefings for all episodes of this podcast. Get instant summaries and key insights from every episode.`,
    imageUrl: `https://podbrief.info/Assets/podbrief_preview.png`,
    podcastId
  };
  
  const content = `
    <div class="preview-title">${podcastData.title}</div>
    <div class="preview-description">${podcastData.description}</div>
    <a href="https://apps.apple.com/app/your-app-id" class="cta-button">Get PodBrief App</a>
  `;
  
  const html = generatePageHTML({
    title: podcastData.title,
    description: podcastData.description,
    imageUrl: podcastData.imageUrl,
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    content: content,
    deepLink: `podbrief://podcast/${podcastId}`,
    isEpisode: false
  });
  
  res.send(html);
});

// Dynamic briefing route handler (episodes shared as briefings)
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
  
  // In a real app, fetch episode and podcast data from Firestore
  const briefingData = {
    title: `AI Briefing - Episode ${episodeGuid.substring(0, 8)}... - PodBrief`,
    description: `Get an instant AI-powered briefing of this podcast episode. Key insights, main topics, and takeaways in just minutes.`,
    imageUrl: `https://podbrief.info/Assets/podbrief_preview.png`,
    podcastId,
    episodeGuid
  };
  
  const content = `
    <div class="preview-title">🎧 Episode Briefing Ready</div>
    <div class="preview-description">This AI-generated briefing contains the key insights, main topics, and important takeaways from this podcast episode.</div>
    <a href="https://apps.apple.com/app/your-app-id" class="cta-button">Read Full Briefing</a>
  `;
  
  const html = generatePageHTML({
    title: briefingData.title,
    description: briefingData.description,
    imageUrl: briefingData.imageUrl,
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    content: content,
    deepLink: `podbrief://briefing/${podcastId}/${episodeGuid}`,
    isEpisode: true
  });
  
  res.send(html);
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
}); 