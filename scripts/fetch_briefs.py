#!/usr/bin/env python3
"""
Fetch briefs from Firebase/GCS for SEO page generation.
"""
import json
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage

# Initialize Firebase
SERVICE_ACCOUNT_PATH = "PodBrief/modal_testing/parakeet_transcriber_api/podbrief-76274-firebase-adminsdk-fbsvc-82a48189c2.json"
BUCKET_NAME = "podbrief-76274.firebasestorage.app"

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()
storage_client = storage.Client.from_service_account_json(SERVICE_ACCOUNT_PATH)
bucket = storage_client.bucket(BUCKET_NAME)

def list_podcasts_with_briefs(limit=10):
    """List podcasts that have episodes with completed briefs."""
    podcasts_ref = db.collection('podcasts')
    podcasts = podcasts_ref.limit(limit).stream()
    
    results = []
    for podcast in podcasts:
        podcast_data = podcast.to_dict()
        podcast_id = podcast.id
        
        # Get episodes with completed briefs
        episodes_ref = db.collection('podcasts').document(podcast_id).collection('episodes')
        episodes = episodes_ref.where('briefing_status', '==', 'completed').limit(5).stream()
        
        episode_list = []
        for ep in episodes:
            ep_data = ep.to_dict()
            episode_list.append({
                'guid': ep.id,
                'title': ep_data.get('title', 'Unknown'),
                'briefing_gcs_uri': ep_data.get('briefing_gcs_uri'),
                'briefing_json_gcs_uri': ep_data.get('briefing_json_gcs_uri'),
            })
        
        if episode_list:
            results.append({
                'podcast_id': podcast_id,
                'podcast_title': podcast_data.get('title', 'Unknown'),
                'episodes': episode_list
            })
    
    return results

def fetch_briefing_content(gcs_uri):
    """Fetch briefing content from GCS."""
    if not gcs_uri:
        return None
    
    # Parse GCS URI (gs://bucket/path or just path)
    if gcs_uri.startswith('gs://'):
        path = gcs_uri.split('/', 3)[3]
    else:
        path = gcs_uri
    
    blob = bucket.blob(path)
    try:
        content = blob.download_as_text()
        return json.loads(content) if path.endswith('.json') else content
    except Exception as e:
        print(f"Error fetching {path}: {e}")
        return None

if __name__ == "__main__":
    print("Fetching podcasts with completed briefs...")
    results = list_podcasts_with_briefs(limit=5)
    
    print(f"\nFound {len(results)} podcasts with briefs:\n")
    
    for podcast in results:
        print(f"📻 {podcast['podcast_title']} (ID: {podcast['podcast_id']})")
        for ep in podcast['episodes']:
            print(f"   └─ {ep['title'][:50]}...")
            if ep['briefing_json_gcs_uri']:
                print(f"      Brief URI: {ep['briefing_json_gcs_uri']}")
        print()
    
    # Fetch one sample briefing
    if results and results[0]['episodes']:
        sample_uri = results[0]['episodes'][0].get('briefing_json_gcs_uri')
        if sample_uri:
            print("\n--- Sample Briefing Content ---")
            content = fetch_briefing_content(sample_uri)
            if content:
                print(json.dumps(content, indent=2)[:2000])
