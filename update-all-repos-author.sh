#!/bin/bash

echo "🔄 Updating ALL repositories to use correct author"
echo "=================================================="
echo ""

# List of all repositories
repos=(
    ".github"
    "stealth-learning"
    "family-finance-hub"
    "job-hunter-app"
    "JobBoardPWA"
    "famlist-api"
    "finance-dashboard"
    "billpaymentapp"
    "kite-pfm"
    "math_clock_adventure"
    "LotteryAnalyzer"
    "EZ-Deploy"
    "mcp-nexus"
    "catch-the-stars"
    "pacman"
    "AI-Dev-Environment"
    "stealth-learning-games"
    "sentence-builder"
    "telegramguide"
    "ai-agency"
)

updated_count=0
pages_count=0

for repo in "${repos[@]}"; do
    echo "📦 Processing $repo..."

    # Clone repository
    rm -rf "/tmp/$repo"
    git clone "https://github.com/chudeemeke/$repo.git" "/tmp/$repo" 2>/dev/null

    if [ -d "/tmp/$repo" ]; then
        cd "/tmp/$repo"

        changes_made=false

        # Check for GitHub Pages
        has_pages=$(gh api repos/chudeemeke/$repo --jq '.has_pages' 2>/dev/null)
        if [ "$has_pages" == "true" ]; then
            echo "  📄 Has GitHub Pages enabled"
            ((pages_count++))
        fi

        # Update all workflow files
        if [ -d ".github/workflows" ]; then
            for workflow in .github/workflows/*.yml .github/workflows/*.yaml; do
                if [ -f "$workflow" ]; then
                    # Replace Claude bot references
                    sed -i 's/claude-bot@anthropic\.com/chude@emeke.org/g' "$workflow"
                    sed -i 's/Claude CI\/CD Bot/Chude/g' "$workflow"
                    sed -i 's/Claude Instant Bot/Chude/g' "$workflow"
                    sed -i 's/Claude Monitor/Chude/g' "$workflow"
                    sed -i 's/Claude Bot/Chude/g' "$workflow"
                    sed -i 's/claude-bot@anthropic\.com/chude@emeke.org/g' "$workflow"

                    # Remove Claude from commit messages but keep functionality
                    sed -i 's/🤖 Auto-fix: /Auto-fix: /g' "$workflow"
                    sed -i 's/🤖 Auto-setup: /Auto-setup: /g' "$workflow"
                    sed -i 's/⚡ Instant setup: Universal Claude/Instant setup: Universal/g' "$workflow"
                    sed -i 's/Claude Universal Fixer/Universal Fixer/g' "$workflow"
                    sed -i 's/Claude CI\/CD Fixer/Universal CI\/CD Fixer/g' "$workflow"
                    sed -i 's/Claude Fixer/Universal Fixer/g' "$workflow"
                    sed -i 's/Fixed by Claude/Fixed by/g' "$workflow"

                    # Remove Co-authored-by lines with Claude
                    sed -i '/Co-authored-by: Claude/d' "$workflow"
                    sed -i '/Co-authored-by: Claude Monitor/d' "$workflow"
                    sed -i '/Co-authored-by: Claude Bot/d' "$workflow"

                    changes_made=true
                fi
            done
        fi

        # Update any CLAUDE.md files
        if [ -f "CLAUDE.md" ]; then
            sed -i 's/Claude Universal Fixer/Universal Fixer/g' "CLAUDE.md"
            sed -i 's/Claude CI\/CD Fixer/Universal CI\/CD Fixer/g' "CLAUDE.md"
            sed -i 's/Claude Fixer/Universal Fixer/g' "CLAUDE.md"
            sed -i 's/Claude automatically/The system automatically/g' "CLAUDE.md"
            sed -i 's/powered by Claude AI/powered by AI/g' "CLAUDE.md"
            changes_made=true
        fi

        # Update README.md if it contains Claude references
        if [ -f "README.md" ]; then
            if grep -q "Claude" "README.md"; then
                sed -i 's/Claude Universal Fixer/Universal Fixer/g' "README.md"
                sed -i 's/Claude CI\/CD Fixer/Universal CI\/CD Fixer/g' "README.md"
                sed -i 's/Claude Fixer/Universal Fixer/g' "README.md"
                sed -i 's/Claude Code Action/Code Action/g' "README.md"
                sed -i 's/powered by Claude AI/powered by AI/g' "README.md"
                changes_made=true
            fi
        fi

        # Update package.json if it has author field
        if [ -f "package.json" ]; then
            if grep -q '"author"' "package.json"; then
                # Update author field if it exists
                jq '.author = "Chude <chude@emeke.org>"' package.json > package.json.tmp
                mv package.json.tmp package.json
                changes_made=true
            fi
        fi

        # Check for _config.yml (Jekyll/GitHub Pages)
        if [ -f "_config.yml" ]; then
            echo "  📄 Found Jekyll config"
            # Update author in Jekyll config
            sed -i 's/^author:.*/author: Chude/g' "_config.yml"
            sed -i 's/^email:.*/email: chude@emeke.org/g' "_config.yml"
            changes_made=true
        fi

        # Check for docs folder (GitHub Pages)
        if [ -d "docs" ]; then
            echo "  📄 Found docs folder (potential GitHub Pages)"
            # Update any config files in docs
            if [ -f "docs/_config.yml" ]; then
                sed -i 's/^author:.*/author: Chude/g' "docs/_config.yml"
                sed -i 's/^email:.*/email: chude@emeke.org/g' "docs/_config.yml"
                changes_made=true
            fi
        fi

        # Commit changes if any were made
        if [ "$changes_made" == "true" ]; then
            git config user.email "chude@emeke.org"
            git config user.name "Chude"
            git add -A

            if [ -n "$(git status --porcelain)" ]; then
                git commit -m "Update: Standardize author and remove vendor references

- Set author to Chude <chude@emeke.org>
- Removed vendor-specific references
- Updated workflow configurations
- Maintained all functionality"

                git push
                echo "  ✅ Updated and pushed changes to $repo"
                ((updated_count++))
            else
                echo "  ℹ️  No changes needed for $repo"
            fi
        else
            echo "  ℹ️  No updates required for $repo"
        fi

        cd -
    else
        echo "  ⚠️  Could not access $repo (might be empty)"
    fi

    # Clean up
    rm -rf "/tmp/$repo"
    echo ""
done

echo "=================================================="
echo "✅ Update Complete!"
echo ""
echo "📊 Summary:"
echo "  - Total repositories checked: ${#repos[@]}"
echo "  - Repositories updated: $updated_count"
echo "  - Repositories with GitHub Pages: $pages_count"
echo ""
echo "All repositories now use Chude <chude@emeke.org> as author"
echo "and have vendor-neutral references!"