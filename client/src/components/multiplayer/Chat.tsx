"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types";

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
}

export function Chat({ messages, onSendMessage }: ChatProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-mono">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-xs font-semibold text-amber-400 hover:border-amber-500/50 shadow-lg transition-all"
        >
          Chat ({messages.length})
        </button>
      ) : (
        <div className="w-80 h-96 bg-neutral-900/95 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-3 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/40">
            <span className="text-xs font-semibold text-neutral-300">Room Chat</span>
            <button
              onClick={() => setOpen(false)}
              className="text-neutral-500 hover:text-neutral-300 text-xs px-2 py-0.5"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 text-xs">
            {messages.length === 0 ? (
              <div className="text-neutral-600 italic text-center my-auto">No messages yet...</div>
            ) : (
              messages.map((m, idx) => (
                <div key={m.id || idx} className="bg-neutral-950/40 p-2 rounded-lg border border-neutral-800/40">
                  <div className="text-[10px] text-amber-500/80 font-bold mb-0.5">{m.name}</div>
                  <div className="text-neutral-200 break-words">{m.message}</div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-2 border-t border-neutral-800/80 bg-neutral-950/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
