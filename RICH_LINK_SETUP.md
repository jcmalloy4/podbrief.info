# PodBrief Rich Link Preview Service

This service provides rich link previews for PodBrief podcast and episode links. When users share links to podcasts or episodes, platforms like Twitter, Facebook, and iMessage will display rich previews with podcast artwork, titles, and descriptions.

## Features

- Rich metadata for podcast and episode links
- Automatic app deep linking
- Fallback content for unavailable episodes
- Firebase authentication integration
- PodBrief logo overlay on preview images

## URL Formats

- Podcast Preview: `/podcast/[id]`
- Episode Preview: `/episode/[podcastId]-[episodeGuid]`
- Briefing Preview: `/briefing/[podcastId]-[briefingId]`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in `.env`:
   - `BACKEND_URL`: Your PodBrief backend service URL
   - `FIREBASE_API_KEY`: Firebase Web API Key
   - `NODE_ENV`: Set to 'development' or 'production'

4. Add Firebase service account key:
   - Save as `firebase-service-account.json` in project root
   - Add to `.gitignore` (already done)

## Development

```bash
npm run dev
```

## Deployment

Deploy to Google App Engine:

```bash
gcloud app deploy
```

## Testing

Test local development:
```bash
curl "http://localhost:3000/podcast/[id]"
curl "http://localhost:3000/episode/[podcastId]-[episodeGuid]"
```

Test production:
```bash
curl "https://podbrief-76274.uc.r.appspot.com/podcast/[id]"
curl "https://podbrief-76274.uc.r.appspot.com/episode/[podcastId]-[episodeGuid]"
```

## Security

- Firebase authentication for backend API calls
- Service account with minimal permissions
- Environment variables for sensitive data
- HTTPS-only in production

## Notes

- The service uses fallback data if the backend is unreachable
- Authentication works automatically in App Engine environment
- Local development uses service account authentication

## API Integration Details

### Authentication Flow
1. Website generates a Firebase custom token using Admin SDK
2. Uses this token to authenticate with your backend API
3. Fetches podcast/episode data from your API endpoints

### API Endpoints Used
- `/podcast-index/episodes/{feedId}` - Get podcast and episode data
- `/check-briefing-status` - Check if briefing exists for an episode

### Error Handling
- API failures gracefully fall back to generic content
- Images fall back to default PodBrief branding
- Network timeouts are handled (10-second timeout)

## Testing Rich Link Previews

### Test in iMessage (iOS)
1. Share a link like: `https://podbrief.info/podcast/123456`
2. Should show podcast artwork, title, and description

### Test in Social Media
1. Paste links into Twitter, Facebook, LinkedIn
2. Should generate rich previews with images and metadata

### Debug with Meta Debugger
1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your URLs to see how they'll appear

## Customization Options

### Image Composition
Currently, the system uses the podcast/episode image directly. You could enhance this by:

1. **Dynamic Image Service**: Create an endpoint that combines your logo with podcast artwork
2. **Static Overlays**: Pre-generate branded versions of common podcast images
3. **Client-Side Composition**: Use canvas to combine images (though this won't work for social media previews)

### Caching
Consider adding caching to improve performance:

```javascript
// Add to server.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

async function fetchPodcastDetails(feedId) {
  const cacheKey = `podcast_${feedId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // ... existing fetch logic ...
  
  if (result) {
    cache.set(cacheKey, result);
  }
  return result;
}
```

## Troubleshooting

### Common Issues

1. **"Firebase Admin initialization failed"**
   - Check that `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
   - Ensure service account has proper permissions

2. **"API call failed" errors**
   - Verify `BACKEND_URL` is correct
   - Check that your backend is accessible from your website
   - Ensure Firebase authentication is working

3. **Images not loading**
   - Check that image URLs are accessible
   - Verify CORS settings on your backend if serving images

4. **Generic content instead of real data**
   - Check browser dev tools for API errors
   - Verify podcast/episode IDs are valid
   - Check backend logs for authentication issues

### Debugging Steps

1. **Check logs locally:**
```bash
npm run dev
# Check console output for API errors
```

2. **Check Google Cloud logs:**
```bash
gcloud app logs tail -s default
```

3. **Test API directly:**
```bash
# Get an auth token and test your backend
curl -H "Authorization: Bearer $TOKEN" \
     "https://your-backend-url/podcast-index/episodes/123456"
```

## Next Steps

1. **Monitor Performance**: Watch for API response times and errors
2. **Add Analytics**: Track which podcasts/episodes are shared most
3. **Enhance Images**: Consider implementing dynamic image generation
4. **SEO Optimization**: Add structured data for better search engine indexing

## Support

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Test API endpoints directly to ensure they're working
4. Check Firebase project permissions

Your rich link sharing should now display beautiful, dynamic content with real podcast data and images! 