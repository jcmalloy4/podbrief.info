#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Top 50 podcasts
const topPodcasts = [
  "The MeidasTouch Podcast",
  "The Dan Le Batard Show with Stugotz",
  "The President's Daily Brief",
  "Up First from NPR",
  "The Smerconish Podcast",
  "The Megyn Kelly Show",
  "The Daily",
  "Bloomberg Daybreak: US Edition",
  "The Charlie Kirk Show",
  "The Ben Shapiro Show",
  "Breaking Points with Krystal and Saagar",
  "TBPN",
  "Apple News Today",
  "Morning Brew Daily",
  "TED Talks Daily",
  "The Rubin Report",
  "Verdict with Ted Cruz",
  "Today, Explained",
  "Global News Podcast",
  "The Prof G Pod with Scott Galloway",
  "PBD Podcast",
  "The Glenn Beck Program",
  "The Indicator from Planet Money",
  "The Joe Rogan Experience",
  "Stuff You Should Know",
  "RealClearPolitics Podcast",
  "The Matt Walsh Show",
  "The Daily Beans",
  "What Next | Daily News and Analysis",
  "The Journal.",
  "Marketplace",
  "Prof G Markets",
  "a16z Podcast",
  "The NPR Politics Podcast",
  "CNBC's \"Fast Money\"",
  "The Tucker Carlson Show",
  "All-In with Chamath, Jason, Sacks & Friedberg",
  "Latent Space: The AI Engineer Podcast",
  "The Hugh Hewitt Show: Highly Concentrated",
  "Modern Wisdom",
  "The Bill Simmons Podcast",
  "Huberman Lab",
  "The Andrew Klavan Show",
  "Pardon My Take",
  "Call Her Daddy",
  "Happier with Gretchen Rubin",
  "Office Ladies",
  "The Twenty Minute VC (20VC): Venture Capital | Startup Funding | The Pitch"
];

function findBriefsForPodcast(podcastName) {
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
      
      if (content.includes(`<p class="podcast-name">${podcastName}</p>`)) {
        const titleMatch = content.match(/<h1 class="episode-title">([^<]+)<\/h1>/);
        const title = titleMatch ? titleMatch[1] : 'Episode';
        
        briefs.push({
          url: `/briefs/${podcastId}/${episode}`,
          title: title
        });
      }
    }
  }
  
  return briefs;
}

function generateDirectoryPage(podcastName, briefs) {
  const slug = podcastName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${podcastName} - All Episodes | PodBrief</title>
    <meta name="description" content="Browse all ${briefs.length} AI-powered briefs for ${podcastName}. Get instant summaries of every episode.">
    <link rel="canonical" href="https://podbrief.info/podcasts/${slug}">
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .directory-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .directory-header { text-align: center; margin-bottom: 3rem; padding-top: 2rem; }
        .directory-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #fff; }
        .directory-header p { font-size: 1.2rem; color: #ccc; }
        .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .episode-card { background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; }
        .episode-card:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.08); border-color: rgba(99, 102, 241, 0.5); box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2); }
        .episode-card h3 { color: #fff; font-size: 1rem; font-weight: 600; line-height: 1.4; margin: 0; }
        @media (max-width: 768px) { .directory-header h1 { font-size: 2rem; } .episodes-grid { grid-template-columns: 1fr; } }
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
    <div class="directory-container">
        <div class="directory-header">
            <h1>${podcastName}</h1>
            <p>${briefs.length} episode briefs available</p>
        </div>
        <div class="episodes-grid">
${briefs.map(brief => `            <div class="episode-card" onclick="window.location.href='${brief.url}'">
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

  return { html, slug };
}

console.log('Generating top 50 podcast directories...\n');

const podcastsDir = path.join(__dirname, '..', 'podbrief.info', 'podcasts');
if (!fs.existsSync(podcastsDir)) {
  fs.mkdirSync(podcastsDir, { recursive: true });
}

let totalPages = 0;
let totalBriefs = 0;

for (const podcast of topPodcasts) {
  const briefs = findBriefsForPodcast(podcast);
  
  if (briefs.length === 0) continue;
  
  const { html, slug } = generateDirectoryPage(podcast, briefs);
  const outputPath = path.join(podcastsDir, `${slug}.html`);
  
  fs.writeFileSync(outputPath, html);
  console.log(`✅ ${slug} (${briefs.length} episodes)`);
  
  totalPages++;
  totalBriefs += briefs.length;
}

console.log(`\n✅ Generated ${totalPages} directories with ${totalBriefs} total briefs`);
