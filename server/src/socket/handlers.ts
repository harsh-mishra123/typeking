import { Server, Socket } from "socket.io";
import {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  updateRoomSettings,
  determineWinner,
  serializeRoom,
} from "./room";
import { generateText } from "../lib/words";

const roomTimers = new Map<string, NodeJS.Timeout>();

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("create-room", ({ name }: { name: string }) => {
      const room = createRoom(socket.id, name);
      socket.join(room.code);
      socket.emit("room-state", serializeRoom(room));
    });

    socket.on("join-room", ({ code, name }: { code: string; name: string }) => {
      const room = joinRoom(code, socket.id, name);
      if (!room) {
        socket.emit("error", { message: "Room not found or race already started." });
        return;
      }
      socket.join(room.code);
      io.to(room.code).emit("room-state", serializeRoom(room));
    });

    socket.on("update-settings", ({ code, mode, value }: { code: string; mode: "time" | "words"; value: number }) => {
      const room = updateRoomSettings(code, socket.id, mode, value);
      if (room) {
        io.to(room.code).emit("room-state", serializeRoom(room));
      }
    });

    socket.on("start-game", ({ code }: { code: string }) => {
      const room = getRoom(code);
      if (!room || room.hostId !== socket.id || room.status !== "waiting") return;

      // Reset all players stats for new race
      for (const p of room.players.values()) {
        p.progress = 0;
        p.wpm = 0;
        p.rawWpm = 0;
        p.accuracy = 100;
        p.correctChars = 0;
        p.totalChars = 0;
        p.finished = false;
        p.finishTime = null;
      }

      room.winnerSocketId = null;
      room.status = "countdown";
      io.to(room.code).emit("room-state", serializeRoom(room));

      setTimeout(() => {
        if (room.status === "countdown") {
          room.status = "racing";
          room.timeLeft = room.settings.mode === "time" ? room.settings.value : 0;
          io.to(room.code).emit("room-state", serializeRoom(room));

          // Start room timer if time mode
          if (room.settings.mode === "time") {
            if (roomTimers.has(room.code)) {
              clearInterval(roomTimers.get(room.code)!);
            }

            const timer = setInterval(() => {
              const currentRoom = getRoom(code);
              if (!currentRoom || currentRoom.status !== "racing") {
                clearInterval(timer);
                roomTimers.delete(code);
                return;
              }

              currentRoom.timeLeft -= 1;

              if (currentRoom.timeLeft <= 0) {
                currentRoom.timeLeft = 0;
                currentRoom.status = "finished";
                for (const p of currentRoom.players.values()) {
                  p.finished = true;
                }
                currentRoom.winnerSocketId = determineWinner(currentRoom);
                clearInterval(timer);
                roomTimers.delete(code);
              }

              io.to(currentRoom.code).emit("room-state", serializeRoom(currentRoom));
            }, 1000);

            roomTimers.set(room.code, timer);
          }
        }
      }, 3000);
    });

    socket.on(
      "update-progress",
      ({
        code,
        progress,
        wpm,
        rawWpm,
        accuracy,
        correctChars,
        totalChars,
        finished,
      }: {
        code: string;
        progress: number;
        wpm: number;
        rawWpm: number;
        accuracy: number;
        correctChars: number;
        totalChars: number;
        finished: boolean;
      }) => {
        const room = getRoom(code);
        if (!room || room.status !== "racing") return;

        const player = room.players.get(socket.id);
        if (!player) return;

        player.progress = progress;
        player.wpm = wpm;
        player.rawWpm = rawWpm;
        player.accuracy = accuracy;
        player.correctChars = correctChars;
        player.totalChars = totalChars;

        if (finished && !player.finished) {
          player.finished = true;
          player.finishTime = Date.now();
        }

        const allFinished = Array.from(room.players.values()).every((p) => p.finished);
        if (allFinished) {
          room.status = "finished";
          room.winnerSocketId = determineWinner(room);
          if (roomTimers.has(room.code)) {
            clearInterval(roomTimers.get(room.code)!);
            roomTimers.delete(room.code);
          }
        }

        io.to(room.code).emit("room-state", serializeRoom(room));
      }
    );

    socket.on("reset-room", ({ code }: { code: string }) => {
      const room = getRoom(code);
      if (!room || room.hostId !== socket.id) return;

      if (roomTimers.has(room.code)) {
        clearInterval(roomTimers.get(room.code)!);
        roomTimers.delete(room.code);
      }

      room.status = "waiting";
      room.winnerSocketId = null;
      const wordCount = room.settings.mode === "time" ? 250 : room.settings.value;
      room.text = generateText(wordCount);
      for (const p of room.players.values()) {
        p.progress = 0;
        p.wpm = 0;
        p.rawWpm = 0;
        p.accuracy = 100;
        p.correctChars = 0;
        p.totalChars = 0;
        p.finished = false;
        p.finishTime = null;
      }

      io.to(room.code).emit("room-state", serializeRoom(room));
    });

    socket.on("chat-message", ({ code, message }: { code: string; message: string }) => {
      const room = getRoom(code);
      if (!room) return;

      const player = room.players.get(socket.id);
      if (!player) return;

      const msgObj = {
        id: Math.random().toString(36).substring(2, 9),
        name: player.name,
        message: message.trim(),
        ts: Date.now(),
      };

      room.chat.push(msgObj);
      if (room.chat.length > 50) room.chat.shift();

      io.to(room.code).emit("chat-message", msgObj);
    });

    socket.on("disconnect", () => {
      const result = leaveRoom(socket.id);
      if (result && result.room) {
        io.to(result.roomCode).emit("room-state", serializeRoom(result.room));
      }
    });
  });
}
