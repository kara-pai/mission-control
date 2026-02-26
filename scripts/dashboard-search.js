/**
 * Dashboard Web Research Integration
 * Connects to SearXNG proxy for live search results
 * Embeds in Dashboard for quick research
 */

class DashboardSearch {
  constructor(searchServerUrl = "http://localhost:5000") {
    this.searchServerUrl = searchServerUrl;
    this.recentSearches = JSON.parse(
      localStorage.getItem("dashboard_searches") || "[]"
    );
    this.setupUI();
  }

  setupUI() {
    // Already in dashboard search bar - just add event listeners
    const searchBar = document.getElementById("searchBar");
    if (!searchBar) return;

    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch(searchBar.value);
      }
    });

    // Add search results panel
    const style = document.createElement("style");
    style.textContent = `
      #searchResults {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        max-height: 500px;
        background: rgba(5, 5, 8, 0.98);
        border: 1px solid rgba(81, 112, 255, 0.3);
        border-radius: 12px;
        padding: 20px;
        overflow-y: auto;
        z-index: 9999;
        display: none;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideDown 0.3s ease;
      }

      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }

      .search-result {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .search-result:last-child {
        border-bottom: none;
      }

      .search-result-title {
        color: #5170FF;
        text-decoration: none;
        font-weight: 600;
        margin-bottom: 4px;
        cursor: pointer;
      }

      .search-result-title:hover {
        text-decoration: underline;
      }

      .search-result-url {
        color: #7A7D89;
        font-size: 0.85rem;
        margin-bottom: 4px;
      }

      .search-result-snippet {
        color: #B8BAC2;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .search-result-engine {
        display: inline-block;
        background: rgba(81, 112, 255, 0.1);
        color: #5170FF;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 0.75rem;
        margin-top: 8px;
      }

      #searchLoading {
        color: #5170FF;
        text-align: center;
        padding: 20px;
      }

      .search-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(81, 112, 255, 0.3);
        border-top-color: #5170FF;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Create results container
    const resultsPanel = document.createElement("div");
    resultsPanel.id = "searchResults";
    document.body.appendChild(resultsPanel);
  }

  async performSearch(query) {
    if (!query.trim()) return;

    const resultsPanel = document.getElementById("searchResults");
    resultsPanel.style.display = "block";
    resultsPanel.innerHTML = `
      <div id="searchLoading">
        <div class="search-spinner"></div> Searching...
      </div>
    `;

    try {
      const response = await fetch(
        `${this.searchServerUrl}/search?q=${encodeURIComponent(query)}&engines=duckduckgo`
      );

      if (!response.ok) {
        throw new Error("Search server not available");
      }

      const data = await response.json();
      this.displayResults(data, resultsPanel);

      // Save to recent searches
      this.recentSearches.unshift({
        query,
        timestamp: new Date().toISOString(),
        resultCount: data.count,
      });
      this.recentSearches = this.recentSearches.slice(0, 20);
      localStorage.setItem(
        "dashboard_searches",
        JSON.stringify(this.recentSearches)
      );
    } catch (error) {
      resultsPanel.innerHTML = `
        <div style="color: #FF4757;">
          ❌ Search unavailable: ${error.message}
          <br><br>
          💡 Ensure SearXNG proxy is running:
          <br><code>node scripts/searxng-proxy.js</code>
        </div>
      `;
    }
  }

  displayResults(data, panel) {
    if (!data.results || data.results.length === 0) {
      panel.innerHTML = `<div style="color: #B8BAC2;">No results found for "${data.query}"</div>`;
      return;
    }

    const resultsHtml = data.results
      .map(
        (r) => `
      <div class="search-result">
        <a href="${r.url}" target="_blank" class="search-result-title">${r.title}</a>
        <div class="search-result-url">${r.url}</div>
        ${
          r.snippet
            ? `<div class="search-result-snippet">${r.snippet}</div>`
            : ""
        }
        <div class="search-result-engine">${r.engine}</div>
      </div>
    `
      )
      .join("");

    panel.innerHTML = `
      <div style="margin-bottom: 12px; font-weight: 600; color: #B8BAC2;">
        📊 ${data.count} results for "${data.query}"
      </div>
      ${resultsHtml}
    `;
  }

  getRecentSearches() {
    return this.recentSearches;
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.dashboardSearch = new DashboardSearch();
  });
} else {
  window.dashboardSearch = new DashboardSearch();
}
