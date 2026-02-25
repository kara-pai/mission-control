# 📅 Cron Setup — Daily Auto-Backup to GitHub

Your auto-backup script is ready. Follow these steps to schedule it.

---

## 🔑 SSH KEY SETUP

Your SSH key has been generated! Here it is:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC5rkDVORx955ciUCIb38e0utujvJvKCsQ/EczQIGyl0 kara@power-ai.com.au
```

### **Step 1: Add SSH Key to GitHub**

1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title:** `Mission Control VPS`
4. **Key:** Copy and paste the entire SSH key above (starting with `ssh-ed25519`)
5. Click **"Add SSH key"**

### **Step 2: Verify SSH Connection**

```bash
ssh -T git@github.com
```

**Expected output:**
```
Hi YOUR_USERNAME! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 📦 GitHub REPOSITORY SETUP

### **Step 1: Create Repository**

1. Go to: https://github.com/new
2. **Repository name:** `mission-control`
3. **Description:** `Unified AI workspace with 4 agents`
4. **Visibility:** Private (recommended)
5. Click **"Create repository"**

### **Step 2: Connect Local Repository**

```bash
cd ~/.openclaw/MISSION-CONTROL

# Replace YOUR_USERNAME with your GitHub username
git remote add origin git@github.com:YOUR_USERNAME/mission-control.git

# Set main branch
git branch -M main

# Push initial commit
git push -u origin main
```

### **Step 3: Verify Connection**

```bash
git remote -v
# Output should show:
# origin git@github.com:YOUR_USERNAME/mission-control.git (fetch)
# origin git@github.com:YOUR_USERNAME/mission-control.git (push)
```

---

## ⏰ CRON JOB SETUP

### **Option 1: Simple (Recommended)**

#### **Edit crontab:**
```bash
crontab -e
```

#### **Add this line:**
```
0 2 * * * /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh >> /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log 2>&1
```

**This schedules the backup for 2 AM daily**

#### **Save and exit:**
- Vim: Press `ESC`, then `:wq`, then `Enter`
- Nano: Press `Ctrl+X`, then `Y`, then `Enter`

#### **Verify it's scheduled:**
```bash
crontab -l
# Should show your backup job
```

---

### **Option 2: Multiple Backups Daily**

Want backups more frequently? Add multiple lines:

```bash
# Backup every 6 hours (2 AM, 8 AM, 2 PM, 8 PM)
0 2,8,14,20 * * * /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh >> /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log 2>&1

# Or every 12 hours (2 AM, 2 PM)
0 2,14 * * * /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh >> /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log 2>&1
```

---

### **Option 3: Backup with Notifications**

For email notifications on failure:

```bash
0 2 * * * /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh || echo "Backup failed" | mail -s "Mission Control Backup Failed" kara@power-ai.com.au
```

---

## 🧪 TESTING

### **Test the backup script manually:**

```bash
/home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh
```

**Expected output:**
```
[2026-02-25 22:41:56] 🔄 AUTO-BACKUP STARTED
[2026-02-25 22:41:56] 📝 Staging changes...
[2026-02-25 22:41:56] 💾 Committing changes...
[2026-02-25 22:41:56] 📤 Pushing to GitHub...
[2026-02-25 22:41:56] ✅ Successfully pushed to GitHub (main)
[2026-02-25 22:41:56] ✅ AUTO-BACKUP COMPLETED SUCCESSFULLY
```

### **Check backup logs:**

```bash
cat /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log
tail -f /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log  # Live view
```

---

## 📋 CRON SYNTAX REFERENCE

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * * command
```

### **Common examples:**

```bash
# Every day at 2 AM
0 2 * * * script

# Every day at 2:30 AM
30 2 * * * script

# Every 6 hours
0 */6 * * * script

# Every 4 hours
0 */4 * * * script

# Every day at 2 AM and 2 PM
0 2,14 * * * script

# Every Monday and Friday at 2 AM
0 2 * * 1,5 script

# Every hour
0 * * * * script

# Every 30 minutes
*/30 * * * * script

# Every 5 minutes
*/5 * * * * script
```

---

## 🔍 MONITORING & TROUBLESHOOTING

### **Check if cron job ran:**
```bash
grep CRON /var/log/syslog | tail -10
# Or on macOS:
log stream --predicate 'process == "cron"'
```

### **Check backup logs:**
```bash
cat /home/karaai/.openclaw/MISSION-CONTROL/logs/backup.log
```

### **If backup fails:**

1. **SSH key issue?**
   ```bash
   ssh -T git@github.com
   ```

2. **Git remote not configured?**
   ```bash
   git remote -v
   # Should show: origin git@github.com:YOUR_USERNAME/mission-control.git
   ```

3. **Script permissions?**
   ```bash
   ls -l /home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh
   # Should show: -rwxr-xr-x (755)
   ```

4. **Logs directory writable?**
   ```bash
   mkdir -p /home/karaai/.openclaw/MISSION-CONTROL/logs
   chmod 755 /home/karaai/.openclaw/MISSION-CONTROL/logs
   ```

---

## ✅ CHECKLIST

Before considering setup complete:

- [ ] SSH key added to GitHub (https://github.com/settings/keys)
- [ ] GitHub repository created (https://github.com/new)
- [ ] Local repo connected to GitHub (`git remote -v` shows origin)
- [ ] SSH connection verified (`ssh -T git@github.com` works)
- [ ] Auto-backup script tested manually (ran without errors)
- [ ] Cron job added (`crontab -l` shows the job)
- [ ] Logs directory created (`/home/karaai/.openclaw/MISSION-CONTROL/logs`)

---

## 📊 WHAT HAPPENS AUTOMATICALLY

**Every day at 2 AM, the script:**

1. ✅ Checks for changes in your workspace
2. ✅ Stages new/modified files
3. ✅ Creates a commit with timestamp
4. ✅ Pushes to GitHub
5. ✅ Logs results to `logs/backup.log`

**If no changes:** Skips the commit (no empty commits)  
**If push fails:** Logs the error but doesn't crash

---

## 🎯 NEXT STEPS

1. **Add SSH key to GitHub** — Copy the key above to https://github.com/settings/keys
2. **Create GitHub repo** — Go to https://github.com/new
3. **Connect local repo** — Run the commands in "Step 2: Connect Local Repository"
4. **Verify SSH** — Run `ssh -T git@github.com`
5. **Test script** — Run `/home/karaai/.openclaw/MISSION-CONTROL/scripts/auto-backup.sh`
6. **Add cron job** — Run `crontab -e` and add the backup line
7. **Verify setup** — Run `crontab -l` to confirm

---

## 🚀 YOU'RE SET!

Once setup is complete:
- Your workspace auto-syncs to GitHub **every day at 2 AM**
- No manual commits needed
- All changes are backed up
- Full version history in GitHub

**Happy backing up!** 🎉
