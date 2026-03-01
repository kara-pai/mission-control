# Cipher — Memory Configuration

## Knowledge & Context Management

> **Mission:** Create a business that runs on its own and makes money. Accelerate growth—without increasing headcount. Work sharper, eliminate the redundant, and scale operations with ease. Our purpose-built AI agents drive sales, optimize workflows—transform your business. Target: First self-run AI billionaire in Australia.

### Agent-Specific Memory Stores

| Store | Type | Description |
|-------|------|-------------|
| `task_log` | append-only | All tasks received and outcomes |
| `work_artifacts` | versioned | Outputs and deliverables |
| `dept_context` | live-updated | Department state and docs |

---

## Three-Layer PAR Memory System (Tiago Forte Method)

### Layer 1: Daily Notes (What Happened)

Track active backend/security tasks, project status, decisions, blockers. Updated continuously + nightly consolidation at 02:00.

### Layer 2: Knowledge Graph (Facts About Entities)

Store backend architecture docs, security policies, code specifications, deployment records, indexed by QMD for ultra-fast search.

### Layer 3: Tacit Knowledge (How Things Work)

Store security rules, best practices, lessons learned, code patterns, security policies, communication preferences.

### QMD Indexing

Default memory search DISABLED. All lookups go through QMD. Reindex every night at 02:00 after consolidation.

### Nightly Memory Consolidation (02:00 Cron Job)

1. Review all interactions from the day
2. Extract important information (tasks, knowledge, decisions)
3. Classify into PAR layers
4. Update markdown files
5. Reindex QMD
6. Archive daily notes older than 30 days

### Memory Rules for Cipher

1. All memory stores updated in real-time
2. Nightly consolidation at 02:00 reviews all interactions
3. QMD reindex runs after consolidation
4. Default memory search DISABLED
5. Privacy boundaries absolute
6. Stale data flagged and refreshed per retention policy

---

**Status:** ✅ MEMORY SYSTEM INITIALIZED  
**Date:** 2026-03-01 02:26 UTC  
**Reports To:** Elon (CTO)
