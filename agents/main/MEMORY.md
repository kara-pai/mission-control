# MEMORY.md — Long-Term Memory

## Infrastructure

- **VPS:** srv1413341 (Tailscale IP: 100.119.162.32) — primary home, running OpenClaw gateway 24/7
- **Dashboard:** https://srv1413341.tail85fac1.ts.net (accessible via Tailscale)
- **Gateway port:** 19000 (loopback, exposed via Tailscale Serve)
- **Desktop:** desktop-3v7rkai (Windows, Tailscale IP: 100.124.15.88) — Kara's main machine, paired to OpenClaw on 2026-02-24
- **MacBook:** dos-macbook-air (macOS, Tailscale IP: 100.92.157.7)

## Context Management Rule
Load light on startup: SOUL.md, USER.md, IDENTITY.md, today's memory, MEMORY.md (main session only).
Pull everything else on demand. Save brief daily summary at session end.

## Model Policy
- **Default:** `anthropic/claude-haiku-4-5` — fast, cheap, everything routine
- **Premium:** `anthropic/claude-sonnet-4-6` — complex tasks, on demand only
- **Heartbeats:** `ollama/llama3.2:3b` on Mac (100.92.157.7:11434) — free, local

## Agents
- **main (Homies):** anthropic/claude-haiku-4-5 — default
- **codex:** openai/gpt-4o — OpenAI key configured

## Tools Installed
- Homebrew @ ~/.homebrew
- `gog` (Google CLI) v0.11.0 — needs OAuth creds to activate
- Ollama on Mac with llama3.2:3b

## GOG Setup (Complete ✅)
- Google OAuth app created: project "powerclaw-homie"
- Scopes: Gmail (modify), Calendar (read), Drive (read), Sheets (read)
- Tokens stored securely at ~/.openclaw/google-tokens.json
- Email sending tested successfully (2026-02-25 02:52 UTC)
- Gmail API verified working

## Cursor Configuration (Complete ✅)
- API Key: `key_896947768909c5ca28cfbd628f0ddc872b6786a0658370a00ba1a9899c6d01b1`
- Config files: `~/.openclaw/cursor-config.json` & `~/.cursor/settings.json`
- Model: Claude Opus
- Status: Ready for local & remote use
- Setup guide: `~/.openclaw/CURSOR-SETUP.md`

## Google Drive Setup (Complete ✅)
- Main folder: "Workspace Skills"
- Folder ID: `1zyfDMP8ajp0wsrz4KN4mbgwCVvt542qx`
- Structure: Agents, Skills, Templates, Documentation, Workflows, Memory, Backups, Projects
- Sub-agents: main, kara, codex
- Access: https://drive.google.com/drive/folders/1zyfDMP8ajp0wsrz4KN4mbgwCVvt542qx

## Open Items
- Mac node pairing — gateway needs LAN/Tailscale bind first
- gateway.bind stuck on loopback — needs clean restart to apply LAN

## Setup History

- 2026-02-24: Set up Tailscale Serve to expose OpenClaw dashboard to Tailscale network
- 2026-02-24: Allowed origin `https://srv1413341.tail85fac1.ts.net` in gateway config
- 2026-02-24: Paired Kara's Windows desktop to OpenClaw gateway
- VPS is the permanent home — always on, always connected
