"use client";

import type { TestResult } from "@/types";
import { WpmChart } from "./WpmChart";

interface ResultsProps {
  result: TestResult;
  onRestart: () => void;
}

export function Results({ result, onRestart }: ResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto font-mono animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-1 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 text-center">
          <div className="text-xs uppercase tracking-widest text-neutral-400 mb-1 font-semibold">wpm</div>
          <div className="text-6xl font-bold text-amber-400 tracking-tight">{result.wpm}</div>
        </div>

        <div className="md:col-span-3 grid grid-cols-3 gap-4 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6">
          <div>
            <div className="text-xs uppercase text-neutral-500 mb-1">acc</div>
            <div className="text-3xl font-semibold text-neutral-100">{result.accuracy}%</div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-500 mb-1">raw wpm</div>
            <div className="text-3xl font-semibold text-neutral-300">{result.rawWpm}</div>
          </div>

          <div>
            <div className="text-xs uppercase text-neutral-500 mb-1">test type</div>
            <div className="text-3xl font-semibold text-neutral-300 capitalize">
              {result.mode} {result.preset}
            </div>
          </div>

          <div className="col-span-3 pt-4 border-t border-neutral-800/60 flex items-center gap-6 text-xs text-neutral-400">
            <span>
              characters:{" "}
              <strong className="text-neutral-200">
                {result.correct}/{result.incorrect}/{result.extra}/{result.missed}
              </strong>
            </span>
            <span>
              time: <strong className="text-neutral-200">{result.time}s</strong>
            </span>
          </div>
        </div>
      </div>

      <WpmChart wpmHistory={result.wpmHistory} />

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-semibold text-sm transition-all"
        >
          Next Test
        </button>
      </div>
    </div>
  );
}
