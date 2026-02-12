"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = resolvedTheme === "dark";
    const characters = isDark
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}[]<>@"
      : "01";
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      // Background color based on theme
      ctx.fillStyle = isDark
        ? "rgba(0, 5, 15, 0.15)"
        : "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "bold " + fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );

        // Colors based on theme
        if (isDark) {
          if (Math.random() > 0.95) {
            ctx.fillStyle = "#e0f7ff";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#00f0ff";
          } else {
            ctx.fillStyle = "#00a2ff";
            ctx.shadowBlur = 5;
            ctx.shadowColor = "#0055ff";
          }
        } else {
          // Light mode: Black characters, no glow or slight gray glow
          if (Math.random() > 0.95) {
            ctx.fillStyle = "#000000";
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "#333333";
            ctx.shadowBlur = 0;
          }
          ctx.shadowColor = "transparent";
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 1.2;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newColumns = Math.floor(width / fontSize);
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-80 dark:opacity-30"
    />
  );
};

export default MatrixBackground;
