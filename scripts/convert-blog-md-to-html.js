#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function markdownToHTML(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Paragraphs and list items
  const lines = html.split('\n');
  let inList = false;
  let processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (line.startsWith('<h') || line.startsWith('</')) {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${line.substring(2)}</li>`);
    } else if (line.startsWith('---')) {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push('<hr>');
    } else if (line.length > 0) {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(`<p>${line}</p>`);
    } else {
      processedLines.push('');
    }
  }
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  return processedLines.join('\n');
}

function convertBlogPost(mdPath) {
  const markdown = fs.readFileSync(mdPath, 'utf8');
  const lines = markdown.split('\n');
  const title = lines[0].replace(/^#\s+/, '').trim();
  const slug = path.basename(mdPath, '.md');
  
  const htmlContent = markdownToHTML(markdown.substring(markdown.indexOf('\n') + 1));
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | PodBrief</title>
    <meta name="description" content="${title} - Discover the best podcasts with AI-generated summaries on PodBrief.">
    <link rel="canonical" href="https://podbrief.info/blog/${slug}.html">
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .blog-container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
        .blog-header { margin-bottom: 2rem; padding-top: 2rem; }
        .blog-header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #fff; line-height: 1.2; }
        .blog-meta { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
        .blog-content { color: #ccc; line-height: 1.8; }
        .blog-content h2 { color: #fff; font-size: 1.8rem; margin-top: 2.5rem; margin-bottom: 1rem; }
        .blog-content h3 { color: #8b5cf6; font-size: 1.3rem; margin-top: 2rem; margin-bottom: 0.75rem; }
        .blog-content p { margin-bottom: 1.25rem; }
        .blog-content ul { margin: 1.5rem 0; padding-left: 2rem; }
        .blog-content li { margin-bottom: 0.75rem; }
        .blog-content a { color: #8b5cf6; text-decoration: none; }
        .blog-content a:hover { text-decoration: underline; }
        .blog-content strong { color: #fff; }
        .blog-content hr { border: none; border-top: 1px solid #333; margin: 2rem 0; }
        @media (max-width: 768px) { .blog-header h1 { font-size: 2rem; } }
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
                <a href="/blog">Blog</a>
                <a href="/faq.html">FAQ</a>
            </nav>
        </div>
    </header>
    <div class="blog-container">
        <div class="blog-header">
            <h1>${title}</h1>
            <div class="blog-meta">Published ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · 10 min read</div>
        </div>
        <article class="blog-content">
${htmlContent}
        </article>
    </div>
    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2024 PodBrief. All rights reserved.</p>
            <div class="footer-links">
                <a href="/privacy.html">Privacy</a>
                <a href="/tos.html">Terms</a>
            </div>
        </div>
    </footer>
</body>
</html>`;
  
  const outputPath = path.join('podbrief.info/blog', slug + '.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✓ Converted ${slug}.md → ${slug}.html`);
  return slug;
}

// Convert all markdown files in blog/
const blogDir = 'blog';
const mdFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const slugs = [];
for (const file of mdFiles) {
  const slug = convertBlogPost(path.join(blogDir, file));
  slugs.push(slug);
}

console.log(`\nConverted ${slugs.length} blog posts.`);
console.log('Slugs:', slugs.join(', '));
