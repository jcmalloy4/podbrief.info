# PodBrief Server Deployment

## 🎯 Problem Solved
- **✅ iMessage Link Previews**: Server-side rendered Open Graph metadata
- **✅ Dynamic URLs**: Handle any episode without creating static files
- **✅ App Redirection**: Automatic redirect to PodBrief app after metadata is served

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Free Tier)
1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Connect your GitHub repo
4. Railway auto-detects Node.js and deploys
5. Get your custom URL: `https://your-app.railway.app`

### Option 2: Render (Free Tier)
1. Go to [Render.com](https://render.com)
2. Connect GitHub repo
3. Create new Web Service
4. Build command: `npm install`
5. Start command: `npm start`

### Option 3: Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts to deploy

### Option 4: Railway CLI (Fastest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway up
```

## 🧪 Local Testing

```bash
# Install dependencies
npm install

# Start server
npm start

# Test URLs:
# http://localhost:3000/briefing/743081-364e7f36-71ca-4481-aef2-d1903cf430aa
# http://localhost:3000/briefing/550168-96838efe-4260-11f0-af85-cf742297bb98
```

## 🔧 Environment Variables (Optional)

For production, you might want to add:
- `PORT` (auto-set by most hosting services)
- `DATABASE_URL` (when you add episode metadata)
- `API_KEY` (for fetching episode data)

## 📱 URL Format

**New Format (works with iMessage):**
```
https://your-domain.com/briefing/743081-364e7f36-71ca-4481-aef2-d1903cf430aa
```

**Old Format (auto-redirects):**
```
https://your-domain.com/briefing/743081/364e7f36-71ca-4481-aef2-d1903cf430aa
```

## 🎨 Customization

To add episode-specific metadata, modify the `briefingData` object in `server.js`:

```javascript
// Replace this static data:
const briefingData = {
  title: `PodBrief - Episode Title Here`,
  description: `Brief description of this specific episode`,
  imageUrl: `https://your-domain.com/episode-images/${episodeGuid}.jpg`
};

// With dynamic data from your API:
const briefingData = await fetchEpisodeData(podcastId, episodeGuid);
```

## ✅ Next Steps

1. **Deploy** using one of the options above
2. **Update your app** to use the new domain
3. **Test** iMessage link previews
4. **Add episode-specific metadata** when ready 