# MEMORY.md - Long-Term Memory

## Key Decisions & Preferences

### Autonomy & Task Execution (2024)
**Decision:** User grants full autonomy for project work going forward.
- **Permission:** Create and complete tasks without asking for approval
- **Expectation:** Identify what needs doing → do it → show results
- **Style:** No "should I..." questions; just action and transparent output
- **Applies to:** Next projects beyond Mission Control setup
- **Reasoning:** Accelerates development, reduces friction, builds trust through delivery

---

## Projects

### Mission Control (2024)
**Status:** Core system complete, Vercel deployment pending user action
- 4-agent unified workspace (main, kara, codex, coding-agent)
- 38KB self-contained HTML dashboard with glasmorphism design (#5170FF accent)
- Gmail integration: 7 labels, 12 filters, workflow automation
- Google Drive workspace structure created
- GitHub SSH key generated for auto-backups
- Awaiting: User deploys to Vercel, configures cron backup

**Key Learnings:**
- Single-file HTML approach works great for dashboards (no build step, offline-capable, localStorage persistence)
- Unified workspace beats separate agent folders for coordination
- Comprehensive documentation (VERCEL-DEPLOYMENT.md, CRON-SETUP.md) reduces friction on user's end

---
