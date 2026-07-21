"use client";

import type { PlayerState } from "@/types";

interface LeaderboardProps {
  players: Record<string, PlayerState>;
  currentSocketId: string;
}

export function Leaderboard({ players, currentSocketId }: LeaderboardProps) {
  const sorted = Object.entries(players)
    .map(([sId, p]) => ({ ...p, socketId: sId }))
    .sort((a, b) => {
    if (a.finished && b.finished) {
      return (a.finishTime || 0) - (b.finishTime || 0);
    }
    if (a.finished) return -1;
    if (b.finished) return 1;
    return (b.wpm || 0) - (a.wpm || 0);
  });

  return (
    <div className="w-full max-w-2xl mx-auto font-mono flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-400 tracking-tight mb-1">Race Completed!</h2>
        <p className="text-xs text-neutral-500">Final results & player standings</p>
      </div>

      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-neutral-800/60 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <div className="col-span-2">rank</div>
          <div className="col-span-6">player</div>
          <div className="col-span-2 text-right">wpm</div>
          <div className="col-span-2 text-right">acc</div>
        </div>

        <div className="divide-y divide-neutral-800/40">
          {sorted.map((p, idx) => {
            const isSelf = p.socketId === currentSocketId;
            const rank = idx + 1;

            return (
              <div
                key={p.socketId}
                className={`grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm ${
                  isSelf ? "bg-amber-500/10 font-semibold" : ""
                }`}
              >
                <div className="col-span-2 flex items-center font-bold">
                  {rank === 1 && <span className="text-amber-400">#1</span>}
                  {rank === 2 && <span className="text-neutral-300">#2</span>}
                  {rank === 3 && <span className="text-amber-600">#3</span>}
                  {rank > 3 && <span className="text-neutral-500">#{rank}</span>}
                </div>

                <div className="col-span-6 flex items-center gap-2">
                  <span className={isSelf ? "text-amber-400" : "text-neutral-200"}>{p.name}</span>
                  {isSelf && <span className="text-xs text-amber-500/70">(you)</span>}
                </div>

                <div className="col-span-2 text-right font-bold text-amber-400">{p.wpm || 0}</div>

                <div className="col-span-2 text-right text-neutral-400">{p.accuracy || 100}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
