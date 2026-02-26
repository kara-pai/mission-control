#!/usr/bin/env node

/**
 * Email Voice Handler
 * Processes voice attachments from emails and transcribes them
 * Integrates with Gmail API
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const FormData = require("form-data");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GMAIL_ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;

async function getVoiceEmailsFromGmail() {
  /**
   * Fetch emails with audio attachments from Gmail
   */
  if (!GMAIL_ACCESS_TOKEN) {
    console.log("⚠️  Gmail token not configured. Check ~/.openclaw/google-tokens.json");
    return [];
  }

  try {
    const query = 'has:attachment filename:(mp3 OR wav OR ogg OR webm OR m4a)';
    
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${GMAIL_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📧 Found ${data.messages?.length || 0} emails with audio attachments`);

    return data.messages || [];
  } catch (error) {
    console.error("❌ Error fetching from Gmail:", error.message);
    return [];
  }
}

async function downloadAttachment(messageId, attachmentId, filename) {
  /**
   * Download attachment from Gmail
   */
  try {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${GMAIL_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const data = await response.json();
    const buffer = Buffer.from(data.data, "base64");
    const filepath = path.join(
      process.env.HOME || "/tmp",
      ".openclaw/MISSION-CONTROL/voice-queue",
      filename
    );

    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Downloaded: ${filename}`);

    return filepath;
  } catch (error) {
    console.error("❌ Download error:", error.message);
    return null;
  }
}

async function transcribeAudio(filepath) {
  /**
   * Transcribe audio using OpenAI Whisper API
   */
  if (!OPENAI_API_KEY) {
    console.log("⚠️  OPENAI_API_KEY not set. Skipping transcription.");
    return null;
  }

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filepath));
    form.append("model", "whisper-1");
    form.append("language", "en");

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.openai.com",
        port: 443,
        path: "/v1/audio/transcriptions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          ...form.getHeaders(),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            resolve(result.text);
          } else {
            reject(new Error(`API error: ${res.statusCode}`));
          }
        });
      });

      req.on("error", reject);
      form.pipe(req);
    });
  } catch (error) {
    console.error("❌ Transcription error:", error.message);
    return null;
  }
}

async function addToNotes(transcript, sender, subject) {
  /**
   * Add transcribed text to Mission Control notes
   */
  const notesPath = path.join(
    process.env.HOME || "/tmp",
    ".openclaw/MISSION-CONTROL/memory/daily-logs",
    "voice-from-email.md"
  );

  const timestamp = new Date().toLocaleString();
  const entry = `
## Voice Message from ${sender}
**Subject:** ${subject}
**Time:** ${timestamp}

${transcript}

---
`;

  try {
    if (!fs.existsSync(notesPath)) {
      fs.writeFileSync(notesPath, "# Voice Messages from Email\n");
    }
    fs.appendFileSync(notesPath, entry);
    console.log("✅ Added to notes");
  } catch (error) {
    console.error("❌ Error adding to notes:", error.message);
  }
}

async function processVoiceEmails() {
  console.log("🎙️  Processing voice emails...\n");

  const messages = await getVoiceEmailsFromGmail();

  for (const message of messages) {
    try {
      // Fetch full message details
      const response = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            Authorization: `Bearer ${GMAIL_ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) continue;

      const emailData = await response.json();
      const headers = emailData.payload.headers;
      const sender = headers.find((h) => h.name === "From")?.value || "Unknown";
      const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";

      // Process attachments
      const attachments = emailData.payload.parts?.filter((p) => p.filename) || [];

      for (const attachment of attachments) {
        const isAudio = /\.(mp3|wav|ogg|webm|m4a)$/.test(attachment.filename);
        if (!isAudio) continue;

        console.log(`\n📎 Attachment: ${attachment.filename}`);

        const filepath = await downloadAttachment(
          message.id,
          attachment.body.attachmentId,
          attachment.filename
        );

        if (filepath) {
          const transcript = await transcribeAudio(filepath);

          if (transcript) {
            console.log(`📝 Transcript: ${transcript.substring(0, 100)}...`);
            await addToNotes(transcript, sender, subject);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error processing message: ${error.message}`);
    }
  }

  console.log("\n✅ Voice email processing complete");
}

// Main
processVoiceEmails().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
