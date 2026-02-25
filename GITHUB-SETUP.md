# 🚀 GitHub Setup Guide — Mission Control Workspace

Your workspace is now ready to sync with GitHub!

---

## 📋 CURRENT GIT STATUS

✅ Local repository initialized  
✅ Files committed to master branch  
✅ Ready to connect to GitHub  

**Current commit:**
```
48741a0 🎯 Initial commit: Unified Mission Control workspace
```

---

## 🔗 HOW TO CONNECT TO GITHUB

### **Option 1: SSH (Recommended)**

#### **Step 1: Generate SSH Key (if you don't have one)**
```bash
ssh-keygen -t ed25519 -C "kara@power-ai.com.au"
# Press Enter for all prompts (use default locations)
```

#### **Step 2: Add SSH Key to GitHub**
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Paste your public key
4. Name it: "Mission Control VPS"
5. Click "Add SSH key"

#### **Step 3: Add GitHub Remote**
```bash
cd ~/.openclaw/MISSION-CONTROL
git remote add origin git@github.com:YOUR_USERNAME/mission-control.git
git branch -M main
git push -u origin main
```

---

### **Option 2: HTTPS (Simpler)**

#### **Step 1: Generate GitHub Token**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ repo (all)
   - ✅ workflow
   - ✅ write:packages
4. Copy the token

#### **Step 2: Configure Git**
```bash
cd ~/.openclaw/MISSION-CONTROL
git remote add origin https://github.com/YOUR_USERNAME/mission-control.git
git config credential.helper store
# Paste token when prompted
git push -u origin main
```

---

## 📦 FIRST-TIME PUSH TO GITHUB

### **Create Repository on GitHub**

1. Go to: https://github.com/new
2. **Repository name:** `mission-control`
3. **Description:** "Unified AI workspace with 4 agents"
4. **Visibility:** Private (recommended) or Public
5. **Skip** initializing with README (we already have one)
6. Click **Create repository**

### **Push Local Code**

```bash
cd ~/.openclaw/MISSION-CONTROL

# If using SSH
git remote add origin git@github.com:YOUR_USERNAME/mission-control.git

# If using HTTPS  
git remote add origin https://github.com/YOUR_USERNAME/mission-control.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📊 DAILY WORKFLOW

### **After Making Changes**

```bash
cd ~/.openclaw/MISSION-CONTROL

# Check what changed
git status

# Stage changes
git add .

# Commit
git commit -m "Update: [what changed]"

# Push to GitHub
git push
```

### **Pull Latest (if working from multiple machines)**

```bash
cd ~/.openclaw/MISSION-CONTROL
git pull origin main
```

---

## 🔒 PROTECTING SENSITIVE DATA

**What's IGNORED (never pushed):**
- `google-tokens.json`
- `cursor-config.json`
- `.env` files
- API keys & secrets
- Large log files
- Cache directories

**What's TRACKED (safe to push):**
- Agent configurations (SOUL.md, USER.md)
- Memory files (MEMORY.md)
- Dashboards & scripts
- Documentation

---

## 🌳 BRANCH STRATEGY

**Branches to create:**

```bash
# Main branch (stable)
git branch main

# Development branch
git branch develop

# Feature branches
git checkout -b feature/agent-optimization
git checkout -b feature/new-dashboard
```

**Naming convention:**
- `main` — Production-ready
- `develop` — Development
- `feature/*` — New features
- `bugfix/*` — Bug fixes
- `docs/*` — Documentation

---

## 🔄 CONTINUOUS BACKUPS

**Automatic backup workflow:**

```bash
#!/bin/bash
# Save to: ~/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh

cd ~/.openclaw/MISSION-CONTROL
git add .
git commit -m "Auto-backup: $(date '+%Y-%m-%d %H:%M:%S')" || true
git push origin main
```

**Schedule with cron:**
```bash
# Every day at 2 AM
0 2 * * * ~/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh

# Every 6 hours
0 */6 * * * ~/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh
```

---

## 🛠️ USEFUL GIT COMMANDS

**View commit history:**
```bash
git log --oneline -10
git log --graph --all --decorate
```

**Check changes:**
```bash
git diff
git diff --cached
git status
```

**Undo changes:**
```bash
git reset HEAD~1          # Undo last commit
git checkout -- .         # Discard all changes
git revert HEAD           # Create new commit undoing changes
```

**Push to GitHub:**
```bash
git push origin main
git push origin develop
git push --all            # Push all branches
```

**Pull from GitHub:**
```bash
git pull origin main
git fetch origin          # Download without merging
```

---

## 📖 GITHUB REPOSITORY FEATURES

### **Add to your README.md (GitHub)**

```markdown
# Mission Control — Unified AI Workspace

Consolidated workspace for 4 AI agents running on VPS.

## Agents

- **main** — Root orchestrator (Claude Haiku)
- **kara** — Reasoning & architecture (Claude Opus)
- **codex** — API integrations (GPT-4o)
- **coding-agent** — Feature building (Claude Sonnet)

## Features

- Unified workspace with shared memory
- Production-ready dashboard
- Google OAuth & email automation
- Git version control
- 24/7 VPS deployment

## Quick Start

See [README.md](./README.md) for workspace structure.
```

---

## 🔐 SECRETS MANAGEMENT

**Never commit secrets!** But you need them locally:

### **Create .env file (not committed)**
```bash
# ~/.openclaw/MISSION-CONTROL/.env
GOOGLE_API_KEY=your_key_here
CURSOR_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### **Load in scripts**
```bash
source ~/.openclaw/MISSION-CONTROL/.env
echo $GOOGLE_API_KEY
```

---

## 📈 MONITORING

**Check status:**
```bash
git status
git log --oneline -10
```

**View remote:**
```bash
git remote -v
```

**Check branch:**
```bash
git branch -a
```

---

## 🚀 NEXT STEPS

1. **Create GitHub repository** — https://github.com/new
2. **Connect local to remote** — Use SSH or HTTPS instructions above
3. **Push initial commit** — `git push -u origin main`
4. **Set up auto-backup** — Add cron job for daily commits
5. **Invite team** — Add collaborators if needed

---

## ✅ VERIFICATION

After connecting to GitHub, verify:

```bash
# Check remote is configured
git remote -v
# Output: origin git@github.com:YOUR_USERNAME/mission-control.git (fetch/push)

# Check you can push
git push origin main
# Should show "Everything up-to-date"

# Check on GitHub
# Visit: https://github.com/YOUR_USERNAME/mission-control
```

---

## 💡 PRO TIPS

1. **Add GitHub Actions** — Auto-test, deploy, backup
2. **Enable branch protection** — Require reviews before merge
3. **Use GitHub Pages** — Host dashboard from repo
4. **Create GitHub Issues** — Track tasks & bugs
5. **Add webhooks** — Trigger deployments on push

---

**Your Mission Control workspace is now version-controlled and backed up!** 🎉

Ready to push to GitHub?
