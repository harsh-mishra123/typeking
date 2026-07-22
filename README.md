# TypeKing

TypeKing is a full-stack, real-time typing speed test and multiplayer race web application. It features a Monkeytype-style solo practice mode with live statistics and a Socket.IO-powered real-time multiplayer race mode with room management, live progress broadcasting, and victory popups.

---

## Technical Stack

- **Client**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Socket.IO Client
- **Server**: Node.js, Express, Socket.IO, TypeScript, `tsx`
- **Typography**: JetBrains Mono (typing text, statistics, timer) and Inter (UI chrome)
- **Palette**: Typewriter-inspired warm dark mode (Deep Charcoal background `#0d1117`, Amber cursor `#e5a411`, Parchment text `#e6dfd0`, Muted Rose errors `#e85d75`)

---

## Features

### Solo Practice Mode
- **Test Modes**: Time-based (15s, 30s, 45s, 60s, 120s) and Word-count-based (10, 25, 50, 100).
- **Text Generator**: Shuffled common English dictionary with buffer support to prevent running out of text.
- **Typing Engine**: Character-level correctness highlights (correct, incorrect, extra, missed), backspacing support within and between words with errors, and auto line-scrolling.
- **Performance Chart**: HTML5 Canvas line chart displaying smooth WPM progress over time with gradient fill.
- **Run History**: Saves recent test results to local storage.
- **Shortcuts**: Instant restart via Tab key.

### Real-Time Multiplayer Mode
- **Room Management**: Create rooms with generated 6-character room codes or join via code.
- **Host Controls**: Configurable time duration presets (15s, 30s, 45s, 60s).
- **Synchronized Countdown**: 3-second server-synced countdown before race start.
- **Live Progress Lanes**: Real-time progress broadcasting rendering filling ink-ribbon bars per player.
- **Authoritative Server Timer**: Server-side countdown timer ensuring fair finish timing across clients.
- **Winner Determination**: Automated scoring identifying the player with the highest WPM and accuracy tiebreaker.
- **Victory Modal**: Animated winner popup announcing the champion with Play Again functionality for the room host.
- **Leaderboard**: Comprehensive post-race standings sorted by finish state, WPM, and accuracy.
- **Room Chat**: Collapsible in-game messaging widget for room participants.

---

## Repository Structure

```text
typeking/
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout and font configuration
│   │   │   ├── page.tsx               # Solo practice mode page
│   │   │   ├── globals.css            # Custom CSS theme variables
│   │   │   └── multiplayer/
│   │   │       └── page.tsx           # Multiplayer state machine controller
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header navigation bar
│   │   │   ├── ModeSelector.tsx       # Mode and preset selection pill
│   │   │   ├── TypingArea.tsx         # Interactive typing interface
│   │   │   ├── RestartButton.tsx      # Test restart button
│   │   │   ├── Results.tsx            # Test completion statistics
│   │   │   ├── WpmChart.tsx           # Canvas WPM performance chart
│   │   │   └── multiplayer/
│   │   │       ├── Lobby.tsx          # Room lobby interface
│   │   │       ├── Countdown.tsx      # Synced race countdown overlay
│   │   │       ├── RaceLanes.tsx      # Ink-ribbon player progress bars
│   │   │       ├── Leaderboard.tsx    # Standings table
│   │   │       ├── WinnerModal.tsx    # Victory popup modal
│   │   │       └── Chat.tsx           # Room chat component
│   │   ├── hooks/
│   │   │   ├── useTypingTest.ts       # Core typing engine hook
│   │   │   ├── useTimer.ts            # Local timer hook
│   │   │   ├── useLocalHistory.ts     # LocalStorage history hook
│   │   │   └── useSocket.ts           # Socket event handler hook
│   │   ├── lib/
│   │   │   ├── socket.ts              # Socket.IO client singleton
│   │   │   ├── utils.ts               # WPM and accuracy calculation formulas
│   │   │   └── words.ts               # Word dictionary generator
│   │   └── types/
│   │       └── index.ts               # Shared TypeScript models
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── index.ts                   # Express server entry point
│   │   ├── socket/
│   │   │   ├── room.ts                # In-memory room manager
│   │   │   └── handlers.ts            # Socket event listeners
│   │   ├── lib/
│   │   │   └── words.ts               # Server word passage generator
│   │   └── types/
│   │       └── index.ts               # Server data interfaces
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/harsh-mishra123/typeking.git
cd typeking
```

### 2. Install Dependencies

Install dependencies for both client and server applications:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## Running the Application

### Development Mode

Run the server and client in separate terminal windows:

**Start Server (Port 3001)**:
```bash
cd server
npm run dev
```

**Start Client (Port 3000)**:
```bash
cd client
npm run dev
```

Open `http://localhost:3000` in your web browser to start typing solo, or navigate to `http://localhost:3000/multiplayer` to create or join a race room.

---

## Production Build

To build the client application for production:

```bash
cd client
npm run build
npm run start
```

To build and run the server process:

```bash
cd server
npm run build
npm start
```

---

## Author

Maintained by [harsh-mishra123](https://github.com/harsh-mishra123).
