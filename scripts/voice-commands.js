/**
 * Voice Commands Engine
 * Control Mission Control dashboard with voice
 * Integrates Web Speech API + local command processing
 */

class VoiceCommandEngine {
  constructor() {
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    this.commandMap = this.buildCommandMap();
    this.setupUI();
  }

  buildCommandMap() {
    return {
      // Navigation
      "go to dashboard": () => switchTab("dashboard"),
      "go to projects": () => switchTab("projects"),
      "go to timeline": () => switchTab("timeline"),
      "go to notes": () => switchTab("notes"),
      "show dashboard": () => switchTab("dashboard"),
      "show projects": () => switchTab("projects"),
      "show timeline": () => switchTab("timeline"),
      "show notes": () => switchTab("notes"),

      // Notes
      "new note": () => {
        switchTab("notes");
        document.getElementById("notesTextarea").focus();
      },
      "clear notes": () => {
        if (confirm("Clear all notes?")) {
          document.getElementById("notesTextarea").value = "";
          StorageManager.set("notes", "");
        }
      },

      // Tasks
      "add task": () => switchTab("projects"),
      "new task": () => switchTab("projects"),
      "show tasks": () => switchTab("projects"),

      // Search
      "search": () => {
        document.getElementById("searchBar").focus();
        this.stopListening();
      },

      // Utilities
      "read notes": () => {
        const notes = document.getElementById("notesTextarea").value;
        if (notes) {
          this.speak(notes);
        } else {
          this.speak("No notes found");
        }
      },
      "read dashboard": () => {
        const dashboard = document.getElementById("dashboard");
        const text = dashboard.innerText;
        this.speak(text.substring(0, 500));
      },
      "what time is it": () => {
        const time = new Date().toLocaleTimeString();
        this.speak(`The time is ${time}`);
      },
      "what is today": () => {
        const date = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        this.speak(`Today is ${date}`);
      },

      // Help
      "help": () => this.showHelp(),
      "voice commands": () => this.showHelp(),
      "what can i say": () => this.showHelp(),
    };
  }

  setupUI() {
    // Add voice control button if not already present
    if (!document.getElementById("voiceCommandBtn")) {
      const btn = document.createElement("button");
      btn.id = "voiceCommandBtn";
      btn.className = "voice-command-btn";
      btn.title = "🎤 Voice Commands (Click or say 'Hey' to start)";
      btn.innerHTML = "🎤";
      btn.onclick = () => this.toggleListening();

      // Add to top right corner
      const style = document.createElement("style");
      style.textContent = `
        .voice-command-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5170FF, #00D9FF);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(81, 112, 255, 0.4);
          transition: all 0.3s ease;
          z-index: 10000;
        }

        .voice-command-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(81, 112, 255, 0.6);
        }

        .voice-command-btn.listening {
          animation: voicePulse 1s infinite;
          background: linear-gradient(135deg, #FF4757, #FFB800);
        }

        @keyframes voicePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        #voiceCommandPanel {
          position: fixed;
          bottom: 90px;
          right: 20px;
          background: rgba(5, 5, 8, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          color: white;
          font-size: 14px;
          max-width: 300px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          z-index: 10001;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        #voiceCommandPanel.listening {
          border-color: #FF4757;
          background: rgba(5, 5, 8, 0.98);
        }

        .voice-transcript {
          color: #00D9FF;
          margin: 8px 0;
          font-weight: 500;
        }

        .voice-status {
          color: #B8BAC2;
          font-size: 12px;
          margin-top: 8px;
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(btn);
    }
  }

  async initRecognition() {
    if (!this.SpeechRecognition) {
      this.showStatus("❌ Voice recognition not supported in this browser", true);
      return false;
    }

    this.recognition = new this.SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      document.getElementById("voiceCommandBtn").classList.add("listening");
      this.showPanel();
      this.showStatus("🎤 Listening... Say a command");
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = (finalTranscript || interimTranscript).toLowerCase().trim();

      if (fullTranscript) {
        this.showTranscript(fullTranscript, !finalTranscript);
      }

      if (finalTranscript) {
        this.processCommand(finalTranscript.toLowerCase().trim());
      }
    };

    this.recognition.onerror = (event) => {
      this.showStatus(`❌ Error: ${event.error}`, true);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      document.getElementById("voiceCommandBtn").classList.remove("listening");
      setTimeout(() => this.hidePanel(), 2000);
    };

    return true;
  }

  toggleListening() {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (!this.recognition) {
      this.initRecognition();
    }
    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  processCommand(transcript) {
    this.showStatus(`Processing: "${transcript}"`);

    // Exact match
    if (this.commandMap[transcript]) {
      this.commandMap[transcript]();
      this.speak(`✓ ${transcript}`);
      return;
    }

    // Fuzzy match
    for (const [command, action] of Object.entries(this.commandMap)) {
      if (transcript.includes(command) || command.includes(transcript)) {
        action();
        this.speak(`✓ ${command}`);
        return;
      }
    }

    this.showStatus(`❓ Command not recognized: "${transcript}"`, true);
    this.speak("Sorry, I didn't recognize that command. Say 'help' for options.");
  }

  speak(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  showHelp() {
    const commands = Object.keys(this.commandMap).slice(0, 15);
    this.speak(
      `Available commands: ${commands.join(", ")}. Say help again for more.`
    );
    this.showStatus(`📋 Commands: ${commands.join(", ")}`);
  }

  showPanel() {
    let panel = document.getElementById("voiceCommandPanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "voiceCommandPanel";
      document.body.appendChild(panel);
    }
    panel.style.display = "block";
    panel.classList.add("listening");
  }

  hidePanel() {
    const panel = document.getElementById("voiceCommandPanel");
    if (panel) {
      panel.style.display = "none";
    }
  }

  showTranscript(text, isInterim = false) {
    const panel = document.getElementById("voiceCommandPanel");
    if (!panel) return;

    let transcriptEl = panel.querySelector(".voice-transcript");
    if (!transcriptEl) {
      transcriptEl = document.createElement("div");
      transcriptEl.className = "voice-transcript";
      panel.insertBefore(transcriptEl, panel.firstChild);
    }

    transcriptEl.textContent = text + (isInterim ? "..." : "");
  }

  showStatus(text, isError = false) {
    const panel = document.getElementById("voiceCommandPanel");
    if (!panel) {
      this.showPanel();
    }

    let statusEl = document.querySelector(".voice-status");
    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "voice-status";
      panel.appendChild(statusEl);
    }

    statusEl.textContent = text;
    if (isError) {
      statusEl.style.color = "#FF4757";
    } else {
      statusEl.style.color = "#B8BAC2";
    }
  }
}

// Initialize when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.voiceCommandEngine = new VoiceCommandEngine();
  });
} else {
  window.voiceCommandEngine = new VoiceCommandEngine();
}
