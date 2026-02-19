#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define topics and their associated podcasts
const topics = {
  "news": {
    title: "News & Current Affairs",
    description: "Stay informed with AI-powered briefs from top news podcasts",
    podcasts: ["The Daily", "Up First from NPR", "WSJ What's News", "The President's Daily Brief", "Global News Podcast", "Bloomberg Daybreak: US Edition", "Apple News Today", "Today, Explained", "The Journal.", "Marketplace"]
  },
  "politics": {
    title: "Politics & Commentary",
    description: "Get the key insights from political podcasts across the spectrum",
    podcasts: ["The MeidasTouch Podcast", "The Ben Shapiro Show", "The Charlie Kirk Show", "Breaking Points with Krystal and Saagar", "The Megyn Kelly Show", "The Smerconish Podcast", "Verdict with Ted Cruz", "The Rubin Report", "Pod Save America", "The Matt Walsh Show", "The Daily Beans", "Political Gabfest", "The NPR Politics Podcast", "The Tucker Carlson Show", "Honestly with Bari Weiss", "The Ezra Klein Show", "Next Up with Mark Halperin", "RealClearPolitics Podcast", "The Hugh Hewitt Show: Highly Concentrated", "The Glenn Beck Program", "The Andrew Klavan Show"]
  },
  "business": {
    title: "Business & Finance",
    description: "Catch up on business news and insights from leading podcasts",
    podcasts: ["Morning Brew Daily", "Bloomberg Daybreak: US Edition", "WSJ What's News", "The Journal.", "Marketplace", "The Indicator from Planet Money", "CNBC's \"Fast Money\"", "Prof G Markets", "The Prof G Pod with Scott Galloway", "TBPN", "Squawk Pod"]
  },
  "sports": {
    title: "Sports",
    description: "Get briefs from top sports podcasts and shows",
    podcasts: ["The Dan Le Batard Show with Stugotz", "The Bill Simmons Podcast", "Pardon My Take"]
  },
  "education": {
    title: "Education & Ideas",
    description: "Explore thought-provoking ideas from educational podcasts",
    podcasts: ["TED Talks Daily", "Stuff You Should Know", "Freakonomics Radio", "Revisionist History", "99% Invisible", "History That Doesn't Suck", "The Skeptics' Guide to the Universe", "Hidden Brain", "Radiolab", "The New Yorker Radio Hour"]
  },
  "technology": {
    title: "Technology & AI",
    description: "Stay current on tech, AI, and the future with expert podcast briefs",
    podcasts: ["a16z Podcast", "Latent Space: The AI Engineer Podcast", "Hard Fork", "AI + a16z", "Decoder with Nilay Patel", "TBPN", "OpenAI Podcast", "Y Combinator Startup Podcast"]
  },
  "investing": {
    title: "Investing & Markets",
    description: "Expert insights on stocks, markets, and investing strategies",
    podcasts: ["The Indicator from Planet Money", "CNBC's \"Fast Money\"", "Prof G Markets", "Marketplace", "We Study Billionaires - The Investor's Podcast Network", "Invest Like the Best with Patrick O'Shaughnessy", "Capital Allocators – Inside the Institutional Investment Industry", "Dry Powder: The Private Equity Podcast", "The Intrinsic Value Podcast - The Investor's Podcast Network", "Planet Money", "Acquired", "Business Breakdowns"]
  },
  "comedy": {
    title: "Comedy & Entertainment",
    description: "Laugh out loud with the best comedy podcast briefs",
    podcasts: ["SmartLess", "Call Her Daddy", "Club Random with Bill Maher", "Andrew Schulz's Flagrant with Akaash Singh", "Adam Carolla Show", "This Past Weekend w/ Theo Von", "Trash Taste Podcast", "The Dr. Phil Podcast", "Office Ladies"]
  },
  "health-wellness": {
    title: "Health & Wellness",
    description: "Expert insights on health, fitness, and mental well-being",
    podcasts: ["Huberman Lab", "The Rich Roll Podcast", "The Mel Robbins Podcast", "Happier with Gretchen Rubin", "The Happiness Lab with Dr. Laurie Santos", "The Skinny Confidential Him & Her Podcast", "The Diary Of A CEO with Steven Bartlett", "We Can Do Hard Things", "Sawbones: A Marital Tour of Misguided Medicine"]
  },
  "true-crime": {
    title: "True Crime",
    description: "Gripping true crime stories and investigations",
    podcasts: ["Last Podcast On The Left"]
  },
  "science": {
    title: "Science & Discovery",
    description: "Explore science, technology, and the natural world",
    podcasts: ["The Skeptics' Guide to the Universe", "99% Invisible", "Stuff You Should Know", "Freakonomics Radio", "Radiolab"]
  },
  "startups": {
    title: "Startups & Entrepreneurship",
    description: "Insights for founders, operators, and startup enthusiasts",
    podcasts: ["Y Combinator Startup Podcast", "Acquired", "My First Million", "The Pitch", "How I Built This with Guy Raz", "Business Breakdowns", "The Diary Of A CEO with Steven Bartlett", "a16z Podcast"]
  },
  "legal": {
    title: "Law & Justice",
    description: "Legal analysis, court coverage, and justice system insights",
    podcasts: ["Strict Scrutiny", "Stanford Legal", "Verdict with Ted Cruz", "Federalist Radio Hour"]
  },
  "philosophy": {
    title: "Philosophy & Ideas",
    description: "Deep thinking on ethics, society, and the human condition",
    podcasts: ["Making Sense with Sam Harris", "The Ezra Klein Show", "Hidden Brain", "Interesting Times with Ross Douthat", "Revisionist History", "The New Yorker Radio Hour"]
  },
  "self-help": {
    title: "Self-Improvement & Productivity",
    description: "Build better habits and live more intentionally",
    podcasts: ["Jocko Podcast", "The Minimalists", "The Knowledge Project with Shane Parrish", "The Mel Robbins Podcast", "Modern Wisdom", "The Diary Of A CEO with Steven Bartlett", "Happier with Gretchen Rubin"]
  },
  "film-tv": {
    title: "Film & TV",
    description: "Movie reviews, TV recaps, and entertainment deep dives",
    podcasts: ["The Rewatchables", "The Big Picture", "Office Ladies"]
  },
  "military": {
    title: "Military & National Security",
    description: "Veteran stories, military history, and national security analysis",
    podcasts: ["Shawn Ryan Show", "Jocko Podcast"]
  },
  "economics": {
    title: "Economics",
    description: "Understand markets, policy, and economic forces shaping our world",
    podcasts: ["Planet Money", "The Indicator from Planet Money", "Marketplace", "Freakonomics Radio", "The Prof G Pod with Scott Galloway", "Pivot"]
  },
  "society-culture": {
    title: "Society & Culture",
    description: "Explore trends, ideas, and forces shaping modern life",
    podcasts: ["The Diary Of A CEO with Steven Bartlett", "The Skinny Confidential Him & Her Podcast", "Modern Wisdom", "Pod Save America", "Interesting Times with Ross Douthat", "The New Yorker Radio Hour", "Honestly with Bari Weiss"]
  },
  "religion-faith": {
    title: "Religion & Faith",
    description: "Spiritual insight and faith-based perspectives",
    podcasts: ["Jack Hibbs Podcast"]
  },
  "venture-capital": {
    title: "Venture Capital & Investing",
    description: "Inside the world of venture capital, startups, and growth investing",
    podcasts: ["a16z Podcast", "AI + a16z", "All-In with Chamath, Jason, Sacks & Friedberg", "Acquired", "Invest Like the Best with Patrick O'Shaughnessy", "Capital Allocators – Inside the Institutional Investment Industry", "Dry Powder: The Private Equity Podcast", "Y Combinator Startup Podcast"]
  },
  "interviews": {
    title: "Interviews & Conversations",
    description: "Long-form conversations with fascinating people from all walks of life",
    podcasts: ["The Joe Rogan Experience", "Lex Fridman Podcast", "SmartLess", "Armchair Expert with Dax Shepard", "Modern Wisdom", "The Rich Roll Podcast", "The Diary Of A CEO with Steven Bartlett", "Club Random with Bill Maher", "The Dr. Phil Podcast"]
  },
  "personal-development": {
    title: "Personal Development",
    description: "Grow as a person with insights from top self-improvement podcasts",
    podcasts: ["The Mel Robbins Podcast", "The Minimalists", "Happier with Gretchen Rubin", "The Happiness Lab with Dr. Laurie Santos", "The Knowledge Project with Shane Parrish", "Modern Wisdom", "Jocko Podcast", "The Diary Of A CEO with Steven Bartlett"]
  },
  "history": {
    title: "History",
    description: "Bring the past to life with gripping historical storytelling",
    podcasts: ["History That Doesn't Suck", "Revisionist History", "Hardcore History"]
  },
  "media": {
    title: "Media & Journalism",
    description: "Insights on the media landscape, journalism, and information",
    podcasts: ["Hard Fork", "Decoder with Nilay Patel", "The New Yorker Radio Hour", "The Ezra Klein Show", "Pivot", "Honestly with Bari Weiss"]
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
