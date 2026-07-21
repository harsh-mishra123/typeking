"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateText, generateTextForTime } from "@/lib/words";
import { calculateWPM, calculateRawWPM, calculateAccuracy } from "@/lib/utils";
import type { TestMode, TestStatus, TestResult, CharState } from "@/types";

interface WordState {
  chars: CharState[];
  typed: string;
}

interface UseTypingTestProps {
  mode: TestMode;
  preset: number;
  text?: string;
  externalTimeLeft?: number;
}

export function useTypingTest({ mode, preset, text: externalText, externalTimeLeft }: UseTypingTestProps) {
  const [words, setWords] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [status, setStatus] = useState<TestStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(mode === "time" ? preset : 0);
  const [elapsed, setElapsed] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const extraCharsRef = useRef(0);
  const missedCharsRef = useRef(0);
  const wpmSampleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rawText = useMemo(() => {
    if (externalText) return externalText;
    return mode === "time" ? generateTextForTime(preset) : generateText(preset);
  }, [mode, preset, externalText]);

  const initWords = useCallback((text: string) => {
    return text.split(" ").map((word) => ({
      chars: word.split("").map((char) => ({ char, state: "pending" as const })),
      typed: "",
    }));
  }, []);

  useEffect(() => {
    setWords(initWords(rawText));
    setCurrentWordIndex(0);
    setStatus("idle");
    setTimeLeft(mode === "time" ? preset : 0);
    setElapsed(0);
    setWpmHistory([]);
    setResult(null);
    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
    incorrectCharsRef.current = 0;
    extraCharsRef.current = 0;
    missedCharsRef.current = 0;
  }, [rawText, mode, preset, initWords]);

  useEffect(() => {
    if (externalTimeLeft !== undefined && mode === "time") {
      setTimeLeft(externalTimeLeft);
      if (externalTimeLeft === 0 && status === "running") {
        finishTest();
      }
    }
  }, [externalTimeLeft, mode, status]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wpmSampleRef.current) {
      clearInterval(wpmSampleRef.current);
      wpmSampleRef.current = null;
    }
  }, []);

  const finishTest = useCallback(() => {
    clearTimers();
    setStatus("finished");

    const totalTime = mode === "time" ? preset : Math.max(1, (Date.now() - startTimeRef.current) / 1000);
    const wpm = calculateWPM(correctCharsRef.current, totalTime);
    const rawWpm = calculateRawWPM(totalCharsRef.current, totalTime);
    const totalAttempted = correctCharsRef.current + incorrectCharsRef.current + extraCharsRef.current;
    const accuracy = calculateAccuracy(correctCharsRef.current, totalAttempted);

    setResult({
      wpm,
      rawWpm,
      accuracy,
      correct: correctCharsRef.current,
      incorrect: incorrectCharsRef.current,
      extra: extraCharsRef.current,
      missed: missedCharsRef.current,
      time: Math.round(totalTime),
      mode,
      preset,
      wpmHistory: [...wpmHistory],
      timestamp: Date.now(),
    });
  }, [mode, preset, wpmHistory, clearTimers]);

  const startTest = useCallback(() => {
    if (status !== "idle") return;

    setStatus("running");
    startTimeRef.current = Date.now();

    if (mode === "time" && externalTimeLeft === undefined) {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const remaining = Math.max(0, preset - elapsed);
        setTimeLeft(Math.ceil(remaining));
        setElapsed(Math.floor(elapsed));

        if (remaining <= 0) {
          finishTest();
        }
      }, 100);
    } else {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setElapsed(Math.floor(elapsed));
      }, 100);
    }

    wpmSampleRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed > 0) {
        const wpm = calculateWPM(correctCharsRef.current, elapsed);
        setWpmHistory((prev) => [...prev, wpm]);
      }
    }, 1000);
  }, [status, mode, preset, externalTimeLeft, finishTest]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (status === "finished") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;

      if (key === "Tab") {
        return;
      }

      e.preventDefault();

      if (status === "idle" && key.length === 1) {
        startTest();
      }

      if (status !== "running" && status !== "idle") return;

      setWords((prev) => {
        const updated = [...prev];
        if (currentWordIndex >= updated.length) return prev;

        const currentWord = { ...updated[currentWordIndex] };
        const chars = [...currentWord.chars];

        // Backspace key
        if (key === "Backspace") {
          if (currentWord.typed.length > 0) {
            const typed = currentWord.typed;
            const newTyped = typed.slice(0, -1);
            const originalLength = chars.filter((c) => c.state !== "extra").length;

            if (typed.length > originalLength) {
              chars.pop();
              extraCharsRef.current = Math.max(0, extraCharsRef.current - 1);
            } else {
              const idx = typed.length - 1;
              if (chars[idx].state === "incorrect") {
                incorrectCharsRef.current = Math.max(0, incorrectCharsRef.current - 1);
              } else if (chars[idx].state === "correct") {
                correctCharsRef.current = Math.max(0, correctCharsRef.current - 1);
              }
              chars[idx] = { ...chars[idx], state: "pending" };
            }

            currentWord.chars = chars;
            currentWord.typed = newTyped;
            updated[currentWordIndex] = currentWord;
            return updated;
          } else if (currentWordIndex > 0) {
            // Monkeytype allow backspacing to previous word if it has errors!
            const prevWord = updated[currentWordIndex - 1];
            const hasErrors = prevWord.chars.some((c) => c.state === "incorrect" || c.state === "extra");
            if (hasErrors) {
              setCurrentWordIndex(currentWordIndex - 1);
            }
            return prev;
          }
          return prev;
        }

        // Space key
        if (key === " ") {
          if (currentWord.typed.length === 0) return prev;

          totalCharsRef.current++;

          // Mark remaining un-typed characters as missed
          for (let i = currentWord.typed.length; i < chars.length; i++) {
            if (chars[i].state === "pending") {
              missedCharsRef.current++;
            }
          }

          currentWord.chars = chars;
          updated[currentWordIndex] = currentWord;

          const nextIndex = currentWordIndex + 1;

          if (mode === "words" && nextIndex >= updated.length) {
            setCurrentWordIndex(nextIndex);
            setTimeout(() => finishTest(), 0);
            return updated;
          }

          setCurrentWordIndex(nextIndex);
          return updated;
        }

        // Printable Character Key
        if (key.length === 1) {
          totalCharsRef.current++;
          const typedLen = currentWord.typed.length;
          const newTyped = currentWord.typed + key;
          const originalLength = chars.filter((c) => c.state !== "extra").length;

          if (typedLen >= originalLength) {
            // Extra characters
            chars.push({ char: key, state: "extra" });
            extraCharsRef.current++;
          } else {
            const isCorrect = chars[typedLen].char === key;
            chars[typedLen] = {
              ...chars[typedLen],
              state: isCorrect ? "correct" : "incorrect",
            };
            if (isCorrect) {
              correctCharsRef.current++;
            } else {
              incorrectCharsRef.current++;
            }
          }

          currentWord.chars = chars;
          currentWord.typed = newTyped;
          updated[currentWordIndex] = currentWord;

          // Word mode completion check
          if (
            mode === "words" &&
            currentWordIndex === updated.length - 1 &&
            newTyped.length >= originalLength
          ) {
            setTimeout(() => finishTest(), 0);
          }

          return updated;
        }

        return prev;
      });
    },
    [status, currentWordIndex, mode, startTest, finishTest]
  );

  const restart = useCallback(() => {
    clearTimers();
    const newText = externalText || (mode === "time" ? generateTextForTime(preset) : generateText(preset));
    setWords(initWords(newText));
    setCurrentWordIndex(0);
    setStatus("idle");
    setTimeLeft(mode === "time" ? preset : 0);
    setElapsed(0);
    setWpmHistory([]);
    setResult(null);
    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
    incorrectCharsRef.current = 0;
    extraCharsRef.current = 0;
    missedCharsRef.current = 0;
  }, [mode, preset, externalText, clearTimers, initWords]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const currentWpm = useMemo(() => {
    if (elapsed === 0) return 0;
    return calculateWPM(correctCharsRef.current, elapsed);
  }, [elapsed]);

  const currentRawWpm = useMemo(() => {
    if (elapsed === 0) return 0;
    return calculateRawWPM(totalCharsRef.current, elapsed);
  }, [elapsed]);

  const currentAccuracy = useMemo(() => {
    const totalAttempted = correctCharsRef.current + incorrectCharsRef.current + extraCharsRef.current;
    if (totalAttempted === 0) return 100;
    return calculateAccuracy(correctCharsRef.current, totalAttempted);
  }, [elapsed]);

  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    if (mode === "time" && preset > 0) {
      const elapsedSec = preset - timeLeft;
      return Math.min(100, Math.max(0, (elapsedSec / preset) * 100));
    }
    const totalChars = words.reduce((sum, w) => sum + w.chars.filter((c) => c.state !== "extra").length, 0);
    const typedChars = words.reduce((sum, w) => sum + w.typed.length, 0);
    return Math.min(100, (typedChars / totalChars) * 100);
  }, [words, mode, preset, timeLeft]);

  return {
    words,
    currentWordIndex,
    status,
    timeLeft,
    elapsed,
    wpmHistory,
    result,
    currentWpm,
    currentRawWpm,
    currentAccuracy,
    correctChars: correctCharsRef.current,
    totalChars: totalCharsRef.current,
    progress,
    handleKeyDown,
    restart,
  };
}
