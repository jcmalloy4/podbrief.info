#!/bin/bash

# PodBrief Migration Script - App Engine to Cloud Run
# This script helps migrate your application from Google App Engine to Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PodBrief Migration: App Engine to Cloud Run${NC}"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project set. Please run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy using Cloud Build
echo -e "${YELLOW}🏗️  Building and deploying to Cloud Run...${NC}"
gcloud builds submit --config cloudbuild.yaml

# Get the Cloud Run service URL
echo -e "${YELLOW}🔍 Getting Cloud Run service URL...${NC}"
SERVICE_URL=$(gcloud run services describe podbrief-website --region=us-central1 --format="value(status.url)")

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}📋 Migration Summary:${NC}"
echo -e "• Service URL: ${GREEN}$SERVICE_URL${NC}"
echo -e "• Region: ${GREEN}us-central1${NC}"
echo -e "• Platform: ${GREEN}Cloud Run (managed)${NC}"
echo -e "• Scaling: ${GREEN}0-10 instances${NC}"
echo -e "• Memory: ${GREEN}512Mi${NC}"
echo -e "• CPU: ${GREEN}1 vCPU${NC}"
echo -e "• Concurrency: ${GREEN}80 requests/instance${NC}"
echo ""
echo -e "${YELLOW}🔄 Next Steps:${NC}"
echo "1. Test your application at: $SERVICE_URL"
echo "2. Update your domain DNS to point to Cloud Run"
echo "3. Configure custom domain in Cloud Run console"
echo "4. Monitor performance and adjust scaling settings if needed"
echo "5. Consider disabling App Engine service once migration is verified"
echo ""
echo -e "${BLUE}💡 Benefits of Cloud Run:${NC}"
echo "• Better cost efficiency with pay-per-use pricing"
echo "• Faster cold starts and better performance"
echo "• More flexible scaling (including scale-to-zero)"
echo "• Better integration with other Google Cloud services"
echo "• Support for custom domains and SSL certificates"
echo ""
echo -e "${GREEN}🎉 Migration completed! Your Firebase permissions are preserved.${NC}" 