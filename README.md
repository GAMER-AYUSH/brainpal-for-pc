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

1. Copy your Database URL. It will look like https://your-project-id.firebaseio.com/.

2. Configure the Code
Clone or download this repository.

Open admin.html, background.js, content.js, and pw_tracker.js.

Locate the FIREBASE_URL variable at the top of each file.

Replace it with your database URL, ensuring it ends with /permissions.json.
(Example: https://your-project-id.firebaseio.com/permissions.json)

3. Install the Extension (PC)
Open your Chromium-based browser (Chrome, Edge, Brave).

Navigate to chrome://extensions.

Enable Developer mode in the top right corner.

Click Load unpacked and select the folder containing this code.

4. Install the Dashboard (Phone)
Send the admin.html file to your phone, or host it for free on GitHub Pages, Vercel, or Netlify. Open the link on your phone and bookmark it to your home screen.

🛠️ Making it Tamper-Proof (Optional but Recommended)
By default, the extension defends itself by redirecting away from the extensions page. However, a user can still right-click the extension puzzle piece and click "Remove".

To make the extension virtually invincible on Windows:

Press Win + R, paste %localappdata%\Google\Chrome\User Data\Default, and hit Enter. (Adjust path for Edge/Brave if necessary).

Find the files named Preferences and Secure Preferences.

Right-click each -> Properties -> Check Read-only -> Apply.

Now, even if the user clicks "Remove from Chrome", the extension will instantly resurrect itself the next time the browser is opened.

(To update the extension later, you must uncheck Read-only, tap "Unlock Extensions" on your mobile dashboard, make your updates, and re-lock the files).

📜 License
This project is open-source and free to modify for personal productivity and focus.
