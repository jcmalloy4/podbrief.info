# MEMORY.md - Monty Molt's Long-Term Memory

## PodBrief Infrastructure

### Deployment
- **Platform:** Google Cloud Run (`podbrief-website` service, project `podbrief-76274`, region `us-central1`)
- **Repo:** `jcmalloy4/podbrief.info` on GitHub (main branch)
- **⚠️ NO auto-deploy trigger** for `podbrief.info` repo — must manually run `gcloud builds submit --config cloudbuild.yaml --project=podbrief-76274 --async` after pushing content changes
- Only auto-trigger is for `jhascall/PodBrief` backend repo
- After every batch of content commits, trigger a Cloud Build deploy

### Brief Upload System
- Briefs posted daily to Firebase Storage (confirmed by John)
- Sync script created: `scripts/sync-briefs-from-firebase.js`
- **BLOCKED:** Missing `firebase-service-account.json` — need credentials from John
- Current brief count in sitemap: ~9,797

### Site Stats (as of Feb 27, 2026)
- Total SEO pages: ~10,141
- Blog posts: 157
- Brief pages: 9,797
- Directory pages: 135
- Topic pages: 52

## Blog Content
- Daily target: 5-10 posts
- Current blog post list tracked in `memory/seo-growth-tracker.json`
- All posts follow template from `blog/lex-fridman-best-episodes.html`
- After each batch: update `blog/index.html` + `sitemap-blog.xml` + trigger Cloud Build

## Website Redesign (Feb 2026)
- Completed competitive analysis of Snipd, Podwise, Snipcast
- **Phase 1 Complete:** Homepage redesign (`index-new.html`, `homepage-redesign.css`)
  - Modern gradients, search bar, topic cards, value props section
- **Phase 2 Complete:** Browse page redesign (`browse-new.html`)
  - Topic filters, sorting, modern card layout, needs dynamic data loading
- **Phase 3 TODO:** Blog page redesign
- **Phase 4 TODO:** Individual episode/podcast page improvements
- Design emphasizes: free access, search prominence, topic discovery, social proof

## Key Blockers for John
1. **Firebase credentials** — needed to automate brief sync
2. **Cloud Build trigger** — consider setting up GitHub trigger for `jcmalloy4/podbrief.info` to auto-deploy on push

## Lessons Learned
- Commits to `podbrief.info` do NOT auto-deploy — always trigger Cloud Build after content pushes
- `gh repo list` only shows owned repos; use `gh api user/repos` for accessible repos
