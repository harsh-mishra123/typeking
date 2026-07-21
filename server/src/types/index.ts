export type TestMode = "time" | "words";

export interface Room {
  code: string;
  hostId: string;
  status: "waiting" | "countdown" | "racing" | "finished";
  settings: { mode: TestMode; value: number }; // value = duration in seconds (15, 30, 45, 60) or word count
  text: string;
  timeLeft: number;
  players: Map<string, Player>;
  chat: ChatMessage[];
  createdAt: number;
  winnerSocketId: string | null;
}

export interface Player {
  socketId: string;
  name: string;
  progress: number; // percentage 0-100
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  finished: boolean;
  finishTime: number | null;
}

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  ts: number;
}
