document.addEventListener("DOMContentLoaded", () => {
  const todayKey = `reels_${new Date().toISOString().slice(0, 10)}`;
  const countEl = document.getElementById("todayCount");
  const limitInput = document.getElementById("limitInput");
  const limitNotice = document.getElementById("limitNotice");
  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Load existing values
  chrome.storage.local.get([todayKey, "dailyLimit"], (data) => {
    const count = data[todayKey] || 0;
    const limit = data.dailyLimit || 20;

    countEl.innerText = count;
    limitInput.value = limit;
    limitNotice.innerText = `Target: under ${limit}`;

    if (count >= limit) {
      countEl.style.color = "#f87171";
    }
  });

  // Save updated limit
  saveBtn.addEventListener("click", () => {
    const newLimit = parseInt(limitInput.value, 10) || 20;
    chrome.storage.local.set({ dailyLimit: newLimit }, () => {
      limitNotice.innerText = `Target: under ${newLimit}`;
      saveBtn.innerText = "Saved!";
      setTimeout(() => (saveBtn.innerText = "Save Limit"), 1200);
    });
  });

  // Reset today's counter
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset today's count back to 0?")) {
      chrome.storage.local.set({ [todayKey]: 0 }, () => {
        countEl.innerText = "0";
        countEl.style.color = "#ffffff";
        chrome.action.setBadgeText({ text: "" });
      });
    }
  });
});