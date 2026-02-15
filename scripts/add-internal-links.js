#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map podcast names to directory slugs
const podcastSlugs = {
  "The MeidasTouch Podcast": "the-meidastouch-podcast",
  "The Dan Le Batard Show with Stugotz": "the-dan-le-batard-show-with-stugotz",
  "The President's Daily Brief": "the-president-s-daily-brief",
  "Up First from NPR": "up-first-from-npr",
  "The Smerconish Podcast": "the-smerconish-podcast",
  "The Megyn Kelly Show": "the-megyn-kelly-show",
  "The Daily": "the-daily",
  "Bloomberg Daybreak: US Edition": "bloomberg-daybreak-us-edition",
  "The Charlie Kirk Show": "the-charlie-kirk-show",
  "The Ben Shapiro Show": "the-ben-shapiro-show",
  "Breaking Points with Krystal and Saagar": "breaking-points-with-krystal-and-saagar",
  "TBPN": "tbpn",
  "Apple News Today": "apple-news-today",
  "Morning Brew Daily": "morning-brew-daily",
  "TED Talks Daily": "ted-talks-daily",
  "The Rubin Report": "the-rubin-report",
  "Verdict with Ted Cruz": "verdict-with-ted-cruz",
  "Today, Explained": "today-explained",
  "Global News Podcast": "global-news-podcast"
};

const briefsDir = path.join(__dirname, '..', 'podbrief.info', 'briefs');
let filesProcessed = 0;
let linksAdded = 0;

console.log('Adding internal links to brief pages...\n');

const podcastDirs = fs.readdirSync(briefsDir);

for (const podcastId of podcastDirs) {
  const episodesPath = path.join(briefsDir, podcastId);
  if (!fs.statSync(episodesPath).isDirectory()) continue;
  
  const episodes = fs.readdirSync(episodesPath).filter(f => f.endsWith('.html'));
  
  for (const episode of episodes) {
    const filePath = path.join(episodesPath, episode);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract podcast name
    const podcastMatch = content.match(/<p class="podcast-name">([^<]+)<\/p>/);
    if (!podcastMatch) continue;
    
    const podcastName = podcastMatch[1];
    const slug = podcastSlugs[podcastName];
    
    if (!slug) continue; // Only add links for podcasts with directory pages
    
    // Check if already has internal links
    if (content.includes('more-episodes-section')) {
      filesProcessed++;
      continue;
    }
    
    // Add internal linking section before the CTA box
    const linkingSection = `        <div class="more-episodes-section" style="margin-top: 2rem; padding: 1.5rem; background: rgba(139, 92, 246, 0.1); border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.3);">
            <h3 style="color: #8b5cf6; font-size: 1.1rem; margin-bottom: 0.75rem;">More from ${podcastName}</h3>
            <p style="color: #ccc; margin-bottom: 1rem;">Explore all episode briefs from this podcast</p>
            <a href="/podcasts/${slug}.html" style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s;">View All Episodes →</a>
        </div>
`;
    
    content = content.replace(
      '<div class="cta-box">',
      linkingSection + '        <div class="cta-box">'
    );
    
    fs.writeFileSync(filePath, content);
    filesProcessed++;
    linksAdded++;
    
    if (filesProcessed % 100 === 0) {
      console.log(`Processed ${filesProcessed} files...`);
    }
  }
}

console.log(`\n✅ Processed ${filesProcessed} files`);
console.log(`✅ Added internal links to ${linksAdded} briefs`);
