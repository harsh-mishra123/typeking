export type TestMode = "time" | "words";
export type TimePreset = 15 | 30 | 45 | 60 | 120;
export type WordPreset = 10 | 25 | 50 | 100;
export type LetterState = "correct" | "incorrect" | "pending" | "extra";
export type TestStatus = "idle" | "running" | "finished";

export interface CharState {
  char: string;
  state: LetterState;
}

export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  time: number;
  mode: TestMode;
  preset: number;
  wpmHistory: number[];
  timestamp: number;
}

export interface RoomState {
  code: string;
  hostId: string;
  status: "waiting" | "countdown" | "racing" | "finished";
  settings: { mode: TestMode; value: number };
  text: string;
  timeLeft: number;
  players: Record<string, PlayerState>;
  chat: ChatMessage[];
  winnerSocketId: string | null;
}

export interface PlayerState {
  socketId?: string;
  name: string;
  progress: number;
  wpm: number;
  rawWpm?: number;
  accuracy: number;
  correctChars?: number;
  totalChars?: number;
  finished: boolean;
  finishTime: number | null;
}

export interface ChatMessage {
  id?: string;
  name: string;
  message: string;
  ts: number;
}
