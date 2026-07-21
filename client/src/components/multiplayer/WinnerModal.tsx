"use client";

import type { PlayerState } from "@/types";

interface WinnerModalProps {
  winner: PlayerState | null;
  currentSocketId: string;
  isHost: boolean;
  onPlayAgain: () => void;
}

export function WinnerModal({ winner, currentSocketId, isHost, onPlayAgain }: WinnerModalProps) {
  if (!winner) return null;

  const isYou = winner.socketId === currentSocketId;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in fade-in duration-300">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">
          👑
        </div>

        <div className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">
          {isYou ? "victory!" : "race finished"}
        </div>

        <h2 className="text-3xl font-bold text-neutral-100 mb-2">
          {isYou ? <span className="text-amber-400">You Won!</span> : `${winner.name} Won!`}
        </h2>

        <p className="text-xs text-neutral-400 mb-6">
          Finished with the highest typing speed and best accuracy
        </p>

        <div className="grid grid-cols-2 gap-3 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4 mb-6">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 font-semibold mb-0.5">wpm</div>
            <div className="text-2xl font-bold text-amber-400">{winner.wpm}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-neutral-500 font-semibold mb-0.5">accuracy</div>
            <div className="text-2xl font-bold text-neutral-100">{winner.accuracy}%</div>
          </div>
        </div>

        {isHost ? (
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(229,164,17,0.3)]"
          >
            Play Again
          </button>
        ) : (
          <div className="text-xs text-neutral-500 italic">
            Waiting for host to start another race...
          </div>
        )}
      </div>
    </div>
  );
}
