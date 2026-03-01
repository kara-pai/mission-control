# Gary — Cron Jobs Configuration

## Scheduled Autonomous Tasks

> **Mission:** Create a business that runs on its own and makes money. Accelerate growth—without increasing headcount. Work sharper, eliminate the redundant, and scale operations with ease. Our purpose-built AI agents drive sales, optimize workflows—transform your business. Target: First self-run AI billionaire in Australia.

### Active Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `nightly_memory` | `0 2 * * *` | PAR memory consolidation + QMD reindex |
| `task_check` | `0 8 * * *` | Morning task queue check |
| `eod_status` | `0 17 * * *` | End-of-day status report |

### Cron Job Details

#### `nightly_memory`
- **Schedule:** `0 2 * * *` (2:00 AM daily)
- **Description:** PAR memory consolidation + QMD reindex
- **Action:** Review day → Update PAR → Reindex QMD

#### `task_check`
- **Schedule:** `0 8 * * *` (8:00 AM daily)
- **Description:** Morning task queue check
- **Action:** Check for tasks from muddy → Execute or delegate

#### `eod_status`
- **Schedule:** `0 17 * * *` (5:00 PM daily)
- **Description:** End-of-day status report
- **Action:** Compile completions → Report to muddy

---

**Status:** ✅ CRON JOBS CONFIGURED (02:14 UTC)  
**Authority:** Muddy (COO)
