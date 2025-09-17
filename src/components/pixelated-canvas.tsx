"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, memo } from "react";

interface PixelatedCanvasProps {
  isActive: boolean;
  className?: string;
  size?: number;
  duration?: number;
  fillColor?: string;
  backgroundColor?: string;
}

const PixelatedCanvasComponent: React.FC<PixelatedCanvasProps> = ({
  isActive,
  className = "",
  size = 4,
  duration = 2500,
  fillColor = "var(--color-brand, #f17463)",
  backgroundColor = "var(--color-gray-200, white)",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filledSquares, setFilledSquares] = useState<Set<number>>(new Set());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const SQUARE_SIZE = size;

  const resolveColor = (color: string): string => {
    if (typeof window !== "undefined" && canvasRef.current) {
      const div = document.createElement("div");
      div.style.color = color;
      document.body.appendChild(div);
      const computedColor = window.getComputedStyle(div).color;
      document.body.removeChild(div);
      return computedColor;
    }
    return color;
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setFilledSquares(new Set());
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    // Calculate grid dimensions
    const cols = Math.floor(dimensions.width / SQUARE_SIZE);
    const rows = Math.floor(dimensions.height / SQUARE_SIZE);
    const totalSquares = cols * rows;

    if (totalSquares === 0) return;

    // Limit total squares for better performance
    const maxSquares = 2000;
    const limitedSquares = Math.min(totalSquares, maxSquares);

    const allSquares = Array.from({ length: limitedSquares }, (_, i) => i);
    const shuffledSquares = [...allSquares].sort(() => Math.random() - 0.5);

    const fillDuration = duration;
    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fillDuration, 1);
      const targetIndex = Math.floor(progress * shuffledSquares.length);

      const newFilledSquares = new Set<number>();
      for (let i = 0; i < targetIndex; i++) {
        newFilledSquares.add(shuffledSquares[i]);
      }

      setFilledSquares(newFilledSquares);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    // Use setTimeout instead of requestAnimationFrame for better performance
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 16);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, dimensions, duration, SQUARE_SIZE]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      canvas.width !== dimensions.width ||
      canvas.height !== dimensions.height
    ) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    }

    const cols = Math.floor(dimensions.width / SQUARE_SIZE);
    const rows = Math.floor(dimensions.height / SQUARE_SIZE);

    ctx.fillStyle = resolveColor(backgroundColor);
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.fillStyle = resolveColor(fillColor);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const squareIndex = row * cols + col;

        if (filledSquares.has(squareIndex)) {
          const x = col * SQUARE_SIZE;
          const y = row * SQUARE_SIZE;

          // Apply a vertical fade: fully visible near the top, gradually
          // decreasing opacity towards the bottom to create a gradient look.
          const verticalProgress = y / Math.max(1, dimensions.height);
          const opacity = Math.max(0, 1 - verticalProgress * 0.85);
          ctx.globalAlpha = opacity;
          ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        }
      }
    }
    ctx.globalAlpha = 1;
  }, [filledSquares, dimensions, fillColor, backgroundColor, SQUARE_SIZE]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{ imageRendering: "pixelated" }}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export const PixelatedCanvas = memo(PixelatedCanvasComponent);
