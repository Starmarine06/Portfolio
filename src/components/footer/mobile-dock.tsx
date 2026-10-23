"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, Check, FileText, Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";

type App = {
  name: string;
  href: string;
  icon: React.ReactNode;
  bg: string;
  external?: boolean;
};

// Phone-only footer: the links laid out like app icons on a home-screen dock.
const MobileDock = () => {
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();

  const apps: App[] = [
    { name: "LinkedIn", href: config.social.linkedin, icon: <FaLinkedin />, bg: "from-sky-500 to-blue-700", external: true },
    { name: "GitHub", href: config.social.github, icon: <FaGithub />, bg: "from-neutral-600 to-neutral-900", external: true },
    { name: "Instagram", href: config.social.instagram, icon: <FaInstagram />, bg: "from-fuchsia-500 via-rose-500 to-amber-400", external: true },
    { name: "Résumé", href: config.resume, icon: <FileText />, bg: "from-emerald-500 to-teal-700", external: true },
  ];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${config.email}`;
    }
  };

  const toTop = () => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const tile = "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-lg shadow-black/30 transition-transform active:scale-90";

  return (
    <footer className="pointer-events-auto relative z-[90] px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-10 md:hidden">
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Find me on
      </p>

      {/* the dock */}
      <div className="mx-auto max-w-sm rounded-[2rem] border border-border bg-card/70 p-4 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-2">
          <button type="button" onClick={copyEmail} aria-label="Copy email address" className="flex flex-col items-center gap-1.5">
            <span className={cn(tile, copied ? "from-green-500 to-emerald-700" : "from-cyan-500 to-indigo-600")}>
              {copied ? <Check /> : <Mail />}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">{copied ? "Copied" : "Email"}</span>
          </button>

          {apps.map((a) => (
            <Link
              key={a.name}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              rel={a.external ? "noopener noreferrer" : undefined}
              aria-label={a.name}
              className="flex flex-col items-center gap-1.5"
            >
              <span className={cn(tile, a.bg)}>{a.icon}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{a.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={toTop}
          className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2.5 text-xs font-medium text-foreground backdrop-blur-md active:scale-95"
        >
          <ArrowUp className="h-4 w-4" /> Back to top
        </button>
      </div>

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        © {year} {config.author}. All rights reserved.
      </p>
    </footer>
  );
};

export default MobileDock;
