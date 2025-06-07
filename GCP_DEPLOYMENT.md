# GCP Deployment Guide for PodBrief

## 🚀 Deploy to Google App Engine

### Prerequisites
1. **Google Cloud SDK installed**: [Install gcloud CLI](https://cloud.google.com/sdk/docs/install)
2. **GCP Project**: Make sure you have a project set up
3. **App Engine enabled**: Enable App Engine API in your project

### Quick Deploy Commands

```bash
# 1. Authenticate with Google Cloud
gcloud auth login

# 2. Set your project ID
gcloud config set project YOUR-PROJECT-ID

# 3. Deploy to App Engine
gcloud app deploy

# 4. View your deployed app
gcloud app browse
```

### Detailed Steps

#### 1. Initialize gcloud (if not done already)
```bash
# Login to your Google account
gcloud auth login

# List your projects
gcloud projects list

# Set your project
gcloud config set project YOUR-PROJECT-ID

# Enable required APIs
gcloud services enable appengine.googleapis.com
```

#### 2. Deploy Application
```bash
# Deploy from project root
gcloud app deploy

# Follow prompts:
# - Choose region (us-central1 recommended)
# - Confirm deployment
```

#### 3. Set Custom Domain (Optional)
```bash
# Map custom domain
gcloud app domain-mappings create podbrief.info
```

## 🔧 Alternative: Cloud Run (Containerized)

If you prefer containerized deployment:

### Create Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

### Deploy to Cloud Run
```bash
# Build and deploy in one command
gcloud run deploy podbrief-server \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🌐 URL Structure

After deployment, your URLs will be:
- **App Engine**: `https://YOUR-PROJECT-ID.uc.r.appspot.com/briefing/EPISODE-ID`
- **Custom Domain**: `https://podbrief.info/briefing/EPISODE-ID`

## 🔍 Testing Deployment

Test these URLs after deployment:
```
https://your-domain.com/briefing/743081-364e7f36-71ca-4481-aef2-d1903cf430aa
https://your-domain.com/briefing/550168-96838efe-4260-11f0-af85-cf742297bb98
```

## 📊 Monitoring

### View logs
```bash
gcloud app logs tail -s default
```

### Check app status
```bash
gcloud app describe
```

## 💰 Cost Considerations

- **App Engine**: Pay per request, free tier available
- **Cloud Run**: Pay per request/CPU time, very cost-effective
- **Minimal traffic**: Should stay within free tier limits

## 🔧 Environment Configuration

App Engine automatically handles:
- ✅ HTTPS/SSL certificates
- ✅ Load balancing
- ✅ Auto-scaling
- ✅ Health checks

## 📱 Update App URLs

After deployment, update your mobile app to use:
```swift
let shareURL = "https://podbrief.info/briefing/\(podcastId)-\(episodeGuid)"
```

## 🚨 Troubleshooting

### Common Issues:
1. **"Region not set"**: Run `gcloud app create --region=us-central1`
2. **"Billing not enabled"**: Enable billing in GCP Console
3. **"API not enabled"**: Run the services enable commands above

### Debug deployment:
```bash
# Check app logs
gcloud app logs tail -s default

# Check app versions
gcloud app versions list
``` 