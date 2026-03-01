# Elon — Memory Configuration

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

This agent operates on a three-layer knowledge management architecture:

### Layer 1: Daily Notes (What Happened)

- **Purpose:** Track exactly what is happening each day — active tasks, project status, decisions made, blockers encountered
- **Update Frequency:** Continuous throughout the day + nightly consolidation at 02:00
- **Format:** Markdown files in `/memory/daily-notes/YYYY-MM-DD.md`
- **Integration:** The heartbeat reads Daily Notes to know which tasks to monitor and check in on
- **Content includes:**
  - Active projects and their current status
  - Tasks delegated to sub-agents and their progress
  - Decisions made and their rationale
  - Blockers encountered and how they were resolved
  - Key metrics captured during the day
  - Client interactions and outcomes

### Layer 2: Knowledge Graph (Facts About Entities)

- **Purpose:** Store factual information about the business, clients, products, market, and everything Power AI works on
- **Update Frequency:** Updated whenever new factual information is learned + nightly consolidation
- **Format:** Markdown files in `/memory/knowledge-graph/` organized by entity type
- **Indexed by:** QMD for ultra-fast search across the entire knowledge base
- **Content includes:**
  - Client profiles, preferences, and engagement history
  - Product specifications and deployment records
  - Market intelligence and competitive data
  - Technical architecture documentation
  - Revenue data and financial records
  - Partnership evaluations and outcomes

### Layer 3: Tacit Knowledge (How Things Work)

- **Purpose:** Store preferences, behavioral patterns, lessons learned, security rules, and operational wisdom
- **Update Frequency:** Updated when new patterns or lessons are identified + nightly consolidation
- **Format:** Markdown files in `/memory/tacit-knowledge/`
- **Content includes:**
  - Louis's preferences and decision-making patterns
  - Security rules and trusted channel definitions
  - Past mistakes and lessons learned (what NOT to do)
  - Successful strategies that should be repeated
  - Agent behavioral guidelines and escalation patterns
  - Communication style preferences per context

### QMD Indexing

- **Tool:** QMD (by Toby at Shopify) — indexes and searches markdown files at extreme speed
- **Override:** Default memory search is DISABLED. All memory lookups go through QMD
- **Reindex Schedule:** Every night at 02:00 after memory consolidation completes
- **Command:** Agent runs QMD search against the knowledge repository instead of default memory lookup

### Nightly Memory Consolidation (02:00 Cron Job)

Every night at 02:00, this agent's memory system executes:

1. **Review:** Go through every chat session and interaction from the day
2. **Identify:** Extract important information — active projects, areas of responsibility, new knowledge, decisions made, lessons learned
3. **Classify:** Sort information into the correct PAR layer (Daily Notes / Knowledge Graph / Tacit Knowledge)
4. **Update:** Write new information to the appropriate markdown files
5. **Reindex:** Run QMD indexing so the agent wakes up with a fully updated, fast-searching knowledge base
6. **Prune:** Archive daily notes older than 30 days; move key insights to Knowledge Graph before archiving

### Memory Rules for Elon

1. All memory stores updated in real-time as Elon operates
2. Nightly consolidation at 02:00 reviews all interactions and updates PAR layers
3. QMD reindex runs after every consolidation — agent wakes up fully updated
4. Default memory search is DISABLED — all lookups go through QMD
5. Privacy boundaries are absolute — no access outside clearance level
6. Stale data flagged and refreshed per retention policy

---

**Status:** ✅ MEMORY SYSTEM INITIALIZED  
**Date:** 2026-03-01 02:09 UTC  
**Authority:** Muddy (COO)
