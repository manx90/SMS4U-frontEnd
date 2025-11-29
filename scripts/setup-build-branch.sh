#!/bin/bash

# Script to setup build branch
# This script creates a new build branch with only build files

echo "🚀 Setting up build branch..."

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "⚠️  Warning: You're not on main/master branch. Current branch: $current_branch"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Make sure we're up to date
echo "📥 Pulling latest changes..."
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || true

# Check if build branch exists
if git show-ref --verify --quiet refs/heads/build; then
    echo "⚠️  Build branch already exists!"
    read -p "Delete and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -D build
        git push origin --delete build 2>/dev/null || true
    else
        echo "❌ Aborted"
        exit 1
    fi
fi

# Build the project first
echo "🔨 Building project..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Build failed?"
    exit 1
fi

# Create build branch
echo "🌿 Creating build branch..."
git checkout -b build

# Remove all files except .git
echo "🧹 Cleaning build branch..."
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitignore' -exec rm -rf {} +

# Copy dist contents
echo "📦 Copying build files..."
cp -r dist/* .

# Create README
cat > README.md << 'EOF'
# Build Files

This branch contains only the built files for deployment.
Source code is in the 'main' branch.

**Do not edit this branch manually!**
This branch is automatically updated by GitHub Actions.
EOF

# Create .gitignore for build branch
cat > .gitignore << 'EOF'
# This is a build branch - keep all files
EOF

# Commit
echo "💾 Committing build files..."
git add -A
git commit -m "Initial build branch setup"

# Push
echo "📤 Pushing build branch to remote..."
git push -u origin build

# Return to main
git checkout main

echo "✅ Build branch setup complete!"
echo ""
echo "Next steps:"
echo "1. The GitHub Actions workflow will automatically update the build branch"
echo "2. The build branch will be deployed to the server automatically"
echo "3. Continue working on the 'main' branch for development"

