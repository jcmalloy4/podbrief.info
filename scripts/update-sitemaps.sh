#!/bin/bash
# Auto-update sitemaps when new briefs are added

cd "$(dirname "$0")/../podbrief.info"

echo "Regenerating sitemap-briefs.xml..."

# Generate sitemap from all brief files
cat > sitemap-briefs.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOF

# Find all brief HTML files and add to sitemap
find briefs -name "*.html" -type f | sort -r | while read -r file; do
  # Extract path relative to briefs/
  path="${file#briefs/}"
  echo "  <url>" >> sitemap-briefs.xml
  echo "    <loc>https://podbrief.info/briefs/${path}</loc>" >> sitemap-briefs.xml
  echo "  </url>" >> sitemap-briefs.xml
done

echo "</urlset>" >> sitemap-briefs.xml

BRIEF_COUNT=$(grep -c "<loc>" sitemap-briefs.xml)
echo "✅ Updated sitemap-briefs.xml with $BRIEF_COUNT URLs"

# Commit and push if there are changes
if git diff --quiet sitemap-briefs.xml; then
  echo "No changes to sitemap"
else
  git add sitemap-briefs.xml
  git commit -m "Auto-update sitemap with latest briefs"
  git push origin main
  echo "✅ Pushed sitemap update to GitHub"
fi
