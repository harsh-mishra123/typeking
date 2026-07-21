"use client";

interface RestartButtonProps {
  onRestart: () => void;
}

export function RestartButton({ onRestart }: RestartButtonProps) {
  return (
    <button
      tabIndex={-1}
      onClick={onRestart}
      className="p-3 rounded-full hover:bg-neutral-800/60 text-neutral-500 hover:text-amber-400 transition-all group mx-auto block outline-none"
      title="Restart test (Tab + Enter)"
    >
      <svg
        className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}
