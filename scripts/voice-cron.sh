#!/bin/bash

#############################################
# Voice Transcription Cron Job
# Processes voice files from a queue and transcribes them
# Schedule: 0 * * * * (every hour)
#############################################

VOICE_QUEUE_DIR="$HOME/.openclaw/MISSION-CONTROL/voice-queue"
TRANSCRIPTS_DIR="$HOME/.openclaw/MISSION-CONTROL/transcripts"
LOG_FILE="$HOME/.openclaw/MISSION-CONTROL/logs/voice-cron.log"
OPENAI_API_KEY="${OPENAI_API_KEY}"

# Create directories if they don't exist
mkdir -p "$VOICE_QUEUE_DIR" "$TRANSCRIPTS_DIR"

# Log function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_msg "===== Voice Transcription Cron Started ====="

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    log_msg "❌ ERROR: OPENAI_API_KEY not set"
    exit 1
fi

# Process all audio files in queue
PROCESSED=0
for audio_file in "$VOICE_QUEUE_DIR"/*.{mp3,wav,webm,ogg,m4a}; do
    # Skip if no files found
    [ -e "$audio_file" ] || continue

    filename=$(basename "$audio_file")
    log_msg "Processing: $filename"

    # Transcribe using Whisper
    transcript_file="$TRANSCRIPTS_DIR/${filename%.*}.txt"
    
    node "$HOME/.openclaw/MISSION-CONTROL/scripts/whisper-transcribe.js" "$audio_file" "en" > "$transcript_file" 2>&1
    
    if [ $? -eq 0 ]; then
        log_msg "✅ Transcribed: $filename"
        
        # Move processed file to archive
        mkdir -p "$VOICE_QUEUE_DIR/archive"
        mv "$audio_file" "$VOICE_QUEUE_DIR/archive/"
        
        PROCESSED=$((PROCESSED + 1))
        
        # Append to notes if applicable
        if [ -f "$transcript_file" ]; then
            TRANSCRIPT=$(cat "$transcript_file")
            
            # Update MISSION-CONTROL notes in memory
            TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
            echo "" >> "$HOME/.openclaw/MISSION-CONTROL/memory/daily-logs/voice-transcripts.md"
            echo "## Voice Transcript — $TIMESTAMP" >> "$HOME/.openclaw/MISSION-CONTROL/memory/daily-logs/voice-transcripts.md"
            echo "**File:** $filename" >> "$HOME/.openclaw/MISSION-CONTROL/memory/daily-logs/voice-transcripts.md"
            echo "**Text:**" >> "$HOME/.openclaw/MISSION-CONTROL/memory/daily-logs/voice-transcripts.md"
            echo "$TRANSCRIPT" >> "$HOME/.openclaw/MISSION-CONTROL/memory/daily-logs/voice-transcripts.md"
        fi
    else
        log_msg "❌ Failed to transcribe: $filename"
    fi
done

log_msg "===== Processed $PROCESSED files ====="
log_msg ""
