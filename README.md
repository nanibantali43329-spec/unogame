# 🎴 UNO Multiplayer Game

A full-featured, real-time multiplayer UNO card game built with React and Firebase.

## 🎮 Features

- **Real-time Multiplayer**: Play with 2-4 players online
- **Matchmaking System**: Create games, join by code, or find available matches
- **Full UNO Rules**: All classic UNO cards and rules implemented
  - Number cards (0-9)
  - Skip, Reverse, Draw 2
  - Wild and Wild Draw 4 cards
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Firebase Integration**: Real-time database synchronization

## 🚀 Quick Start

### Option 1: Using the Batch File (Windows)
Simply double-click `run.bat` and the game will automatically:
1. Install dependencies (if needed)
2. Start the development server
3. Open at http://localhost:3000

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:3000`

## 🔧 Firebase Setup

### Realtime Database Rules

1. Go to Firebase Console → Realtime Database
2. Navigate to the "Rules" tab
3. Copy and paste the rules from `database.rules.json`
4. Publish the rules

The rules ensure:
- Anyone can read game data
- Only authenticated users can create/modify games
- Players can only modify their own player data

### Database Structure

```
games/
  ├── {gameId}/
      ├── id: string
      ├── host: string (userId)
      ├── status: "waiting" | "playing"
      ├── createdAt: timestamp
      ├── players/
      │   └── {userId}/
      │       ├── name: string
      │       ├── ready: boolean
      │       └── handCount: number
      └── gameState/ (when playing)
          ├── deck: array
          ├── discardPile: array
          ├── hands: object
          ├── currentPlayer: number
          ├── direction: number
          ├── currentColor: string
          ├── drawCount: number
          ├── lastAction: object
          └── winner: string | null
```

## 🎯 How to Play

1. **Start**: Click "Create Game", "Join Game" (with code), or "Find Match"
2. **Lobby**: Wait for players and click "Ready"
3. **Game**: 
   - Play cards that match the color or number
   - Use special cards strategically
   - Draw cards when you can't play
   - First to empty their hand wins!

### Card Types
- **Number Cards (0-9)**: Match color or number
- **Skip**: Next player loses their turn
- **Reverse**: Reverses play direction
- **Draw 2**: Next player draws 2 cards
- **Wild**: Change the color
- **Wild Draw 4**: Change color + next player draws 4

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Backend**: Firebase Realtime Database
- **Auth**: Firebase Anonymous Authentication
- **Styling**: Pure CSS with modern animations

## 📁 Project Structure

```
uno_game/
├── src/
│   ├── components/
│   │   ├── Card.jsx          # Card component
│   │   ├── GameBoard.jsx     # Main game interface
│   │   ├── Lobby.jsx         # Pre-game lobby
│   │   └── Menu.jsx          # Main menu
│   ├── styles/
│   │   ├── Card.css
│   │   ├── GameBoard.css
│   │   ├── Lobby.css
│   │   └── Menu.css
│   ├── firebase.js           # Firebase configuration
│   ├── gameLogic.js          # UNO game rules
│   ├── App.jsx               # Main app component
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── database.rules.json       # Firebase database rules
├── run.bat                   # Quick launcher
└── README.md
```

## 🔒 Security Notes

- Uses Firebase Anonymous Authentication
- Database rules restrict write access to authenticated users
- Players can only modify their own data
- Game state updates verified server-side through rules

## 🌐 Deployment

To deploy to production:

```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (Netlify, Vercel, Firebase Hosting, etc.)

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork, modify, and enhance the game!

---

**Enjoy playing UNO!** 🎉
