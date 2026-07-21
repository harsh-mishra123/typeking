"use client";

import { useEffect, useRef } from "react";

interface WpmChartProps {
  wpmHistory: number[];
  height?: number;
}

export function WpmChart({ wpmHistory, height = 180 }: WpmChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || wpmHistory.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 600;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxWpm = Math.max(...wpmHistory, 60);
    const minWpm = 0;

    ctx.clearRect(0, 0, width, height);

    // Draw horizontal grid lines
    const gridCount = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.textAlign = "right";

    for (let i = 0; i <= gridCount; i++) {
      const val = Math.round(minWpm + ((maxWpm - minWpm) / gridCount) * i);
      const y = padding.top + chartH - (i / gridCount) * chartH;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      ctx.fillText(val.toString(), padding.left - 8, y + 3);
    }

    // Calculate points
    const points = wpmHistory.map((val, idx) => {
      const x = padding.left + (idx / (wpmHistory.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - minWpm) / (maxWpm - minWpm)) * chartH;
      return { x, y };
    });

    // Draw gradient under line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, "rgba(229, 164, 17, 0.25)");
    gradient.addColorStop(1, "rgba(229, 164, 17, 0.0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.lineTo(points[0].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw WPM line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = "#e5a411";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw points
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#e5a411";
      ctx.fill();
    });
  }, [wpmHistory, height]);

  if (wpmHistory.length < 2) return null;

  return (
    <div className="w-full bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 mt-6">
      <canvas ref={canvasRef} style={{ width: "100%", height }} />
    </div>
  );
}
