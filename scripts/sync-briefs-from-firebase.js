#!/usr/bin/env node

/**
 * Sync Briefs from Firebase Storage
 * 
 * This script:
 * 1. Connects to Firebase Storage
 * 2. Fetches all briefs from podcasts/{podcastId}/episodes/{episodeGuid}/briefing.json
 * 3. Generates static HTML files for new briefs
 * 4. Updates sitemap-briefs.xml
 * 5. Reports stats
 */

require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../firebase-service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error.message);
    process.exit(1);
  }
}

const storage = admin.storage().bucket('podbrief-76274.firebasestorage.app');
const db = admin.firestore();

// Stats tracking
const stats = {
  totalBriefsInFirebase: 0,
  existingStaticBriefs: 0,
  newBriefsGenerated: 0,
  errors: 0,
  startTime: Date.now()
};

/**
 * Check if a static brief file already exists
 */
function briefExists(podcastId, episodeGuid) {
  const filePath = path.join(__dirname, '..', 'briefs', podcastId, `${episodeGuid}.html`);
  return fs.existsSync(filePath);
}

/**
 * Generate HTML for a brief
 */
function generateBriefHTML(podcastInfo, episodeInfo, briefing) {
  const podcastTitle = podcastInfo.title || 'Unknown Podcast';
  const episodeTitle = episodeInfo.title || 'Episode';
  const podcastId = podcastInfo.id || '';
  const episodeGuid = episodeInfo.guid || '';
  
  let briefingHTML = '<h2>Key Takeaways</h2><ul>';
  const takeaways = briefing.key_takeaways || [];
  for (const t of takeaways) {
    if (typeof t === 'object' && t.title) {
      briefingHTML += `<li><strong>${t.title}</strong> - ${t.summary || ''}</li>`;
    } else {
      briefingHTML += `<li>${t}</li>`;
    }
  }
  briefingHTML += '</ul>';
  
  const deepDives = briefing.deep_dives || [];
  if (deepDives.length > 0) {
    briefingHTML += '<h2>Deep Dive</h2>';
    for (const dd of deepDives) {
      if (typeof dd === 'object' && dd.title) {
        briefingHTML += `<h3>${dd.title}</h3><ul>`;
        for (const bullet of (dd.bullets || [])) {
          briefingHTML += `<li>${bullet}</li>`;
        }
        briefingHTML += '</ul>';
      }
    }
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${episodeTitle} | ${podcastTitle} Brief - PodBrief</title>
    <meta name="description" content="AI-generated brief for ${episodeTitle} from ${podcastTitle}.">
    <link rel="canonical" href="https://podbrief.info/briefs/${podcastId}/${episodeGuid}.html">
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .brief-container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
        .brief-header { margin-bottom: 2rem; padding-top: 2rem; }
        .podcast-name { color: #53a0fe; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .episode-title { font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 1rem; line-height: 1.3; }
        .brief-content { line-height: 1.8; color: #ccc; }
        .brief-content h2 { color: #fff; font-size: 1.8rem; margin-top: 2.5rem; margin-bottom: 1rem; }
        .brief-content h3 { color: #53a0fe; font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.75rem; }
        .brief-content ul { margin: 1.5rem 0; padding-left: 2rem; }
        .brief-content li { margin: 0.75rem 0; }
        .brief-content strong { color: #fff; }
        .cta-box { background: linear-gradient(135deg, rgba(83, 160, 254, 0.2), rgba(59, 142, 234, 0.2)); padding: 2rem; border-radius: 12px; margin-top: 3rem; text-align: center; border: 1px solid rgba(83, 160, 254, 0.3); }
        .cta-box h3 { color: #fff; margin-bottom: 1rem; }
        .cta-box p { color: #ccc; margin-bottom: 1.5rem; }
        @media (max-width: 768px) { .episode-title { font-size: 1.5rem; } .brief-container { padding: 1rem; } }
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
                <a href="/browse.html">Browse</a>
                <a href="/all-podcasts.html">Podcasts</a>
                <a href="/topics.html">Topics</a>
                <a href="/blog">Blog</a>
                <a href="/faq.html">FAQ</a>
            </nav>
        </div>
    </header>
    <main class="brief-container">
        <div class="brief-header">
            <p class="podcast-name">${podcastTitle}</p>
            <h1 class="episode-title">${episodeTitle}</h1>
        </div>
        <article class="brief-content">
            ${briefingHTML}
        </article>
        <div class="cta-box">
            <h3>Listen smarter with PodBrief</h3>
            <p>Get AI-powered briefs for all your favorite podcasts, plus a daily feed that keeps you informed.</p>
            <a href="https://apps.apple.com/us/app/podbrief-ai-podcast-app/id6748547717" class="btn-primary">Download on the App Store</a>
        </div>
    </main>
    <footer class="footer">
        <div class="footer-container">
            <p>&copy; 2024 PodBrief. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * Save brief HTML to file
 */
function saveBriefHTML(podcastId, episodeGuid, html) {
  const dir = path.join(__dirname, '..', 'briefs', podcastId);
  const filePath = path.join(dir, `${episodeGuid}.html`);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, html);
}

/**
 * Fetch all briefs from Firebase Storage
 */
async function fetchAllBriefs() {
  console.log('🔍 Scanning Firebase Storage for briefs...\n');
  
  const [files] = await storage.getFiles({ prefix: 'podcasts/' });
  const briefFiles = files.filter(file => file.name.endsWith('/briefing.json'));
  
  stats.totalBriefsInFirebase = briefFiles.length;
  console.log(`Found ${briefFiles.length} briefs in Firebase Storage\n`);
  
  let processed = 0;
  
  for (const file of briefFiles) {
    try {
      // Parse path: podcasts/{podcastId}/episodes/{episodeGuid}/briefing.json
      const parts = file.name.split('/');
      if (parts.length !== 5) continue;
      
      const podcastId = parts[1];
      const episodeGuid = parts[3];
      
      // Check if static file already exists
      if (briefExists(podcastId, episodeGuid)) {
        stats.existingStaticBriefs++;
        processed++;
        if (processed % 100 === 0) {
          console.log(`Processed ${processed}/${briefFiles.length} briefs...`);
        }
        continue;
      }
      
      // Download briefing JSON
      const [briefingData] = await file.download();
      const briefing = JSON.parse(briefingData.toString());
      
      // Fetch podcast and episode metadata from Firestore
      const [podcastDoc, episodeDoc] = await Promise.all([
        db.collection('podcasts').doc(podcastId).get(),
        db.collection('podcasts').doc(podcastId).collection('episodes').doc(episodeGuid).get()
      ]);
      
      const podcastInfo = podcastDoc.exists ? { ...podcastDoc.data(), id: podcastId } : { id: podcastId };
      const episodeInfo = episodeDoc.exists ? { ...episodeDoc.data(), guid: episodeGuid } : { guid: episodeGuid };
      
      // Generate and save HTML
      const html = generateBriefHTML(podcastInfo, episodeInfo, briefing);
      saveBriefHTML(podcastId, episodeGuid, html);
      
      stats.newBriefsGenerated++;
      console.log(`✅ Generated: ${podcastInfo.title || podcastId} - ${episodeInfo.title || episodeGuid}`);
      
      processed++;
      if (processed % 100 === 0) {
        console.log(`Processed ${processed}/${briefFiles.length} briefs...`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file.name}:`, error.message);
      stats.errors++;
    }
  }
  
  console.log(`\n✅ Processed all ${processed} briefs`);
}

/**
 * Update sitemap with all briefs
 */
async function updateSitemap() {
  console.log('\n📝 Updating sitemap...');
  
  const briefsDir = path.join(__dirname, '..', 'briefs');
  const sitemapPath = path.join(__dirname, '..', 'sitemap-briefs.xml');
  
  let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  let urlCount = 0;
  
  // Recursively find all .html files in briefs directory
  function findBriefFiles(dir) {
    const items = fs.readdirSync(dir);
    let files = [];
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(findBriefFiles(fullPath));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  const allBriefFiles = findBriefFiles(briefsDir);
  
  for (const file of allBriefFiles) {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    const url = relativePath.replace(/\\/g, '/'); // Fix Windows paths
    sitemapContent += `  <url><loc>https://podbrief.info/${url}</loc><priority>0.7</priority></url>\n`;
    urlCount++;
  }
  
  sitemapContent += '</urlset>\n';
  
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`✅ Sitemap updated with ${urlCount} brief URLs`);
}

/**
 * Print final stats
 */
function printStats() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 SYNC COMPLETE');
  console.log('='.repeat(50));
  console.log(`Total briefs in Firebase: ${stats.totalBriefsInFirebase}`);
  console.log(`Existing static briefs:   ${stats.existingStaticBriefs}`);
  console.log(`New briefs generated:     ${stats.newBriefsGenerated}`);
  console.log(`Errors:                   ${stats.errors}`);
  console.log(`Duration:                 ${duration}s`);
  console.log('='.repeat(50) + '\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('\n🚀 Starting brief sync from Firebase...\n');
    
    await fetchAllBriefs();
    await updateSitemap();
    printStats();
    
    if (stats.newBriefsGenerated > 0) {
      console.log('💡 TIP: Run git add/commit/push to deploy new briefs\n');
    } else {
      console.log('✅ All briefs are up to date!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
