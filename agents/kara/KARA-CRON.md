# Kara — Cron Jobs Configuration

## Scheduled Autonomous Tasks

> **Mission:** Create a business that runs on its own and makes money. Accelerate growth—without increasing headcount. Work sharper, eliminate the redundant, and scale operations with ease. Our purpose-built AI agents drive sales, optimize workflows—transform your business. Target: First self-run AI billionaire in Australia.

### Active Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `morning_triage` | `30 6 * * *` | Inbox scan and classify |
| `invoice_review` | `0 9 * * *` | Daily financial doc review |
| `pending_followup` | `0 14 * * *` | Follow up open items |
| `eod_summary` | `0 17 * * *` | Activity summary to Muddy |
| `nightly_memory` | `0 2 * * *` | Memory consolidation |

### Cron Job Details

#### `morning_triage`
- **Schedule:** `30 6 * * *` (6:30 AM daily)
- **Description:** Inbox scan and classify
- **Action:** Scan → Classify → Process routine → Flag escalations

#### `invoice_review`
- **Schedule:** `0 9 * * *` (9:00 AM daily)
- **Description:** Daily financial doc review
- **Action:** Review quotations/invoices → Verify → Flag discrepancies

#### `pending_followup`
- **Schedule:** `0 14 * * *` (2:00 PM daily)
- **Description:** Follow up open items
- **Action:** Check tracker → Send follow-ups → Update status

#### `eod_summary`
- **Schedule:** `0 17 * * *` (5:00 PM daily)
- **Description:** Activity summary to Muddy
- **Action:** Compile actions, pending items, deadlines

#### `nightly_memory`
- **Schedule:** `0 2 * * *` (2:00 AM daily)
- **Description:** Memory consolidation
- **Action:** Update PAR memory → QMD reindex

### Universal Cron (All Agents)

| Job | Schedule | Action |
|-----|----------|--------|
| `nightly_memory_consolidation` | `0 2 * * *` | Review all interactions → Update PAR layers → Reindex QMD |

### Cron Rules

1. All jobs execute autonomously — no manual trigger
2. Failed jobs retry once, then alert `muddy`
3. Outputs logged in Daily Notes and appropriate memory stores
4. Schedule changes require approval from `muddy`

### Cron Syntax Reference

```
┌───────── minute (0-59)
│ ┌─────── hour (0-23)
│ │ ┌───── day of month (1-31)
│ │ │ ┌─── month (1-12)
│ │ │ │ ┌─ day of week (0-6, Sun=0)
* * * * *
```

---

**Status:** ✅ CRON JOBS CONFIGURED (01:57 UTC)  
**Authority:** Muddy (COO)
