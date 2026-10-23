"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy, Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

const SOCIALS = [
  { name: "LinkedIn", href: config.social.linkedin, icon: FaLinkedin },
  { name: "GitHub", href: config.social.github, icon: FaGithub },
  { name: "Instagram", href: config.social.instagram, icon: FaInstagram },
];

const chip =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2.5 text-sm font-medium sm:flex-none sm:px-4 sm:py-2 text-foreground backdrop-blur-md transition-colors hover:border-cyan-500/60 hover:bg-cyan-500/10";

const ContactLinks = ({ className }: { className?: string }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      setCopied(true);
      toast({ description: "Email copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${config.email}`;
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-background/60 backdrop-blur-md sm:w-auto">
        <a
          href={`mailto:${config.email}`}
          className="flex min-w-0 flex-1 items-center gap-2 py-2.5 pl-4 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-cyan-500/10 sm:py-2"
        >
          <Mail className="h-4 w-4 shrink-0 text-cyan-500" />
          <span className="truncate">{config.email}</span>
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy email address"
          className="flex h-11 w-12 shrink-0 items-center justify-center border-l border-border sm:h-9 sm:w-10 text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {SOCIALS.map(({ name, href, icon: Icon }) => (
        <Link key={name} href={href} target="_blank" rel="noopener noreferrer" className={chip} aria-label={name}>
          <Icon className="h-4 w-4" />
          <span>{name}</span>
        </Link>
      ))}
    </div>
  );
};

export default ContactLinks;
