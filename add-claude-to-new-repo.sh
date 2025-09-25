#!/bin/bash

# Script to add Claude Universal Fixer to a NEW repository

if [ $# -eq 0 ]; then
    echo "Usage: ./add-claude-to-new-repo.sh <repo-name>"
    echo "Example: ./add-claude-to-new-repo.sh my-new-project"
    exit 1
fi

REPO_NAME=$1
GITHUB_USERNAME="chudeemeke"

echo "🚀 Adding Claude Universal Fixer to $REPO_NAME"
echo "============================================"

# Clone the new repo
echo "📥 Cloning repository..."
git clone "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" "/tmp/$REPO_NAME" 2>/dev/null

cd "/tmp/$REPO_NAME"

# Create .github/workflows directory if it doesn't exist
mkdir -p .github/workflows

# Copy the Universal Claude Fixer files
echo "📝 Adding Claude Universal Fixer..."

# Copy from the stealth-learning repo (which has the master copies)
cp /mnt/c/Users/Destiny/iCloudDrive/Documents/AI\ Tools/Anthropic\ Solution/Projects/stealth-learning/.github/workflows/claude-universal-fixer.yml .github/workflows/
cp /mnt/c/Users/Destiny/iCloudDrive/Documents/AI\ Tools/Anthropic\ Solution/Projects/stealth-learning/.github/workflows/claude-quick-fix.yml .github/workflows/
cp /mnt/c/Users/Destiny/iCloudDrive/Documents/AI\ Tools/Anthropic\ Solution/Projects/stealth-learning/CLAUDE-SETUP.md .

# Commit and push
echo "💾 Committing changes..."
git add .
git commit -m "feat: Add Universal Claude CI/CD Fixer

- Auto-detects project type and language
- Fixes build, lint, and test failures automatically
- Works with any framework or language
- Triggered on push and manually via Actions tab"

echo "📤 Pushing to GitHub..."
git push

# Add the ANTHROPIC_API_KEY secret
echo "🔐 Adding ANTHROPIC_API_KEY secret..."
gh secret set ANTHROPIC_API_KEY --repo "$GITHUB_USERNAME/$REPO_NAME" < ~/.anthropic-key 2>/dev/null

# Clean up
cd -
rm -rf "/tmp/$REPO_NAME"

echo ""
echo "✅ Successfully added Claude Fixer to $REPO_NAME!"
echo ""
echo "The Claude Universal Fixer is now active and will:"
echo "  • Auto-detect your project type"
echo "  • Fix CI/CD failures automatically"
echo "  • Work with any language or framework"
echo ""
echo "🎉 Your new repository is self-healing!"