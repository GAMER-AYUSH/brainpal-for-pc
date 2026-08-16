const FIREBASE_URL = "https://YOUR-FIREBASE-PROJECT-ID.firebaseio.com/permissions.json"; // WARNING: Add your own Firebase URL here!

let isDnrRulesDisabled = false;
let allowExtensionManagementUntil = 0;

// 1. Sync & Reward Message Handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SYNC_FIREBASE") {
    fetch(FIREBASE_URL + "?ts=" + Date.now(), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data) {
          const unlockUntil = data.gameUnlockUntil || 0;
          allowExtensionManagementUntil = data.adminUnlockUntil || 0;
          const isGameUnlocked = Date.now() < unlockUntil;

          if (isGameUnlocked && !isDnrRulesDisabled) {
            chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ["game_block_rules"] });
            isDnrRulesDisabled = true;
          } else if (!isGameUnlocked && isDnrRulesDisabled) {
            chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ["game_block_rules"] });
            isDnrRulesDisabled = false;
          }

          sendResponse({ 
            success: true, 
            allowed: data.allowed || 0,
            gameUnlockUntil: unlockUntil
          });
        } else {
          sendResponse({ success: false });
        }
      })
      .catch(() => sendResponse({ success: false }));

    return true; 
  }

  if (message.type === "GRANT_STUDY_REWARD") {
    fetch(FIREBASE_URL + "?ts=" + Date.now(), { cache: "no-store" })
      .then(res => res.json())
      .then(async (data) => {
        const now = Date.now();
        let newGameTime = data.gameUnlockUntil || 0;
        
        if (newGameTime < now) {
          newGameTime = now;
        }
        
        newGameTime += 30000;
        const newAllowed = (data.allowed || 0) + 1;
        const newXP = (data.studyXP || 0) + 2;

        await fetch(FIREBASE_URL, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            allowed: newAllowed,
            gameUnlockUntil: newGameTime,
            studyXP: newXP,
            lastUpdated: now
          })
        });

        sendResponse({ success: true, allowed: newAllowed, xp: newXP });
      })
      .catch(err => {
        console.error("Study reward update error:", err);
        sendResponse({ success: false });
      });

    return true;
  }
});

// 2. Safe Self-Defense (Only blocks if NOT unlocked via phone admin)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && (tab.url.includes("://extensions") || tab.url.includes("chrome://settings/extensions"))) {
    // If admin granted unlock window from phone, allow access
    if (Date.now() < allowExtensionManagementUntil) {
      return;
    }
    
    // Instead of crashing Chrome, redirect to Google or PW
    chrome.tabs.update(tabId, { url: "https://www.pw.live/" });
  }
});
