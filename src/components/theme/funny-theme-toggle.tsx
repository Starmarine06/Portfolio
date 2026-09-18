"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { themeDisclaimers } from "@/data/constants";

export default function FunnyThemeToggle({
  className,
}: {
  className?: string;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [counter, setCounter] = React.useState({ dark: 0, light: 0 });
  const { toast } = useToast();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleTheme = async (newTheme: "dark" | "light", event?: React.MouseEvent) => {
    // Determine click position for ripple animation
    const targetElement = (event?.currentTarget as HTMLElement) || buttonRef.current;
    let x = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let y = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const right = typeof window !== "undefined" ? window.innerWidth - x : 0;
    const bottom = typeof window !== "undefined" ? window.innerHeight - y : 0;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    // Fallback if View Transitions API is not available
    // @ts-ignore
    if (typeof document === "undefined" || !document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    try {
      // @ts-ignore
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      });

      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch {
      setTheme(newTheme);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    if (isDark) {
      // Currently dark → switching to light → warn about light
      const description =
        themeDisclaimers.light[counter.light % themeDisclaimers.light.length];
      setCounter((prev) => ({ ...prev, light: prev.light + 1 }));
      toast({
        description,
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-16 md:right-4 z-[9999]",
      });
      toggleTheme("light", e);
    } else {
      // Currently light → switching to dark → welcome to the dark side
      const description =
        themeDisclaimers.dark[counter.dark % themeDisclaimers.dark.length];
      setCounter((prev) => ({ ...prev, dark: prev.dark + 1 }));
      toast({
        description,
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-16 md:right-4 z-[9999]",
      });
      toggleTheme("dark", e);
    }
  };

  // Plain <button> so the hitbox is exactly 40×40px without the custom Button
  // component's addClassNameRecursively stomping on icon sizing.
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className={cn(
        "cursor-can-hover inline-flex items-center justify-center rounded-md",
        "h-10 w-10 shrink-0",
        "bg-transparent hover:bg-accent hover:text-accent-foreground",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {/* Sun = shown in dark mode (click to go light) */}
      <Sun className={cn(
        "h-5 w-5 transition-all duration-500 pointer-events-none absolute",
        isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
      )} />
      {/* Moon = shown in light mode (click to go dark) */}
      <Moon className={cn(
        "h-5 w-5 transition-all duration-500 pointer-events-none absolute",
        isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
      )} />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
