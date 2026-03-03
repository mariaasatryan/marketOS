#!/bin/bash

# MarketOS Auto Deploy Script
echo "🚀 Starting MarketOS deployment..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Copy to docs directory
echo "📁 Copying files to docs..."
mkdir -p docs
cp -r dist/* docs/
# GitHub Pages: serve app for 404 so client-side routing works
cp docs/index.html docs/404.html

# Add and commit changes
echo "💾 Committing changes..."
git add docs/
git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deployment completed!"
echo "🌐 Site will be available at: https://mariaasatryan.github.io/marketOS/"
echo "⏱️  GitHub Pages usually takes 1-2 minutes to update"
