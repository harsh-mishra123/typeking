"use client";

import { useEffect, useState } from "react";
import { ModeSelector } from "@/components/ModeSelector";
import { TypingArea } from "@/components/TypingArea";
import { Results } from "@/components/Results";
import { RestartButton } from "@/components/RestartButton";
import { useTypingTest } from "@/hooks/useTypingTest";
import { useLocalHistory } from "@/hooks/useLocalHistory";
import type { TestMode } from "@/types";

export default function SoloPage() {
  const [mode, setMode] = useState<TestMode>("time");
  const [preset, setPreset] = useState<number>(30);

  const {
    words,
    currentWordIndex,
    status,
    timeLeft,
    elapsed,
    result,
    currentWpm,
    currentAccuracy,
    handleKeyDown,
    restart,
  } = useTypingTest({ mode, preset });

  const { addResult } = useLocalHistory();

  useEffect(() => {
    if (result) {
      addResult(result);
    }
  }, [result, addResult]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        restart();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [restart]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8">
      {status !== "finished" && (
        <ModeSelector
          mode={mode}
          preset={preset}
          onModeChange={setMode}
          onPresetChange={setPreset}
          disabled={status === "running"}
        />
      )}

      {status !== "finished" ? (
        <div className="w-full flex flex-col gap-6">
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            status={status}
            mode={mode}
            timeLeft={timeLeft}
            elapsed={elapsed}
            currentWpm={currentWpm}
            currentAccuracy={currentAccuracy}
            onKeyDown={handleKeyDown}
            onRefocus={() => {}}
          />
          <RestartButton onRestart={restart} />
        </div>
      ) : (
        result && <Results result={result} onRestart={restart} />
      )}
    </div>
  );
}
