#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// New podcasts that need internal links (directories created but not yet linked)
const newPodcastSlugs = {
  "The Prof G Pod with Scott Galloway": "the-prof-g-pod-with-scott-galloway",
  "PBD Podcast": "pbd-podcast",
  "The Glenn Beck Program": "the-glenn-beck-program",
  "The Indicator from Planet Money": "the-indicator-from-planet-money",
  "The Joe Rogan Experience": "the-joe-rogan-experience",
  "Stuff You Should Know": "stuff-you-should-know",
  "RealClearPolitics Podcast": "realclearpolitics-podcast",
  "The Matt Walsh Show": "the-matt-walsh-show",
  "The Daily Beans": "the-daily-beans",
  "What Next | Daily News and Analysis": "what-next-daily-news-and-analysis",
  "The Journal.": "the-journal",
  "Marketplace": "marketplace",
  "Prof G Markets": "prof-g-markets",
  "a16z Podcast": "a16z-podcast",
  "The NPR Politics Podcast": "the-npr-politics-podcast",
  "CNBC's \"Fast Money\"": "cnbc-s-fast-money",
  "The Tucker Carlson Show": "the-tucker-carlson-show",
  "All-In with Chamath, Jason, Sacks & Friedberg": "all-in-with-chamath-jason-sacks-friedberg",
  "Latent Space: The AI Engineer Podcast": "latent-space-the-ai-engineer-podcast",
  "The Hugh Hewitt Show: Highly Concentrated": "the-hugh-hewitt-show-highly-concentrated",
  "Modern Wisdom": "modern-wisdom",
  "The Bill Simmons Podcast": "the-bill-simmons-podcast",
  "Huberman Lab": "huberman-lab",
  "The Andrew Klavan Show": "the-andrew-klavan-show",
  "Pardon My Take": "pardon-my-take",
  "Call Her Daddy": "call-her-daddy",
  "Happier with Gretchen Rubin": "happier-with-gretchen-rubin",
  "Office Ladies": "office-ladies",
  "The Twenty Minute VC (20VC): Venture Capital | Startup Funding | The Pitch": "the-twenty-minute-vc-20vc-venture-capital-startup-funding-the-pitch"
};

const briefsDir = path.join(__dirname, '..', 'podbrief.info', 'briefs');
let filesProcessed = 0;
let linksAdded = 0;

console.log('Adding internal links for 29 new podcast directories...\n');

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
    const slug = newPodcastSlugs[podcastName];
    
    if (!slug) {
      filesProcessed++;
      continue; // Only update new directories
    }
    
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
