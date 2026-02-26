# 🎙️ Voice Features Setup Guide

Complete guide to enable and configure voice transcription, voice commands, and voice email processing.

## Overview

Mission Control includes 5 integrated voice features:

1. ✅ **Local Voice Input** — Record notes via browser microphone
2. ✅ **Web Speech API** — Local speech recognition (no API key needed)
3. ⏳ **Whisper Transcription** — OpenAI Whisper for high-accuracy transcription
4. ⏳ **Voice Commands** — Control dashboard with voice
5. ⏳ **Email Voice Handler** — Process voice messages from Gmail

---

## Feature 1: Dashboard Voice Input

### Status: ✅ READY (No Setup Needed)

**What it does:**
- Click "🎙️ Record" button in Notes tab
- Speak your note
- Auto-transcribes using browser's Web Speech API
- Saves directly to notes

**How to use:**
1. Open Mission Control dashboard
2. Click "📝 Notes" tab
3. Click "🎙️ Record" button
4. Start speaking
5. Click "⏹️ Stop" when done
6. Transcript appears in notes

**Browser support:**
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Partial (speech input works, local recognition)
- ✅ Safari: Full support (iOS 14.5+)

---

## Feature 2: Voice File Upload

### Status: ✅ READY (Requires OPENAI_API_KEY for high quality)

**What it does:**
- Upload MP3, WAV, WebM, OGG, or M4A files
- Transcribes using OpenAI Whisper API
- High accuracy (better than browser speech recognition)

**Setup (optional but recommended):**

### Get OpenAI API Key

1. Go to: https://platform.openai.com/api/keys
2. Click "Create new secret key"
3. Name it: `mission-control-voice`
4. Copy the key

### Store API Key

**Option A: Environment variable (recommended)**

```bash
export OPENAI_API_KEY=sk-...
```

Add to `~/.bashrc` or `~/.zshrc` for persistence:

```bash
echo 'export OPENAI_API_KEY=sk-...' >> ~/.bashrc
```

**Option B: Config file**

Create `~/.openclaw/openai-api-key.txt`:

```bash
mkdir -p ~/.openclaw
echo "sk-..." > ~/.openclaw/openai-api-key.txt
chmod 600 ~/.openclaw/openai-api-key.txt
```

### Test transcription

```bash
cd /home/karaai/.openclaw/MISSION-CONTROL

export OPENAI_API_KEY=sk-...

# Transcribe an audio file
node scripts/whisper-transcribe.js path/to/audio.mp3 en
```

Expected output:
```
🎙️  Transcribing: path/to/audio.mp3
📝 Language: en

✅ Transcription complete:

[Your transcribed text here...]

💾 Saved to: path/to/audio.mp3.transcript.txt
```

---

## Feature 3: Voice Commands

### Status: ✅ READY (Fully functional)

**What it does:**
- Click 🎤 button (bottom right of dashboard)
- Say voice commands to control dashboard
- Navigate tabs, create notes, search, etc.

**Voice command examples:**

```
Navigation:
- "go to dashboard"
- "go to projects"
- "go to timeline"
- "go to notes"

Notes:
- "new note"
- "clear notes"
- "read notes"

Utilities:
- "what time is it"
- "what is today"
- "help"
```

**How to use:**
1. Open Mission Control dashboard
2. Click 🎤 button (bottom right corner)
3. Wait for "🎤 Listening..." message
4. Say a command (e.g., "go to notes")
5. Dashboard responds with voice feedback

**Add custom commands:**

Edit `scripts/voice-commands.js`, find `buildCommandMap()`:

```javascript
buildCommandMap() {
  return {
    // Add your custom command here:
    "custom command": () => {
      // Your action
      console.log("Command executed!");
    },
    // ... rest of commands
  };
}
```

---

## Feature 4: Cron Transcription (Automated)

### Status: ⏳ OPTIONAL (Requires OpenAI API key)

**What it does:**
- Automatically transcribes audio files on a schedule
- Watches `voice-queue/` directory
- Saves transcripts to `transcripts/`
- Appends to daily voice logs

**Setup:**

### 1. Create voice queue directory

```bash
mkdir -p ~/.openclaw/MISSION-CONTROL/voice-queue
mkdir -p ~/.openclaw/MISSION-CONTROL/transcripts
```

### 2. Set up cron job

Edit your crontab:

```bash
crontab -e
```

Add this line (runs every hour):

```bash
0 * * * * cd /home/karaai/.openclaw/MISSION-CONTROL && bash scripts/voice-cron.sh
```

Or run daily at 2 AM:

```bash
0 2 * * * cd /home/karaai/.openclaw/MISSION-CONTROL && bash scripts/voice-cron.sh
```

### 3. Make script executable

```bash
chmod +x /home/karaai/.openclaw/MISSION-CONTROL/scripts/voice-cron.sh
```

### 4. Test the cron job

```bash
# Manually run the script
bash /home/karaai/.openclaw/MISSION-CONTROL/scripts/voice-cron.sh

# Check logs
tail -20 ~/.openclaw/MISSION-CONTROL/logs/voice-cron.log
```

**How it works:**
1. Drop audio files in `~/.openclaw/MISSION-CONTROL/voice-queue/`
2. Cron job runs on schedule
3. Files are transcribed using Whisper API
4. Transcripts saved to `transcripts/` directory
5. Entries added to `memory/daily-logs/voice-transcripts.md`
6. Processed files moved to `voice-queue/archive/`

---

## Feature 5: Email Voice Handler

### Status: ⏳ OPTIONAL (Requires Gmail API + OpenAI API)

**What it does:**
- Finds emails with audio attachments
- Downloads voice files
- Transcribes using Whisper API
- Stores transcripts in notes

**Setup:**

### 1. Configure Gmail API token

Your Gmail access token is already stored at:
```
~/.openclaw/google-tokens.json
```

The script automatically uses it. No additional setup needed!

### 2. Set OpenAI API key (see Feature 2)

### 3. Make script executable

```bash
chmod +x /home/karaai/.openclaw/MISSION-CONTROL/scripts/email-voice-handler.js
```

### 4. Test email voice handler

```bash
cd /home/karaai/.openclaw/MISSION-CONTROL

export OPENAI_API_KEY=sk-...
export GMAIL_ACCESS_TOKEN=$(cat ~/.openclaw/google-tokens.json | jq -r '.access_token')

node scripts/email-voice-handler.js
```

### 5. Schedule with cron (optional)

Add to crontab:

```bash
# Run daily at 9 AM
0 9 * * * cd /home/karaai/.openclaw/MISSION-CONTROL && node scripts/email-voice-handler.js
```

**Expected output:**
```
🎙️  Processing voice emails...

📧 Found 3 emails with audio attachments

📎 Attachment: voice-note.mp3
✅ Downloaded: voice-note.mp3
📝 Transcript: [Your transcribed text...]
✅ Added to notes

✅ Voice email processing complete
```

---

## Troubleshooting

### "Mic not working"

- Check browser permissions (🔒 in URL bar)
- Grant microphone access
- Restart browser
- Try different browser

### "Web Speech API not available"

- Use Chrome/Edge (best support)
- Firefox/Safari have limited support
- For reliable transcription, use OpenAI Whisper API

### "Whisper API returns 401"

- Check API key: `echo $OPENAI_API_KEY`
- Verify key starts with `sk-`
- Check key has "Audio" permissions at https://platform.openai.com/api/keys

### "Cron job not running"

```bash
# Check crontab
crontab -l

# Verify script is executable
ls -la scripts/voice-cron.sh

# Check logs
tail -20 logs/voice-cron.log

# Test manually
bash scripts/voice-cron.sh
```

### "Gmail email handler not finding attachments"

- Gmail API token may have expired
- Re-authenticate: `GMAIL_ACCESS_TOKEN=$(cat ~/.openclaw/google-tokens.json | jq -r '.access_token')`
- Check token is valid: `echo $GMAIL_ACCESS_TOKEN`

---

## Cost Estimates

| Feature | Cost | Notes |
|---------|------|-------|
| Web Speech API | FREE | Local browser only |
| Whisper API | $0.36/hour | $0.006 per minute (~6¢) |
| Voice Commands | FREE | Browser-based |
| Gmail API | FREE | Included with Google account |

**Example:** 1 hour of audio transcription = ~$0.36 with OpenAI Whisper

---

## Next Steps

1. ✅ **Activate dashboard voice** — Use "🎙️ Record" in Notes tab
2. 📋 **Try voice commands** — Click 🎤 button and say "help"
3. 🔑 **Optional: Add OpenAI API key** — For high-quality Whisper transcription
4. ⏰ **Optional: Set up cron** — For automated transcription on schedule
5. 📧 **Optional: Email handler** — Process voice emails daily

---

## Quick Reference

```bash
# Test dashboard
open https://kara-pai.github.io/mission-control/

# Set API key
export OPENAI_API_KEY=sk-...

# Test Whisper
node scripts/whisper-transcribe.js audio.mp3

# Check cron
crontab -l

# View logs
tail -20 logs/voice-cron.log
tail -20 memory/daily-logs/voice-transcripts.md
```

---

**Questions?** Check the main Mission Control docs at `README.md` or `DEPLOY-NOW.md`.

