#!/usr/bin/env node

/**
 * SearXNG-Compatible Proxy for Mission Control
 * Aggregates search results from multiple engines
 * Runs on http://localhost:5000
 */

const http = require("http");
const https = require("https");
const url = require("url");
const querystring = require("querystring");

const PORT = process.env.SEARXNG_PORT || 5000;

// Supported search engines
const ENGINES = {
  duckduckgo: {
    url: "https://api.duckduckgo.com/",
    params: { q: "q", format: "json" },
    parser: (data) => {
      const results = [];
      if (data.Results) {
        data.Results.forEach((r) => {
          results.push({
            title: r.Result,
            url: r.FirstURL,
            snippet: r.Text,
            engine: "duckduckgo",
          });
        });
      }
      return results;
    },
  },
  
  google: {
    url: "https://www.google.com/search",
    params: { q: "q" },
    parser: (html) => {
      // Parse Google's HTML (basic parsing)
      const results = [];
      const regex = /<h3[^>]*>.*?<a href="([^"]*)"[^>]*>([^<]+)<\/a>/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        results.push({
          title: match[2],
          url: match[1],
          engine: "google",
        });
      }
      return results.slice(0, 10);
    },
  },
  
  bing: {
    url: "https://api.bing.microsoft.com/v7.0/search",
    params: { q: "q" },
    headers: { "Ocp-Apim-Subscription-Key": "" }, // Requires API key
    parser: (data) => {
      const results = [];
      if (data.webPages) {
        data.webPages.value.forEach((r) => {
          results.push({
            title: r.name,
            url: r.url,
            snippet: r.snippet,
            engine: "bing",
          });
        });
      }
      return results;
    },
  },
};

// Fetch from a single engine
async function fetchEngine(engine, query) {
  return new Promise((resolve) => {
    try {
      const engineConfig = ENGINES[engine];
      if (!engineConfig) {
        resolve([]);
        return;
      }

      const params = {
        ...engineConfig.params,
        q: query,
      };

      const queryStr = Object.keys(params)
        .map((k) => `${params[k]}=${encodeURIComponent(query)}`)
        .join("&");

      const fullUrl = `${engineConfig.url}?${queryStr}`;
      const protocol = fullUrl.startsWith("https") ? https : http;

      protocol
        .get(fullUrl, { timeout: 5000 }, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              const results = engineConfig.parser(parsed);
              resolve(results);
            } catch (e) {
              resolve([]);
            }
          });
        })
        .on("error", () => resolve([]));
    } catch (error) {
      resolve([]);
    }
  });
}

// Aggregate results from multiple engines
async function aggregateResults(query, engines = ["duckduckgo"]) {
  const results = [];
  const seenUrls = new Set();

  for (const engine of engines) {
    const engineResults = await fetchEngine(engine, query);
    
    engineResults.forEach((result) => {
      if (!seenUrls.has(result.url)) {
        results.push(result);
        seenUrls.add(result.url);
      }
    });
  }

  return results;
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (pathname === "/search") {
    // Main search endpoint
    if (!query.q) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Missing query parameter 'q'" }));
      return;
    }

    const engines = (query.engines || "duckduckgo").split(",");
    const results = await aggregateResults(query.q, engines);

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        query: query.q,
        engines,
        results,
        count: results.length,
      })
    );
  } else if (pathname === "/engines") {
    // List available engines
    res.statusCode = 200;
    res.end(JSON.stringify(Object.keys(ENGINES)));
  } else if (pathname === "/status") {
    // Health check
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "ok", engines: Object.keys(ENGINES) }));
  } else if (pathname === "/") {
    // Home page
    res.statusCode = 200;
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>SearXNG Proxy</title>
  <style>
    body { font-family: Arial; margin: 40px; }
    h1 { color: #333; }
    .api { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0; }
    code { background: #ddd; padding: 5px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>🔍 SearXNG Proxy API</h1>
  <p>Metasearch engine aggregating results from multiple sources</p>
  
  <h2>Endpoints</h2>
  
  <div class="api">
    <h3>/search?q=<query>&engines=<engine1,engine2></h3>
    <p>Search across engines</p>
    <p>Example: <code>/search?q=nodejs&engines=duckduckgo</code></p>
  </div>
  
  <div class="api">
    <h3>/engines</h3>
    <p>List available search engines</p>
  </div>
  
  <div class="api">
    <h3>/status</h3>
    <p>Health check</p>
  </div>

  <h2>Available Engines</h2>
  <ul>
    <li><strong>duckduckgo</strong> - Privacy-focused search (working)</li>
    <li><strong>google</strong> - Google search (requires HTML parsing)</li>
    <li><strong>bing</strong> - Bing search (requires API key)</li>
  </ul>

  <h2>Usage Examples</h2>
  <pre>
curl "http://localhost:5000/search?q=nodejs&engines=duckduckgo"
curl "http://localhost:5000/engines"
curl "http://localhost:5000/status"
  </pre>
</body>
</html>
    `);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🔍 SearXNG Proxy running on http://localhost:${PORT}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   /search?q=<query>&engines=duckduckgo`);
  console.log(`   /engines`);
  console.log(`   /status`);
  console.log(`\n🚀 Try: curl "http://localhost:${PORT}/search?q=nodejs"`);
});
