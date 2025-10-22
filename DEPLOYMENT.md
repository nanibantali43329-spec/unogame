# 🚀 Deploying UNO Game to GitHub Pages

## Step-by-Step Deployment Guide

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** button (top right) → **"New repository"**
3. Repository settings:
   - **Name**: `uno-multiplayer` (or any name you want)
   - **Description**: "Multiplayer UNO card game with Firebase"
   - **Visibility**: Public
   - ✅ **Do NOT** initialize with README (we already have one)
4. Click **"Create repository"**

### 2. Push Your Code to GitHub

Open a terminal in your project folder and run these commands:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - UNO multiplayer game"

# Add your GitHub repository as remote
# Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual values
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top right)
3. In the left sidebar, click **"Pages"**
4. Under **"Build and deployment"**:
   - **Source**: Select "GitHub Actions"
5. Click **"Save"**

### 4. Wait for Deployment

1. Go to the **"Actions"** tab in your repository
2. You'll see a workflow running (Deploy to GitHub Pages)
3. Wait for it to complete (usually 1-2 minutes)
4. Once done, you'll see a green checkmark ✅

### 5. Access Your Live Website

Your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
- Username: `johnsmith`
- Repo: `uno-multiplayer`
- URL: `https://johnsmith.github.io/uno-multiplayer/`

---

## 🔄 Updating Your Website

Whenever you make changes and want to update the live site:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

The GitHub Action will automatically rebuild and deploy your site!

---

## ⚙️ Important Notes

### Firebase Configuration
Your Firebase credentials are already in the code, which is fine for this project since:
- They're meant to be public (client-side)
- Security is handled by Firebase Rules
- Anonymous authentication is enabled

### Custom Domain (Optional)
If you want a custom domain:
1. Go to Settings → Pages
2. Add your custom domain
3. Follow GitHub's instructions

### Base Path Configuration
If your repository name is different, you might need to update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/', // Change this to your repo name
  // ... rest of config
})
```

Then rebuild and push:
```bash
npm run build
git add .
git commit -m "Update base path"
git push
```

---

## 🐛 Troubleshooting

### Site not loading?
- Check Actions tab for build errors
- Verify Pages is enabled in Settings
- Wait a few minutes after pushing

### 404 errors?
- Make sure `base` in `vite.config.js` matches your repo name
- If using custom domain, set `base: '/'`

### Firebase not working?
- Verify Anonymous Auth is enabled in Firebase Console
- Check Realtime Database rules are set
- Open browser console (F12) for error details

---

## 📝 Quick Command Reference

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Future updates
git add .
git commit -m "Your update message"
git push

# Check git status
git status

# See commit history
git log --oneline
```

---

## 🎉 Your Game is Now Live!

Share your game URL with friends and play together! 🎴
