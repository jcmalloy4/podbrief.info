#!/usr/bin/env node

/**
 * Generate Search Index for Browse Page
 * 
 * Creates search-index.json with all podcast names and episode titles
 * for fast client-side search without loading all HTML files
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const briefsDir = path.join(__dirname, '..', 'briefs');
const outputPath = path.join(__dirname, '..', 'search-index.json');

const searchIndex = [];
let processed = 0;
let errors = 0;

function findBriefFiles(dir, podcastId = null) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // This is a podcast folder
            findBriefFiles(fullPath, item);
        } else if (item.endsWith('.html')) {
            try {
                const html = fs.readFileSync(fullPath, 'utf8');
                const dom = new JSDOM(html);
                const doc = dom.window.document;
                
                const podcastName = doc.querySelector('.podcast-name')?.textContent || '';
                const episodeTitle = doc.querySelector('.episode-title')?.textContent || '';
                const episodeGuid = path.basename(item, '.html');
                
                if (podcastName && episodeTitle) {
                    searchIndex.push({
                        podcastId: podcastId,
                        podcastName: podcastName,
                        episodeTitle: episodeTitle,
                        episodeGuid: episodeGuid,
                        url: `/briefs/${podcastId}/${episodeGuid}.html`,
                        // Pre-lowercase for faster search
                        podcastNameLower: podcastName.toLowerCase(),
                        episodeTitleLower: episodeTitle.toLowerCase()
                    });
                }
                
                processed++;
                if (processed % 1000 === 0) {
                    console.log(`Processed ${processed} briefs...`);
                }
            } catch (error) {
                console.error(`Error processing ${fullPath}:`, error.message);
                errors++;
            }
        }
    }
}

console.log('🔍 Generating search index...\n');
findBriefFiles(briefsDir);

// Write search index
fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));

console.log(`\n✅ Search index generated!`);
console.log(`   Total entries: ${searchIndex.length}`);
console.log(`   Processed: ${processed}`);
console.log(`   Errors: ${errors}`);
console.log(`   Output: search-index.json\n`);
