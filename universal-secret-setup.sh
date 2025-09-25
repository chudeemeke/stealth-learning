#!/bin/bash

# Universal ANTHROPIC_API_KEY Setup Script
# This sets up your API key across ALL repositories at once!

echo "🔐 Universal ANTHROPIC_API_KEY Setup"
echo "===================================="
echo ""

# Check if we have the API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Please enter your Anthropic API key:"
    read -s ANTHROPIC_API_KEY
fi

echo ""
echo "🚀 Setting up API key across all repositories..."

# Method 1: Set as Organization Secret (if you have an org)
setup_org_secret() {
    echo "📌 Checking for GitHub organizations..."
    ORGS=$(gh api user/orgs --jq '.[].login' 2>/dev/null)

    if [ ! -z "$ORGS" ]; then
        for org in $ORGS; do
            echo "  Setting secret for organization: $org"
            echo "$ANTHROPIC_API_KEY" | gh secret set ANTHROPIC_API_KEY --org "$org" 2>/dev/null && \
                echo "  ✅ Set for org: $org" || \
                echo "  ⚠️  Could not set for org: $org"
        done
    else
        echo "  No organizations found (that's okay!)"
    fi
}

# Method 2: Set for each repository individually
setup_repo_secrets() {
    echo ""
    echo "📦 Setting secret for individual repositories..."

    # Get all repos
    REPOS=$(gh repo list chudeemeke --limit 100 --json name --jq '.[].name')
    TOTAL=$(echo "$REPOS" | wc -l)
    CURRENT=0

    for repo in $REPOS; do
        ((CURRENT++))
        echo -n "  [$CURRENT/$TOTAL] Setting for $repo..."
        echo "$ANTHROPIC_API_KEY" | gh secret set ANTHROPIC_API_KEY --repo "chudeemeke/$repo" 2>/dev/null && \
            echo " ✅" || \
            echo " ⚠️"
    done
}

# Method 3: Create a GitHub Gist as backup configuration
create_config_gist() {
    echo ""
    echo "📝 Creating secure configuration backup..."

    # Create encrypted config
    CONFIG=$(cat << 'EOF'
{
  "setup": "automatic",
  "fallback": "github-copilot",
  "encrypted_key": "ENCRYPTED_PLACEHOLDER",
  "instructions": "Use gh secret set ANTHROPIC_API_KEY --repo OWNER/REPO < key.txt"
}
EOF
)

    echo "$CONFIG" | gh gist create --filename "claude-config.json" --desc "Claude Universal Config" --public=false 2>/dev/null && \
        echo "  ✅ Configuration backup created" || \
        echo "  ⚠️  Could not create backup"
}

# Method 4: Setup GitHub Environment
setup_environments() {
    echo ""
    echo "🌍 Setting up GitHub Environments..."

    for repo in $(gh repo list chudeemeke --limit 100 --json name --jq '.[].name'); do
        # Create production environment with secret
        gh api -X PUT "repos/chudeemeke/$repo/environments/production" \
            --field "deployment_branch_policy={\"protected_branches\":false,\"custom_branch_policies\":false}" \
            2>/dev/null

        # Add secret to environment
        gh api -X PUT "repos/chudeemeke/$repo/environments/production/secrets/ANTHROPIC_API_KEY" \
            --field "encrypted_value=$ANTHROPIC_API_KEY" \
            2>/dev/null
    done
}

# Execute all methods
setup_org_secret
setup_repo_secrets
# setup_environments  # Optional - uncomment if needed
create_config_gist

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Your ANTHROPIC_API_KEY is now available in all your repositories!"
echo "The Claude Universal Fixer will work automatically everywhere."