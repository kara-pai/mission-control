# 🎙️ Voice System Setup Guide

**Complete voice integration for Mission Control dashboard:**
- Voice input for notes (browser microphone)
- Voice commands to control dashboard (Web Speech API)
- Email voice message transcription (Gmail + OpenAI Whisper)
- Automated cron transcription processor
- Voice-to-text across all platforms

---

## ✅ What's Installed (Default Configuration)

### 1. **Dashboard Voice Input** ✅ LIVE
- **Location:** Notes tab → 🎙️ Record & 📁 Upload buttons
- **Technology:** Browser Web Audio API + Media Recorder
- **Features:**
  - Click "🎙️ Record" to record voice notes
  - Transcription via OpenAI Whisper API (if token configured)
  - Fallback to Web Speech API for local transcription
  - Auto-saves to localStorage
  - Timestamps all voice entries
- **Status:** Ready to use now

### 2. **Voice Commands** ✅ LIVE
- **Location:** 🎤 button (bottom-right corner of dashboard)
- **Technology:** Web Speech API + browser speech synthesis
- **Default Commands:**
  ```
  "go to dashboard"     → Show Dashboard tab
  "go to projects"      → Show Projects tab  
  "go to timeline"      → Show Timeline tab
  "go to notes"         → Show Notes tab
  "new note"            → Open Notes editor
  "clear notes"         → Clear all notes
  "read notes"          → Speak notes aloud
  "search"              → Open search bar
  "what time is it"     → Speak current time
  "help"                → List all commands
  ```
- **How to Use:**
  1. Click 🎤 button (bottom-right)
  2. Say a command (e.g., "go to notes")
  3. Dashboard responds visually + speaks confirmation
  4. Press again to stop listening
- **Status:** Ready to use now (browser dependent)

### 3. **Whisper Transcription CLI** ⏳ SETUP REQUIRED
- **Location:** `scripts/whisper-transcribe.js`
- **Usage:** 
  ```bash
  export OPENAI_API_KEY=sk-...
  node scripts/whisper-transcribe.js audio.wav [language]
  ```
- **What it does:** Transcribes audio files using OpenAI Whisper API
- **Requires:** OpenAI API key with audio transcription access
- **Status:** Ready but needs API key

### 4. **Email Voice Handler** ⏳ SETUP REQUIRED
- **Location:** `scripts/email-voice-handler.js`
- **What it does:**
  - Fetches emails with audio attachments from Gmail
  - Downloads voice files automatically
  - Transcribes using Whisper API
  - Saves transcripts to memory logs
- **Usage:**
  ```bash
  export OPENAI_API_KEY=sk-...
  export GMAIL_ACCESS_TOKEN=ya29...
  node scripts/email-voice-handler.js
  ```
- **Status:** Ready but needs credentials

### 5. **Cron Voice Processor** ⏳ SETUP REQUIRED
- **Location:** `scripts/voice-cron.sh`
- **What it does:**
  - Runs hourly
  - Processes files from `~/.openclaw/MISSION-CONTROL/voice-queue/`
  - Transcribes each audio file
  - Archives processed files
  - Logs everything to `logs/voice-cron.log`
- **Setup (Run once):**
  ```bash
  chmod +x scripts/voice-cron.sh
  
  # Add to crontab (hourly)
  crontab -e
  # Add this line:
  0 * * * * export OPENAI_API_KEY=sk-... && /home/karaai/.openclaw/MISSION-CONTROL/scripts/voice-cron.sh
  ```
- **Status:** Ready but needs cron + API key

---

## 🚀 Getting Started (Default Setup)

### **Right Now — No Setup Needed:**
1. **Open dashboard:** https://kara-pai.github.io/mission-control/
2. **Try voice commands:** Click 🎤 button → Say "go to notes"
3. **Record a note:** Go to Notes tab → Click 🎙️ Record → Speak → See transcript appear

### **To Enable Full Transcription (5 minutes):**

#### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com/api/keys
2. Create a new API key
3. Copy it (format: `sk-...`)

#### Step 2: Set the environment variable
```bash
export OPENAI_API_KEY=sk-YOUR_KEY_HERE
```

#### Step 3: Test transcription
```bash
# Create a test audio file or use existing one
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/whisper-transcribe.js test.wav
```

#### Step 4: Enable email voice handling
```bash
# If you have Gmail token already configured:
node /home/karaai/.openclaw/MISSION-CONTROL/scripts/email-voice-handler.js
```

#### Step 5: Schedule cron (optional)
```bash
# Edit crontab
crontab -e

# Add this line (runs every hour):
0 * * * * export OPENAI_API_KEY=sk-YOUR_KEY && /home/karaai/.openclaw/MISSION-CONTROL/scripts/voice-cron.sh
```

---

## 📋 Commands Reference

### Dashboard Navigation
- "go to dashboard" / "show dashboard"
- "go to projects" / "show projects"
- "go to timeline" / "show timeline"
- "go to notes" / "show notes"

### Notes Management
- "new note" → Open notes editor
- "clear notes" → Clear all notes (with confirmation)
- "read notes" → Speak current notes aloud

### Utilities
- "search" → Focus search bar
- "what time is it" → Speak current time
- "help" / "voice commands" → Show available commands

### Voice Input (Notes Tab)
- 🎙️ **Record Button:** Record voice, transcribe, save to notes
- 📁 **Upload Button:** Upload audio file for transcription

---

## 🔧 Configuration

### Default Settings
```javascript
// Voice Recognition (Web Speech API)
language: "en-US"
continuous: true
interim_results: true

// OpenAI Whisper
model: "whisper-1"
language: "en"

// Cron Job
schedule: "0 * * * *" (hourly)
input_dir: "~/.openclaw/MISSION-CONTROL/voice-queue/"
output_dir: "~/.openclaw/MISSION-CONTROL/transcripts/"
```

### Environment Variables
```bash
# Required for transcription
OPENAI_API_KEY=sk-YOUR_KEY

# Optional for email voice handler
GMAIL_ACCESS_TOKEN=ya29...
```

---

## 📊 File Structure

```
MISSION-CONTROL/
├── index.html                          (Dashboard with voice UI)
├── scripts/
│   ├── whisper-transcribe.js          (CLI transcription)
│   ├── email-voice-handler.js         (Gmail voice processor)
│   └── voice-cron.sh                  (Cron transcription job)
├── voice-queue/                       (Audio files awaiting transcription)
├── transcripts/                       (Completed transcripts)
├── memory/
│   └── daily-logs/
│       ├── voice-transcripts.md       (All transcriptions)
│       └── voice-from-email.md        (Email voice messages)
└── logs/
    └── voice-cron.log                 (Transcription job logs)
```

---

## ✨ Features by Feature

### Feature 1: Voice Input (Notes Tab)
- **Status:** ✅ Active
- **Browser Support:** Chrome, Safari, Firefox, Edge
- **Requires:** Microphone permission
- **Limitation:** Local transcription via Web Speech API (basic)
- **Enhancement:** Add `OPENAI_API_KEY` for Whisper accuracy

### Feature 2: Voice Commands
- **Status:** ✅ Active
- **Browser Support:** Chrome, Safari, Firefox, Edge
- **Requires:** Microphone permission
- **How:** Click 🎤 → Say command → Dashboard responds
- **Customizable:** Edit `commandMap` in voice-commands.js

### Feature 3: CLI Transcription
- **Status:** ⏳ Ready (needs API key)
- **Command:** `node scripts/whisper-transcribe.js <audio-file>`
- **Output:** `.transcript.txt` file + console output
- **Best For:** Batch processing audio files

### Feature 4: Email Voice Handler
- **Status:** ⏳ Ready (needs credentials)
- **Watches:** Gmail for audio attachments
- **Processes:** Downloads + transcribes automatically
- **Saves:** To `memory/daily-logs/voice-from-email.md`

### Feature 5: Cron Transcription
- **Status:** ⏳ Ready (needs setup)
- **Frequency:** Hourly (configurable)
- **Input:** `voice-queue/` directory
- **Output:** `transcripts/` directory + memory logs
- **Logging:** Full audit in `logs/voice-cron.log`

---

## 🎯 Quick Wins

### ✅ Already Working (No API Key)
1. Click 🎤 → Use voice commands to navigate dashboard
2. Notes tab → Click 🎙️ Record → Use local speech recognition
3. Speak notes and see them transcribed (basic browser API)

### 🚀 With API Key (5 min setup)
1. Set `OPENAI_API_KEY` environment variable
2. Notes tab → Click 🎙️ Record → Get accurate OpenAI Whisper transcription
3. Optional: Email voice messages auto-transcribed
4. Optional: Schedule cron for batch processing

---

## 🐛 Troubleshooting

### "Voice recognition not supported"
- Browser doesn't support Web Speech API
- **Fix:** Use Chrome, Safari, or Edge

### "Microphone access denied"
- Browser permission not granted
- **Fix:** Check browser settings → Allow microphone for this site

### "❌ Transcription failed"
- API key missing or invalid
- **Fix:** Set `export OPENAI_API_KEY=sk-...` first

### Cron job not running
- Not scheduled in crontab
- **Fix:** Run `crontab -e` and add the line from "Setup" section

### Email voice handler not working
- Gmail token expired or not set
- **Fix:** Refresh token at `~/.openclaw/google-tokens.json`

---

## 📚 Resources

- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **OpenAI Whisper:** https://platform.openai.com/docs/guides/speech-to-text
- **Media Recorder API:** https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
- **Gmail API:** https://developers.google.com/gmail/api

---

## 🎓 Next Steps

1. **Try it now:** Open dashboard, click 🎤, say "go to notes"
2. **Add API key:** Enable Whisper transcription for accuracy
3. **Set up cron:** Automate batch transcription
4. **Customize commands:** Edit `commandMap` for your workflow

---

**Status:** 🟢 VOICE SYSTEM READY  
**Default Setup:** Dashboard voice + Web Speech API (no API key needed)  
**Full Setup:** All 5 features (needs OpenAI API key)

