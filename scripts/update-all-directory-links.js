#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all podcast slugs from directories
const podcastsDir = path.join(__dirname, '..', 'podbrief.info', 'podcasts');
const slugs = {};

fs.readdirSync(podcastsDir).forEach(file => {
  if (file.endsWith('.html')) {
    const slug = file.replace('.html', '');
    const content = fs.readFileSync(path.join(podcastsDir, file), 'utf8');
    const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
    if (titleMatch) {
      slugs[titleMatch[1]] = slug;
    }
  }
});

console.log(`Found ${Object.keys(slugs).length} podcast directories\n`);

const briefsDir = path.join(__dirname, '..', 'podbrief.info', 'briefs');
let filesProcessed = 0;
let linksAdded = 0;

const podcastDirs = fs.readdirSync(briefsDir);

for (const podcastId of podcastDirs) {
  const episodesPath = path.join(briefsDir, podcastId);
  if (!fs.statSync(episodesPath).isDirectory()) continue;
  
  const episodes = fs.readdirSync(episodesPath).filter(f => f.endsWith('.html'));
  
  for (const episode of episodes) {
    const filePath = path.join(episodesPath, episode);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const podcastMatch = content.match(/<p class="podcast-name">([^<]+)<\/p>/);
    if (!podcastMatch) continue;
    
    const podcastName = podcastMatch[1];
    const slug = slugs[podcastName];
    
    if (!slug) {
      filesProcessed++;
      continue;
    }
    
    if (content.includes('more-episodes-section')) {
      filesProcessed++;
      continue;
    }
    
    const linkingSection = `        <div class="more-episodes-section" style="margin-top: 2rem; padding: 1.5rem; background: rgba(139, 92, 246, 0.1); border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.3);">
            <h3 style="color: #8b5cf6; font-size: 1.1rem; margin-bottom: 0.75rem;">More from ${podcastName}</h3>
            <p style="color: #ccc; margin-bottom: 1rem;">Explore all episode briefs from this podcast</p>
            <a href="/podcasts/${slug}.html" style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">View All Episodes →</a>
        </div>
`;
    
    content = content.replace(
      '<div class="cta-box">',
      linkingSection + '        <div class="cta-box">'
    );
    
    fs.writeFileSync(filePath, content);
    filesProcessed++;
    linksAdded++;
    
    if (filesProcessed % 200 === 0) {
      console.log(`Processed ${filesProcessed} files...`);
    }
  }
}

console.log(`\n✅ Processed ${filesProcessed} files`);
console.log(`✅ Added internal links to ${linksAdded} briefs`);
