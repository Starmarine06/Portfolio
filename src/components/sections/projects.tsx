"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink, Github } from "lucide-react";
import projects, { Project, ProjectGroup, Skill } from "@/data/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { FloatingDock } from "../ui/floating-dock";
import { useOptionalSectionContext } from "@/contexts/section-context";
import { Button } from "../ui/button";

const GROUPS: ProjectGroup[] = ["AI & Systems", "Tools", "Games & Mods", "Web"];

const GROUP_ART: Record<ProjectGroup, string> = {
  "AI & Systems": "from-cyan-500/40 via-blue-600/25 to-transparent",
  Tools: "from-violet-500/40 via-fuchsia-600/20 to-transparent",
  "Games & Mods": "from-rose-500/40 via-orange-500/20 to-transparent",
  Web: "from-emerald-500/40 via-teal-600/20 to-transparent",
};

const slug = (g: ProjectGroup) => g.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

const ProjectsSection = () => {
  const sectionCtx = useOptionalSectionContext();
  const isInactive = sectionCtx ? sectionCtx.activeSection !== "projects" : false;
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [collapsed, setCollapsed] = useState<ProjectGroup[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = GROUPS.flatMap((g) =>
    projects.filter((p) => p.group === g && (showAll || p.featured))
  );
  const active = visible.find((p) => p.id === selectedId) ?? visible[0];
  const hiddenCount = projects.length - projects.filter((p) => p.featured).length;
  const isCollapsed = (g: ProjectGroup) => collapsed.includes(g);

  const toggleGroup = (g: ProjectGroup) =>
    setCollapsed((c) => (c.includes(g) ? c.filter((x) => x !== g) : [...c, g]));

  const reopen = () => {
    setClosed(false);
    setMinimized(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const nav = visible.filter((p) => !isCollapsed(p.group));
    if (!nav.length) return;
    const i = nav.findIndex((p) => p.id === active.id);
    const step = e.key === "ArrowDown" ? 1 : -1;
    const next = nav[(i + step + nav.length) % nav.length];
    setSelectedId(next.id);
    listRef.current?.querySelector<HTMLElement>(`[data-id="${next.id}"]`)?.focus();
  };

  return (
    <SectionWrapper
      id="projects"
      className={cn("max-w-6xl mx-auto py-12 md:py-20 px-4 sm:px-6", isInactive && "pointer-inactive")}
    >
      <SectionHeader
        id="projects"
        title="Featured Projects"
        desc="Pick a file from the explorer to see what I built, how, and what it runs on."
        className="md:static mb-8 sm:mb-10 md:mb-[270px] lg:mb-[300px]"
      />

      <div className="hidden lg:block">
      <AnimatePresence mode="wait" initial={false}>
        {closed ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="pointer-events-auto flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center backdrop-blur-md"
          >
            <p className="font-mono text-sm text-muted-foreground">[process exited with code 0]</p>
            <Button
              variant="outline"
              onClick={reopen}
              className="rounded-full font-mono text-xs uppercase tracking-wider"
            >
              $ reopen projects
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "pointer-events-auto overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-xl transition-[margin] duration-500",
              zoomed && "lg:-mx-16 xl:-mx-32"
            )}
          >
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
              <div className="group/lights flex items-center gap-2">
                <TrafficLight
                  label="Close projects"
                  glyph="×"
                  color="bg-red-500"
                  onClick={() => setClosed(true)}
                />
                <TrafficLight
                  label={minimized ? "Restore projects" : "Minimize projects"}
                  glyph={minimized ? "+" : "−"}
                  color="bg-yellow-500"
                  onClick={() => setMinimized((m) => !m)}
                />
                <TrafficLight
                  label={zoomed ? "Shrink window" : "Expand window"}
                  glyph={zoomed ? "−" : "+"}
                  color="bg-green-500"
                  onClick={() => {
                    setMinimized(false);
                    setZoomed((z) => !z);
                  }}
                />
              </div>
              <span className="ml-3 min-w-0 truncate font-mono text-xs text-muted-foreground">
                ~/projects/{active ? `${slug(active.group)}/${active.file}` : ""}
              </span>
              <span className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
                {visible.length} projects
              </span>
            </div>

            <AnimatePresence initial={false}>
              {!minimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid lg:grid-cols-[250px_1fr]">
                    {/* explorer */}
                    <div
                      ref={listRef}
                      onKeyDown={onKeyDown}
                      role="tablist"
                      aria-orientation="vertical"
                      className="flex gap-1 overflow-x-auto border-b border-border p-2 no-scrollbar lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-3"
                    >
                      <span className="hidden px-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground lg:block">
                        Explorer
                      </span>
                      {GROUPS.map((g) => {
                        const items = visible.filter((p) => p.group === g);
                        if (!items.length) return null;
                        const folded = isCollapsed(g);
                        return (
                          <React.Fragment key={g}>
                            <button
                              onClick={() => toggleGroup(g)}
                              aria-expanded={!folded}
                              className="mt-2 hidden cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:flex"
                            >
                              <ChevronDown
                                className={cn("h-3 w-3 transition-transform duration-200", folded && "-rotate-90")}
                              />
                              {slug(g)}/
                              {folded && (
                                <span className="ml-auto rounded-full bg-secondary px-1.5 text-[10px]">
                                  {items.length}
                                </span>
                              )}
                            </button>
                            {items.map((p) => (
                              <button
                                key={p.id}
                                data-id={p.id}
                                role="tab"
                                aria-selected={p.id === active.id}
                                tabIndex={p.id === active.id ? 0 : -1}
                                onClick={() => setSelectedId(p.id)}
                                className={cn(
                                  "shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3.5 py-2.5 text-left font-mono text-xs transition-colors lg:ml-3 lg:px-3 lg:py-1.5",
                                  folded && "lg:hidden",
                                  p.id === active.id
                                    ? "bg-cyan-500/15 text-cyan-600 ring-1 ring-cyan-500/40 dark:text-cyan-300"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                              >
                                {p.file}
                              </button>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* editor pane */}
                    <div className={cn("min-w-0 transition-[min-height] duration-500", zoomed ? "min-h-[680px]" : "min-h-[520px]")}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ProjectPane project={active} />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <div className="lg:hidden">
        <MobileProjects visible={visible} active={active} onSelect={setSelectedId} />
      </div>

      {hiddenCount > 0 && (
        <div className="pointer-events-auto mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="gap-2 rounded-full bg-background/60 font-mono text-xs uppercase tracking-wider backdrop-blur-md"
          >
            {showAll ? "Show featured only" : `Show ${hiddenCount} more projects`}
            <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
          </Button>
        </div>
      )}
    </SectionWrapper>
  );
};

const CARD_W = 268;

const MobileProjects = ({
  visible,
  active,
  onSelect,
}: {
  visible: Project[];
  active: Project;
  onSelect: (id: string) => void;
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout>>();
  const [group, setGroup] = useState<ProjectGroup | "All">("All");

  const list = group === "All" ? visible : visible.filter((p) => p.group === group);
  const current = list.find((p) => p.id === active.id) ?? list[0];
  const groups = GROUPS.filter((g) => visible.some((p) => p.group === g));
  const index = Math.max(0, list.findIndex((p) => p.id === current?.id));

  const pickGroup = (g: ProjectGroup | "All") => {
    setGroup(g);
    const next = g === "All" ? visible : visible.filter((p) => p.group === g);
    if (next[0]) onSelect(next[0].id);
    scroller.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  // the card closest to the centre of the strip becomes the selected project
  const onScroll = () => {
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const el = scroller.current;
      if (!el) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = -1;
      let bestD = Infinity;
      el.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best >= 0 && list[best] && list[best].id !== active.id) onSelect(list[best].id);
    }, 110);
  };

  const go = (i: number) => {
    const target = list[Math.min(Math.max(i, 0), list.length - 1)];
    scroller.current
      ?.querySelector<HTMLElement>(`[data-card="${target.id}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  if (!current) return null;

  return (
    <div className="pointer-events-auto">
      {/* category chips */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar" data-lenis-prevent>
        {(["All", ...groups] as const).map((g) => (
          <button
            key={g}
            onClick={() => pickGroup(g)}
            aria-pressed={group === g}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
              group === g
                ? "border-cyan-400 bg-cyan-500 text-black"
                : "border-border bg-background/60 text-muted-foreground"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* swipeable cards */}
      <div
        ref={scroller}
        onScroll={onScroll}
        data-lenis-prevent
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 no-scrollbar"
        style={{ paddingInline: `calc(50% - ${CARD_W / 2}px)`, scrollPaddingInline: `calc(50% - ${CARD_W / 2}px)` }}
      >
        {list.map((p) => {
          const on = p.id === current.id;
          return (
            <button
              key={p.id}
              data-card={p.id}
              onClick={() => go(list.indexOf(p))}
              aria-label={p.title}
              aria-current={on}
              style={{ width: CARD_W }}
              className={cn(
                "relative shrink-0 snap-center overflow-hidden rounded-2xl border bg-card/80 text-left backdrop-blur-md transition-all duration-300",
                on ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10" : "scale-[0.93] border-border opacity-60"
              )}
            >
              <div className="relative aspect-[16/9] w-full bg-neutral-900">
                {p.src ? (
                  <Image src={p.src} alt="" fill sizes={`${CARD_W}px`} className="object-cover" />
                ) : (
                  <div className={cn("absolute inset-0 bg-gradient-to-br", GROUP_ART[p.group])} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="space-y-1 p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-500">{p.category}</p>
                <p className="line-clamp-2 text-base font-bold leading-tight text-foreground">{p.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* position */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-30"
        >
          ‹
        </button>
        <span className="min-w-[64px] rounded-full bg-background/70 px-3 py-1 text-center font-mono text-xs tabular-nums text-foreground backdrop-blur-md">
          {index + 1} / {list.length}
        </span>
        <button
          onClick={() => go(index + 1)}
          disabled={index === list.length - 1}
          aria-label="Next project"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-30"
        >
          ›
        </button>
      </div>

      {/* details of the centred card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl"
      >
        <ProjectPane project={current} hideBanner />
      </motion.div>
    </div>
  );
};

const TrafficLight = ({
  label,
  glyph,
  color,
  onClick,
}: {
  label: string;
  glyph: string;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={cn(
      "relative flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full text-[10px] font-bold leading-none text-black/70 transition-transform before:absolute before:-inset-2 before:content-[''] hover:scale-110 active:scale-90",
      color
    )}
  >
    <span className="opacity-0 transition-opacity group-hover/lights:opacity-100">{glyph}</span>
  </button>
);

const TechChips = ({ frontend, backend }: { frontend: Skill[]; backend: Skill[] }) => {
  const group = (label: string | null, items: Skill[]) =>
    items.length > 0 && (
      <div>
        {label && (
          <p className="mb-2 text-center text-[11px] font-medium text-muted-foreground">{label}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((s) => (
            <span
              key={s.title}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <span className="flex h-4 w-4 items-center justify-center text-base leading-none">{s.icon}</span>
              {s.title}
            </span>
          ))}
        </div>
      </div>
    );
  const both = frontend.length > 0 && backend.length > 0;
  return (
    <div className="space-y-4 sm:[@media(hover:hover)]:hidden">
      {group(both ? "Core / Frontend" : null, frontend)}
      {group(both ? "Backend / Engine" : null, backend)}
    </div>
  );
};

const ProjectPane = ({ project, hideBanner = false }: { project: Project; hideBanner?: boolean }) => {
  const { frontend, backend } = project.skills;
  const hasLive = project.live && project.live !== project.github;

  return (
    <div>
      {/* banner */}
      {!hideBanner && (
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-neutral-900">
        {project.src ? (
          <Image
            src={project.src}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", GROUP_ART[project.group])}>
            <span className="absolute -bottom-6 right-6 select-none font-mono text-[9rem] font-black leading-none text-foreground/10">
              {"</>"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <span className="absolute left-5 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-200 backdrop-blur-md">
          {project.category}
        </span>
      </div>
      )}

      <div className="space-y-6 p-5 sm:p-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{project.title}</h3>
          <p className="mt-2 max-w-2xl text-muted-foreground">{project.tagline}</p>
        </div>

        <ul className="space-y-2.5 font-mono text-sm">
          {project.highlights.map((h, i) => (
            <motion.li
              key={h}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.1 }}
              className="flex gap-3 leading-relaxed text-foreground/90"
            >
              <span className="select-none text-cyan-500">❯</span>
              <span>{h}</span>
            </motion.li>
          ))}
        </ul>

        {(frontend.length > 0 || backend.length > 0) && (
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <h4 className="mb-3 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Technologies &amp; Frameworks
            </h4>
            <TechChips frontend={frontend} backend={backend} />
            <div className="hidden flex-col items-center justify-around gap-4 sm:[@media(hover:hover)]:flex sm:[@media(hover:hover)]:flex-row">
              {frontend.length > 0 && (
                <div className="flex min-w-0 flex-col items-center gap-1.5">
                  {backend.length > 0 && (
                    <span className="text-[11px] font-medium text-muted-foreground">Core / Frontend</span>
                  )}
                  <FloatingDock items={frontend} />
                </div>
              )}
              {backend.length > 0 && (
                <div className="flex min-w-0 flex-col items-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Backend / Engine</span>
                  <FloatingDock items={backend} />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {project.github ? (
            <code className="min-w-0 truncate rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-xs text-muted-foreground">
              $ git clone {project.github.replace("https://", "")}
              <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-cyan-500" />
            </code>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {project.github && (
              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </Button>
              </Link>
            )}
            {hasLive && (
              <Link href={project.live} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
