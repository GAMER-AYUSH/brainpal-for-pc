let seenIds = new Set();
let dailyCount = 0;
let allowedLimit = 0;

const todayKey = `reels_${new Date().toISOString().slice(0, 10)}`;

// 1. Initial Load from Local Storage (for instant UI render)
chrome.storage.local.get([todayKey, "allowedLimit"], (data) => {
  dailyCount = data[todayKey] || 0;
  allowedLimit = data.allowedLimit || 0;
  createInPageCounter();
  updateInPageCounter();
  enforceLimit(location.href);
});

// 2. The "Ping": Ask background.js for live Firebase data every 2 seconds
function syncRemoteLimit() {
  chrome.runtime.sendMessage({ type: "SYNC_FIREBASE" }, (response) => {
    // If background script was asleep, it might fail once. It will wake up on the next ping.
    if (chrome.runtime.lastError) return; 

    if (response && response.success) {
      if (allowedLimit !== response.allowed) {
        allowedLimit = response.allowed;
        updateInPageCounter();
        enforceLimit(location.href);
      }
    }
  });
}

// Check every 2 seconds
setInterval(syncRemoteLimit, 2000);

// 3. Extraction & Detection Logic
function extractVideoId(url) {
  const ytMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `yt_${ytMatch[1]}`;

  const igMatch = url.match(/\/(?:reel|reels)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) return `ig_${igMatch[1]}`;

  return null;
}

function isReelOrShort(url) {
  return url.includes("/shorts/") || url.includes("/reel/") || url.includes("/reels/");
}

function enforceLimit(url) {
  if (dailyCount >= allowedLimit && isReelOrShort(url)) {
    window.location.replace(chrome.runtime.getURL("blocked.html"));
  }
}

let lastUrl = location.href;
function checkUrlChange() {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    handleReelDetection(currentUrl);
  }
}

function handleReelDetection(url) {
  if (dailyCount >= allowedLimit && isReelOrShort(url)) {
    window.location.replace(chrome.runtime.getURL("blocked.html"));
    return;
  }

  const videoId = extractVideoId(url);
  if (videoId && !seenIds.has(videoId)) {
    seenIds.add(videoId);
    dailyCount += 1;

    chrome.storage.local.set({ [todayKey]: dailyCount }, () => {
      updateInPageCounter();
      if (dailyCount >= allowedLimit) {
        window.location.replace(chrome.runtime.getURL("blocked.html"));
      }
    });
  }
}

// Check for URL changes as the user scrolls
setInterval(checkUrlChange, 400);
handleReelDetection(location.href);

// 4. In-Page UI Logic
function createInPageCounter() {
  if (document.getElementById("reel-counter-badge")) return;
  const badge = document.createElement("div");
  badge.id = "reel-counter-badge";
  badge.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    background: rgba(17, 24, 39, 0.9);
    backdrop-filter: blur(8px);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    user-select: none;
    transition: all 0.3s ease;
  `;
  document.body.appendChild(badge);
}

function updateInPageCounter() {
  const badge = document.getElementById("reel-counter-badge");
  if (!badge) return;
  const isOver = dailyCount >= allowedLimit;
  badge.innerHTML = `🎬 Reels: <span style="color: ${isOver ? '#f87171' : '#38bdf8'}">${dailyCount}</span> / Allowed: ${allowedLimit}`;
  badge.style.borderColor = isOver ? "rgba(239, 68, 68, 0.6)" : "rgba(255, 255, 255, 0.15)";
}