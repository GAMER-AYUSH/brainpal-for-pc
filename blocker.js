// Function to sync with background script
function checkGamePermission() {
  chrome.runtime.sendMessage({ type: "SYNC_FIREBASE" }, (response) => {
    if (chrome.runtime.lastError) return;
    
    if (response && response.success) {
      const unlockUntil = response.gameUnlockUntil || 0;
      
      if (Date.now() >= unlockUntil) {
        // Time is up or locked manually! Kick them out instantly.
        window.location.replace(chrome.runtime.getURL("blocked.html"));
      } else {
        // They are allowed to play. Update the on-screen timer.
        updateTimerUI(unlockUntil);
      }
    }
  });
}

// Inject and update the floating UI timer on the gaming website
function updateTimerUI(unlockUntil) {
  if (!document.body) return; // Wait for the game page to load enough to show the timer
  
  let timerEl = document.getElementById("focus-guard-game-timer");
  if (!timerEl) {
    timerEl = document.createElement("div");
    timerEl.id = "focus-guard-game-timer";
    timerEl.style.cssText = `
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 2147483647; /* Maximum possible z-index */
      background: #ef4444;
      color: white;
      font-family: -apple-system, sans-serif;
      font-size: 16px;
      font-weight: 800;
      padding: 10px 18px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      border: 2px solid white;
      pointer-events: none;
    `;
    document.body.appendChild(timerEl);
  }
  
  // Calculate remaining time
  const timeLeftMsec = unlockUntil - Date.now();
  const mins = Math.floor(timeLeftMsec / 60000);
  const secs = Math.floor((timeLeftMsec % 60000) / 1000);
  
  // Format to look like 15:09
  const formattedSecs = secs < 10 ? '0' + secs : secs;
  
  // Flash red when under 1 minute
  if (mins === 0) {
    timerEl.style.background = secs % 2 === 0 ? "#ef4444" : "#991b1b"; 
  }
  
  timerEl.innerText = `⏳ Game Time: ${mins}:${formattedSecs}`;
}

// Ping the server every 1 second to update the timer and check if time is up
setInterval(checkGamePermission, 1000);
checkGamePermission();