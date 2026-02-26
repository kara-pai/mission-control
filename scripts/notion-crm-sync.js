#!/usr/bin/env node

/**
 * Notion CRM Sync
 * Bidirectional sync between Notion and Mission Control
 * Manages: Contacts, Deals, Pipeline
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || "";
const CONFIG_FILE = path.join(
  process.env.HOME || "/tmp",
  ".openclaw/notion-config.json"
);

class NotionCRMSync {
  constructor() {
    this.baseURL = "https://api.notion.com/v1";
    this.headers = {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2024-02-15",
      "Content-Type": "application/json",
    };
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      }
    } catch (error) {
      console.warn("⚠️  Config file not found, using defaults");
    }
    return {
      contactsDbId: "",
      dealsDbId: "",
      pipelineDbId: "",
      lastSync: null,
    };
  }

  saveConfig() {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.baseURL + path);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method,
        headers: this.headers,
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            if (res.statusCode >= 400) {
              reject(new Error(`Notion API Error: ${res.statusCode} ${data}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on("error", reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  async createContactsDatabase(parentPageId) {
    console.log("📋 Creating Contacts database in Notion...");
    try {
      const response = await this.request("/databases", "POST", {
        parent: { page_id: parentPageId },
        title: [{ text: { content: "Contacts" } }],
        properties: {
          Name: { title: {} },
          Email: { email: {} },
          Phone: { phone_number: {} },
          Company: { rich_text: {} },
          Status: {
            select: {
              options: [
                { name: "Lead", color: "blue" },
                { name: "Active", color: "green" },
                { name: "Inactive", color: "gray" },
              ],
            },
          },
          Notes: { rich_text: {} },
          Added: { created_time: {} },
        },
      });

      this.config.contactsDbId = response.id;
      this.saveConfig();
      console.log(`✅ Contacts DB created: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error("❌ Error creating database:", error.message);
      throw error;
    }
  }

  async createDealsDatabase(parentPageId) {
    console.log("📋 Creating Deals database in Notion...");
    try {
      const response = await this.request("/databases", "POST", {
        parent: { page_id: parentPageId },
        title: [{ text: { content: "Deals" } }],
        properties: {
          "Deal Name": { title: {} },
          Contact: { relation: { database_id: this.config.contactsDbId } },
          Amount: { number: { format: "dollar" } },
          Stage: {
            select: {
              options: [
                { name: "Prospect", color: "gray" },
                { name: "Negotiation", color: "yellow" },
                { name: "Won", color: "green" },
                { name: "Lost", color: "red" },
              ],
            },
          },
          "Close Date": { date: {} },
          Notes: { rich_text: {} },
        },
      });

      this.config.dealsDbId = response.id;
      this.saveConfig();
      console.log(`✅ Deals DB created: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error("❌ Error creating deals database:", error.message);
      throw error;
    }
  }

  async addContact(contactData) {
    try {
      const response = await this.request("/pages", "POST", {
        parent: { database_id: this.config.contactsDbId },
        properties: {
          Name: { title: [{ text: { content: contactData.name } }] },
          Email: { email: contactData.email || "" },
          Phone: { phone_number: contactData.phone || "" },
          Company: { rich_text: [{ text: { content: contactData.company || "" } }] },
          Status: { select: { name: contactData.status || "Lead" } },
          Notes: { rich_text: [{ text: { content: contactData.notes || "" } }] },
        },
      });

      console.log(`✅ Contact added: ${contactData.name}`);
      return response;
    } catch (error) {
      console.error("❌ Error adding contact:", error.message);
      throw error;
    }
  }

  async addDeal(dealData) {
    try {
      const response = await this.request("/pages", "POST", {
        parent: { database_id: this.config.dealsDbId },
        properties: {
          "Deal Name": { title: [{ text: { content: dealData.name } }] },
          Amount: { number: dealData.amount || 0 },
          Stage: { select: { name: dealData.stage || "Prospect" } },
          "Close Date": { date: { start: dealData.closeDate || null } },
          Notes: { rich_text: [{ text: { content: dealData.notes || "" } }] },
        },
      });

      console.log(`✅ Deal added: ${dealData.name}`);
      return response;
    } catch (error) {
      console.error("❌ Error adding deal:", error.message);
      throw error;
    }
  }

  async getContacts() {
    try {
      const response = await this.request(
        `/databases/${this.config.contactsDbId}/query`,
        "POST",
        {}
      );

      const contacts = response.results.map((page) => ({
        id: page.id,
        name: page.properties.Name.title[0]?.text.content || "Unknown",
        email: page.properties.Email.email || "",
        phone: page.properties.Phone.phone_number || "",
        company: page.properties.Company.rich_text[0]?.text.content || "",
        status: page.properties.Status.select?.name || "Lead",
      }));

      console.log(`✅ Retrieved ${contacts.length} contacts`);
      return contacts;
    } catch (error) {
      console.error("❌ Error fetching contacts:", error.message);
      return [];
    }
  }

  async getDeals() {
    try {
      const response = await this.request(
        `/databases/${this.config.dealsDbId}/query`,
        "POST",
        {}
      );

      const deals = response.results.map((page) => ({
        id: page.id,
        name: page.properties["Deal Name"].title[0]?.text.content || "Unknown",
        amount: page.properties.Amount.number || 0,
        stage: page.properties.Stage.select?.name || "Prospect",
        closeDate: page.properties["Close Date"].date?.start || null,
      }));

      console.log(`✅ Retrieved ${deals.length} deals`);
      return deals;
    } catch (error) {
      console.error("❌ Error fetching deals:", error.message);
      return [];
    }
  }
}

// CLI Interface
async function main() {
  if (!NOTION_API_KEY) {
    console.error("❌ NOTION_API_KEY not set");
    console.log("   Set it: export NOTION_API_KEY=notionauthtoken...");
    process.exit(1);
  }

  const sync = new NotionCRMSync();
  const command = process.argv[2];

  try {
    switch (command) {
      case "init":
        const parentPageId = process.argv[3];
        if (!parentPageId) {
          console.error("Usage: node notion-crm-sync.js init <parent-page-id>");
          process.exit(1);
        }
        await sync.createContactsDatabase(parentPageId);
        await sync.createDealsDatabase(parentPageId);
        console.log("\n✅ CRM databases initialized!");
        break;

      case "add-contact":
        const contactName = process.argv[3];
        const contactEmail = process.argv[4];
        if (!contactName) {
          console.error("Usage: node notion-crm-sync.js add-contact <name> [email]");
          process.exit(1);
        }
        await sync.addContact({ name: contactName, email: contactEmail });
        break;

      case "add-deal":
        const dealName = process.argv[3];
        const dealAmount = parseFloat(process.argv[4] || 0);
        if (!dealName) {
          console.error("Usage: node notion-crm-sync.js add-deal <name> [amount]");
          process.exit(1);
        }
        await sync.addDeal({ name: dealName, amount: dealAmount });
        break;

      case "list-contacts":
        const contacts = await sync.getContacts();
        console.log("\n📋 Contacts:");
        contacts.forEach((c) => {
          console.log(
            `  • ${c.name} (${c.email}) - ${c.status}`
          );
        });
        break;

      case "list-deals":
        const deals = await sync.getDeals();
        console.log("\n💰 Deals:");
        deals.forEach((d) => {
          console.log(
            `  • ${d.name} - $${d.amount} (${d.stage})`
          );
        });
        break;

      default:
        console.log(`
Notion CRM Sync — Manage your CRM via Notion API

Usage:
  node notion-crm-sync.js init <parent-page-id>    Create CRM databases
  node notion-crm-sync.js add-contact <name> [email]
  node notion-crm-sync.js add-deal <name> [amount]
  node notion-crm-sync.js list-contacts             List all contacts
  node notion-crm-sync.js list-deals                List all deals

Environment:
  NOTION_API_KEY=notionauth...
        `);
    }
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

main();
