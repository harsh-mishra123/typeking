"use client";

import { useEffect, useRef } from "react";
import type { CharState, TestStatus, TestMode } from "@/types";

interface WordState {
  chars: CharState[];
  typed: string;
}

interface TypingAreaProps {
  words: WordState[];
  currentWordIndex: number;
  status: TestStatus;
  mode: TestMode;
  timeLeft: number;
  elapsed: number;
  currentWpm: number;
  currentAccuracy: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onRefocus: () => void;
}

export function TypingArea({
  words,
  currentWordIndex,
  status,
  mode,
  timeLeft,
  elapsed,
  currentWpm,
  currentAccuracy,
  onKeyDown,
  onRefocus,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeWord = activeWordRef.current;
      const container = containerRef.current;
      const wordTop = activeWord.offsetTop;
      const containerTop = container.offsetTop;
      const relativeTop = wordTop - containerTop;

      // Scroll smoothly when active word moves past line 2
      if (relativeTop > 100) {
        container.scrollTop = relativeTop - 52;
      } else {
        container.scrollTop = 0;
      }
    }
  }, [currentWordIndex]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
    onRefocus();
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto font-mono select-none my-auto">
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        onKeyDown={onKeyDown}
        autoFocus
        tabIndex={0}
      />

      <div className="flex items-center justify-between mb-6 h-12">
        <div className="text-4xl font-bold text-amber-500 font-mono tracking-wide">
          {mode === "time" ? `${timeLeft}s` : `${currentWordIndex}/${words.length}`}
        </div>

        {status === "running" && (
          <div className="flex items-center gap-8 text-base text-neutral-400 font-mono">
            <span>
              WPM: <strong className="text-amber-400 font-semibold">{currentWpm}</strong>
            </span>
            <span>
              ACC: <strong className="text-neutral-200 font-semibold">{currentAccuracy}%</strong>
            </span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative h-[195px] overflow-hidden leading-relaxed text-2xl md:text-3xl tracking-wider flex flex-wrap gap-x-4 gap-y-4 cursor-text scroll-smooth"
      >
        {words.map((word, wIdx) => {
          const isCurrentWord = wIdx === currentWordIndex;

          return (
            <span
              key={wIdx}
              ref={isCurrentWord ? activeWordRef : null}
              className={`relative inline-flex items-center py-0.5 rounded ${
                wIdx < currentWordIndex && word.chars.some((c) => c.state === "incorrect")
                  ? "border-b-2 border-rose-500/60"
                  : ""
              }`}
            >
              {word.chars.map((c, cIdx) => {
                const isCaretHere = isCurrentWord && cIdx === word.typed.length;

                let charClass = "text-neutral-600";
                if (c.state === "correct") {
                  charClass = "text-neutral-100 font-medium";
                } else if (c.state === "incorrect") {
                  charClass = "text-rose-400 bg-rose-500/15 rounded-xs";
                } else if (c.state === "extra") {
                  charClass = "text-rose-500 font-bold bg-rose-500/20 rounded-xs";
                }

                return (
                  <span key={cIdx} className="relative">
                    {isCaretHere && (
                      <span className="absolute -left-[2px] top-1 bottom-1 w-[3px] bg-amber-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(229,164,17,0.9)]" />
                    )}
                    <span className={charClass}>{c.char}</span>
                  </span>
                );
              })}

              {isCurrentWord && word.typed.length >= word.chars.length && (
                <span className="relative">
                  <span className="absolute -left-[2px] top-1 bottom-1 w-[3px] bg-amber-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(229,164,17,0.9)]" />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
