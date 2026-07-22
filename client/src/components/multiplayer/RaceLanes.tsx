"use client";

import type { PlayerState } from "@/types";

interface RaceLanesProps {
  players: Record<string, PlayerState>;
  currentSocketId: string;
}

export function RaceLanes({ players, currentSocketId }: RaceLanesProps) {
  const playerList = Object.entries(players).map(([sId, p]) => ({ ...p, socketId: sId }));

  return (
    <div className="w-full max-w-6xl mx-auto font-mono flex flex-col gap-3.5 mb-8">
      {playerList.map((p) => {
        const isSelf = p.socketId === currentSocketId;
        const progress = Math.min(100, Math.max(0, p.progress || 0));

        return (
          <div
            key={p.socketId}
            className={`relative overflow-hidden rounded-2xl border p-4 flex items-center justify-between transition-all ${
              isSelf
                ? "bg-neutral-900/80 border-amber-500/50 shadow-[0_0_20px_rgba(229,164,17,0.15)]"
                : "bg-neutral-900/40 border-neutral-800/60"
            }`}
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-amber-500/15 border-r-2 border-amber-500/50 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <span className={`text-base font-semibold ${isSelf ? "text-amber-400" : "text-neutral-200"}`}>
                {p.name} {isSelf && "(you)"}
              </span>
              {p.finished && (
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  finished
                </span>
              )}
            </div>

            <div className="relative z-10 flex items-center gap-6 text-sm font-mono">
              <span className="text-neutral-400">
                <strong className="text-neutral-100 font-semibold">{p.wpm || 0}</strong> WPM
              </span>
              <span className="text-neutral-500 font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
