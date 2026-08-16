# 🧠 BrainPal for PC

**Stop Doomscrolling. Block Distractions. Earn Your Entertainment.**

BrainPal for PC is a custom Chrome/Edge/Brave extension paired with a remote mobile dashboard. It acts as a strict productivity enforcer that completely blocks addictive web games and limits short-form content (Instagram Reels, YouTube Shorts). 

Instead of just blocking things, it uses a **Study-to-Earn** system. By actively studying on educational platforms (like Physics Wallah), the user earns XP, which automatically converts into unlocked Reel quota and Web Game time.

## ✨ Features

* 🎬 **Reel & Shorts Tracker:** Accurately counts IG Reels and YT Shorts watched. Blocks the feed instantly when the limit is reached.
* 🎮 **Web Game Blocker:** Intercepts distraction sites (CrazyGames, Poki, Roblox Web, MSN, etc.) and redirects to a motivational study screen.
* ⚡ **Study-to-Earn (PW Integration):** Detects active lecture video playback on `pw.live`. For every 1 minute of focused watching, it automatically grants +2 XP, +1 Reel, and +30 seconds of Game Time.
* 📱 **Remote Admin Dashboard:** A mobile-friendly web dashboard powered by Firebase. Parents or accountability partners can remotely grant Reels, add game time, or completely lock the device in real-time.
* 🛡️ **Self-Defense System:** Prevents the user from disabling the extension. Attempts to open `chrome://extensions` are instantly redirected unless explicitly unlocked via the mobile admin dashboard.

---

## 🚀 Installation & Setup

### 1. Set up the Database (Firebase)
This project uses Firebase Realtime Database (100% Free) to sync commands between the phone and the PC.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Navigate to **Realtime Database** -> **Create Database** (Start in Test Mode).
3. Go to the **Rules** tab and ensure it looks like this:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
