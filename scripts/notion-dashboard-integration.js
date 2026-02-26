/**
 * Notion Dashboard Integration
 * Embed in dashboard for OAuth authentication and sync
 * Usage: Include this in index.html <script> tags
 */

class NotionDashboardIntegration {
  constructor() {
    this.oauthServerUrl = "http://localhost:3000";
    this.storageKey = "notion_auth";
    this.config = this.loadConfig();
  }

  loadConfig() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveConfig() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.config));
  }

  async checkStatus() {
    try {
      const response = await fetch(`${this.oauthServerUrl}/auth/notion/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("OAuth status check failed:", error);
      return { authenticated: false };
    }
  }

  async startAuth() {
    console.log("🔐 Starting Notion OAuth...");
    // Open OAuth server in popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${this.oauthServerUrl}/auth/notion/start`,
      "notion-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check for completion
    return new Promise((resolve) => {
      const checkInterval = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkInterval);
          const status = await this.checkStatus();
          if (status.authenticated) {
            console.log("✅ Notion authenticated!");
            this.config = status;
            this.saveConfig();
            resolve(true);
          } else {
            resolve(false);
          }
        }
      }, 500);
    });
  }

  async logout() {
    try {
      await fetch(`${this.oauthServerUrl}/auth/notion/logout`);
      this.config = {};
      this.saveConfig();
      console.log("✅ Logged out from Notion");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }

  isAuthenticated() {
    return !!this.config.workspace_id;
  }

  // Sync contacts to Notion
  async syncContactsToNotion(contacts) {
    if (!this.isAuthenticated()) {
      console.warn("⚠️  Not authenticated with Notion");
      return false;
    }

    try {
      console.log(`📤 Syncing ${contacts.length} contacts to Notion...`);

      // Call backend API to sync
      const response = await fetch("/api/notion/sync-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts,
          access_token: this.config.access_token,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(`✅ Synced ${result.count} contacts`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Sync failed:", error);
      return false;
    }
  }

  // Sync deals to Notion
  async syncDealsToNotion(deals) {
    if (!this.isAuthenticated()) {
      console.warn("⚠️  Not authenticated with Notion");
      return false;
    }

    try {
      console.log(`📤 Syncing ${deals.length} deals to Notion...`);

      const response = await fetch("/api/notion/sync-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals,
          access_token: this.config.access_token,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(`✅ Synced ${result.count} deals`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Sync failed:", error);
      return false;
    }
  }

  // Import contacts from Notion
  async importContactsFromNotion() {
    if (!this.isAuthenticated()) {
      console.warn("⚠️  Not authenticated with Notion");
      return [];
    }

    try {
      console.log("📥 Importing contacts from Notion...");

      const response = await fetch("/api/notion/import-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: this.config.access_token,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(`✅ Imported ${result.contacts.length} contacts`);
        return result.contacts;
      }
      return [];
    } catch (error) {
      console.error("Import failed:", error);
      return [];
    }
  }

  // Full bidirectional sync
  async fullSync(contacts, deals) {
    if (!this.isAuthenticated()) {
      console.warn("⚠️  Not authenticated with Notion");
      return false;
    }

    try {
      console.log("🔄 Starting full sync...");

      const contactsResult = await this.syncContactsToNotion(contacts);
      const dealsResult = await this.syncDealsToNotion(deals);

      console.log("✅ Sync complete");
      return contactsResult && dealsResult;
    } catch (error) {
      console.error("Full sync failed:", error);
      return false;
    }
  }
}

// Initialize globally
window.notionIntegration = new NotionDashboardIntegration();

// Check status on load
window.notionIntegration.checkStatus().then((status) => {
  if (status.authenticated) {
    console.log("✅ Notion already authenticated");
    console.log(`   Workspace: ${status.workspace_id}`);
  }
});
