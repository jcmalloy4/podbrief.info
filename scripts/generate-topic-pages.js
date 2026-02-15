#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define topics and their associated podcasts
const topics = {
  "news": {
    title: "News & Current Affairs",
    description: "Stay informed with AI-powered briefs from top news podcasts",
    podcasts: [
      "The Daily",
      "Up First from NPR",
      "WSJ What's News",
      "The President's Daily Brief",
      "Global News Podcast",
      "Bloomberg Daybreak: US Edition",
      "Apple News Today",
      "Today, Explained"
    ]
  },
  "politics": {
    title: "Politics & Commentary",
    description: "Get the key insights from political podcasts across the spectrum",
    podcasts: [
      "The MeidasTouch Podcast",
      "The Ben Shapiro Show",
      "The Charlie Kirk Show",
      "Breaking Points with Krystal and Saagar",
      "The Megyn Kelly Show",
      "The Smerconish Podcast",
      "Verdict with Ted Cruz",
      "The Rubin Report"
    ]
  },
  "business": {
    title: "Business & Finance",
    description: "Catch up on business news and insights from leading podcasts",
    podcasts: [
      "Morning Brew Daily",
      "Bloomberg Daybreak: US Edition"
    ]
  },
  "sports": {
    title: "Sports & Entertainment",
    description: "Get briefs from top sports and entertainment podcasts",
    podcasts: [
      "The Dan Le Batard Show with Stugotz"
    ]
  },
  "education": {
    title: "Education & Ideas",
    description: "Explore thought-provoking ideas from educational podcasts",
    podcasts: [
      "TED Talks Daily"
    ]
  }
};

// Find all briefs for podcasts in a topic
function findBriefsForTopic(topicPodcasts) {
  const briefs = [];
  const briefsDir = path.join(__dirname, '..', 'podbrief.info', 'briefs');
  
  const podcastDirs = fs.readdirSync(briefsDir);
  
  for (const podcastId of podcastDirs) {
    const episodesPath = path.join(briefsDir, podcastId);
    if (!fs.statSync(episodesPath).isDirectory()) continue;
    
    const episodes = fs.readdirSync(episodesPath).filter(f => f.endsWith('.html'));
    
    for (const episode of episodes) {
      const filePath = path.join(episodesPath, episode);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if this brief is from one of the topic's podcasts
      for (const podcastName of topicPodcasts) {
        if (content.includes(`<p class="podcast-name">${podcastName}</p>`)) {
          const titleMatch = content.match(/<h1 class="episode-title">([^<]+)<\/h1>/);
          const title = titleMatch ? titleMatch[1] : 'Episode';
          
          briefs.push({
            url: `/briefs/${podcastId}/${episode}`,
            title: title,
            podcast: podcastName
          });
          break;
        }
      }
    }
  }
  
  return briefs;
}

// Generate topic page HTML
function generateTopicPage(topicSlug, topicData, briefs) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topicData.title} Podcast Briefs | PodBrief</title>
    <meta name="description" content="${topicData.description}. Browse ${briefs.length}+ episode briefs.">
    <link rel="canonical" href="https://podbrief.info/topics/${topicSlug}">
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .topic-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        
        .topic-header {
            text-align: center;
            margin-bottom: 3rem;
            padding-top: 2rem;
        }
        
        .topic-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .topic-header p {
            font-size: 1.2rem;
            color: #ccc;
            max-width: 700px;
            margin: 0 auto;
        }
        
        .episodes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .episode-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.25rem;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
        }
        
        .episode-card:hover {
            transform: translateY(-4px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }
        
        .episode-card .podcast-name {
            color: #8b5cf6;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .episode-card h3 {
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.4;
            margin: 0;
        }
        
        @media (max-width: 768px) {
            .topic-header h1 {
                font-size: 2rem;
            }
            
            .episodes-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="navbar-content">
            <div class="navbar-logo">
                <a href="/" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
                    <img src="/Assets/podbrief_logo.png" alt="PodBrief Logo">
                    <span>PodBrief</span>
                </a>
            </div>
            <nav class="navbar-links">
                <a href="/">Home</a>
                <a href="/browse.html">Browse Briefs</a>
                <a href="/faq.html">FAQ</a>
            </nav>
        </div>
    </header>

    <div class="topic-container">
        <div class="topic-header">
            <h1>${topicData.title}</h1>
            <p>${topicData.description}</p>
            <p style="margin-top: 1rem; color: #888;">${briefs.length} episode briefs available</p>
        </div>

        <div class="episodes-grid">
${briefs.slice(0, 50).map(brief => `            <div class="episode-card" onclick="window.location.href='${brief.url}'">
                <div class="podcast-name">${brief.podcast}</div>
                <h3>${brief.title}</h3>
            </div>`).join('\n')}
        </div>
    </div>

    <footer class="footer">
        <div class="footer-container">
            <p>&copy; 2024 PodBrief. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

  return html;
}

// Main execution
console.log('Generating topic/category pages...\n');

const topicsDir = path.join(__dirname, '..', 'podbrief.info', 'topics');
if (!fs.existsSync(topicsDir)) {
  fs.mkdirSync(topicsDir, { recursive: true });
}

let totalPages = 0;
let totalBriefs = 0;

for (const [slug, data] of Object.entries(topics)) {
  console.log(`Processing: ${data.title}`);
  const briefs = findBriefsForTopic(data.podcasts);
  
  if (briefs.length === 0) {
    console.log(`  ⚠️  No briefs found\n`);
    continue;
  }
  
  const html = generateTopicPage(slug, data, briefs);
  const outputPath = path.join(topicsDir, `${slug}.html`);
  
  fs.writeFileSync(outputPath, html);
  console.log(`  ✅ Created /topics/${slug}.html (${briefs.length} episodes)\n`);
  
  totalPages++;
  totalBriefs += briefs.length;
}

console.log(`\n✅ Generated ${totalPages} topic pages covering ${totalBriefs} briefs`);
