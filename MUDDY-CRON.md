# Muddy — Cron Jobs Configuration

## Scheduled Autonomous Tasks

> **Mission:** Create a business that runs on its own and makes money. Accelerate growth—without increasing headcount. Work sharper, eliminate the redundant, and scale operations with ease. Our purpose-built AI agents drive sales, optimize workflows—transform your business. Target: First self-run AI billionaire in Australia.

### Active Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `nightly_memory_consolidation` | `0 2 * * *` | PAR memory consolidation + QMD reindex |
| `overnight_summary` | `0 6 * * *` | Compile overnight activity for Louis |
| `daily_standup` | `0 8 * * *` | Lead C-suite standup |
| `midday_status` | `0 12 * * *` | Midday delegation check |
| `crypto_pipeline` | `0 12 * * *` | Daily crypto fee management |
| `eod_summary` | `0 17 * * *` | End-of-day summary |
| `kara_audit` | `0 18 * * *` | Audit Kara's daily activity |
| `workspace_sync` | `0 */2 * * *` | Workspace sync audit every 2 hours |
| `doc_integrity` | `0 3 * * *` | Documentation integrity check |
| `weekly_digest` | `0 7 * * 1` | Monday weekly digest |
| `bottleneck_scan` | `0 15 * * *` | Daily bottleneck scan |
| `revenue_opportunity_scan` | `0 10 * * *` | Daily revenue opportunity scan |

### Cron Job Details

#### `nightly_memory_consolidation`
- **Schedule:** `0 2 * * *` (2:00 AM daily)
- **Description:** PAR memory consolidation + QMD reindex
- **Action:** Review all chat sessions → Extract info → Update Daily Notes, Knowledge Graph, Tacit Knowledge → Rerun QMD indexing → Agent wakes up fully updated

#### `overnight_summary`
- **Schedule:** `0 6 * * *` (6:00 AM daily)
- **Description:** Compile overnight activity for Louis
- **Action:** Gather completions, errors, cron results → Format summary → Dashboard

#### `daily_standup`
- **Schedule:** `0 8 * * *` (8:00 AM daily)
- **Description:** Lead C-suite standup
- **Action:** Prepare agenda → Standup with Elon, Gary, Warren → Capture action items → Assign → Log

#### `midday_status`
- **Schedule:** `0 12 * * *` (12:00 PM daily)
- **Description:** Midday delegation check
- **Action:** Check all delegations → Follow up overdue → Update dashboard

#### `crypto_pipeline`
- **Schedule:** `0 12 * * *` (12:00 PM daily)
- **Description:** Daily crypto fee management
- **Action:** Claim fees → Burn tokens → Transfer to wallet → Log treasury

#### `eod_summary`
- **Schedule:** `0 17 * * *` (5:00 PM daily)
- **Description:** End-of-day summary
- **Action:** Compile day's activity → Pending items → Escalations → Tomorrow's priorities

#### `kara_audit`
- **Schedule:** `0 18 * * *` (6:00 PM daily)
- **Description:** Audit Kara's daily activity
- **Action:** Review sent emails, docs, financials → Flag anomalies

#### `workspace_sync`
- **Schedule:** `0 */2 * * *` (every 2 hours)
- **Description:** Workspace sync audit every 2 hours
- **Action:** Verify workspaces match docs → Flag desync → Auto-correct

#### `doc_integrity`
- **Schedule:** `0 3 * * *` (3:00 AM daily)
- **Description:** Documentation integrity check
- **Action:** Verify master docs match system state → Flag discrepancies

#### `weekly_digest`
- **Schedule:** `0 7 * * 1` (Monday 7:00 AM)
- **Description:** Monday weekly digest
- **Action:** Compile weekly metrics: tasks, revenue, costs, bottlenecks → Present to Louis

#### `bottleneck_scan`
- **Schedule:** `0 15 * * *` (3:00 PM daily)
- **Description:** Daily bottleneck scan
- **Action:** Identify tasks stalled on manual input → Propose automation → Log

#### `revenue_opportunity_scan`
- **Schedule:** `0 10 * * *` (10:00 AM daily)
- **Description:** Daily revenue opportunity scan
- **Action:** Review market data, client needs, trending demands → Identify buildable products → Delegate to Warren/Elon

### Universal Cron (All Agents)

| Job | Schedule | Action |
|-----|----------|--------|
| `nightly_memory_consolidation` | `0 2 * * *` | Review all interactions → Update PAR layers → Reindex QMD |

### Cron Rules

1. All jobs execute autonomously — no manual trigger
2. Failed jobs retry once, then alert `louis`
3. Outputs logged in Daily Notes and appropriate memory stores
4. Schedule changes require approval from `louis`

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

**Status:** ✅ INSTALLED & READY FOR SCHEDULING  
**Jobs Configured:** 12 cron tasks  
**Daily Execution:** 10 jobs  
**Weekly Execution:** 1 job  
**Hourly/Every-2H Execution:** 1 job  
**Authority:** Awaiting Louis's directive to activate cron scheduler
