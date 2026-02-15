#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const briefsDir = path.join(__dirname, '..', 'podbrief.info', 'briefs');
let filesProcessed = 0;
let schemaAdded = 0;

console.log('Adding schema markup to brief pages...\n');

const podcastDirs = fs.readdirSync(briefsDir);

for (const podcastId of podcastDirs) {
  const episodesPath = path.join(briefsDir, podcastId);
  if (!fs.statSync(episodesPath).isDirectory()) continue;
  
  const episodes = fs.readdirSync(episodesPath).filter(f => f.endsWith('.html'));
  
  for (const episode of episodes) {
    const filePath = path.join(episodesPath, episode);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has schema
    if (content.includes('"@type": "PodcastEpisode"')) {
      filesProcessed++;
      continue;
    }
    
    // Extract data
    const podcastMatch = content.match(/<p class="podcast-name">([^<]+)<\/p>/);
    const titleMatch = content.match(/<h1 class="episode-title">([^<]+)<\/h1>/);
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
    
    if (!podcastMatch || !titleMatch) {
      filesProcessed++;
      continue;
    }
    
    const podcastName = podcastMatch[1];
    const episodeTitle = titleMatch[1];
    const description = descMatch ? descMatch[1] : `AI-generated brief for ${episodeTitle} from ${podcastName}.`;
    
    const url = `https://podbrief.info/briefs/${podcastId}/${episode}`;
    
    // Create schema markup
    const schema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "PodcastEpisode",
      "url": "${url}",
      "name": "${episodeTitle.replace(/"/g, '\\"')}",
      "description": "${description.replace(/"/g, '\\"')}",
      "partOfSeries": {
        "@type": "PodcastSeries",
        "name": "${podcastName.replace(/"/g, '\\"')}",
        "url": "https://podbrief.info"
      }
    }
    </script>`;
    
    // Insert schema before </head>
    content = content.replace('</head>', `${schema}\n</head>`);
    
    fs.writeFileSync(filePath, content);
    filesProcessed++;
    schemaAdded++;
    
    if (filesProcessed % 200 === 0) {
      console.log(`Processed ${filesProcessed} files...`);
    }
  }
}

console.log(`\n✅ Processed ${filesProcessed} files`);
console.log(`✅ Added schema markup to ${schemaAdded} briefs`);
