"use client";

import { useState } from "react";
import type { RoomState, TestMode } from "@/types";

interface LobbyProps {
  roomState: RoomState;
  socketId: string;
  onUpdateSettings: (mode: TestMode, value: number) => void;
  onStartGame: () => void;
}

const TIME_PRESETS = [15, 30, 45, 60];

export function Lobby({ roomState, socketId, onUpdateSettings, onStartGame }: LobbyProps) {
  const [copied, setCopied] = useState(false);
  const isHost = roomState.hostId === socketId;
  const players = Object.values(roomState.players);

  const copyCode = () => {
    navigator.clipboard.writeText(roomState.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto font-mono flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-semibold">room code</div>
        <button
          onClick={copyCode}
          className="text-4xl font-bold text-amber-400 tracking-wider hover:scale-105 transition-transform font-mono inline-block group"
        >
          {roomState.code}
          <span className="ml-2 text-xs font-normal text-neutral-500 group-hover:text-amber-300">
            {copied ? "(copied!)" : "(click to copy)"}
          </span>
        </button>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            players ({players.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(roomState.players).map(([sId, p]) => (
            <div
              key={sId}
              className="bg-neutral-900/80 border border-neutral-800/60 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-neutral-200">{p.name}</span>
              {sId === roomState.hostId && (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {isHost ? (
        <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 flex flex-col gap-4">
          <div className="text-sm font-semibold uppercase tracking-wider text-neutral-400">race duration (time-based)</div>
          <div className="flex items-center gap-3">
            {TIME_PRESETS.map((val) => (
              <button
                key={val}
                onClick={() => onUpdateSettings("time", val)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  roomState.settings.mode === "time" && roomState.settings.value === val
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold"
                    : "text-neutral-400 hover:text-neutral-200 border border-transparent"
                }`}
              >
                {val >= 60 ? `${val / 60}m` : `${val}s`}
              </button>
            ))}
          </div>

          <button
            onClick={onStartGame}
            className="mt-2 w-full py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(229,164,17,0.3)]"
          >
            Start Race ({roomState.settings.value}s)
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-neutral-500 italic py-4">
          Waiting for host to start the race ({roomState.settings.value}s time mode)...
        </div>
      )}
    </div>
  );
}
