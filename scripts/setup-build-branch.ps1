# PowerShell script to setup build branch
# This script creates a new build branch with only build files

Write-Host "🚀 Setting up build branch..." -ForegroundColor Cyan

# Check if we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "⚠️  Warning: You're not on main/master branch. Current branch: $currentBranch" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Make sure we're up to date
Write-Host "📥 Pulling latest changes..." -ForegroundColor Cyan
git pull origin main 2>$null
if ($LASTEXITCODE -ne 0) {
    git pull origin master 2>$null
}

# Check if build branch exists
$buildBranchExists = git show-ref --verify --quiet refs/heads/build
if ($buildBranchExists -eq 0) {
    Write-Host "⚠️  Build branch already exists!" -ForegroundColor Yellow
    $delete = Read-Host "Delete and recreate? (y/n)"
    if ($delete -eq "y" -or $delete -eq "Y") {
        git branch -D build
        git push origin --delete build 2>$null
    } else {
        Write-Host "❌ Aborted" -ForegroundColor Red
        exit 1
    }
}

# Build the project first
Write-Host "🔨 Building project..." -ForegroundColor Cyan
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist folder not found. Build failed?" -ForegroundColor Red
    exit 1
}

# Create build branch
Write-Host "🌿 Creating build branch..." -ForegroundColor Cyan
git checkout -b build

# Remove all files except .git and .gitignore (Windows compatible)
Write-Host "🧹 Cleaning build branch..." -ForegroundColor Cyan
Get-ChildItem -Path . -Exclude .git,.gitignore | Remove-Item -Recurse -Force

# Copy dist contents
Write-Host "📦 Copying build files..." -ForegroundColor Cyan
Copy-Item -Path "dist\*" -Destination . -Recurse -Force

# Create README
@"
# Build Files

This branch contains only the built files for deployment.
Source code is in the 'main' branch.

**Do not edit this branch manually!**
This branch is automatically updated by GitHub Actions.
"@ | Out-File -FilePath "README.md" -Encoding UTF8

# Create .gitignore for build branch
"# This is a build branch - keep all files" | Out-File -FilePath ".gitignore" -Encoding UTF8

# Commit
Write-Host "💾 Committing build files..." -ForegroundColor Cyan
git add -A
git commit -m "Initial build branch setup"

# Push
Write-Host "📤 Pushing build branch to remote..." -ForegroundColor Cyan
git push -u origin build

# Return to main
git checkout main

Write-Host ""
Write-Host "✅ Build branch setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. The GitHub Actions workflow will automatically update the build branch"
Write-Host "2. The build branch will be deployed to the server automatically"
Write-Host "3. Continue working on the 'main' branch for development"

