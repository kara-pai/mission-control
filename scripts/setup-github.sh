#!/bin/bash

# ========== GITHUB CONNECTION SETUP SCRIPT ==========
# Guides you through SSH setup and GitHub remote configuration

echo "🚀 MISSION CONTROL — GITHUB SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if SSH key exists
if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo "✅ SSH key already exists"
    echo ""
    echo "📋 Your public SSH key:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat ~/.ssh/id_ed25519.pub
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo "🔑 Generating SSH key..."
    echo ""
    ssh-keygen -t ed25519 -C "kara@power-ai.com.au" -f ~/.ssh/id_ed25519 -N ""
    echo ""
    echo "✅ SSH key generated!"
    echo ""
    echo "📋 Your public SSH key:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat ~/.ssh/id_ed25519.pub
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo "📝 NEXT STEPS:"
echo ""
echo "1️⃣  Add SSH key to GitHub:"
echo "   👉 Visit: https://github.com/settings/keys"
echo "   👉 Click 'New SSH key'"
echo "   👉 Paste the key above"
echo "   👉 Name it: 'Mission Control VPS'"
echo ""
echo "2️⃣  Create GitHub repository:"
echo "   👉 Visit: https://github.com/new"
echo "   👉 Name: mission-control"
echo "   👉 Description: 'Unified AI workspace with 4 agents'"
echo "   👉 Visibility: Private (recommended)"
echo "   👉 Click 'Create repository'"
echo ""
echo "3️⃣  Run this command (replace YOUR_USERNAME):"
echo "   $ cd ~/.openclaw/MISSION-CONTROL"
echo "   $ git remote add origin git@github.com:YOUR_USERNAME/mission-control.git"
echo "   $ git branch -M main"
echo "   $ git push -u origin main"
echo ""
echo "4️⃣  Verify connection:"
echo "   $ ssh -T git@github.com"
echo "   (Should say: 'Hi YOUR_USERNAME! You've successfully authenticated...')"
echo ""
echo "5️⃣  Test auto-backup:"
echo "   $ /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh"
echo ""
echo "✅ When done with all steps, run: crontab -e"
echo "   Add this line to schedule daily backups at 2 AM:"
echo "   0 2 * * * /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh >> /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log 2>&1"
echo ""
