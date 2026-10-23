"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { config } from "@/data/config";

const TOPICS = ["Project", "Internship", "Collaboration", "Just saying hi"] as const;
const MAX = 1000;
const MIN = 10;

type Status = "idle" | "sending" | "sent";

const fieldBase =
  "peer w-full rounded-xl border border-border bg-background/60 px-4 pt-6 pb-2 text-base text-foreground " +
  "placeholder-transparent outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

// A span, not a <label>: the home page forces every <label> to position: relative.
const floating =
  "pointer-events-none absolute left-4 top-4 z-[81] origin-left text-sm text-muted-foreground transition-all duration-200 " +
  "peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-cyan-500 " +
  "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]";

const ContactForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [topic, setTopic] = useState<(typeof TOPICS)[number] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const { toast } = useToast();

  const ready = fullName.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && message.trim().length >= MIN;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          message: topic ? `[${topic}] ${message.trim()}` : message.trim(),
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const err = new Error(data.error || "send failed");
        (err as Error & { status?: number }).status = res.status;
        throw err;
      }
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      const status = (err as { status?: number }).status;
      toast({
        title: "Couldn't send that",
        description:
          status === 400
            ? (err as Error).message
            : `Something went wrong on my end. Please email me directly at ${config.email}.`,
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setFullName("");
    setEmail("");
    setMessage("");
    setWebsite("");
    setTopic(null);
    setStatus("idle");
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-4 py-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/40"
          >
            <Check className="h-8 w-8 text-green-500" />
          </motion.div>
          <h3 className="text-2xl font-bold text-foreground">Message sent</h3>
          <p className="max-w-xs text-sm text-muted-foreground">
            Thanks for reaching out. I&apos;ll reply to {email || "you"} soon.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-cyan-500/60 hover:bg-cyan-500/10"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <input
                id="cf-name"
                aria-label="Full name"
                className={fieldBase}
                placeholder=" "
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <span className={floating}>Full name</span>
            </div>
            <div className="relative">
              <input
                id="cf-email"
                aria-label="Email address"
                className={fieldBase}
                placeholder=" "
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className={floating}>Email address</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="What is this about?">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={topic === t}
                onClick={() => setTopic((cur) => (cur === t ? null : t))}
                className={cn(
                  "rounded-full border px-3.5 py-2.5 text-xs font-medium transition-colors sm:py-1.5",
                  topic === t
                    ? "border-cyan-500 bg-cyan-500 text-black"
                    : "border-border bg-background/60 text-muted-foreground hover:border-cyan-500/60 hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              id="cf-message"
              aria-label="Your message"
              className={cn(fieldBase, "min-h-[140px] resize-y pt-7")}
              placeholder=" "
              rows={5}
              maxLength={MAX}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <span className={floating}>Tell me about your project or idea</span>
            <span className="pointer-events-none absolute bottom-2 right-3 z-[81] text-[11px] tabular-nums text-muted-foreground">
              {message.length} / {MAX}
            </span>
          </div>

          <button
            type="submit"
            disabled={!ready || status === "sending"}
            className={cn(
              "group flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
              ready
                ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.99]"
                : "cursor-not-allowed bg-secondary text-muted-foreground"
            )}
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending
              </>
            ) : (
              <>
                Send message <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            I&apos;ll never share your data with anyone else. Pinky promise!
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;
