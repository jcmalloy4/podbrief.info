#!/usr/bin/env python3
"""
Generate SEO pages from PodBrief briefings.
Pulls from GCS, generates HTML, outputs to website repo.
"""
import os
import re
import json
import hashlib
import warnings
from pathlib import Path
from datetime import datetime

warnings.filterwarnings('ignore')

import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage

# Config
SERVICE_ACCOUNT_PATH = "PodBrief/modal_testing/parakeet_transcriber_api/podbrief-76274-firebase-adminsdk-fbsvc-82a48189c2.json"
BUCKET_NAME = "podbrief-76274.firebasestorage.app"
OUTPUT_DIR = "podbrief.info/briefs"
SITE_URL = "https://podbrief.info"

# Initialize Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    pass  # Already initialized

db = firestore.client()
storage_client = storage.Client.from_service_account_json(SERVICE_ACCOUNT_PATH)
bucket = storage_client.bucket(BUCKET_NAME)

def slugify(text):
    """Convert text to URL-friendly slug."""
    if not text:
        return "untitled"
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text[:80] or "untitled"

def get_podcast_info(podcast_id):
    """Get podcast metadata from Firestore."""
    try:
        doc = db.collection('podcasts').document(str(podcast_id)).get()
        if doc.exists:
            return doc.to_dict()
    except Exception as e:
        print(f"Error getting podcast {podcast_id}: {e}")
    return {}

def get_episode_info(podcast_id, episode_guid):
    """Get episode metadata from Firestore."""
    try:
        doc = db.collection('podcasts').document(str(podcast_id)).collection('episodes').document(episode_guid).get()
        if doc.exists:
            return doc.to_dict()
    except Exception as e:
        print(f"Error getting episode {episode_guid}: {e}")
    return {}

def fetch_briefing(blob_path):
    """Fetch briefing content from GCS."""
    try:
        blob = bucket.blob(blob_path)
        content = blob.download_as_text()
        if blob_path.endswith('.json'):
            return json.loads(content)
        return content
    except Exception as e:
        print(f"Error fetching {blob_path}: {e}")
        return None

def markdown_to_html(md_text):
    """Simple markdown to HTML conversion."""
    if not md_text:
        return ""
    
    html = md_text
    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    # Bullets
    html = re.sub(r'^• (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    # Wrap consecutive <li> in <ul>
    html = re.sub(r'((?:<li>.*?</li>\n?)+)', r'<ul>\1</ul>', html)
    # Paragraphs
    html = re.sub(r'\n\n+', '</p><p>', html)
    html = f'<p>{html}</p>'
    html = re.sub(r'<p>\s*</p>', '', html)
    html = re.sub(r'<p>\s*<(h[123]|ul)', r'<\1', html)
    html = re.sub(r'(</h[123]>|</ul>)\s*</p>', r'\1', html)
    
    return html

def generate_html_page(podcast_info, episode_info, briefing_content, podcast_id, episode_guid):
    """Generate a complete HTML page for a briefing."""
    
    podcast_title = podcast_info.get('title', 'Unknown Podcast')
    episode_title = episode_info.get('title', 'Episode')
    episode_description = episode_info.get('description', '')[:200]
    
    # Handle both txt and json briefings
    if isinstance(briefing_content, dict):
        # JSON format - extract key_takeaways and deep_dives
        takeaways = briefing_content.get('key_takeaways', [])
        deep_dives = briefing_content.get('deep_dives', [])
        
        # Handle case where takeaways might be strings, not dicts
        briefing_html = '<h2>Key Takeaways</h2><ul>'
        for t in takeaways:
            if isinstance(t, dict):
                briefing_html += f'<li><strong>{t.get("title", "")}</strong> - {t.get("summary", "")}</li>'
            else:
                briefing_html += f'<li>{t}</li>'
        briefing_html += '</ul>'
        
        if deep_dives:
            briefing_html += '<h2>Deep Dive</h2>'
            for dd in deep_dives:
                if isinstance(dd, dict):
                    briefing_html += f'<h3>{dd.get("title", "")}</h3><ul>'
                    for bullet in dd.get('bullets', []):
                        briefing_html += f'<li>{bullet}</li>'
                    briefing_html += '</ul>'
                else:
                    briefing_html += f'<p>{dd}</p>'
    else:
        # Plain text format (string)
        briefing_html = markdown_to_html(str(briefing_content))
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{episode_title} | {podcast_title} Brief - PodBrief</title>
    <meta name="description" content="AI-generated brief for {episode_title} from {podcast_title}. {episode_description}">
    <meta property="og:title" content="{episode_title} | {podcast_title} Brief">
    <meta property="og:description" content="AI-generated podcast brief with key takeaways and insights.">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{SITE_URL}/briefs/{podcast_id}/{episode_guid}.html">
    <link rel="canonical" href="{SITE_URL}/briefs/{podcast_id}/{episode_guid}.html">
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .brief-container {{ max-width: 800px; margin: 0 auto; padding: 2rem; }}
        .brief-header {{ margin-bottom: 2rem; }}
        .podcast-name {{ color: #888; font-size: 0.9rem; margin-bottom: 0.5rem; }}
        .episode-title {{ font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 1rem; }}
        .brief-content {{ line-height: 1.8; color: #ccc; }}
        .brief-content h2 {{ color: #fff; margin-top: 2rem; }}
        .brief-content h3 {{ color: #ddd; margin-top: 1.5rem; }}
        .brief-content ul {{ margin: 1rem 0; padding-left: 1.5rem; }}
        .brief-content li {{ margin: 0.5rem 0; }}
        .brief-content strong {{ color: #fff; }}
        .cta-box {{ background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2)); padding: 2rem; border-radius: 12px; margin-top: 3rem; text-align: center; }}
        .cta-box h3 {{ color: #fff; margin-bottom: 1rem; }}
        .cta-box p {{ color: #ccc; margin-bottom: 1.5rem; }}
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
                <a href="/#Overview">Overview</a>
                <a href="/#Features">Features</a>
                <a href="/faq.html">FAQ</a>
            </nav>
        </div>
    </header>

    <main class="brief-container">
        <div class="brief-header">
            <p class="podcast-name">{podcast_title}</p>
            <h1 class="episode-title">{episode_title}</h1>
        </div>
        
        <article class="brief-content">
            {briefing_html}
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
</html>'''
    
    return html

def list_all_briefings(limit=None):
    """List all briefing files in GCS."""
    briefings = []
    blobs = bucket.list_blobs(prefix='podcasts/')
    
    for blob in blobs:
        if 'briefing' in blob.name:
            # Parse path: podcasts/{podcast_id}/episodes/{episode_guid}/briefing.txt
            parts = blob.name.split('/')
            if len(parts) >= 5:
                briefings.append({
                    'path': blob.name,
                    'podcast_id': parts[1],
                    'episode_guid': parts[3],
                    'is_json': blob.name.endswith('.json')
                })
        
        if limit and len(briefings) >= limit:
            break
    
    return briefings

def generate_all_pages(limit=None, batch_size=500, checkpoint_file='seo_checkpoint.json'):
    """Generate HTML pages for all briefings with batch processing."""
    import gc
    
    output_path = Path(OUTPUT_DIR)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Load checkpoint if exists
    checkpoint_path = Path(checkpoint_file)
    checkpoint = {'last_index': 0, 'sitemap_entries': [], 'generated': 0, 'errors': 0}
    if checkpoint_path.exists():
        try:
            checkpoint = json.loads(checkpoint_path.read_text())
            print(f"📌 Resuming from checkpoint: {checkpoint['last_index']} processed")
        except:
            pass
    
    print(f"Fetching briefing list...")
    briefings = list_all_briefings(limit=limit)
    print(f"Found {len(briefings)} briefings to process")
    
    sitemap_entries = checkpoint['sitemap_entries']
    generated = checkpoint['generated']
    errors = checkpoint['errors']
    start_index = checkpoint['last_index']
    
    # Process in batches
    for batch_start in range(start_index, len(briefings), batch_size):
        batch_end = min(batch_start + batch_size, len(briefings))
        batch = briefings[batch_start:batch_end]
        
        print(f"\n🔄 Processing batch {batch_start}-{batch_end} ({len(batch)} items)")
        
        for i, b in enumerate(batch):
            global_index = batch_start + i
            try:
                # Get metadata
                podcast_info = get_podcast_info(b['podcast_id'])
                episode_info = get_episode_info(b['podcast_id'], b['episode_guid'])
                
                # Fetch briefing content
                content = fetch_briefing(b['path'])
                if not content:
                    errors += 1
                    continue
                
                # Generate HTML
                html = generate_html_page(podcast_info, episode_info, content, b['podcast_id'], b['episode_guid'])
                
                # Write file
                podcast_dir = output_path / b['podcast_id']
                podcast_dir.mkdir(exist_ok=True)
                
                file_path = podcast_dir / f"{b['episode_guid']}.html"
                file_path.write_text(html)
                
                sitemap_entries.append(f"{SITE_URL}/briefs/{b['podcast_id']}/{b['episode_guid']}.html")
                generated += 1
                
                if (global_index + 1) % 50 == 0:
                    print(f"Progress: {global_index + 1}/{len(briefings)} processed")
                    
            except Exception as e:
                print(f"Error processing {b['path']}: {e}")
                errors += 1
        
        # Save checkpoint after each batch
        checkpoint = {
            'last_index': batch_end,
            'sitemap_entries': sitemap_entries,
            'generated': generated,
            'errors': errors
        }
        checkpoint_path.write_text(json.dumps(checkpoint))
        
        # Force garbage collection
        gc.collect()
        print(f"✓ Batch complete. Memory cleared. Checkpoint saved.")
    
    # Generate sitemap
    sitemap_path = Path("podbrief.info/sitemap-briefs.xml")
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in sitemap_entries:
        sitemap_content += f'  <url><loc>{url}</loc></url>\n'
    sitemap_content += '</urlset>'
    sitemap_path.write_text(sitemap_content)
    
    # Clean up checkpoint
    if checkpoint_path.exists():
        checkpoint_path.unlink()
    
    print(f"\n✅ Generated {generated} pages")
    print(f"❌ Errors: {errors}")
    print(f"📍 Sitemap: {sitemap_path}")
    
    return generated, errors

if __name__ == "__main__":
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    print(f"Generating SEO pages (limit: {limit})...")
    generate_all_pages(limit=limit)
