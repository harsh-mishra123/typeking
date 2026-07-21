import { Room, Player, TestMode } from "../types";
import { generateText } from "../lib/words";

const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(hostSocketId: string, hostName: string): Room {
  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const hostPlayer: Player = {
    socketId: hostSocketId,
    name: hostName || "Player 1",
    progress: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
    finished: false,
    finishTime: null,
  };

  const duration = 30; // Default 30s time mode
  const room: Room = {
    code,
    hostId: hostSocketId,
    status: "waiting",
    settings: { mode: "time", value: duration },
    text: generateText(250), // Plenty of words for 30s
    timeLeft: duration,
    players: new Map([[hostSocketId, hostPlayer]]),
    chat: [],
    createdAt: Date.now(),
    winnerSocketId: null,
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase());
}

export function joinRoom(code: string, socketId: string, name: string): Room | null {
  const room = rooms.get(code.toUpperCase());
  if (!room) return null;
  if (room.status !== "waiting") return null;

  const player: Player = {
    socketId,
    name: name || `Player ${room.players.size + 1}`,
    progress: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
    finished: false,
    finishTime: null,
  };

  room.players.set(socketId, player);
  return room;
}

export function leaveRoom(socketId: string): { roomCode: string; room?: Room } | null {
  for (const [code, room] of rooms.entries()) {
    if (room.players.has(socketId)) {
      room.players.delete(socketId);

      if (room.players.size === 0) {
        rooms.delete(code);
        return { roomCode: code };
      }

      if (room.hostId === socketId) {
        const nextHost = room.players.keys().next().value;
        if (nextHost) {
          room.hostId = nextHost;
        }
      }

      return { roomCode: code, room };
    }
  }
  return null;
}

export function updateRoomSettings(
  code: string,
  hostSocketId: string,
  mode: TestMode,
  value: number
): Room | null {
  const room = rooms.get(code.toUpperCase());
  if (!room || room.hostId !== hostSocketId || room.status !== "waiting") return null;

  room.settings = { mode, value };
  room.timeLeft = mode === "time" ? value : 0;
  const wordCount = mode === "time" ? Math.max(150, Math.ceil((120 / 60) * value * 2)) : value;
  room.text = generateText(wordCount);

  return room;
}

export function determineWinner(room: Room): string | null {
  let winner: Player | null = null;

  for (const player of room.players.values()) {
    if (!winner) {
      winner = player;
      continue;
    }
    // Highest WPM wins. If tie, higher accuracy wins.
    if (player.wpm > winner.wpm) {
      winner = player;
    } else if (player.wpm === winner.wpm && player.accuracy > winner.accuracy) {
      winner = player;
    }
  }

  return winner ? winner.socketId : null;
}

export function serializeRoom(room: Room) {
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    settings: room.settings,
    text: room.text,
    timeLeft: room.timeLeft,
    players: Object.fromEntries(room.players.entries()),
    chat: room.chat,
    winnerSocketId: room.winnerSocketId,
  };
}
