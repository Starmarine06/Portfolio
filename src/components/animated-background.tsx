"use client";
import React, { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useRouter } from "next/navigation";
import { Section } from "./animated-background-config";
import { useSkillContext } from "@/contexts/skill-context";
import { useSectionContext } from "@/contexts/section-context";
import { useSounds } from "./realtime/hooks/use-sounds";
import { SplineErrorFallback } from "./spline-error-fallback";

const MAX_RETRY_ATTEMPTS = 1;
const RETRY_DELAY_MS = 3000;

gsap.registerPlugin(ScrollTrigger);

const SPLINE_TO_SKILL_MAP: Record<string, SkillNames> = {
  "tensorflow": SkillNames.TENSORFLOW,
  "unity":      SkillNames.UNITY,
  "html":       SkillNames.HTML,
  "css":        SkillNames.CSS,
  "nextjs":     SkillNames.NEXTJS,
  "tailwind":   SkillNames.TAILWIND,
  "nodejs":     SkillNames.NODEJS,
  "express":    SkillNames.EXPRESS,
  "git":        SkillNames.GIT,
  "github":     SkillNames.GITHUB,
  "react":      SkillNames.REACT,
  "npm":        SkillNames.NPM,
  "linux":      SkillNames.LINUX,
  "firebase":   SkillNames.FIREBASE,
  "mongodb":    SkillNames.MONGODB,
  "aws":        SkillNames.AWS,
};

const BUTTON_TO_SECTION_MAP: Record<string, Section> = {
  "tab_skills":   "skills",
  "tab_projects": "projects",
  "tab_contact":  "contact",
  "btn_skills":   "skills",
  "btn_projects": "projects",
  "btn_contact":  "contact",
  "Skills":       "skills",
  "Projects":     "projects",
  "Contact":      "contact",
};

type SectionState = {
  desktop: { x: string; y: string; scale: number; rotY: number; rotX: number; rotZ: number };
  mobile:  { x: string; y: string; scale: number; rotY: number; rotX: number; rotZ: number };
};

const X = -1.30;
const Y = -0.68;
const Z = -1.09;

type GhostVec = { x: number; y: number; z: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Calibration: the projected chip position lands slightly left of the real
// button on screen — nudge the ghost tap rightward to actually hit it.
const GHOST_CLICK_OFFSET = { x: 24, y: 0 };

const rotateXYZ = (rx: number, ry: number, rz: number, v: GhostVec): GhostVec => {
  let { x, y, z } = v;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y2 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  y = y2; z = z2;
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x2 = x * cy + z * sy;
  const z3 = -x * sy + z * cy;
  x = x2; z = z3;
  const cz = Math.cos(rz), sz = Math.sin(rz);
  const x3 = x * cz - y * sz;
  const y3 = x * sz + y * cz;
  return { x: x3, y: y3, z };
};

// Walk the object's parent chain (top-down) to accumulate its world position.
const getWorldPosition = (obj: any): GhostVec => {
  const chain: any[] = [];
  let node: any = obj;
  while (node) { chain.unshift(node); node = node.parent; }
  let pos = { x: 0, y: 0, z: 0 };
  for (const n of chain) {
    const p = n.position ?? { x: 0, y: 0, z: 0 };
    const r = n.rotation ?? { x: 0, y: 0, z: 0 };
    const s = n.scale ?? { x: 1, y: 1, z: 1 };
    pos = { x: pos.x * s.x, y: pos.y * s.y, z: pos.z * s.z };
    pos = rotateXYZ(r.x, r.y, r.z, pos);
    pos = { x: pos.x + p.x, y: pos.y + p.y, z: pos.z + p.z };
  }
  return pos;
};

const SECTION_STATES: Record<Section, SectionState> = {
  hero: {
    desktop: { x: "12vw", y: "3vh", scale: 2.98, rotY: -0.19, rotX: -1.36, rotZ: 4.99 },
    mobile:  { x: "0vw",   y: "10vh", scale: 1.0,  rotY: Y + Math.PI / 4, rotX: X, rotZ: Z },
  },
  about: {
    desktop: { x: "-5vw",  y: "-5vh", scale: 1.0,  rotY: Y + Math.PI + Math.PI / 6, rotX: X, rotZ: Z },
    mobile:  { x: "0vw",   y: "10vh", scale: 0.9,  rotY: Y + Math.PI + Math.PI / 6, rotX: X, rotZ: Z },
  },
  experience: {
    desktop: { x: "-5vw",  y: "-5vh", scale: 0.9,  rotY: Y + Math.PI - Math.PI / 4, rotX: X + Math.PI / 12, rotZ: Z },
    mobile:  { x: "0vw",   y: "10vh", scale: 0.8,  rotY: Y + Math.PI - Math.PI / 6, rotX: X + Math.PI / 12, rotZ: Z },
  },
  skills: {
    desktop: { x: "5vw", y: "0vh", scale: 1.98, rotY: -0.19, rotX: -1.36, rotZ: 4.99 },
    mobile:  { x: "0vw",   y: "0vh",  scale: 0.85, rotY: Y, rotX: X, rotZ: 0.23 + Math.PI * 1.5 },
  },
  projects: {
    desktop: { x: "0vw",   y: "-5vh", scale: 0.85, rotY: Y + Math.PI / 2, rotX: X, rotZ: Z },
    mobile:  { x: "0vw",   y: "10vh", scale: 0.7,  rotY: Y + Math.PI / 2, rotX: X, rotZ: Z },
  },
  contact: {
    desktop: { x: "22vw", y: "3vh", scale: 1.98, rotY: -0.19, rotX: -1.36, rotZ: 4.99 },
    mobile:  { x: "0vw",   y: "10vh", scale: 0.85, rotY: Y, rotX: X, rotZ: 0.23 + Math.PI * 1.5 },
  },
};

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedSkillRef = useRef<Skill | null>(null);
  const idleRotationRef = useRef<gsap.core.Tween | null>(null);
  const splineAppRef = useRef<Application | undefined>(undefined);
  const [splineApp, _setSplineApp] = useState<Application | undefined>(undefined);
  const setSplineApp = useCallback((app: Application | undefined) => {
    splineAppRef.current = app;
    _setSplineApp(app);
  }, []);

  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const { selectedSkill, setSelectedSkill } = useSkillContext();
  const setSelectedSkillRef = useRef(setSelectedSkill);
  useEffect(() => { setSelectedSkillRef.current = setSelectedSkill; }, [setSelectedSkill]);
  // Name of the last 3D object that opened the skill panel — used to reverse
  // its hover state when the panel is dismissed.
  const lastTappedNameRef = useRef<string | null>(null);
  // Attractor state: tracks the chip currently being pulsed so a pending pulse
  // can be cancelled/reversed if the user interacts with that chip first.
  const attractorRef = useRef<{ name: string | null; timer: number | null } | null>(null);
  // The ghost cursor (a glowing circle) used to visually "click" a chip.
  const ghostRef = useRef<HTMLDivElement | null>(null);
  // Cached screen positions for each chip once successfully projected.
  const chipScreenCacheRef = useRef<Record<string, { x: number; y: number }>>({});
  // Lets a section-change effect trigger a ghost tap the moment #skills opens.
  const attractorPokeRef = useRef<(() => void) | null>(null);

  const { activeSection, setActiveSection, registerNavigate } = useSectionContext();
  const activeSectionRef = useRef(activeSection);
  const setActiveSectionRef = useRef(setActiveSection);
  useEffect(() => { 
    activeSectionRef.current = activeSection; 
    setActiveSectionRef.current = setActiveSection; 
  }, [activeSection, setActiveSection]);

  const { playPressSound, playReleaseSound } = useSounds();
  const playPressSoundRef = useRef(playPressSound);
  const playReleaseSoundRef = useRef(playReleaseSound);
  useEffect(() => { playPressSoundRef.current = playPressSound; }, [playPressSound]);
  useEffect(() => { playReleaseSoundRef.current = playReleaseSound; }, [playReleaseSound]);

  const isMobileRef = useRef(isMobile);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  const handleRetry = useCallback(() => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) return;
    setError(null);
    setSplineApp(undefined);
    setRetryCount(prev => prev + 1);
  }, [retryCount, setSplineApp]);

  const getRootObj = useCallback(() => {
    const app = splineAppRef.current;
    return app?.findObjectByName("iPhone 14 Pro") || app?.findObjectByName("keyboard") || app?.findObjectByName("Group");
  }, []);

  const getState = useCallback((section: Section) => SECTION_STATES[section][isMobileRef.current ? "mobile" : "desktop"], []);

  const getSkillFromTarget = useCallback((name: string): Skill | undefined => {
    if (!name) return undefined;
    const clean = name.trim().toLowerCase();
    const mapped = SPLINE_TO_SKILL_MAP[clean];
    if (mapped) return SKILLS[mapped];
    for (const key of Object.keys(SPLINE_TO_SKILL_MAP)) {
      if (clean.includes(key)) return SKILLS[SPLINE_TO_SKILL_MAP[key]];
    }
    return undefined;
  }, []);

  const getSectionFromTarget = useCallback((name: string): Section | undefined => BUTTON_TO_SECTION_MAP[name] ?? BUTTON_TO_SECTION_MAP[name.toLowerCase()], []);

  const cancelAttractor = useCallback((name?: string) => {
    const a = attractorRef.current;
    if (!a || !a.name) { attractorRef.current = { name: null, timer: null }; return; }
    if (name && a.name !== name) return;
    if (a.timer) window.clearTimeout(a.timer);
    const app = splineAppRef.current;
    if (app) { try { app.emitEventReverse("mouseHover", a.name); } catch (_) { } }
    attractorRef.current = { name: null, timer: null };
    const ghost = ghostRef.current;
    if (ghost) {
      gsap.killTweensOf(ghost);
      ghost.classList.remove("is-tapping");
      gsap.to(ghost, { opacity: 0, duration: 0.2, ease: "power2.out" });
    }
  }, []);

  // Project a world position to viewport pixels using the runtime's camera.
  // Falls back to cached results (or null) when the camera isn't reachable.
  const projectToScreen = useCallback((world: GhostVec): { x: number; y: number } | null => {
    const app = splineAppRef.current as any;
    const canvas = app?.canvas as HTMLCanvasElement | undefined;
    if (!canvas || !canvas.clientWidth) return null;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const controls = app?.controls;
    const cam = controls?.object ?? controls?.camera;
    if (!cam || !cam.position || !cam.rotation) return null;
    const fov = (cam.fov ?? 50) * (Math.PI / 180);
    const aspect = w / Math.max(1, h);
    let v: GhostVec = { x: world.x - cam.position.x, y: world.y - cam.position.y, z: world.z - cam.position.z };
    v = rotateXYZ(-(cam.rotation.x ?? 0), -(cam.rotation.y ?? 0), -(cam.rotation.z ?? 0), v);
    if (v.z > -0.05) return null;
    const halfH = Math.tan(fov / 2);
    const ndcX = v.x / (-v.z * halfH * aspect);
    const ndcY = v.y / (-v.z * halfH);
    return {
      x: (ndcX * 0.5 + 0.5) * w,
      y: (1 - (ndcY * 0.5 + 0.5)) * h,
    };
  }, []);

  const startIdleRotation = useCallback(() => {
    const root = getRootObj();
    if (!root) return;
    idleRotationRef.current?.kill();
    const state = SECTION_STATES.hero[isMobileRef.current ? "mobile" : "desktop"];
    idleRotationRef.current = gsap.to(root.rotation, {
      y: state.rotY + Math.PI / 12,
      duration: 3.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, [getRootObj]);

  const stopIdleRotation = useCallback(() => {
    idleRotationRef.current?.kill();
    idleRotationRef.current = null;
  }, []);

  const animateTo = useCallback((section: Section, duration = 1.2) => {
    stopIdleRotation();
    const el = wrapperRef.current;
    const state = getState(section);
    if (el) gsap.to(el, { x: state.x, y: state.y, opacity: 1, duration, ease: "power2.out", overwrite: "auto" });
    const root = getRootObj();
    if (root) {
      gsap.to(root.rotation, { x: state.rotX, y: state.rotY, z: state.rotZ, duration, ease: "power2.out", overwrite: "auto", onComplete: () => { if (section === "hero") startIdleRotation(); } });
      gsap.to(root.scale, { x: state.scale, y: state.scale, z: state.scale, duration, ease: "power2.out", overwrite: "auto" });
      root.position.x = 0; root.position.y = 0;
    }
  }, [getState, getRootObj, stopIdleRotation, startIdleRotation]);

  useEffect(() => {
    registerNavigate((section: Section) => {
      setActiveSectionRef.current(section);
      animateTo(section);
    });
  }, [registerNavigate, animateTo]);

  const handleMouseHover = useCallback((e: SplineEvent) => {
    const app = splineAppRef.current;
    if (!app) return;
    const target = e.target as any;
    let current = target;
    let skill: Skill | undefined = undefined;
    let sec: Section | undefined = undefined;
    let skillObjName: string | null = null;
    while (current) {
      const name = current.name ?? "";
      if (!sec) sec = getSectionFromTarget(name);
      if (!skill) {
        const found = getSkillFromTarget(name);
        if (found) { skill = found; skillObjName = name; }
      }
      current = current.parent;
    }
    if (sec) return;
    if (skill) {
      if (skillObjName) cancelAttractor(skillObjName);
      if (selectedSkillRef.current?.name !== skill.name) {
        if (selectedSkillRef.current) playReleaseSoundRef.current();
        playPressSoundRef.current();
        // Show TABS only in skills section
        if (activeSectionRef.current === "skills" || activeSection === "skills") {
          setSelectedSkillRef.current(skill);
          selectedSkillRef.current = skill;
          if (skillObjName) lastTappedNameRef.current = skillObjName;
          try { app.setVariable("heading", skill.label); } catch (_) { }
        }
      }
    }
  }, [cancelAttractor]);

  const handleMouseDown = useCallback((e: SplineEvent) => {
    const app = splineAppRef.current;
    if (!app) return;
    const target = e.target as any;
    let current = target;
    let skill: Skill | undefined = undefined;
    let sec: Section | undefined = undefined;
    let skillObjName: string | null = null;
    while (current) {
      const name = current.name ?? "";
      if (!sec) sec = getSectionFromTarget(name);
      if (!skill) {
        const found = getSkillFromTarget(name);
        if (found) { skill = found; skillObjName = name; }
      }
      current = current.parent;
    }
    if (sec) {
      setActiveSectionRef.current(sec);
      animateTo(sec);
      return;
    }
    if (skill) {
      if (skillObjName) cancelAttractor(skillObjName);
      playPressSoundRef.current();
      // Show TABS only in skills section
      if (activeSectionRef.current === "skills" || activeSection === "skills") {
        setSelectedSkillRef.current(skill);
        selectedSkillRef.current = skill;
        if (skillObjName) lastTappedNameRef.current = skillObjName;
        try { app.setVariable("heading", skill.label); } catch (_) { }
      }
    }
  }, [animateTo, cancelAttractor]);

  // When the skill panel is dismissed, clear the phone heading and reverse the
  // 3D object's hover state so it returns to the base pose. On touch there is
  // no hover-out event, so the Spline "Details" state would otherwise stick.
  useEffect(() => {
    const app = splineAppRef.current;
    if (!app) return;
    if (selectedSkill) {
      try { app.setVariable("heading", selectedSkill.label); } catch (_) { }
      return;
    }
    try { app.setVariable("heading", ""); } catch (_) { }
    const name = lastTappedNameRef.current;
    if (name) {
      try { app.emitEventReverse("mouseHover", name); } catch (_) { }
    }
  }, [selectedSkill, splineApp]);

  // Periodic "attention" animation: a ghost cursor (glowing circle) flies to a
// random skill chip and taps it — lighting the chip up as if a visitor just
// hovered + clicked it, inviting the real visitor to click that button. Only
// runs while lounging in the skills section, and never while a skill panel is
// already open.
  useEffect(() => {
    const chips = Object.keys(SPLINE_TO_SKILL_MAP);
    if (chips.length === 0) return;
    let stopped = false;
    let timer = 0;
    let lastChip = "";

    const fire = (forcedName?: string, instant = false) => {
      if (stopped) return;
      const app = splineAppRef.current;
      if (!app || selectedSkillRef.current || activeSectionRef.current !== "skills") return;
      let name = forcedName;
      if (name && !chips.includes(name)) name = undefined;
      if (!name) {
        name = lastChip;
        while (name === lastChip && chips.length > 1) name = chips[Math.floor(Math.random() * chips.length)];
      }
      lastChip = name;
      const obj = app.findObjectByName(name) as any;
      const el = ghostRef.current;
      if (!obj || !el) return;
      const skill = getSkillFromTarget(name);
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Resolve where the chip sits on screen. Fall back to a cached position
      // (or a spot near the phone) when a projection isn't possible or lands
      // off-viewport.
      let target: { x: number; y: number } | null = projectToScreen(getWorldPosition(obj));
      if (!target || target.x < w * 0.06 || target.x > w * 0.94 || target.y < h * 0.06 || target.y > h * 0.94) {
        const cached = chipScreenCacheRef.current[name];
        target = cached ?? { x: w * 0.5 + (Math.random() - 0.5) * w * 0.08, y: h * 0.42 + (Math.random() - 0.5) * h * 0.05 };
        target = { x: clamp(target.x, w * 0.08, w * 0.92), y: clamp(target.y, h * 0.1, h * 0.9) };
      } else {
        chipScreenCacheRef.current = { ...chipScreenCacheRef.current, [name]: { x: target.x, y: target.y } };
      }
      target = { x: target.x + GHOST_CLICK_OFFSET.x, y: target.y + GHOST_CLICK_OFFSET.y };
      target.x = clamp(target.x, w * 0.06, w * 0.94);
      target.y = clamp(target.y, h * 0.06, h * 0.94);

      // It "sees" the chip: it lights up, pops, and the phone heading hints at
      // the hovered skill — just like a real visitor.
      try { app.emitEvent("mouseHover", name); } catch (_) { }
      if (skill) { try { app.setVariable("heading", skill.label); } catch (_) { } }
      try { gsap.fromTo(obj.scale, { x: 1, y: 1, z: 1 }, { x: 1.14, y: 1.14, z: 1.14, duration: 0.38, ease: "sine.out", yoyo: true, repeat: 2 }); } catch (_) { }

      const doTap = () => {
        if (stopped) return;
        // Tap: press pulse + ripple ring + press sound, then reverse.
        gsap.to(el, { scale: 0.5, duration: 0.11, yoyo: true, repeat: 1, ease: "power2.inOut" });
        el.classList.add("is-tapping");
        playPressSoundRef.current?.();
        const timerId = window.setTimeout(() => {
          attractorRef.current = { name: null, timer: null };
          el.classList.remove("is-tapping");
          try { app.emitEventReverse("mouseHover", name); } catch (_) { }
          gsap.to(el, { opacity: 0, duration: 0.35, delay: 0.2, ease: "power2.out", onComplete: () => { gsap.set(el, { scale: 1 }); } });
        }, 620);
        attractorRef.current = { name, timer: timerId };
      };

      gsap.killTweensOf(el);
      el.classList.remove("is-tapping");

      if (instant) {
        // No travel: the cursor simply appears on the chip and taps in place.
        gsap.set(el, { x: target.x - 11, y: target.y - 11, scale: 1 });
        gsap.to(el, { opacity: 1, duration: 0.18, ease: "power2.out", onComplete: doTap });
        return;
      }

      const fromSide = Math.random() > 0.5;
      const start = { x: (fromSide ? w + 140 : -140) - 11, y: h + 120 - 11 };
      const approach = { x: target.x - 11, y: target.y - 96 };
      const land = { x: target.x - 11, y: target.y - 11 };

      gsap.set(el, { x: start.x, y: start.y, opacity: 0, scale: 1 });
      const dist = Math.hypot(approach.x - start.x, approach.y - start.y);
      const fly = Math.min(1.1, 0.5 + dist / 1400);

      gsap.to(el, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(el, { x: approach.x, y: approach.y, duration: fly, ease: "power2.inOut", onComplete: () => {
        if (stopped) return;
        gsap.to(el, { x: land.x, y: land.y, duration: 0.16, ease: "power3.in" });
        doTap();
      } });
    };

    const tick = () => {
      fire();
      if (!stopped) timer = window.setTimeout(tick, 8000 + Math.random() * 5000);
    };
    // Immediately play a tap and reschedule, used when #skills is entered.
    const poke = () => {
      if (stopped) return;
      window.clearTimeout(timer);
      timer = 0;
      fire("express", true);
      if (!stopped) timer = window.setTimeout(tick, 8000 + Math.random() * 5000);
    };
    attractorPokeRef.current = poke;
    timer = window.setTimeout(tick, 4000);

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      attractorPokeRef.current = null;
      const ghost = ghostRef.current;
      if (ghost) { gsap.killTweensOf(ghost); gsap.set(ghost, { opacity: 0 }); }
      if (attractorRef.current?.name) cancelAttractor();
    };
  }, [getSkillFromTarget, cancelAttractor, projectToScreen]);

  // Play the ghost tap right away whenever the visitor enters the #skills
  // section, instead of waiting for the next scheduled interval.
  useEffect(() => {
    if (activeSection !== "skills") return;
    const t = window.setTimeout(() => { attractorPokeRef.current?.(); }, 700);
    return () => window.clearTimeout(t);
  }, [activeSection, splineApp]);

  // Leaving the skills section: clear any pending attraction highlight and
  // reset the phone heading so no fake hover is left dangling on other views.
  useEffect(() => {
    if (activeSection !== "skills") {
      cancelAttractor();
      const app = splineAppRef.current;
      if (app) { try { app.setVariable("heading", ""); } catch (_) { } }
    }
  }, [activeSection, cancelAttractor]);

  useEffect(() => {
    if (!splineApp) return;
    const update = () => {
      const n = new Date();
      const obj = splineApp.findObjectByName("Time") as any;
      if (obj) obj.text = `${n.getHours().toString().padStart(2, "0")}:${n.getMinutes().toString().padStart(2, "0")}`;
    };
    update();
    const iv = setInterval(update, 60_000);
    return () => clearInterval(iv);
  }, [splineApp]);

  useEffect(() => {
    if (!splineApp || revealed) return;
    Object.keys(SPLINE_TO_SKILL_MAP).forEach((key, i) => {
      const obj = splineApp.findObjectByName(key);
      if (obj) {
        obj.visible = true;
        gsap.fromTo(obj.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.6 + i * 0.05 });
      }
    });
  }, [splineApp, revealed]);

  const createTrigger = useCallback((id: string, target: Section, prev: Section, start = "top 50%") => {
    ScrollTrigger.create({
      trigger: id, start,
      onEnter: () => { setActiveSectionRef.current(target); animateTo(target); },
      onLeaveBack: () => { setActiveSectionRef.current(prev); animateTo(prev); },
    });
  }, [animateTo]);

  useEffect(() => {
    if (!splineApp) return;
    ScrollTrigger.getAll().forEach(t => t.kill());
    requestAnimationFrame(() => {
      createTrigger("#skills", "skills", "hero");
      createTrigger("#projects", "projects", "skills", "top 70%");
      createTrigger("#contact", "contact", "projects", "top 30%");
      ScrollTrigger.refresh();
    });
  }, [splineApp, createTrigger]);

  const revealModel = useCallback(() => {
    const el = wrapperRef.current;
    const root = getRootObj();
    if (!el) return;
    setRevealed(true);
    const state = getState("hero");
    gsap.fromTo(el, { opacity: 0 }, { x: state.x, y: state.y, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.4, onComplete: () => startIdleRotation() });
    if (root) {
      gsap.set(root.rotation, { x: state.rotX, y: state.rotY, z: state.rotZ });
      gsap.set(root.scale, { x: state.scale, y: state.scale, z: state.scale });
    }
  }, [getState, getRootObj, startIdleRotation]);

  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });
    if (!splineApp || isLoading || revealed) return;
    revealModel();
  }, [splineApp, isLoading, revealed, router, activeSection, revealModel]);

  useEffect(() => {
    if (!splineApp || !revealed) return;
    const root = getRootObj();
    if (root) {
      const state = getState(activeSection);
      gsap.to(root.rotation, { x: state.rotX, y: state.rotY, z: state.rotZ, duration: 0.5, overwrite: "auto" });
    }
  }, [splineApp, revealed, activeSection, getState, getRootObj]);

  return (
    <>
    <div ref={wrapperRef} className="w-full h-full fixed inset-0 z-[30]" style={{ opacity: 0, pointerEvents: "none" }}>
      <Suspense fallback={null}>
        {error && retryCount >= MAX_RETRY_ATTEMPTS ? <SplineErrorFallback onRetry={handleRetry} error={error} /> : null}
        {!error && (
          <Spline className="w-full h-full" style={{ pointerEvents: "auto" }} scene="/assets/iphone_main.spline" onLoad={(app: Application) => { setSplineApp(app); setError(null); setRetryCount(0); bypassLoading(); try { app.addEventListener("mouseHover", handleMouseHover); app.addEventListener("mouseDown", handleMouseDown); } catch (e) { } }} onError={(err: any) => { const e = err instanceof Error ? err : new Error(String(err)); if (retryCount < MAX_RETRY_ATTEMPTS) { setTimeout(() => setRetryCount(p => p + 1), RETRY_DELAY_MS); } else { setError(e); } bypassLoading(); }} />
        )}
      </Suspense>
    </div>
    <div ref={ghostRef} aria-hidden className="ghost-cursor"><span className="ghost-ring" /></div>
    </>
  );
};

export default AnimatedBackground;
