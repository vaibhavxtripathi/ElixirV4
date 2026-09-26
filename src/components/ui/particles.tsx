"use client";

import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [255, 255, 255];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef<number | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

  const rgb = useMemo(() => hexToRgb(color), [color]);

  const createCircle = useCallback((): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: Math.random() * 0.6 + 0.1,
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  }, [size]);

  const resizeCanvas = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !context.current) return;

    canvasSize.current.w = containerRef.current.offsetWidth;
    canvasSize.current.h = containerRef.current.offsetHeight;

    canvasRef.current.width = canvasSize.current.w * dpr;
    canvasRef.current.height = canvasSize.current.h * dpr;
    canvasRef.current.style.width = `${canvasSize.current.w}px`;
    canvasRef.current.style.height = `${canvasSize.current.h}px`;
    context.current.scale(dpr, dpr);

    circles.current = Array.from({ length: quantity }, () => createCircle());
  }, [dpr, quantity, createCircle]);

  const animate = useCallback(() => {
    if (!context.current) return;

    const ctx = context.current;
    const { w, h } = canvasSize.current;
    ctx.clearRect(0, 0, w, h);

    const particleList = circles.current;
    const [r, g, b] = rgb;

    for (let i = 0; i < particleList.length; i++) {
      const c = particleList[i];

      // Fade out near edges
      const px = c.x + c.translateX;
      const py = c.y + c.translateY;
      const distEdge = Math.min(px - c.size, w - px - c.size, py - c.size, h - py - c.size);
      const edgeFactor = Math.max(0, Math.min(1, distEdge / 20));

      if (edgeFactor >= 1) {
        c.alpha = Math.min(c.targetAlpha, c.alpha + 0.02);
      } else {
        c.alpha = c.targetAlpha * edgeFactor;
      }

      c.x += c.dx + vx;
      c.y += c.dy + vy;
      c.translateX += (mouse.current.x / (staticity / c.magnetism) - c.translateX) / ease;
      c.translateY += (mouse.current.y / (staticity / c.magnetism) - c.translateY) / ease;

      // Draw particle
      ctx.translate(c.translateX, c.translateY);
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${c.alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Respawn when off-screen
      if (c.x < -c.size || c.x > w + c.size || c.y < -c.size || c.y > h + c.size) {
        particleList[i] = createCircle();
      }
    }

    rafID.current = window.requestAnimationFrame(animate);
  }, [rgb, vx, vy, staticity, ease, dpr, createCircle]);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    resizeCanvas();

    if (rafID.current != null) {
      window.cancelAnimationFrame(rafID.current);
    }
    rafID.current = window.requestAnimationFrame(animate);

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;
      if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    };

    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(resizeCanvas, 200);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (rafID.current != null) window.cancelAnimationFrame(rafID.current);
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [resizeCanvas, animate]);

  useEffect(() => {
    resizeCanvas();
  }, [refresh, resizeCanvas]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={containerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
