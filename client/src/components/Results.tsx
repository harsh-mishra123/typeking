"use client";

import type { TestResult } from "@/types";
import { WpmChart } from "./WpmChart";

interface ResultsProps {
  result: TestResult;
  onRestart: () => void;
}

export function Results({ result, onRestart }: ResultsProps) {
  return (
    <div className="w-full max-w-6xl mx-auto font-mono animate-in fade-in slide-in-from-bottom-4 duration-300 my-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-1 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 text-center">
          <div className="text-xs uppercase tracking-widest text-neutral-400 mb-1 font-semibold">wpm</div>
          <div className="text-7xl font-bold text-amber-400 tracking-tight">{result.wpm}</div>
        </div>

        <div className="md:col-span-3 grid grid-cols-3 gap-6 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-8">
          <div>
            <div className="text-xs uppercase text-neutral-500 mb-1">acc</div>
            <div className="text-4xl font-semibold text-neutral-100">{result.accuracy}%</div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-500 mb-1">raw wpm</div>
            <div className="text-4xl font-semibold text-neutral-300">{result.rawWpm}</div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-500 mb-1">test type</div>
            <div className="text-4xl font-semibold text-neutral-300 capitalize">
              {result.mode} {result.preset}
            </div>
          </div>

          <div className="col-span-3 pt-6 border-t border-neutral-800/60 flex items-center gap-8 text-sm text-neutral-400">
            <span>
              characters:{" "}
              <strong className="text-neutral-200 font-semibold">
                {result.correct}/{result.incorrect}/{result.extra}/{result.missed}
              </strong>
            </span>
            <span>
              time: <strong className="text-neutral-200 font-semibold">{result.time}s</strong>
            </span>
          </div>
        </div>
      </div>

      <WpmChart wpmHistory={result.wpmHistory} height={200} />

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(229,164,17,0.15)]"
        >
          Next Test
        </button>
      </div>
    </div>
  );
}
