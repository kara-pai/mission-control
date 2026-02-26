#!/usr/bin/env node

/**
 * Whisper Transcription Script
 * Transcribes audio files using OpenAI Whisper API
 * Usage: node whisper-transcribe.js <audio-file> [language]
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const FormData = require("form-data");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AUDIO_FILE = process.argv[2];
const LANGUAGE = process.argv[3] || "en";

if (!OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY not set");
  console.error("   Set it: export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

if (!AUDIO_FILE) {
  console.error("❌ Usage: node whisper-transcribe.js <audio-file> [language]");
  process.exit(1);
}

if (!fs.existsSync(AUDIO_FILE)) {
  console.error(`❌ File not found: ${AUDIO_FILE}`);
  process.exit(1);
}

async function transcribe() {
  console.log(`🎙️  Transcribing: ${AUDIO_FILE}`);
  console.log(`📝 Language: ${LANGUAGE}`);

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(AUDIO_FILE));
    form.append("model", "whisper-1");
    form.append("language", LANGUAGE);

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
            console.log("\n✅ Transcription complete:\n");
            console.log(result.text);

            // Save to file
            const outputFile = `${AUDIO_FILE}.transcript.txt`;
            fs.writeFileSync(outputFile, result.text);
            console.log(`\n💾 Saved to: ${outputFile}`);

            resolve(result.text);
          } else {
            console.error(`❌ API Error: ${res.statusCode}`);
            console.error(data);
            reject(new Error(data));
          }
        });
      });

      req.on("error", reject);
      form.pipe(req);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

transcribe();
