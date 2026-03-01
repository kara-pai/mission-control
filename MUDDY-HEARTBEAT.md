# Muddy — Heartbeat Configuration

## Autonomous Task Monitoring & Proactive Operation

> **Mission:** Create a business that runs on its own and makes money. Accelerate growth—without increasing headcount. Work sharper, eliminate the redundant, and scale operations with ease. Our purpose-built AI agents drive sales, optimize workflows—transform your business. Target: First self-run AI billionaire in Australia.

### Schedule

`*/5 * * * *` — **Every 5 minutes**

### Operational Rhythm

**1.** Every 5 min: Check for incoming tasks → delegate immediately

**2.** Every 5 min: Check dashboard for changes → update workspaces and docs

**3.** Every 5 min: Monitor all active Codeex sessions (via Daily Notes):

**4.**   — If running: do nothing

**5.**   — If crashed: restart silently, do NOT report

**6.**   — If finished: report completion to the appropriate supervisor

**7.** Every 5 min: Check delegation status across all departments

**8.** Every 5 min: Review Kara's flagged items — approve/reject outbound docs

**9.** Daily 02:00: Run nightly memory consolidation + QMD reindex

**10.** Daily 06:00: Compile overnight summary for Louis's dashboard

**11.** Daily 07:00: Prepare standup agenda

**12.** Daily 08:00: Lead C-suite standup — capture action items, assign ownership

**13.** Daily 12:00: Midday delegation status check — follow up on overdue items

**14.** Daily 12:00: Run crypto fee claim + burn + transfer pipeline

**15.** Daily 17:00: End-of-day summary — completions, pending, escalations

**16.** Daily 18:00: Audit Kara's daily activity

**17.** Weekly Monday 07:00: Weekly performance digest for Louis

**18.** Continuous: Identify bottlenecks → propose automation → eliminate

**19.** Continuous: Identify revenue opportunities → delegate product builds

---

## Heartbeat System — Autonomous Task Monitoring

This agent's heartbeat runs periodically (configurable interval) and performs intelligent task monitoring:

### Heartbeat Logic

The heartbeat checks Daily Notes for any open projects that should have active sessions running, then applies this logic:

1. **If the session is still actively running:** Do nothing. Let it continue.
2. **If the session died or crashed:** Automatically restart it. Do NOT report to Louis — handle silently.
3. **If the session has successfully finished:** Report back to the appropriate supervisor that the task is complete.

### Large Task Delegation (PRD + Ralph Loops)

For major programming or production tasks, this agent follows the delegation protocol:

1. **Create a PRD First:** Before writing any code or executing any major task, create a detailed Product Requirements Document
2. **Spawn a Ralph Loop:** Delegate execution to Codeex via a Ralph loop running against the PRD
3. **NEVER use TMP folder:** Explicitly spawn sessions in persistent directories — TMP gets cleaned and kills jobs
4. **Update Daily Notes:** Immediately log the task start, session location, and expected completion in Daily Notes
5. **Heartbeat monitors:** The heartbeat will check on these sessions, restart crashes, and report completions

### Proactive Actions

The heartbeat doesn't just monitor — it proactively:
- Checks for new opportunities based on current context
- Identifies bottlenecks and proposes solutions
- Surfaces actionable items that may have been overlooked
- Pitches ideas to the appropriate supervisor based on recent conversations and market data

### Health Indicators

- **Active:** Processing tasks within expected latency
- **Idle:** No pending tasks — monitoring for assignments + scanning for opportunities
- **Degraded:** Response time exceeds thresholds — alert `louis`
- **Offline:** Not responding — immediate escalation + auto-restart attempt

### Proactive Behavior

The heartbeat doesn't just monitor — it:
- Scans for revenue opportunities based on current context
- Identifies bottlenecks and proposes automation
- Surfaces overlooked action items
- Checks Daily Notes for tasks that need attention

---

**Status:** ✅ INSTALLED & READY FOR ACTIVATION  
**Interval:** Every 5 minutes  
**Monitoring Scope:** All active sessions, delegations, Codeex jobs  
**Proactive Capabilities:** Opportunity scanning + Bottleneck elimination + Action surfacing  
**Authority:** Awaiting Louis's directive to enable heartbeat processor
