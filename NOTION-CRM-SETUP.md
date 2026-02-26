# 👥 Notion CRM Integration Guide

Complete guide to set up and use the integrated CRM system in Mission Control with Notion.

---

## 🚀 Quick Start (5 minutes)

### What You Get (Default - No Setup Needed)
✅ **Full CRM in Mission Control dashboard:**
- 👥 Contacts management (add, edit, delete)
- 💼 Deals tracking (pipeline stages)
- 📊 Pipeline board (Prospect → Won → Lost)
- 📈 CRM metrics (total contacts, deals, pipeline value)
- 🎤 Voice commands ("add contact", "show pipeline", etc.)
- 💾 Auto-saves to localStorage (offline-capable)

### How to Use (Right Now)
1. **Open dashboard:** https://kara-pai.github.io/mission-control/
2. **Click CRM tab** (👥 in navigation)
3. **Add your first contact:** Click "➕ Add Contact"
4. **Create a deal:** Click "💰 Add Deal"
5. **View pipeline:** Switch to "📊 Pipeline" view
6. **Use voice:** Click 🎤 → Say "add contact" or "show pipeline"

---

## 🔗 Notion Integration (Optional - 10 minutes)

### Why Integrate with Notion?
- ✅ Persistent storage (survives browser clear)
- ✅ Share CRM with team members
- ✅ Access from Notion app + web
- ✅ Integrations with other tools
- ✅ Backup and sync across devices

### Setup Notion Integration

#### Step 1: Create Notion Internal Integration
1. Go to https://www.notion.com/my-integrations
2. Click "Create new integration"
3. **Name:** "Mission Control CRM"
4. **Associated workspace:** Your workspace
5. **Capabilities:** Select "Read", "Update", "Insert"
6. Click "Submit"
7. **Copy the token** (keep it secret!)

#### Step 2: Set Environment Variable
```bash
export NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Create CRM Workspace in Notion
Create a new page in Notion where you want the CRM databases. Get its page ID from the URL:
```
https://notion.so/workspace/abc123def456-v=...
                            ^^^^^^^^^^^^^^^^
                            Copy this (page ID)
```

#### Step 4: Initialize CRM Databases
```bash
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js init <page-id>
```

This creates two Notion databases:
- **Contacts** — All your contacts with emails, phones, companies
- **Deals** — All your deals with amounts, stages, close dates

#### Step 5: Test Sync
```bash
# Add a test contact
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js \
  add-contact "John Doe" "john@example.com"

# List contacts
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js list-contacts

# Add a test deal
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js \
  add-deal "ACME Contract" 25000

# List deals
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js list-deals
```

---

## 📋 Features

### Contacts Management
**Available in:** CRM tab → Contacts view

- **Add Contact:** Name, Email, Phone, Company, Status
- **Edit Contact:** Modify any field
- **Delete Contact:** Remove from CRM
- **Status Types:** Lead, Active, Inactive

**Storage:**
- Local: `localStorage` (instant, offline)
- Notion: Synced via API script

### Deals Tracking
**Available in:** CRM tab → Deals view

- **Add Deal:** Name, Amount, Close Date, Stage
- **Edit Deal:** Update any field
- **Delete Deal:** Remove from pipeline
- **Pipeline Stages:** Prospect, Negotiation, Won, Lost

**Storage:**
- Local: `localStorage` (instant, offline)
- Notion: Synced via API script

### Pipeline Board
**Available in:** CRM tab → Pipeline view

Visual Kanban board showing deals by stage:
```
Prospect      Negotiation      Won         Lost
┌──────────┐  ┌──────────┐  ┌────────┐  ┌────┐
│ ACME Inc │  │ TechCorp │  │ BigCo  │  │XYZ │
│ $25,000  │  │ $15,000  │  │$50,000 │  │Co  │
└──────────┘  └──────────┘  └────────┘  └────┘
```

- Drag deals between stages (coming soon)
- See pipeline value by stage
- Quick deal overview

### CRM Dashboard
**Metrics shown:**
- **Total Contacts:** Active contacts in your CRM
- **Active Deals:** Number of open deals
- **Pipeline Value:** Total $ of all deals
- **Conversion Rate:** % of deals won vs total

---

## 🎤 Voice Commands for CRM

Speak these commands to control the CRM:

### Navigation
```
"go to crm"          → Open CRM tab
"show crm"           → Open CRM tab
"show contacts"      → View all contacts
"show deals"         → View all deals
"show pipeline"      → View Kanban pipeline
```

### Actions
```
"add contact"        → Create new contact (prompts for details)
"add deal"           → Create new deal (prompts for details)
```

### Example Flow
1. Click 🎤 button
2. Say "add contact"
3. Dashboard prompts for name, email, phone, company
4. Saves automatically

---

## 📁 File Structure

```
MISSION-CONTROL/
├── index.html                          (Dashboard with CRM tab)
├── scripts/
│   ├── notion-crm-sync.js            (Notion API integration)
│   ├── whisper-transcribe.js          (Voice transcription)
│   ├── email-voice-handler.js         (Gmail voice processing)
│   └── voice-cron.sh                  (Cron transcription job)
├── NOTION-CRM-SETUP.md                (This file)
├── VOICE-SETUP.md                     (Voice system docs)
└── memory/
    └── daily-logs/
        └── crm-sync.log               (Notion sync logs)
```

---

## 🔄 Syncing Data

### Local → Notion Sync
To sync contacts and deals from Mission Control to Notion:

```bash
# Export local contacts to Notion
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js sync-contacts

# Export local deals to Notion
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js sync-deals
```

### Notion → Local Sync
To import data from Notion into Mission Control:

```bash
# Import contacts from Notion
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js import-contacts

# Import deals from Notion
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js import-deals
```

### Bidirectional Sync (Cron Job)
Set up automatic sync every hour:

```bash
# Edit crontab
crontab -e

# Add this line (hourly sync):
0 * * * * export NOTION_API_KEY=secret_... && node /home/karaai/.openclaw/MISSION-CONTROL/scripts/notion-crm-sync.js sync-all
```

---

## 🎯 Common Use Cases

### Use Case 1: Sales Pipeline
1. Open CRM → Pipeline view
2. See deals organized by stage
3. Drag deals between stages (coming soon)
4. Watch pipeline value grow

### Use Case 2: Lead Management
1. Open CRM → Contacts view
2. Add new leads as "Lead" status
3. Qualify leads → change to "Active"
4. Archive old leads → change to "Inactive"

### Use Case 3: Voice-Driven CRM
1. Click 🎤 button
2. Say "add contact"
3. Speak contact details
4. Dashboard saves automatically
5. Syncs to Notion

### Use Case 4: Team Collaboration
1. Set up Notion integration
2. Share Notion databases with team
3. Everyone can view/edit contacts and deals
4. Changes sync back to Mission Control

---

## 🐛 Troubleshooting

### "Notion API Key not set"
**Problem:** Can't sync to Notion
**Solution:** 
```bash
export NOTION_API_KEY=secret_xxxxx
```

### "Database ID not found"
**Problem:** Initialize failed
**Solution:** 
1. Check Notion page ID is correct
2. Ensure integration has permission to page
3. Run init command again

### Data not syncing
**Problem:** Changes not appearing in Notion
**Solution:**
1. Check NOTION_API_KEY is set
2. Verify database IDs in `.openclaw/notion-config.json`
3. Run sync commands manually first
4. Check Notion page permissions

### Voice commands not working
**Problem:** "add contact" not recognized
**Solution:**
1. Make sure you're in CRM tab
2. Click 🎤 button to start listening
3. Speak clearly
4. Wait for confirmation

---

## 📊 Database Schemas

### Contacts Database
| Field | Type | Description |
|-------|------|-------------|
| Name | Title | Contact's full name |
| Email | Email | Contact's email address |
| Phone | Phone | Contact's phone number |
| Company | Text | Company name |
| Status | Select | Lead / Active / Inactive |
| Notes | Text | Any notes |
| Added | Date | When added to CRM |

### Deals Database
| Field | Type | Description |
|-------|------|-------------|
| Deal Name | Title | Deal name/title |
| Contact | Relation | Link to contact |
| Amount | Number | Deal value in USD |
| Stage | Select | Prospect/Negotiation/Won/Lost |
| Close Date | Date | Expected close date |
| Notes | Text | Deal notes |

---

## 🔐 Security & Privacy

### Data Storage
- **Local:** Stored in browser localStorage (encrypted in browser)
- **Notion:** Stored in your Notion workspace (encrypted at rest)
- **In Transit:** HTTPS encryption

### Access Control
- **Dashboard:** Works offline, no external access needed
- **Notion:** Requires API key (keep secret!)
- **GitHub:** Code is public, credentials are private

### Best Practices
1. Never commit API keys to Git (use environment variables)
2. Use strong Notion workspace password
3. Share Notion databases only with trusted team members
4. Regularly back up Notion databases
5. Use read-only API tokens when possible

---

## 🚀 Advanced Setup

### Automated Email-to-CRM
Convert incoming emails to contacts/deals automatically:

```bash
# Set up email monitoring (future feature)
# Will auto-create contacts from sender email
# Will auto-create deals from email templates
```

### CRM + Gmail Integration
Existing Gmail integration can power:
- Contact discovery from emails
- Deal tracking via email threads
- Automatic follow-up reminders

### CRM + Calendar
Coming soon:
- Schedule follow-ups on deals
- Send email reminders
- Calendar sync with close dates

---

## 📚 Resources

- **Notion API Docs:** https://developers.notion.com/
- **Notion Integration Guide:** https://developers.notion.com/docs/getting-started
- **Database Relation Guide:** https://developers.notion.com/docs/working-with-databases

---

## 🎓 Next Steps

1. **Try it now:** Open dashboard, go to CRM tab, add a contact
2. **Optional:** Set up Notion integration for persistent storage
3. **Advanced:** Set up cron sync for auto-backup
4. **Future:** Add email-to-CRM automation

---

**Status:** 🟢 CRM SYSTEM READY  
**Default Setup:** Full CRM in dashboard (localStorage only)  
**Full Setup:** CRM + Notion integration (persistent, team-shareable)  
**Voice Control:** All CRM actions available via voice commands

