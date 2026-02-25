# 🎯 MISSION CONTROL — Unified Agent Workspace

**Location:** `/home/karaai/.openclaw/MISSION-CONTROL`

This is the **single unified workspace** where all agents operate together.

---

## 📊 WORKSPACE STRUCTURE

```
MISSION-CONTROL/
├── agents/                          # All agent definitions & workspaces
│   ├── main/                        # Root orchestrator
│   │   ├── SOUL.md                  # Identity & values
│   │   ├── USER.md                  # Context
│   │   ├── MEMORY.md                # Long-term memory
│   │   └── HEARTBEAT.md             # Daily operations
│   │
│   ├── kara/                        # Opus agent (reasoning, architecture)
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md
│   │   └── HEARTBEAT.md
│   │
│   ├── codex/                       # GPT-4o agent (OpenAI integrations)
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md
│   │   └── HEARTBEAT.md
│   │
│   └── coding-agent/                # Sonnet agent (feature building)
│       ├── SOUL.md
│       ├── USER.md
│       ├── MEMORY.md
│       ├── HEARTBEAT.md
│       └── DELEGATION.md
│
├── memory/                          # Shared memory across all agents
│   ├── UNIFIED-MEMORY.md            # Consolidated facts
│   ├── archive/                     # Old memories
│   └── daily-logs/                  # Session logs
│
├── logs/                            # Execution logs
│   ├── agents.log
│   ├── execution.log
│   └── errors.log
│
├── configs/                         # Shared configurations
│   ├── google-tokens.json
│   ├── cursor-config.json
│   └── agent-routing.json
│
├── dashboards/                      # UI/frontend
│   └── MISSION-CONTROL-DASHBOARD.html
│
└── scripts/                         # Runnable system scripts
    ├── restart-agents.sh
    ├── health-check.sh
    └── sync-memory.sh
```

---

## 🧠 AGENT HIERARCHY

```
🎯 MISSION CONTROL (main)
│
├── ⚙️  OpenClaw Execution Layer
│
├── 🧩 kara (Reasoning Agent)
│   • Model: Claude Opus 4.5
│   • Specialty: Architecture, deep reasoning, optimization
│   • Authority: Architecture decisions
│
├── 🧩 codex (Integration Agent)
│   • Model: GPT-4o
│   • Specialty: OpenAI APIs, external integrations
│   • Authority: API integration decisions
│
└── 🧩 coding-agent (Builder Agent)
    • Model: Claude Sonnet 4.6
    • Specialty: Feature building, coding tasks
    • Delegates to: kara (architecture), codex (APIs)
```

---

## 📋 SHARED MEMORY PROTOCOL

All agents share memory in this hierarchy:

1. **Individual Agent Memory** — `agents/[agent]/MEMORY.md`
   - Agent-specific facts
   - Agent learnings
   - Agent decisions

2. **Unified Memory** — `memory/UNIFIED-MEMORY.md`
   - Shared facts across agents
   - Global decisions
   - Cross-agent insights

3. **Daily Logs** — `memory/daily-logs/YYYY-MM-DD.md`
   - Session notes
   - Task completions
   - Decisions made

---

## 🚀 AGENT COMMUNICATION

All agents:
- ✅ Read from shared memory
- ✅ Write to agent-specific memory first
- ✅ Escalate to unified memory when needed
- ✅ Log all decisions
- ✅ Report status to Mission Control

---

## 🔄 OPERATIONAL FLOWS

### **Feature Building (coding-agent)**
```
Request → coding-agent
├─ Check local capability
├─ Need architecture? → Escalate to kara
├─ Need API integration? → Escalate to codex
├─ Execute locally
└─ Report result
```

### **Architecture Decision (kara)**
```
Request → kara
├─ Analyze requirements
├─ Design system
├─ Document decision
└─ Share with agents
```

### **API Integration (codex)**
```
Request → codex
├─ Research API
├─ Build integration
├─ Test endpoints
└─ Document in shared memory
```

---

## 🔧 CONFIGURATION

**Location:** `/home/karaai/.openclaw/openclaw.json`

All agents configured to:
- Use MISSION-CONTROL workspace
- Share memory directory
- Log to shared logs directory
- Respect unified configs

**Update Config:**
```bash
openclaw config get agents.list
openclaw config set agents.list '[...]'
```

---

## 📊 MONITORING

**Check agent status:**
```bash
openclaw config get agents.list
```

**View shared memory:**
```bash
cat /home/karaai/.openclaw/MISSION-CONTROL/memory/UNIFIED-MEMORY.md
```

**View agent logs:**
```bash
tail -f /home/karaai/.openclaw/MISSION-CONTROL/logs/agents.log
```

---

## 🎯 DAILY WORKFLOW

1. **Mission Control checks memory** — What's the current state?
2. **Specialist agents receive tasks** — Clear, explicit instructions
3. **Agents execute independently** — In shared workspace
4. **Results logged to memory** — Append-only, versioned
5. **Status reported back** — Success, failure, or escalation

---

## 🛡️ RULES

1. **No agent works outside this workspace**
2. **No silent execution** — Everything logged
3. **No memory overwrites** — Append-first only
4. **No conflicting authority** — Mission Control decides
5. **Reliability > Speed** — Safe over fast

---

## 🚀 RESTART GATEWAY (Apply Changes)

After config updates:
```bash
openclaw gateway restart
```

Check status:
```bash
openclaw gateway status
```

---

## 📞 ESCALATION PATH

**If something fails:**
1. Log the error
2. Capture context
3. Report to Mission Control
4. Do NOT retry blindly

**If an agent is stuck:**
1. Escalate to Mission Control
2. Provide full context
3. Await new instructions

---

## ✨ STATUS

**Workspace:** ✅ Active  
**All Agents:** ✅ Registered  
**Shared Memory:** ✅ Initialized  
**Config:** ✅ Updated  
**Dashboard:** ✅ Live @ port 8888  

---

**Created:** 2026-02-25  
**Version:** 1.0  
**Last Updated:** 2026-02-25 13:10 UTC
