const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Dynamic briefing route handler
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
  
  // In a real app, you'd fetch this from your database
  // For now, we'll use generic data but the structure is ready
  const briefingData = {
    title: `PodBrief - AI-Powered Podcast Briefings`,
    description: `Get instant AI-powered briefings for your favorite podcast episodes. Save time and never miss key insights.`,
    imageUrl: `https://podbrief.info/Assets/podbrief_preview.png`,
    podcastId,
    episodeGuid
  };
  
  const html = `
<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${briefingData.title}</title>
    
    <!-- Open Graph metadata for rich previews -->
    <meta property="og:title" content="${briefingData.title}">
    <meta property="og:description" content="${briefingData.description}">
    <meta property="og:image" content="${briefingData.imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="PodBrief - AI-Powered Podcast Briefings">
    <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="PodBrief">
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${briefingData.title}">
    <meta name="twitter:description" content="${briefingData.description}">
    <meta name="twitter:image" content="${briefingData.imageUrl}">
    
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
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Opening PodBrief App...</p>
    </div>

    <script>
        // Automatic app redirect
        setTimeout(() => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            if (isIOS) {
                // Try to open app, fallback to App Store
                window.location.href = 'podbrief://briefing/${podcastId}/${episodeGuid}';
                setTimeout(() => {
                    window.location.href = 'https://apps.apple.com/app/your-app-id';
                }, 2000);
            } else if (isAndroid) {
                // Android intent URL
                window.location.href = 'intent://briefing/${podcastId}/${episodeGuid}#Intent;scheme=podbrief;package=com.johncmalloy4.PodBrief;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.johncmalloy4.PodBrief;end';
            } else {
                // Desktop fallback
                window.location.href = '/briefing/?podcast=${podcastId}&episode=${episodeGuid}';
            }
        }, 1000);
    </script>
</body>
</html>`;

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