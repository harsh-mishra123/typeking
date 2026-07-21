"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import type { RoomState } from "@/types";

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onRoomState(state: RoomState) {
      setRoomState(state);
      setError(null);
    }

    function onError(err: { message: string }) {
      setError(err.message);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room-state", onRoomState);
    socket.on("error", onError);

    if (!socket.connected) {
      socket.connect();
    } else {
      setConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room-state", onRoomState);
      socket.off("error", onError);
    };
  }, []);

  const createRoom = useCallback((name: string) => {
    getSocket().emit("create-room", { name });
  }, []);

  const joinRoom = useCallback((code: string, name: string) => {
    getSocket().emit("join-room", { code, name });
  }, []);

  const updateSettings = useCallback((code: string, mode: "time" | "words", value: number) => {
    getSocket().emit("update-settings", { code, mode, value });
  }, []);

  const startGame = useCallback((code: string) => {
    getSocket().emit("start-game", { code });
  }, []);

  const updateProgress = useCallback(
    (
      code: string,
      progress: number,
      wpm: number,
      rawWpm: number,
      accuracy: number,
      correctChars: number,
      totalChars: number,
      finished: boolean
    ) => {
      getSocket().emit("update-progress", {
        code,
        progress,
        wpm,
        rawWpm,
        accuracy,
        correctChars,
        totalChars,
        finished,
      });
    },
    []
  );

  const sendMessage = useCallback((code: string, message: string) => {
    getSocket().emit("chat-message", { code, message });
  }, []);

  const resetRoom = useCallback((code: string) => {
    getSocket().emit("reset-room", { code });
  }, []);

  return {
    socket: getSocket(),
    connected,
    roomState,
    error,
    createRoom,
    joinRoom,
    updateSettings,
    startGame,
    updateProgress,
    sendMessage,
    resetRoom,
  };
}
