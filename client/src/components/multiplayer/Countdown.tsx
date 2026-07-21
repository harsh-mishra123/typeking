"use client";

import { useEffect, useState } from "react";

export function Countdown() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center font-mono">
      <div className="text-center animate-in zoom-in-75 duration-200">
        <div className="text-8xl font-black text-amber-400 tracking-tighter drop-shadow-[0_0_25px_rgba(229,164,17,0.5)]">
          {count > 0 ? count : "GO!"}
        </div>
        <div className="text-xs uppercase tracking-widest text-neutral-400 mt-4">
          Get ready to type...
        </div>
      </div>
    </div>
  );
}
