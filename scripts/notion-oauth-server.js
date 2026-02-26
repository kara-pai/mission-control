#!/usr/bin/env node

/**
 * Notion OAuth Server
 * Handles authentication flow for Notion CRM integration
 * Runs on http://localhost:3000
 */

const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const CONFIG_FILE = path.join(
  process.env.HOME || "/tmp",
  ".openclaw/notion-oauth.json"
);

const PORT = process.env.NOTION_OAUTH_PORT || 3000;
let config = loadConfig();

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  }
  return {};
}

function saveConfig() {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code,
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: config.redirect_uri,
    });

    const options = {
      hostname: "api.notion.com",
      path: "/v1/oauth/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          if (result.access_token) {
            config.access_token = result.access_token;
            config.workspace_id = result.workspace_id;
            config.bot_id = result.bot_id;
            saveConfig();
            resolve(result);
          } else {
            reject(new Error(result.message || "Token exchange failed"));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (pathname === "/auth/notion/start") {
    // Step 1: Redirect user to Notion OAuth
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${config.client_id}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
      config.redirect_uri
    )}`;

    res.statusCode = 302;
    res.setHeader("Location", authUrl);
    res.end();
  } else if (pathname === "/auth/notion/callback") {
    // Step 2: Exchange code for token
    try {
      if (!query.code) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "No authorization code provided" }));
        return;
      }

      const result = await exchangeCodeForToken(query.code);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          message: "✅ Notion authenticated successfully!",
          workspace_id: result.workspace_id,
          bot_id: result.bot_id,
        })
      );

      console.log("✅ Notion OAuth authenticated");
      console.log(`   Workspace ID: ${result.workspace_id}`);
      console.log(`   Bot ID: ${result.bot_id}`);
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: error.message }));
      console.error("❌ OAuth error:", error.message);
    }
  } else if (pathname === "/auth/notion/status") {
    // Check authentication status
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        authenticated: !!config.access_token,
        workspace_id: config.workspace_id || null,
        bot_id: config.bot_id || null,
      })
    );
  } else if (pathname === "/auth/notion/logout") {
    // Clear authentication
    config.access_token = null;
    config.workspace_id = null;
    config.bot_id = null;
    saveConfig();

    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, message: "Logged out" }));
    console.log("✅ Notion OAuth cleared");
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🔐 Notion OAuth Server running on http://localhost:${PORT}`);
  console.log(`📍 Redirect URI: ${config.redirect_uri}`);
  console.log(`\n🚀 To authenticate:`);
  console.log(`   1. Open http://localhost:${PORT}/auth/notion/start`);
  console.log(`   2. Grant permission in Notion`);
  console.log(`   3. You'll be redirected back`);
  console.log(`\n📊 Check status: http://localhost:${PORT}/auth/notion/status`);
  console.log(`🚪 Logout: http://localhost:${PORT}/auth/notion/logout\n`);
});
