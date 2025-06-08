# PodBrief Migration Guide: App Engine to Cloud Run

This guide walks you through migrating your PodBrief website from Google App Engine to Cloud Run while preserving all Firebase permissions and backend functionality.

## 🎯 Migration Overview

**What's changing:**
- Hosting platform: App Engine → Cloud Run
- Deployment method: `gcloud app deploy` → Cloud Build + Cloud Run
- Configuration: `app.yaml` → `Dockerfile` + `cloudbuild.yaml`

**What's staying the same:**
- ✅ Firebase Admin SDK integration
- ✅ All environment variables and secrets
- ✅ Backend API authentication
- ✅ Static file serving
- ✅ Application functionality

## 📋 Prerequisites

1. **Google Cloud CLI installed and authenticated**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Required APIs enabled** (the script will do this automatically)
   - Cloud Build API
   - Cloud Run API
   - Container Registry API

## 🚀 Quick Migration (Automated)

The easiest way to migrate is using the provided deployment script:

```bash
./deploy.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Enable required APIs
- ✅ Build your Docker container
- ✅ Deploy to Cloud Run
- ✅ Provide you with the new service URL

## 🔧 Manual Migration Steps

If you prefer to run the migration manually:

### Step 1: Build and Push Container
```bash
# Build the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/podbrief-website .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/podbrief-website
```

### Step 2: Deploy to Cloud Run
```bash
gcloud run deploy podbrief-website \
  --image gcr.io/YOUR_PROJECT_ID/podbrief-website \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --timeout 300 \
  --set-env-vars NODE_ENV=production,BACKEND_URL=https://podbrief-5kgqcgqjsa-uc.a.run.app,FIREBASE_API_KEY=AIzaSyBlRxE3r7CBKUIkdAquG4CnbP3893rvxmI
```

## 🔐 Firebase Integration

Your Firebase integration is fully preserved:

- **Service Account**: The `firebase-service-account.json` file is included in the container
- **Authentication**: Custom token generation continues to work
- **API Calls**: Backend authentication using Firebase ID tokens remains unchanged
- **Environment Variables**: All Firebase configuration is maintained

## 📊 Performance Improvements

Cloud Run offers several advantages over App Engine:

| Feature | App Engine | Cloud Run |
|---------|------------|-----------|
| **Cold Start** | ~2-3 seconds | ~1-2 seconds |
| **Scaling** | Limited control | Full control (0-1000 instances) |
| **Pricing** | Instance hours | Request-based + CPU/Memory |
| **Concurrency** | 1 request/instance | Up to 1000 requests/instance |
| **Memory** | Fixed tiers | Flexible (128Mi-8Gi) |
| **CPU** | Coupled with memory | Independent allocation |

## 🌐 Domain Configuration

After successful deployment:

1. **Get your Cloud Run URL**:
   ```bash
   gcloud run services describe podbrief-website --region=us-central1 --format="value(status.url)"
   ```

2. **Configure custom domain** (if needed):
   ```bash
   gcloud run domain-mappings create --service=podbrief-website --domain=podbrief.info --region=us-central1
   ```

3. **Update DNS records** to point to Cloud Run

## 🔍 Testing Your Migration

1. **Functional Testing**:
   - Visit your new Cloud Run URL
   - Test podcast page loading
   - Verify episode details work
   - Check Firebase authentication

2. **Performance Testing**:
   - Monitor response times
   - Check cold start performance
   - Verify scaling behavior

## 📈 Monitoring and Optimization

### Cloud Run Metrics to Monitor:
- Request latency
- Instance utilization
- Cold starts
- Error rates

### Optimization Tips:
- Adjust `--min-instances` if you need faster response times
- Increase `--concurrency` for better resource utilization
- Monitor memory usage and adjust `--memory` as needed

## 🔄 Rollback Plan

If you need to rollback to App Engine:

1. **Keep your App Engine service running** during initial testing
2. **Switch traffic back** using Cloud Load Balancer or DNS
3. **Your original `app.yaml`** remains unchanged

## 💰 Cost Optimization

Cloud Run pricing advantages:
- **Pay per request** instead of instance hours
- **Scale to zero** when not in use
- **Better resource utilization** with higher concurrency
- **No minimum instance requirements**

Estimated cost reduction: **30-60%** for typical web applications

## 🆘 Troubleshooting

### Common Issues:

**Container fails to start:**
```bash
# Check logs
gcloud logs read --service=podbrief-website --region=us-central1
```

**Firebase authentication errors:**
- Verify `firebase-service-account.json` is in the container
- Check environment variables are set correctly
- Ensure Firebase API key is valid

**Static files not loading:**
- Verify `express.static('.')` is working
- Check file paths in the container

## 📞 Support

If you encounter issues during migration:
1. Check the Cloud Run logs: `gcloud logs read --service=podbrief-website`
2. Verify all environment variables are set correctly
3. Test the Docker container locally first

---

**🎉 Congratulations!** Your PodBrief website is now running on Cloud Run with improved performance, better scaling, and reduced costs while maintaining all Firebase functionality. 