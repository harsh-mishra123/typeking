"use client";

import { useCallback, useRef, useState } from "react";

interface TimerState {
  timeLeft: number;
  elapsed: number;
  isRunning: boolean;
}

export function useTimer(initialTime: number, onEnd?: () => void) {
  const [state, setState] = useState<TimerState>({
    timeLeft: initialTime,
    elapsed: 0,
    isRunning: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;

    startTimeRef.current = Date.now();
    setState((prev) => ({ ...prev, isRunning: true }));

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const timeLeft = Math.max(0, initialTime - elapsed);

      setState({ timeLeft, elapsed, isRunning: timeLeft > 0 });

      if (timeLeft <= 0) {
        clear();
        onEnd?.();
      }
    }, 100);
  }, [initialTime, onEnd, clear]);

  const reset = useCallback(
    (newTime?: number) => {
      clear();
      const t = newTime ?? initialTime;
      setState({ timeLeft: t, elapsed: 0, isRunning: false });
    },
    [initialTime, clear]
  );

  return { ...state, start, reset, clear };
}
