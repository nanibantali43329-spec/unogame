# 🔥 Firebase Setup Guide

Follow these steps to configure Firebase for your UNO game:

## Step 1: Enable Anonymous Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/project/multiplayer-ee0d2)
2. Click on **Authentication** in the left sidebar
3. Click on **Get Started** (if not already enabled)
4. Go to the **Sign-in method** tab
5. Click on **Anonymous**
6. Toggle it to **Enable**
7. Click **Save**

## Step 2: Enable Realtime Database

1. In Firebase Console, click on **Realtime Database** in the left sidebar
2. Click **Create Database**
3. Choose a location (e.g., United States)
4. Select **Start in test mode** (we'll add proper rules next)
5. Click **Enable**

## Step 3: Get Your Database URL

After creating the database, you'll see a URL like:
```
https://multiplayer-ee0d2-default-rtdb.firebaseio.com
```

**IMPORTANT:** Your database might be in a different region. Common formats:
- US: `https://PROJECT-ID-default-rtdb.firebaseio.com`
- Europe: `https://PROJECT-ID-default-rtdb.europe-west1.firebasedatabase.app`
- Asia: `https://PROJECT-ID-default-rtdb.asia-southeast1.firebasedatabase.app`

Copy YOUR actual database URL from the top of the Realtime Database page.

## Step 4: Update Database URL in Code

If the URL is different from `https://multiplayer-ee0d2-default-rtdb.firebaseio.com`:

1. Open `src/firebase.js`
2. Find line 13:
   ```javascript
   databaseURL: "https://multiplayer-ee0d2-default-rtdb.firebaseio.com"
   ```
3. Replace it with YOUR actual database URL

## Step 5: Set Database Rules

1. In Realtime Database, click on the **Rules** tab
2. Replace the existing rules with the content from `database.rules.json`:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": "auth != null",
        "players": {
          "$playerId": {
            ".write": "auth.uid == $playerId"
          }
        },
        "gameState": {
          ".write": "auth != null && data.parent().child('players').child(auth.uid).exists()"
        }
      }
    }
  }
}
```

3. Click **Publish**

## Step 6: Verify Setup

After completing all steps:
1. Refresh your browser at http://localhost:3000
2. Click the "Retry" button
3. You should see the main menu!

## Troubleshooting

### "Authentication Error" persists
- Make sure Anonymous auth is enabled
- Check browser console (F12) for specific error messages

### "Permission denied" errors
- Verify database rules are published
- Check that Realtime Database is enabled

### Can't create/join games
- Verify the databaseURL matches your Firebase project
- Check that you're using Realtime Database (not Firestore)

---

**Need help?** Check the browser console (F12 → Console tab) for detailed error messages.
