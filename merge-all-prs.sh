#!/bin/bash

echo "🔀 Auto-merging all Claude Fixer Pull Requests"
echo "=============================================="
echo ""

# Get all repositories
repos=(
    "stealth-learning"
    "sentence-builder"
    "stealth-learning-games"
    "AI-Dev-Environment"
    "pacman"
    "catch-the-stars"
    "mcp-nexus"
    "EZ-Deploy"
    "LotteryAnalyzer"
    "math_clock_adventure"
    "kite-pfm"
    "billpaymentapp"
    "finance-dashboard"
    "famlist-api"
    "ai-agency"
    "JobBoardPWA"
    "job-hunter-app"
    "telegramguide"
    "family-finance-hub"
)

merged_count=0
skipped_count=0

for repo in "${repos[@]}"; do
    echo "📦 Processing $repo..."

    # Check if there's an open PR with Claude Fixer
    pr_number=$(gh pr list --repo "chudeemeke/$repo" --search "Claude CI/CD Fixer" --json number --jq '.[0].number' 2>/dev/null)

    if [ -n "$pr_number" ]; then
        echo "  Found PR #$pr_number - Merging..."

        # Merge the PR
        if gh pr merge "$pr_number" --repo "chudeemeke/$repo" --merge --delete-branch 2>/dev/null; then
            echo "  ✅ Successfully merged PR #$pr_number!"
            ((merged_count++))
        else
            echo "  ⚠️  Could not merge PR #$pr_number (might need manual review)"
            ((skipped_count++))
        fi
    else
        echo "  ℹ️  No Claude Fixer PR found (might already be merged)"
        ((skipped_count++))
    fi
    echo ""
done

echo "=============================================="
echo "✅ Merge Complete!"
echo ""
echo "📊 Summary:"
echo "  - Successfully merged: $merged_count PRs"
echo "  - Skipped/Manual needed: $skipped_count"
echo ""
echo "🎉 The Claude Universal Fixer is now ACTIVE!"
echo "It will automatically fix any CI/CD issues in your repositories."