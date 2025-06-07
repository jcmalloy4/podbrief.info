# App URL Format for iMessage Compatibility

## Problem
The app currently generates URLs like:
```
https://podbrief.info/briefing/550168/96838efe-4260-11f0-af85-cf742297bb98/
```

But for iMessage link previews to work properly, we need static pages with embedded Open Graph metadata (no JavaScript execution).

## Solution
**Change the app to generate URLs in this format:**
```
https://podbrief.info/briefing/550168-96838efe-4260-11f0-af85-cf742297bb98/
```

## Required App Changes

### In your sharing functionality, change from:
```swift
// OLD FORMAT (doesn't work with iMessage previews)
let shareURL = "https://podbrief.info/briefing/\(podcastId)/\(episodeGuid)/"
```

### To:
```swift
// NEW FORMAT (works with iMessage previews)
let shareURL = "https://podbrief.info/briefing/\(podcastId)-\(episodeGuid)/"
```

## Why This Works

1. **Static Jekyll Pages**: Each URL corresponds to a static file in `_briefings/`
2. **Open Graph Metadata**: Served immediately without JavaScript execution
3. **iMessage Compatibility**: Social media crawlers can read metadata instantly
4. **Automatic App Redirect**: Page still redirects to app after metadata is parsed

## Creating New Briefing Pages

For each new episode, create a file in `_briefings/` with this naming pattern:
```
_briefings/{podcastId}-{episodeGuid}.md
```

Example:
```markdown
---
layout: briefing
podcast_id: "550168"
episode_guid: "96838efe-4260-11f0-af85-cf742297bb98"
episode_title: "Episode Title Here"
podcast_name: "Podcast Name Here"
description: "Brief description for social sharing"
---
```

This creates the URL: `/briefing/550168-96838efe-4260-11f0-af85-cf742297bb98/`

## Benefits

- ✅ Perfect iMessage link previews with PodBrief logo
- ✅ Automatic app redirection after metadata is parsed
- ✅ Works on all platforms (iOS, Android, Desktop)
- ✅ SEO-friendly static pages
- ✅ No intermediate button press required 