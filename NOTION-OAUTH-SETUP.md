# 🔐 Notion OAuth Integration Guide

Complete guide to authenticate Mission Control CRM with Notion using OAuth 2.0.

---

## 🚀 Quick Start (3 minutes)

### Prerequisites
✅ **Already done:**
- Notion OAuth credentials configured
- OAuth server script ready
- Dashboard has "Connect Notion" button

### Step 1: Start OAuth Server
```bash
cd /home/karaai/.openclaw/MISSION-CONTROL
node scripts/notion-oauth-server.js
```

**Output:**
```
🔐 Notion OAuth Server running on http://localhost:3000
📍 Redirect URI: http://localhost:3000/auth/notion/callback

🚀 To authenticate:
   1. Open http://localhost:3000/auth/notion/start
   2. Grant permission in Notion
   3. You'll be redirected back
```

### Step 2: Connect in Dashboard
1. Open: https://kara-pai.github.io/mission-control/
2. Go to 👥 **CRM tab**
3. Click 🔗 **Connect Notion** button
4. New window opens → Grant permission → Redirects back
5. Button changes to ✅ **Notion Connected**

### Step 3: Sync Your Data
- 📤 **Push to Notion** — Send dashboard contacts/deals to Notion
- 📥 **Pull from Notion** — Import Notion data to dashboard
- Sync automatically preserves data on both sides

---

## 🔑 What's Happening (Behind the Scenes)

### OAuth Flow
```
Dashboard                OAuth Server              Notion API
   │                          │                        │
   ├──── Click "Connect" ────→ │                        │
   │                          ├──── Redirect to OAuth ─→│
   │                          │                        │
   │  (User grants permission in Notion popup)        │
   │                          │← Redirect callback ────┤
   │                          │                        │
   │                          ├─ Exchange code for token
   │                          │                        │
   │                          ├──── Get access token ──┤
   │                          │                        │
   │  ← Authenticated! ───────┤                        │
   │
   ├─── Store token in browser (localStorage)
   │
   └─── Ready to sync!
```

### Architecture
1. **OAuth Server** (`notion-oauth-server.js`)
   - Handles token exchange
   - Manages credentials
   - Provides status endpoint

2. **Dashboard Integration** (`notion-dashboard-integration.js`)
   - Triggers OAuth flow
   - Stores access token
   - Syncs contacts/deals

3. **Credentials** (`~/.openclaw/notion-oauth.json`)
   - Client ID
   - Client Secret
   - Access tokens (added after auth)
   - Workspace/Bot IDs

---

## 📋 Available Commands

### OAuth Server Endpoints
```bash
# Start OAuth flow
http://localhost:3000/auth/notion/start

# OAuth callback (handled automatically)
http://localhost:3000/auth/notion/callback?code=xxxxx

# Check authentication status
curl http://localhost:3000/auth/notion/status

# Logout / clear tokens
curl http://localhost:3000/auth/notion/logout
```

### Dashboard Buttons
| Button | Action |
|--------|--------|
| 🔗 Connect Notion | Start OAuth authentication |
| ✅ Notion Connected | Shows when authenticated |
| 📤 Push to Notion | Sync dashboard data → Notion |
| 📥 Pull from Notion | Import Notion data → dashboard |
| 🔓 Disconnect | Log out and clear tokens |

---

## 🔄 Sync Features

### Push to Notion (📤)
Uploads all contacts and deals from dashboard to Notion:

```
Dashboard Data          →          Notion Database
─────────────────                 ──────────────────
Contact: John Doe                 Contact: John Doe
  Email: john@ex.com                Email: john@ex.com
  Status: Lead                       Status: Lead

Deal: ACME Contract               Deal: ACME Contract
  Amount: $25,000                   Amount: $25,000
  Stage: Negotiation                Stage: Negotiation
```

**When to use:**
- First time syncing dashboard data to Notion
- After adding/editing multiple contacts
- Before sharing CRM with team

### Pull from Notion (📥)
Imports all contacts and deals from Notion to dashboard:

```
Notion Database         →          Dashboard Data
──────────────────                 ──────────────
Contact: Jane Smith                Contact: Jane Smith
  Email: jane@ex.com                 Email: jane@ex.com
  Company: TechCorp                  Company: TechCorp
```

**When to use:**
- First time connecting Notion
- Team updated contacts in Notion
- Syncing from another device

### Full Bidirectional Sync
Both push and pull happen together:

```
Desktop                    Notion                    Mobile
   │                        │                         │
   └──── Push changes ──────→│←─── Pull changes ──────┘
        (Contacts, Deals)     │  (Latest from team)
```

---

## 📁 Files & Configuration

### OAuth Server Script
**Location:** `scripts/notion-oauth-server.js`
**Port:** `3000` (configurable via `NOTION_OAUTH_PORT`)
**Handles:** Token exchange, status checks, logout

### Dashboard Integration
**Location:** `scripts/notion-dashboard-integration.js`
**Global:** `window.notionIntegration`
**Methods:**
- `startAuth()` — Begin OAuth flow
- `logout()` — Clear tokens
- `syncContactsToNotion()` — Push contacts
- `syncDealsToNotion()` — Push deals
- `fullSync()` — Push and pull
- `isAuthenticated()` — Check auth status

### Credentials File
**Location:** `~/.openclaw/notion-oauth.json`
**Permissions:** Mode 600 (read/write owner only)
**Contents:**
```json
{
  "client_id": "your-oauth-client-id",
  "client_secret": "your-oauth-client-secret",
  "redirect_uri": "http://localhost:3000/auth/notion/callback",
  "auth_token": null,
  "access_token": null,
  "workspace_id": null,
  "bot_id": null
}
```
**Note:** Credentials are populated after successful OAuth authentication. Never commit this file to Git.

---

## 🎯 Workflow Examples

### Example 1: First-Time Setup
```
1. Start OAuth server
   $ node scripts/notion-oauth-server.js

2. Open dashboard
   https://kara-pai.github.io/mission-control/

3. Click "Connect Notion" button
   → OAuth popup appears
   → Grant permission
   → Redirected back

4. Create a test contact
   Name: John Doe
   Email: john@example.com

5. Click "Push to Notion"
   → Contact synced to Notion

6. Verify in Notion
   → Check Notion workspace
   → See contact in Contacts database
```

### Example 2: Team Collaboration
```
Person A:
1. Adds 5 new contacts in Notion
2. Shares CRM workspace with Person B

Person B:
1. Opens Mission Control dashboard
2. Clicks "Pull from Notion"
3. Imports 5 contacts from Person A
4. Adds new deals locally
5. Clicks "Push to Notion"
6. Both see all contacts + new deals
```

### Example 3: Multi-Device Sync
```
Desktop:
1. Add contacts in dashboard
2. Click "Push to Notion"

Mobile (later):
1. Open Notion app
2. See contacts added on desktop
3. Add more contacts in Notion

Desktop (later):
1. Click "Pull from Notion"
2. See new contacts from mobile
3. All data is in sync
```

---

## 🐛 Troubleshooting

### "OAuth Server not running"
**Problem:** Can't connect to Notion
**Solution:**
```bash
# Start the server
node scripts/notion-oauth-server.js

# Verify it's running
curl http://localhost:3000/auth/notion/status
```

### "Notion button not appearing"
**Problem:** CRM tab doesn't show Notion button
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check console for errors (F12)

### "OAuth popup blocked"
**Problem:** Browser blocked the popup
**Solution:**
1. Check popup blocker settings
2. Add `localhost:3000` to allowed sites
3. Try again

### "Sync failed: Credentials expired"
**Problem:** Access token is old
**Solution:**
1. Click "Disconnect"
2. Click "Connect Notion" again
3. Grant permission in new OAuth flow

### "Can't see contacts in Notion"
**Problem:** Push didn't create Notion database
**Solution:**
1. Make sure OAuth token is valid
2. Check Notion workspace permissions
3. Look for "Contacts" database in Notion
4. Try push again

---

## 🔐 Security Notes

### What's Stored Where
| Data | Location | Security |
|------|----------|----------|
| OAuth Credentials | `~/.openclaw/notion-oauth.json` | File mode 600 (owner only) |
| Access Token | Browser localStorage | Encrypted at browser level |
| Workspace ID | Browser localStorage | No sensitive data |
| Contacts/Deals | Dashboard localStorage | Local browser storage |

### Best Practices
1. **Never share credentials** — Keep `notion-oauth.json` private
2. **Use HTTPS in production** — Dashboard is HTTPS, OAuth server can be proxied
3. **Rotate tokens regularly** — Disconnect and re-authenticate monthly
4. **Audit permissions** — Check what integrations have access in Notion
5. **Backup data** — Notion is persistent backup

### Credential Rotation
```bash
# To rotate credentials:
1. Disconnect in dashboard ("🔓 Disconnect" button)
2. Delete ~/.openclaw/notion-oauth.json
3. Create new OAuth app in Notion (if needed)
4. Reconnect with new credentials
```

---

## 📊 Status Indicators

### Dashboard Button States
```
🔗 Connect Notion
   ↓ (not connected)
   
✅ Notion Connected (workspace_id shown)
   ↓ (authenticated)
   
   [📤 Push] [📥 Pull] [🔓 Disconnect]
```

### Console Output
```bash
# Successful auth
✅ Notion authenticated
   Workspace ID: abc-123-def
   Bot ID: bot-xyz-789

# Successful sync
📤 Syncing 5 contacts to Notion...
✅ Synced 5 contacts

# Error
❌ Sync failed: Invalid token
⚠️  Not connected to Notion
```

---

## 🎓 Next Steps

1. **Start OAuth server:** `node scripts/notion-oauth-server.js`
2. **Connect in dashboard:** Click "🔗 Connect Notion"
3. **Create test data:** Add a contact and deal
4. **Push to Notion:** Click "📤 Push to Notion"
5. **Verify:** Check your Notion workspace
6. **Pull back:** Click "📥 Pull from Notion"
7. **Keep synced:** Regular push/pull or set up cron

---

## 📚 Resources

- **Notion OAuth Docs:** https://developers.notion.com/docs/guides/authorization/oauth
- **Notion API Ref:** https://developers.notion.com/reference/getting-started-with-databases
- **OAuth 2.0 Flow:** https://tools.ietf.org/html/rfc6749

---

**Status:** 🟢 NOTION OAUTH READY  
**OAuth Server:** Ready to run (`scripts/notion-oauth-server.js`)  
**Dashboard Integration:** Fully implemented  
**Bidirectional Sync:** Ready to use  
**Security:** Credentials secured (mode 600)

