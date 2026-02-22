#!/usr/bin/env python3
"""Generate 20 new topic pages for podbrief.info"""

import os

TOPICS_DIR = "/Users/moltbot/clawd/1/podbrief.info/topics"
TODAY = "2025-07-26"

TOPICS = [
    {
        "slug": "arts-music",
        "title": "Arts & Music",
        "meta_desc": "Explore arts and music podcasts covering everything from music history and theory to interviews with artists, composers, and creators. Browse episode briefs on PodBrief.",
        "h1": "Arts & Music",
        "description": "Arts and music podcasts offer some of the richest listening experiences available, blending storytelling, cultural analysis, and creative exploration. From deep dives into musical eras and genres to intimate conversations with working artists, these shows bring creativity to life. Whether you love classical, hip-hop, visual art, or theatre, there's a podcast that speaks your language.",
        "podcasts": [
            ("Song Exploder", "Artists break down their songs piece by piece, revealing the creative process behind iconic tracks."),
            ("Switched on Pop", "Pop music experts decode why the songs we love work so well, from chord progressions to cultural impact."),
            ("The Pitchfork Review", "In-depth music criticism and journalism from one of the most influential music publications."),
            ("All Songs Considered", "NPR Music's flagship show exploring new releases, deep cuts, and the stories behind great music."),
            ("99% Invisible", "Explores the design and architecture of the world around us, with frequent deep dives into visual art and music."),
            ("Radiolab", "Science and philosophy meet storytelling, often touching on creativity and the human capacity for art."),
            ("The Business of Music", "How the music industry actually works — licensing, touring, streaming, and artist economics."),
        ],
        "icon": "🎵",
    },
    {
        "slug": "fitness-exercise",
        "title": "Fitness & Exercise",
        "meta_desc": "Discover the best fitness and exercise podcasts covering training science, workout tips, athletic performance, and motivation. Browse episode briefs on PodBrief.",
        "h1": "Fitness & Exercise",
        "description": "Fitness podcasts cut through the noise of fad diets and workout trends to deliver evidence-based advice from elite coaches, athletes, and sports scientists. Whether you're a weekend warrior, competitive athlete, or just getting started, there's actionable insight for every level. The best shows combine practical training tips with the psychology of habit and motivation.",
        "podcasts": [
            ("The Tim Ferriss Show", "World-class performers share tools and tactics for peak physical and mental performance."),
            ("Mind Pump Podcast", "Four fitness coaches debate and discuss training, nutrition, and the fitness industry with no-BS honesty."),
            ("Ben Greenfield Life", "Cutting-edge biohacking, exercise physiology, and performance optimization from an elite trainer."),
            ("Running Rogue", "Expert coaching for runners at every level, covering training plans, gear, and race strategy."),
            ("Strength Running Podcast", "Evidence-based running coaching focused on injury prevention and sustainable performance."),
            ("The Physical Performance Show", "Conversations with elite athletes and coaches on training, recovery, and peak performance."),
            ("Barbell Medicine Podcast", "Physician-coaches break down strength training and rehabilitation with science-backed depth."),
        ],
        "icon": "💪",
    },
    {
        "slug": "nutrition-diet",
        "title": "Nutrition & Diet",
        "meta_desc": "Find the best nutrition and diet podcasts covering food science, meal planning, metabolic health, and expert dietary advice. Browse episode briefs on PodBrief.",
        "h1": "Nutrition & Diet",
        "description": "Nutrition podcasts help you separate science from hype in a world overloaded with conflicting dietary advice. Top dietitians, researchers, and food scientists break down the evidence on everything from intermittent fasting to gut health to sports nutrition. These shows empower you to make informed choices about what you eat and why it matters.",
        "podcasts": [
            ("Nutrition Facts with Dr. Greger", "Evidence-based nutrition insights from a physician and author of How Not to Die."),
            ("The Doctor's Farmacy", "Dr. Mark Hyman explores the intersection of food, medicine, and chronic disease."),
            ("Found My Fitness", "Dr. Rhonda Patrick delivers deep scientific dives into nutrition, aging, and health optimization."),
            ("Sigma Nutrition Radio", "Research-based discussions on dietetics, metabolism, and the science of food."),
            ("Rethinking Nutrition", "Challenging conventional dietary wisdom with the latest research in nutritional science."),
            ("The Rich Roll Podcast", "Plant-based nutrition and endurance sports with one of the world's fittest men."),
            ("Fuel Your Strength", "Female-focused sports nutrition, strength training, and hormone health."),
        ],
        "icon": "🥗",
    },
    {
        "slug": "mental-health",
        "title": "Mental Health",
        "meta_desc": "Listen to the best mental health podcasts covering therapy, anxiety, depression, trauma, and emotional wellness. Browse episode briefs on PodBrief.",
        "h1": "Mental Health",
        "description": "Mental health podcasts have become a vital resource for millions navigating anxiety, depression, trauma, and the everyday challenges of modern life. Leading therapists, psychiatrists, and lived-experience advocates share tools that genuinely help. These shows reduce stigma, build awareness, and offer real strategies for improving emotional wellbeing.",
        "podcasts": [
            ("Therapy for Black Girls", "Mental health conversations centered on Black women's experiences, with real therapist insights."),
            ("The Anxiety Coaches Podcast", "Practical tools and techniques for managing anxiety and panic disorder in everyday life."),
            ("On Being with Krista Tippett", "Deeply thoughtful conversations on meaning, healing, and what it means to be human."),
            ("The Mental Illness Happy Hour", "Honest, often funny conversations about mental illness and its intersection with creativity."),
            ("Unlocking Us with Brené Brown", "Vulnerability researcher Brené Brown explores emotions, connection, and psychological resilience."),
            ("Feel Better, Live More", "Dr. Rangan Chatterjee on practical mental and physical health strategies backed by science."),
            ("The Psychology Podcast", "Scott Barry Kaufman interviews leading psychologists on human potential and flourishing."),
        ],
        "icon": "🧠",
    },
    {
        "slug": "marketing",
        "title": "Marketing",
        "meta_desc": "Explore the best marketing podcasts covering digital strategy, content marketing, SEO, social media, branding, and growth tactics. Browse episode briefs on PodBrief.",
        "h1": "Marketing",
        "description": "Marketing podcasts keep practitioners sharp in a field that reinvents itself every few years. From performance advertising and content strategy to brand building and influencer culture, top marketers share what's actually working right now. Whether you're a CMO or just starting out, these shows deliver tactics, frameworks, and inspiration.",
        "podcasts": [
            ("Marketing School", "Neil Patel and Eric Siu deliver a daily 10-minute burst of actionable marketing advice."),
            ("The GaryVee Audio Experience", "Entrepreneurship meets marketing philosophy with Gary Vaynerchuk's raw, unfiltered perspective."),
            ("How I Built This", "Guy Raz interviews founders about the marketing and brand stories behind iconic companies."),
            ("Masters of Scale", "Reid Hoffman explores unconventional marketing wisdom from founders who scaled global companies."),
            ("Duct Tape Marketing", "Small business marketing made practical, with strategies any entrepreneur can implement."),
            ("Social Media Marketing Podcast", "Michael Stelzner covers the latest social media trends and platform strategies."),
            ("Content Inc.", "Joe Pulizzi on building audiences and businesses through content-first marketing."),
        ],
        "icon": "📣",
    },
    {
        "slug": "finance-money",
        "title": "Finance & Money",
        "meta_desc": "Discover top finance and money podcasts covering personal finance, budgeting, debt, investing basics, and financial independence. Browse episode briefs on PodBrief.",
        "h1": "Finance & Money",
        "description": "Personal finance podcasts are among the most transformative media you can consume — they help people pay off debt, build savings, and work toward financial independence. The best hosts make complex topics approachable, offering clear frameworks for budgeting, investing, and planning your financial future. From beginner basics to advanced wealth strategies, there's a show for every financial journey.",
        "podcasts": [
            ("Planet Money", "NPR's team makes economic stories fascinating and accessible for everyday listeners."),
            ("So Money", "Farnoosh Torabi interviews celebrities and experts about their money habits and financial journeys."),
            ("The Dave Ramsey Show", "America's most-listened-to personal finance show, focused on debt freedom and baby steps."),
            ("Afford Anything", "Paula Pant explores how money, time, and attention intersect to build a life you love."),
            ("ChooseFI", "The financial independence community's flagship podcast, covering FIRE and frugal living."),
            ("Bigger Pockets Money", "Financial independence through real estate and smart money management."),
            ("Stacking Benjamins", "Entertaining take on personal finance with humor, interviews, and real strategies."),
        ],
        "icon": "💰",
    },
    {
        "slug": "real-estate",
        "title": "Real Estate",
        "meta_desc": "Find the best real estate podcasts covering investing, home buying, rental properties, market trends, and wealth building through property. Browse episode briefs on PodBrief.",
        "h1": "Real Estate",
        "description": "Real estate podcasts are essential listening for investors, agents, and anyone navigating today's complex property markets. Expert hosts break down deal analysis, financing strategies, market trends, and the mindset required to build wealth through real property. From house hacking your first duplex to scaling a commercial portfolio, the knowledge is all here.",
        "podcasts": [
            ("BiggerPockets Real Estate Podcast", "The gold standard for real estate investors, covering every strategy and market condition."),
            ("Real Estate Today", "NAR's official podcast covering the latest market data and practical advice for buyers and sellers."),
            ("Rental Income Podcast", "Straightforward interviews with landlords sharing exactly how they built rental income streams."),
            ("Passive Real Estate Investing", "How to invest in real estate without being a landlord through syndications and REITs."),
            ("The Real Wealth Show", "Kathy Fettke on market cycles, passive income, and building long-term wealth through property."),
            ("Real Estate Rockstars", "Top-performing real estate agents share their systems, scripts, and success secrets."),
            ("Commercial Real Estate Pro Network", "Deep dives into commercial property investing, from office to multifamily to industrial."),
        ],
        "icon": "🏠",
    },
    {
        "slug": "cryptocurrency",
        "title": "Cryptocurrency & Blockchain",
        "meta_desc": "Explore the top cryptocurrency and blockchain podcasts covering Bitcoin, Ethereum, DeFi, NFTs, Web3, and crypto market analysis. Browse episode briefs on PodBrief.",
        "h1": "Cryptocurrency & Blockchain",
        "description": "Crypto and blockchain podcasts guide listeners through one of the most volatile, complex, and potentially transformative technological and financial revolutions in history. From Bitcoin fundamentals to DeFi protocols, NFT culture, and regulatory battles, these shows keep you informed and thoughtful. Whether you're a crypto skeptic or true believer, the conversation is worth hearing.",
        "podcasts": [
            ("Unchained", "Laura Shin interviews the most prominent figures in crypto with rigorous, journalist-grade depth."),
            ("What Bitcoin Did", "Peter McCormack's conversations with Bitcoiners, economists, and critics of the crypto space."),
            ("Bankless", "Ryan Adams and David Hoffman on the journey to a bankless financial system through DeFi."),
            ("The Breakdown", "Nathaniel Whittemore provides daily macro and crypto market analysis with sharp context."),
            ("CoinDesk Podcast Network", "Multiple shows covering breaking news, market trends, and deep analysis across all of crypto."),
            ("Epicenter", "Long-form interviews with blockchain builders and researchers at the frontier of Web3."),
            ("The Pomp Podcast", "Anthony Pompliano talks Bitcoin, macro economics, and entrepreneurship with top investors."),
        ],
        "icon": "₿",
    },
    {
        "slug": "leadership",
        "title": "Leadership",
        "meta_desc": "Discover top leadership podcasts covering executive coaching, team management, organizational culture, decision-making, and leadership development. Browse episode briefs on PodBrief.",
        "h1": "Leadership",
        "description": "Leadership podcasts help managers and executives develop the self-awareness, communication skills, and strategic thinking required to lead effectively at every level. The best shows blend psychology, organizational behavior, and real-world stories from leaders who've succeeded and failed at scale. Whether you manage a team of two or a company of thousands, these conversations sharpen your edge.",
        "podcasts": [
            ("How Leaders Lead", "David Novak interviews world-class leaders on what really separates good leaders from great ones."),
            ("The Knowledge Project", "Shane Parrish on decision-making, mental models, and the habits of exceptional leaders."),
            ("WorkLife with Adam Grant", "Organizational psychologist Adam Grant explores the science of better work and leadership."),
            ("Leadership and Loyalty", "Dov Baron examines authentic leadership and building fierce loyalty in teams."),
            ("Dare to Lead", "Brené Brown brings her research on courage and vulnerability directly to leadership practice."),
            ("The John Maxwell Leadership Podcast", "America's top leadership authority shares decades of lessons on influence and impact."),
            ("Finding Mastery", "Michael Gervais on the psychology of high performance with elite leaders and athletes."),
        ],
        "icon": "🏆",
    },
    {
        "slug": "productivity",
        "title": "Productivity",
        "meta_desc": "Find the best productivity podcasts covering time management, deep work, automation, habits, focus strategies, and getting more done. Browse episode briefs on PodBrief.",
        "h1": "Productivity",
        "description": "Productivity podcasts help you reclaim your time, build better systems, and do your most important work without burning out. From GTD frameworks and inbox-zero tactics to deep work philosophy and habit science, the best shows offer practical tools you can implement immediately. In a world designed to distract, these podcasts help you stay focused on what matters.",
        "podcasts": [
            ("Beyond the To-Do List", "Real conversations about work, systems, and finding a sustainable approach to productivity."),
            ("The Productivity Show", "Asian Efficiency shares tactics, tools, and mindsets for getting more done in less time."),
            ("Before Breakfast", "Laura Vanderkam's daily 5-minute episodes on using mornings and time wisely."),
            ("Deep Questions with Cal Newport", "The author of Deep Work answers listener questions and unpacks digital minimalism."),
            ("Getting Things Done", "David Allen's GTD methodology explored in depth with practitioners worldwide."),
            ("Optimal Living Daily", "Justin Malik reads the best productivity and self-improvement content from around the web."),
            ("Cortex", "Myke Hurley and CGP Grey share their obsessive approach to productivity tools and workflows."),
        ],
        "icon": "⚡",
    },
    {
        "slug": "mindfulness-meditation",
        "title": "Mindfulness & Meditation",
        "meta_desc": "Explore the best mindfulness and meditation podcasts covering breathwork, stress reduction, presence, contemplative practices, and inner peace. Browse episode briefs on PodBrief.",
        "h1": "Mindfulness & Meditation",
        "description": "Mindfulness and meditation podcasts offer something increasingly rare: an invitation to slow down and pay attention. From secular mindfulness and breathing techniques to Buddhist teachings and contemplative philosophy, these shows serve as a portable practice and learning resource. Even a few minutes of intentional attention can transform how you move through the world.",
        "podcasts": [
            ("The Mindfulness Meditation Podcast", "Weekly guided meditations from the Rubin Museum, rooted in Buddhist and secular traditions."),
            ("Ten Percent Happier", "Dan Harris makes meditation approachable for skeptics, interviewing world-class teachers."),
            ("On Being with Krista Tippett", "Thoughtful conversations about meaning, consciousness, and contemplative traditions."),
            ("The Meditation Podcast", "Jesse and Jeane Stern offer binaural beat meditations for relaxation and self-discovery."),
            ("Tara Brach", "Buddhist teacher Tara Brach shares talks and meditations on radical acceptance and presence."),
            ("Insight Meditation Center", "Dharma talks from the IMS tradition, covering the full depth of mindfulness practice."),
            ("Waking Up with Sam Harris", "Secular mindfulness and philosophy from neuroscientist and philosopher Sam Harris."),
        ],
        "icon": "🧘",
    },
    {
        "slug": "parenting-family",
        "title": "Parenting & Family",
        "meta_desc": "Listen to the top parenting and family podcasts covering child development, relationships, family dynamics, education, and raising resilient kids. Browse episode briefs on PodBrief.",
        "h1": "Parenting & Family",
        "description": "Parenting podcasts provide evidence-based guidance and real-world wisdom from child development experts, educators, and parents who've navigated every stage of family life. From newborn sleep science to navigating teens and technology, these shows offer practical strategies without judgment. The best parenting podcasts normalize the hard parts and celebrate the extraordinary journey of raising humans.",
        "podcasts": [
            ("Good Inside with Dr. Becky Kennedy", "Parenting psychologist reframes challenging behaviors with compassion and clear tools."),
            ("Unruffled with Janet Lansbury", "Respectful parenting philosophy applied to everyday challenges with calm, practical advice."),
            ("Brains On!", "Science podcasts for curious kids, making learning a family adventure."),
            ("The Longest Shortest Time", "Hillary Frank explores the full spectrum of modern parenthood — the beautiful and the brutal."),
            ("Big Life Journal", "Growth mindset conversations to help kids develop resilience and a love of learning."),
            ("Raising Boys and Girls", "Research-backed insights on the differences and similarities in how boys and girls develop."),
            ("One Bad Mother", "Celebrates imperfect parenting and the messy reality of raising little humans."),
        ],
        "icon": "👨‍👩‍👧",
    },
    {
        "slug": "environment-climate",
        "title": "Environment & Climate",
        "meta_desc": "Explore the best environment and climate podcasts covering climate change, sustainability, clean energy, conservation, and environmental policy. Browse episode briefs on PodBrief.",
        "h1": "Environment & Climate",
        "description": "Environmental and climate podcasts cut through the noise of a polarizing debate to deliver grounded science, innovative solutions, and urgent policy conversations. Leading scientists, activists, entrepreneurs, and policymakers explore both the scale of the challenge and the extraordinary work happening to address it. These shows leave you informed and, often, more hopeful than the headlines suggest.",
        "podcasts": [
            ("Volts", "David Roberts on clean energy policy, technology, and the politics of decarbonization."),
            ("Drilled", "Investigative journalism exploring the decades-long campaign to deceive the public on climate."),
            ("Sustainability Defined", "Practical definitions and deep dives into sustainability concepts for everyday understanding."),
            ("My Climate Journey", "Now MCJ Collective — conversations on climate solutions with founders, investors, and scientists."),
            ("TILclimate", "Short, expert-explainer episodes on climate science from MIT researchers."),
            ("Hot Take", "Mary Heglar and Amy Westervelt on climate change and the media narratives around it."),
            ("The Climate Question", "BBC's exploration of the most pressing climate questions with global expert insight."),
        ],
        "icon": "🌍",
    },
    {
        "slug": "ai-machine-learning",
        "title": "AI & Machine Learning",
        "meta_desc": "Discover the top AI and machine learning podcasts covering deep learning, large language models, research breakthroughs, and the future of artificial intelligence. Browse episode briefs on PodBrief.",
        "h1": "AI & Machine Learning",
        "description": "AI and machine learning podcasts are essential listening for anyone navigating the fastest-moving field in technology. Researchers, engineers, and ethicists discuss the breakthroughs, limitations, and implications of today's AI systems — from large language models and reinforcement learning to AI safety and alignment. These shows help you separate the signal from the hype.",
        "podcasts": [
            ("Lex Fridman Podcast", "Long-form conversations with AI researchers, scientists, and thinkers on the nature of intelligence."),
            ("TWIML AI Podcast", "Sam Charrington interviews ML practitioners and researchers on the state of the field."),
            ("Machine Learning Street Talk", "Technical deep-dives into ML research papers and ideas with practitioner guests."),
            ("The AI Alignment Podcast", "Conversations on AI safety, existential risk, and how to build beneficial AI systems."),
            ("Data Skeptic", "Machine learning, statistics, and AI explained with clarity and healthy skepticism."),
            ("Practical AI", "Daniel Whitenack and Chris Benson make AI accessible for practitioners and enthusiasts alike."),
            ("Eye on AI", "Craig Smith interviews AI researchers and executives on the science and business of artificial intelligence."),
        ],
        "icon": "🤖",
    },
    {
        "slug": "cybersecurity",
        "title": "Cybersecurity",
        "meta_desc": "Find the best cybersecurity podcasts covering hacking, data breaches, privacy, threat intelligence, and digital defense for professionals and individuals. Browse episode briefs on PodBrief.",
        "h1": "Cybersecurity",
        "description": "Cybersecurity podcasts serve both professionals defending critical infrastructure and individuals trying to protect their digital lives. Top security researchers, ethical hackers, and CISO-level executives unpack the latest threats, breaches, and defensive strategies in accessible terms. In a world of constant cyber risk, staying informed isn't optional — and these shows make learning genuinely engaging.",
        "podcasts": [
            ("Darknet Diaries", "True crime meets hacking — Jack Rhysider tells the real stories behind iconic cyber incidents."),
            ("Security Now", "Steve Gibson and Leo Laporte break down the week's most important security news in extraordinary depth."),
            ("Risky Business", "Patrick Gray's weekly news show for security professionals, with sharp expert commentary."),
            ("The CyberWire Daily", "Concise daily briefings on cybersecurity news from a trusted professional source."),
            ("Smashing Security", "Graham Cluley and Carole Theriault cover security news with humor and clarity."),
            ("SANS Internet Stormcast", "Daily 5-minute briefings on the most urgent current threats from SANS researchers."),
            ("Hacking Humans", "Social engineering and human manipulation tactics that power today's biggest scams."),
        ],
        "icon": "🔐",
    },
    {
        "slug": "books-literature",
        "title": "Books & Literature",
        "meta_desc": "Explore top books and literature podcasts covering fiction, nonfiction, book reviews, author interviews, and literary culture. Browse episode briefs on PodBrief.",
        "h1": "Books & Literature",
        "description": "Books and literature podcasts celebrate the written word and the ideas within it, connecting readers with new titles, authors, and literary traditions from around the world. From rigorous fiction analysis to casual book club conversations, these shows inspire reading lists and deepen appreciation for what makes great writing great. If you love books, these podcasts feel like the best book club you've ever joined.",
        "podcasts": [
            ("Books on the Nightstand", "Ann Kingman and Michael Kindness share their passion for books with warmth and enthusiasm."),
            ("The New Yorker Fiction Podcast", "Authors read and discuss short stories from the New Yorker's legendary archive."),
            ("Literary Friction", "Carrie Plitt and Octavia Bright explore literature through themed conversations and author interviews."),
            ("Backlisted", "Celebrating overlooked and out-of-print books that deserve a wider audience."),
            ("Well-Read Black Girl", "Glory Edim champions Black literature and authors with joy, rigor, and community."),
            ("Overdue", "Craig and Andrew finally read the books they always meant to, with humor and insight."),
            ("The Reader", "BBC Radio 4's literary podcast exploring a wide range of fiction and nonfiction titles."),
        ],
        "icon": "📖",
    },
    {
        "slug": "gaming",
        "title": "Gaming",
        "meta_desc": "Discover the best gaming podcasts covering video games, esports, game design, industry news, and gaming culture. Browse episode briefs on PodBrief.",
        "h1": "Gaming",
        "description": "Gaming podcasts capture the full spectrum of one of the world's largest entertainment industries — from indie game reviews and blockbuster releases to esports, game design philosophy, and the evolving culture around play. Expert hosts offer criticism, insight, and enthusiasm that goes far beyond any single review. Whether you're a console gamer, PC enthusiast, or mobile player, there's a show for you.",
        "podcasts": [
            ("Giant Bombcast", "Giant Bomb's flagship show bringing personality and depth to weekly gaming news and reviews."),
            ("The Game Design Roundtable", "Professionals discuss game design from the inside, covering craft, process, and industry realities."),
            ("Waypoint Radio", "Vice Gaming's thoughtful, critically engaged look at games and their cultural context."),
            ("Kinda Funny Games Daily", "Daily gaming news and commentary with infectious enthusiasm from a beloved community."),
            ("The Indoor Kids", "Kumail Nanjiani (before he was famous) and friends explored gaming's place in pop culture."),
            ("Retronauts", "A loving, expert exploration of gaming history and the classics that shaped the medium."),
            ("Switch It Up", "Nintendo-focused podcast covering Switch games, news, and fan community conversations."),
        ],
        "icon": "🎮",
    },
    {
        "slug": "travel",
        "title": "Travel",
        "meta_desc": "Find the best travel podcasts covering destination guides, travel tips, adventure stories, budget travel, and solo travel inspiration. Browse episode briefs on PodBrief.",
        "h1": "Travel",
        "description": "Travel podcasts open up the world through storytelling, practical advice, and the infectious excitement of people who've devoted their lives to exploration. From budget backpacking tactics to luxury escapes, from solo adventure to family travel, these shows inspire itineraries and cultivate the mindset of a genuine traveler. Even when you can't go anywhere, a great travel podcast takes you there.",
        "podcasts": [
            ("Zero to Travel", "Jason Moore on how to travel long-term, build location independence, and explore the world."),
            ("Amateur Traveler", "Chris Christensen covers specific destinations with deep local knowledge and practical planning tips."),
            ("The Travel Podcast", "BBC's travel show bringing vivid storytelling from destinations around the globe."),
            ("Women Who Travel", "Condé Nast Traveler's celebration of women exploring the world on their own terms."),
            ("Extra Pack of Peanuts", "Travis and Heather Sherry on travel hacking, points, and maximizing travel budgets."),
            ("Indie Travel Podcast", "Craig and Linda Martin on independent, thoughtful, and sustainable travel."),
            ("No Reservations", "Inspired by Anthony Bourdain — immersive food and travel storytelling from around the world."),
        ],
        "icon": "✈️",
    },
    {
        "slug": "food-cooking",
        "title": "Food & Cooking",
        "meta_desc": "Explore the best food and cooking podcasts covering recipes, culinary techniques, food culture, chef interviews, and the business of the restaurant industry. Browse episode briefs on PodBrief.",
        "h1": "Food & Cooking",
        "description": "Food and cooking podcasts satisfy the appetite for great stories as much as great meals. From the science of flavor and culinary technique to the history of food cultures and the business of restaurants, these shows celebrate food in all its complexity. Whether you're a home cook perfecting your pasta or a foodie fascinated by culinary history, there's a podcast worth savoring.",
        "podcasts": [
            ("The Dave Chang Show", "Chef and restaurateur Dave Chang talks food, culture, and life with a distinctly honest voice."),
            ("Gastropod", "Cynthia Graber and Nicola Twilley explore the science and history behind every food we eat."),
            ("Spilled Milk", "Molly Wizenberg and Matthew Amster-Burton dissect one food per episode with wit and appetite."),
            ("Burnt Toast", "Food52's exploration of recipes, kitchen science, and the culture around how we eat."),
            ("The Splendid Table", "Lynne Rossetto Kasper and Francis Lam celebrate the world's food cultures with warmth and depth."),
            ("Milk Street Radio", "Christopher Kimball's thoughtful exploration of global cooking techniques and ingredients."),
            ("Food Schmooze", "WNPR's delicious conversation about local and global food with leading chefs and food writers."),
        ],
        "icon": "🍳",
    },
    {
        "slug": "design-ux",
        "title": "Design & UX",
        "meta_desc": "Discover top design and UX podcasts covering product design, user experience, interface design, design systems, and creative careers. Browse episode briefs on PodBrief.",
        "h1": "Design & UX",
        "description": "Design and UX podcasts serve the growing community of practitioners shaping how people interact with products, services, and information. From foundational principles of human-centered design to emerging trends in AI-assisted tools and design systems, these shows keep designers thinking critically and creatively. Whether you're a visual designer, UX researcher, or product manager, these conversations expand your craft.",
        "podcasts": [
            ("Design Details", "Brian Lovin and Marshall Bock interview product designers from top tech companies about their work and process."),
            ("99% Invisible", "Roman Mars explores the unnoticed design of everything around us — essential listening for any designer."),
            ("ShopTalk Show", "Chris Coyier and Dave Rupert on frontend web design and development from a practitioner's view."),
            ("The Futur", "Chris Do on the business and career side of design, helping creatives build sustainable practices."),
            ("UI Breakfast", "Jane Portman on UI and UX design for SaaS products, with actionable practitioner conversations."),
            ("Presentable", "Jeff Veen on the intersection of design culture, business, and technology from a veteran designer."),
            ("Honest Designers Show", "Tom Ross and Ian Barnard on the real challenges of building a career in design."),
        ],
        "icon": "🎨",
    },
]


TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} Podcasts — PodBrief</title>
    <meta name="description" content="{meta_desc}">
    <link rel="canonical" href="https://podbrief.info/topics/{slug}">
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        .topic-container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }}
        
        .topic-header {{
            text-align: center;
            margin-bottom: 3rem;
            padding-top: 2rem;
        }}
        
        .topic-header h1 {{
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        
        .topic-header p {{
            font-size: 1.2rem;
            color: #ccc;
            max-width: 700px;
            margin: 0 auto;
        }}
        
        .topic-description {{
            background: rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            padding: 1.5rem 2rem;
            margin-bottom: 2.5rem;
            color: #bbb;
            font-size: 1rem;
            line-height: 1.75;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }}
        
        .browse-cta {{
            text-align: center;
            margin-bottom: 2.5rem;
        }}
        
        .browse-cta a {{
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            text-decoration: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            transition: opacity 0.2s ease;
        }}
        
        .browse-cta a:hover {{
            opacity: 0.85;
        }}
        
        .section-title {{
            font-size: 1.4rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 1.25rem;
        }}
        
        .episodes-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }}
        
        .episode-card {{
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.25rem;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }}
        
        .episode-card:hover {{
            transform: translateY(-4px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }}
        
        .episode-card .podcast-name {{
            color: #8b5cf6;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .episode-card h3 {{
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.4;
            margin: 0 0 0.5rem 0;
        }}
        
        .episode-card p {{
            color: #999;
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0;
        }}
        
        @media (max-width: 768px) {{
            .topic-header h1 {{
                font-size: 2rem;
            }}
            
            .episodes-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "{title} Podcasts",
      "description": "{meta_desc}",
      "url": "https://podbrief.info/topics/{slug}",
      "isPartOf": {{
        "@type": "WebSite",
        "name": "PodBrief",
        "url": "https://podbrief.info"
      }}
    }}
    </script>
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
                <a href="/topics.html">Topics</a>
                <a href="/faq.html">FAQ</a>
            </nav>
        </div>
    </header>

    <div class="topic-container">
        <div class="topic-header">
            <h1>{h1}</h1>
            <p>{description_short}</p>
        </div>

        <div class="topic-description">
            <p>{description_full}</p>
        </div>

        <div class="browse-cta">
            <a href="/browse.html">Browse All Episode Briefs →</a>
        </div>

        <div class="section-title">Featured Podcasts in {h1}</div>
        <div class="episodes-grid">
{podcast_cards}
        </div>
    </div>

    <footer class="footer">
        <div class="footer-container">
            <p>&copy; 2024 PodBrief. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
'''

CARD_TEMPLATE = '''            <div class="episode-card">
                <div class="podcast-name">{name}</div>
                <h3>{name}</h3>
                <p>{desc}</p>
            </div>'''


def generate_page(topic):
    slug = topic["slug"]
    podcast_cards = "\n".join(
        CARD_TEMPLATE.format(name=name, desc=desc)
        for name, desc in topic["podcasts"]
    )
    # Short description (first sentence of full description)
    desc_full = topic["description"]
    short = desc_full.split(".")[0] + "."

    html = TEMPLATE.format(
        title=topic["title"],
        meta_desc=topic["meta_desc"],
        slug=slug,
        h1=topic["h1"],
        description_short=short,
        description_full=desc_full,
        podcast_cards=podcast_cards,
    )
    path = os.path.join(TOPICS_DIR, f"{slug}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Created: {slug}.html")
    return slug


if __name__ == "__main__":
    created = []
    for topic in TOPICS:
        slug = generate_page(topic)
        created.append(slug)
    
    print(f"\n✅ Created {len(created)} topic pages:")
    for slug in created:
        print(f"  - {slug}.html")
