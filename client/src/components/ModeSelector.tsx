"use client";

import type { TestMode, TimePreset, WordPreset } from "@/types";

interface ModeSelectorProps {
  mode: TestMode;
  preset: number;
  onModeChange: (mode: TestMode) => void;
  onPresetChange: (preset: number) => void;
  disabled?: boolean;
}

const TIME_PRESETS: TimePreset[] = [15, 30, 60, 120];
const WORD_PRESETS: WordPreset[] = [10, 25, 50, 100];

export function ModeSelector({
  mode,
  preset,
  onModeChange,
  onPresetChange,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <div
      className={`mx-auto w-fit bg-neutral-900/80 border border-neutral-800/70 backdrop-blur-md rounded-2xl px-5 py-2.5 flex items-center gap-5 transition-opacity ${
        disabled ? "opacity-30 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-1 font-mono text-xs">
        <button
          onClick={() => {
            onModeChange("time");
            onPresetChange(30);
          }}
          className={`px-3 py-1 rounded-lg transition-all ${
            mode === "time"
              ? "text-amber-400 bg-amber-500/10 font-semibold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          time
        </button>
        <button
          onClick={() => {
            onModeChange("words");
            onPresetChange(25);
          }}
          className={`px-3 py-1 rounded-lg transition-all ${
            mode === "words"
              ? "text-amber-400 bg-amber-500/10 font-semibold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          words
        </button>
      </div>

      <div className="h-4 w-[1px] bg-neutral-800" />

      <div className="flex items-center gap-1 font-mono text-xs">
        {mode === "time"
          ? TIME_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => onPresetChange(p)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  preset === p
                    ? "text-amber-400 bg-amber-500/10 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {p >= 60 ? `${p / 60}m` : p}
              </button>
            ))
          : WORD_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => onPresetChange(p)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  preset === p
                    ? "text-amber-400 bg-amber-500/10 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {p}
              </button>
            ))}
      </div>
    </div>
  );
}
