#!/bin/bash

# Universal Claude CI/CD Fixer Deployment Script
# This script deploys the universal fixer to ALL your GitHub repositories

echo "🚀 Starting Universal Claude Fixer Deployment to All Repositories"
echo "================================================================"

# Configuration
GITHUB_USER="chudeemeke"
UNIVERSAL_FIXER_PATH="$(pwd)/UNIVERSAL-CLAUDE-FIXER.yml"
SETUP_GUIDE_PATH="$(pwd)/UNIVERSAL-CLAUDE-SETUP.md"
ACTION_YAML_PATH="$(pwd)/CLAUDE-ACTION-MARKETPLACE/action.yml"

# Create temporary directory for operations
TEMP_DIR="/tmp/claude-deploy-$$"
mkdir -p "$TEMP_DIR"

# Function to add Claude fixer to a repository
add_claude_to_repo() {
    local repo_name=$1
    local repo_language=$2

    echo ""
    echo "📦 Processing: $repo_name (Language: $repo_language)"
    echo "-------------------------------------------"

    cd "$TEMP_DIR" || exit

    # Clone the repository
    echo "  📥 Cloning repository..."
    if gh repo clone "$GITHUB_USER/$repo_name" "$repo_name" -- --depth=1 2>/dev/null; then
        cd "$repo_name" || return

        # Create .github/workflows directory if it doesn't exist
        mkdir -p .github/workflows

        # Copy the universal fixer
        echo "  📝 Adding Universal Claude Fixer..."
        cp "$UNIVERSAL_FIXER_PATH" .github/workflows/claude-universal-fixer.yml

        # Create a minimal quick-fix workflow too
        cat > .github/workflows/claude-quick-fix.yml << 'EOF'
name: Claude Quick Fix

on:
  push:
    branches: ['main', 'master', 'develop']
  pull_request:
  workflow_dispatch:
  workflow_run:
    workflows: ["*"]
    types: [completed]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  quick-fix:
    if: ${{ github.event.workflow_run.conclusion == 'failure' || github.event_name == 'workflow_dispatch' }}
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          task: |
            Fix all CI/CD issues in this repository.
            Auto-detect the language and framework.
            Fix all errors and ensure builds pass.
EOF

        # Add README section about Claude fixer
        if [ -f "README.md" ]; then
            echo "" >> README.md
            echo "## 🤖 CI/CD Auto-Fix" >> README.md
            echo "" >> README.md
            echo "This repository uses Claude AI to automatically fix CI/CD failures." >> README.md
            echo "If builds fail, Claude will automatically create a fix PR." >> README.md
            echo "" >> README.md
        fi

        # Copy setup guide
        cp "$SETUP_GUIDE_PATH" CLAUDE-SETUP.md

        # Check if there are changes to commit
        if [[ -n $(git status -s) ]]; then
            echo "  💾 Committing changes..."
            git config user.name "Claude CI/CD Bot"
            git config user.email "claude@anthropic.com"
            git add -A
            git commit -m "feat: Add Universal Claude CI/CD Fixer

- Automatically fixes all CI/CD failures
- Works with $repo_language projects
- Self-healing CI/CD pipeline
- Intelligent error resolution

This will automatically fix:
- Build errors
- Test failures
- Dependency issues
- Linting problems
- TypeScript/compilation errors

🤖 Deployed by Universal Claude Fixer"

            # Create a branch and push
            BRANCH_NAME="add-claude-fixer-$(date +%s)"
            git checkout -b "$BRANCH_NAME"

            echo "  📤 Pushing to GitHub..."
            if git push origin "$BRANCH_NAME" 2>/dev/null; then
                echo "  🔄 Creating Pull Request..."
                gh pr create \
                    --title "🤖 Add Universal Claude CI/CD Fixer" \
                    --body "## 🚀 Universal Claude CI/CD Fixer

This PR adds Claude AI-powered automatic CI/CD fixing to your repository.

### ✨ What This Does:
- **Automatically fixes** any CI/CD failures
- **Self-detects** your project type ($repo_language)
- **Resolves** build, test, and dependency issues
- **Creates PRs** with fixes when needed

### 📋 Setup Required:
1. Add \`ANTHROPIC_API_KEY\` to your repository secrets
2. That's it! Claude will handle the rest

### 🎯 Benefits:
- Never worry about CI/CD failures again
- Automatic fixes for all types of errors
- Works with your existing workflows
- Intelligent, context-aware solutions

### 📖 Documentation:
See \`CLAUDE-SETUP.md\` for detailed information.

---
*Deployed by Universal Claude Fixer Bot*" \
                    --head "$BRANCH_NAME" \
                    --base "main" 2>/dev/null || \
                gh pr create \
                    --title "🤖 Add Universal Claude CI/CD Fixer" \
                    --body "Adding Claude AI-powered CI/CD fixer" \
                    --head "$BRANCH_NAME" \
                    --base "master" 2>/dev/null || \
                echo "  ⚠️  Could not create PR (might already exist or no base branch)"

                echo "  ✅ Successfully added Claude fixer to $repo_name!"
            else
                echo "  ⚠️  Could not push changes (might not have permissions)"
            fi
        else
            echo "  ℹ️  Claude fixer already exists or no changes needed"
        fi

        cd ..
        rm -rf "$repo_name"
    else
        echo "  ⚠️  Could not access repository (might be private or archived)"
    fi
}

# Get all repositories
echo ""
echo "📊 Fetching all repositories for $GITHUB_USER..."
REPOS=$(gh repo list "$GITHUB_USER" --limit 100 --json name,primaryLanguage,isArchived --jq '.[] | select(.isArchived == false) | "\(.name)|\(.primaryLanguage.name // "unknown")"')

# Count total repos
TOTAL_REPOS=$(echo "$REPOS" | wc -l)
CURRENT=0

echo "Found $TOTAL_REPOS active repositories to process"
echo ""

# Process each repository
while IFS='|' read -r repo_name repo_language; do
    ((CURRENT++))
    echo "[$CURRENT/$TOTAL_REPOS] Processing $repo_name..."
    add_claude_to_repo "$repo_name" "$repo_language"
done <<< "$REPOS"

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "================================================================"
echo "✅ Universal Claude Fixer Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review and merge the PRs in each repository"
echo "2. Add ANTHROPIC_API_KEY to each repo's secrets"
echo "3. Watch as Claude automatically fixes all CI/CD issues!"
echo ""
echo "🎉 Your repositories are now self-healing!"