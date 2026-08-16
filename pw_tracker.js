let activeWatchSeconds = 0;
let totalSessionSeconds = 0;
let isPlaying = false;

// 1. Create In-Page Study Badge on PW
function createStudyBadge() {
  if (document.getElementById("pw-study-reward-badge")) return;

  const badge = document.createElement("div");
  badge.id = "pw-study-reward-badge";
  badge.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: rgba(15, 23, 42, 0.92);
    border: 2px solid #eab308;
    backdrop-filter: blur(10px);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    user-select: none;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;
  document.body.appendChild(badge);
  updateBadgeUI("⏸️ Waiting for Lecture Video...");
}

function updateBadgeUI(statusText) {
  const badge = document.getElementById("pw-study-reward-badge");
  if (!badge) return;

  const minsEarned = Math.floor(totalSessionSeconds / 60);
  const reelsEarned = minsEarned * 1;
  const gameMinsEarned = (minsEarned * 0.5).toFixed(1);
  const xpEarned = minsEarned * 2;

  badge.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
      <span style="color:#facc15; font-weight:700;">⚡ PW Study Tracker</span>
      <span style="font-size:11px; padding:2px 8px; border-radius:9999px; background:${isPlaying ? '#15803d' : '#475569'}; color:white;">
        ${isPlaying ? '● PLAYING' : '❚❚ PAUSED'}
      </span>
    </div>
    <div style="font-size:12px; color:#cbd5e1; margin-top:2px;">${statusText}</div>
    <div style="font-size:11px; color:#94a3b8; border-top:1px solid #334155; padding-top:4px; margin-top:4px;">
      🎁 Earned: <b style="color:#38bdf8;">+${reelsEarned} Reels</b> | <b style="color:#c084fc;">+${gameMinsEarned}m Games</b> | <b style="color:#facc15;">+${xpEarned} XP</b>
    </div>
  `;
}

// 2. Check if a video lecture is actively playing
function checkVideoPlayback() {
  const videos = document.querySelectorAll("video");
  let playingVideo = null;

  for (const video of videos) {
    // A video is playing if it's not paused, not ended, and has progressing time
    if (!video.paused && !video.ended && video.readyState > 2 && video.currentTime > 0) {
      playingVideo = video;
      break;
    }
  }

  if (playingVideo) {
    isPlaying = true;
    activeWatchSeconds++;
    totalSessionSeconds++;

    const progressToReward = activeWatchSeconds % 60;
    updateBadgeUI(`⏳ Next reward in: <b>${60 - progressToReward}s</b>`);

    // Every 60 seconds of active playback, send reward
    if (activeWatchSeconds >= 60) {
      activeWatchSeconds = 0;
      grantStudyReward();
    }
  } else {
    isPlaying = false;
    if (videos.length === 0) {
      updateBadgeUI("⏸️ Open a Lecture Video to Earn");
    } else {
      updateBadgeUI("⏸️ Lecture Paused — Resume to Earn");
    }
  }
}

// 3. Send reward command to background.js
function grantStudyReward() {
  chrome.runtime.sendMessage({ type: "GRANT_STUDY_REWARD" }, (response) => {
    if (response && response.success) {
      const badge = document.getElementById("pw-study-reward-badge");
      if (badge) {
        badge.style.borderColor = "#22c55e";
        setTimeout(() => {
          badge.style.borderColor = "#eab308";
        }, 1500);
      }
    }
  });
}

// Initialize
createStudyBadge();
setInterval(checkVideoPlayback, 1000);