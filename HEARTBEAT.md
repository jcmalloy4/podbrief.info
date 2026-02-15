# HEARTBEAT.md - Autonomous Growth Work

## Primary Mission
Drive PodBrief to $10k MRR through SEO and content growth.

## Heartbeat Tasks (Rotate Through These)

### Competitive Analysis & Website Redesign (PRIORITY)
**Goal:** Analyze competitor websites and completely redesign podbrief.info based on best practices.

**Competitive Research (Do First):**
1. Analyze 3-5 competitor websites:
   - Podcast summary/transcript sites
   - Podcast discovery platforms
   - AI content aggregators
   - Note: design, navigation, features, UX patterns
2. Document findings in `memory/competitive-analysis.md`
3. Identify what makes them successful
4. Find gaps we can fill better

**Redesign Execution:**
1. Create redesign plan based on competitive insights
2. Prioritize homepage, browse page, blog
3. Improve navigation, visual hierarchy, CTAs
4. Make it look modern and professional
5. Test on mobile and desktop
6. Deploy incrementally (test each change)

**Track progress in `memory/website-redesign-tracker.json`**

### Brief Upload Automation (CRITICAL - Check Every Heartbeat)
**Goal:** Ensure new briefs are continuously uploaded and indexed.

**Every heartbeat, check:**
1. Is the brief upload system running?
   - Check for new briefs in the PodBrief backend
   - Verify they're being added to sitemap-briefs.xml
   - Confirm they're deployed to podbrief.info
2. Are uploads working correctly?
   - Check timestamp of last brief upload
   - Verify sitemap count is increasing
   - Test random brief URLs to ensure they load
3. If broken:
   - Investigate the issue
   - Fix the upload pipeline
   - Alert John immediately

**Track in `memory/brief-upload-monitor.json`:**
- Last upload timestamp
- Number of briefs uploaded today
- Any errors or issues
- System health status

### Content Creation (Priority)
**Goal:** 5-10 blog posts per day, spread throughout the day.

Check `memory/seo-growth-tracker.json` for current count. If fewer than 5 blog posts created today:
- Create 2-3 blog posts targeting high-value keywords
- Focus on: podcast comparisons, best-of lists, how-to guides, show-specific guides
- Update blog index
- Update sitemap-blog.xml
- Commit and push
- Start deployment

**Blog post ideas queue:**
- Best true crime podcasts
- Best science podcasts
- All-In podcast best episodes
- Lex Fridman best episodes
- Tim Ferriss best episodes
- Best podcasts for learning
- Best short podcasts (under 30 min)
- Podcast listening apps compared
- How to find new podcasts
- Best finance podcasts
- Best technology podcasts
- Best marketing podcasts
- SmartLess best episodes

### Comparison Pages (High-Impact SEO)
Create 2-3 comparison pages targeting high search volume:
- "All-In vs My First Million podcast"
- "Huberman Lab vs Lex Fridman podcast"
- "The Daily vs Up First news podcasts"
- "Joe Rogan vs Lex Fridman interviews"

### Best Episodes Pages (Per Show)
Target show-specific searches:
- "Best All-In Episodes of All Time"
- "Best Lex Fridman Interviews"
- "Best My First Million Episodes"
- "Top SmartLess Celebrity Interviews"

### Use-Case Landing Pages
- "Best Podcasts for Your Morning Routine"
- "Podcasts for Long Flights"
- "Best Workout Podcasts"
- "Podcasts to Fall Asleep To"

### FAQ/How-To Pages
- "How to Start Listening to Podcasts"
- "Best Podcast Apps Compared"
- "How to Discover New Podcasts"

### Site Improvements
- Add breadcrumbs to podcast/topic pages
- Improve internal linking
- Add more schema markup (BreadcrumbList, FAQPage)
- Generate more topic pages (aim for 50+ total)
- Fix mobile responsiveness issues
- Clean up design inconsistencies

### Metrics Check (2x Daily - Morning & Evening)
- Check if Google Search Console data is available
- Look for any deployment failures
- Verify site is accessible
- Check git status for uncommitted work

### Deployment Management
- Monitor running deployments
- Ensure changes actually go live
- Don't start more than 2 deployments simultaneously

## When to Message John

**Message every heartbeat with:**
- What I just built (blog posts, pages, improvements)
- Current stats (total pages, blog count, deployments)
- What's next
- Any issues or blockers

**Always ask for approval before:**
- Spending money
- Major architectural changes
- Accessing external APIs that need credentials

## When to Reply HEARTBEAT_OK

- Late night (11 PM - 7 AM Pacific)
- Just completed work less than 30 min ago
- Nothing urgent or significant to report
- All systems running normally

## Execution Guidelines

1. **Be productive, not chatty** - Build things, report results
2. **Batch work** - Create multiple blog posts at once, then deploy
3. **Track progress** - Update seo-growth-tracker.json after each session
4. **Stay focused** - Every action should map to traffic growth
5. **Don't wait for permission** - Build, test, deploy

## Current Stats (Updated by Me)
Last updated: 2026-02-13 13:40:00 PST
- Total SEO pages: 10,016
- Blog posts: 17
- Today's blog posts: 0 (reset daily at midnight)
