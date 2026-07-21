"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Lobby } from "@/components/multiplayer/Lobby";
import { Countdown } from "@/components/multiplayer/Countdown";
import { RaceLanes } from "@/components/multiplayer/RaceLanes";
import { Leaderboard } from "@/components/multiplayer/Leaderboard";
import { WinnerModal } from "@/components/multiplayer/WinnerModal";
import { Chat } from "@/components/multiplayer/Chat";
import { TypingArea } from "@/components/TypingArea";
import { useTypingTest } from "@/hooks/useTypingTest";

export default function MultiplayerPage() {
  const [username, setUsername] = useState("");
  const [enteredName, setEnteredName] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const {
    socket,
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
  } = useSocket();

  const currentSocketId = socket.id || "";

  const {
    words,
    currentWordIndex,
    status,
    timeLeft,
    elapsed,
    currentWpm,
    currentRawWpm,
    currentAccuracy,
    correctChars,
    totalChars,
    progress,
    handleKeyDown,
    restart,
  } = useTypingTest({
    mode: roomState?.settings.mode || "time",
    preset: roomState?.settings.value || 30,
    text: roomState?.text,
    externalTimeLeft: roomState?.timeLeft,
  });

  useEffect(() => {
    if (roomState?.status === "racing") {
      const finished = roomState.timeLeft <= 0;
      updateProgress(
        roomState.code,
        progress,
        currentWpm,
        currentRawWpm,
        currentAccuracy,
        correctChars,
        totalChars,
        finished
      );
    }
  }, [
    progress,
    currentWpm,
    currentRawWpm,
    currentAccuracy,
    correctChars,
    totalChars,
    roomState?.timeLeft,
    roomState?.status,
    roomState?.code,
    updateProgress,
  ]);

  if (!enteredName) {
    return (
      <div className="w-full max-w-md mx-auto font-mono flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">Enter Username</h2>
          <p className="text-xs text-neutral-500 mt-1">Choose a display name to join or host a race</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (username.trim()) setEnteredName(true);
          }}
          className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 flex flex-col gap-4"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type your name..."
            className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/50"
            autoFocus
          />

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 disabled:opacity-30 transition-all"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  if (!roomState) {
    return (
      <div className="w-full max-w-md mx-auto font-mono flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">Multiplayer Lobby</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Status: {connected ? <span className="text-emerald-400 font-semibold">Connected</span> : <span className="text-rose-400">Connecting...</span>}
          </p>
        </div>

        {error && <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-center">{error}</div>}

        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 flex flex-col gap-6">
          <button
            onClick={() => createRoom(username)}
            disabled={!connected}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 disabled:opacity-30 transition-all shadow-[0_0_20px_rgba(229,164,17,0.2)]"
          >
            Create New Room
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <span className="relative z-10 bg-neutral-900 px-3 text-[10px] uppercase text-neutral-500 font-semibold">or join room</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (joinCodeInput.trim()) joinRoom(joinCodeInput.trim(), username);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE"
              className="flex-1 bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 uppercase tracking-wider focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={!connected || !joinCodeInput.trim()}
              className="px-5 py-2.5 bg-neutral-800 text-neutral-200 font-bold text-xs rounded-xl hover:bg-neutral-700 disabled:opacity-30 transition-all"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    );
  }

  const winnerPlayer = roomState.winnerSocketId ? roomState.players[roomState.winnerSocketId] || null : null;
  const isHost = roomState.hostId === currentSocketId;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      {roomState.status === "countdown" && <Countdown />}

      {roomState.status === "waiting" && (
        <Lobby
          roomState={roomState}
          socketId={currentSocketId}
          onUpdateSettings={(mode, val) => updateSettings(roomState.code, mode, val)}
          onStartGame={() => startGame(roomState.code)}
        />
      )}

      {(roomState.status === "racing" || roomState.status === "finished") && (
        <div className="w-full flex flex-col gap-6">
          <RaceLanes players={roomState.players} currentSocketId={currentSocketId} />
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            status={status}
            mode={roomState.settings.mode}
            timeLeft={roomState.timeLeft}
            elapsed={elapsed}
            currentWpm={currentWpm}
            currentAccuracy={currentAccuracy}
            onKeyDown={handleKeyDown}
            onRefocus={() => {}}
          />
        </div>
      )}

      {roomState.status === "finished" && (
        <>
          <WinnerModal
            winner={winnerPlayer}
            currentSocketId={currentSocketId}
            isHost={isHost}
            onPlayAgain={() => resetRoom(roomState.code)}
          />
          <Leaderboard players={roomState.players} currentSocketId={currentSocketId} />
        </>
      )}

      <Chat messages={roomState.chat} onSendMessage={(msg) => sendMessage(roomState.code, msg)} />
    </div>
  );
}
