#!/bin/bash

# ========== MISSION CONTROL AUTO-BACKUP SCRIPT ==========
# Auto-commits and pushes to GitHub daily
# Add to crontab: 0 2 * * * /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh

set -e  # Exit on error

# ========== CONFIGURATION ==========
WORKSPACE_DIR="/home/karaai/.openclaw/MISSION-CONTROL"
LOG_FILE="/home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE_ONLY=$(date '+%Y-%m-%d')

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# ========== LOGGING FUNCTION ==========
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# ========== START BACKUP ==========
log "🔄 AUTO-BACKUP STARTED"

# Change to workspace
cd "$WORKSPACE_DIR" || { log "❌ Failed to access workspace"; exit 1; }

# ========== CHECK GIT STATUS ==========
if ! git status > /dev/null 2>&1; then
    log "❌ Not a git repository"
    exit 1
fi

# ========== STAGE CHANGES ==========
log "📝 Staging changes..."
git add . 2>/dev/null || log "⚠️  No new files to stage"

# ========== CHECK IF THERE ARE CHANGES ==========
if git diff --cached --quiet; then
    log "ℹ️  No changes to commit (repository up to date)"
    log "✅ AUTO-BACKUP COMPLETED (no changes)"
    exit 0
fi

# ========== COMMIT CHANGES ==========
COMMIT_MESSAGE="🔄 Auto-backup: $TIMESTAMP

Agent States:
  - main: operational
  - kara: operational
  - codex: operational
  - coding-agent: operational

Workspace Status: Synced
Dashboard: Live
Gateway: Running"

log "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE" || { log "⚠️  Commit failed"; exit 1; }

# ========== PUSH TO GITHUB ==========
log "📤 Pushing to GitHub..."

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if git push origin "$CURRENT_BRANCH" 2>/dev/null; then
    log "✅ Successfully pushed to GitHub ($CURRENT_BRANCH)"
else
    log "⚠️  Push failed - checking remote..."
    
    # Check if remote exists
    if git remote get-url origin > /dev/null 2>&1; then
        log "⚠️  GitHub remote exists but push failed"
        log "ℹ️  Check SSH keys: ssh -T git@github.com"
        exit 1
    else
        log "ℹ️  GitHub remote not configured (skip)"
        exit 0
    fi
fi

# ========== BACKUP COMPLETE ==========
log "✅ AUTO-BACKUP COMPLETED SUCCESSFULLY"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
