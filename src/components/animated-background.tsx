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

  const { setSelectedSkill } = useSkillContext();
  const setSelectedSkillRef = useRef(setSelectedSkill);
  useEffect(() => { setSelectedSkillRef.current = setSelectedSkill; }, [setSelectedSkill]);

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
    while (current) {
      const name = current.name ?? "";
      if (!sec) sec = getSectionFromTarget(name);
      if (!skill) skill = getSkillFromTarget(name);
      current = current.parent;
    }
    if (sec) return;
    if (skill) {
      if (selectedSkillRef.current?.name !== skill.name) {
        if (selectedSkillRef.current) playReleaseSoundRef.current();
        playPressSoundRef.current();
        // Show TABS only in skills section
        if (activeSectionRef.current === "skills" || activeSection === "skills") {
          setSelectedSkillRef.current(skill);
          selectedSkillRef.current = skill;
          try { app.setVariable("heading", skill.label); app.setVariable("desc", skill.shortDescription); } catch (_) { }
        }
      }
    }
  }, []);

  const handleMouseDown = useCallback((e: SplineEvent) => {
    const app = splineAppRef.current;
    if (!app) return;
    const target = e.target as any;
    let current = target;
    let skill: Skill | undefined = undefined;
    let sec: Section | undefined = undefined;
    while (current) {
      const name = current.name ?? "";
      if (!sec) sec = getSectionFromTarget(name);
      if (!skill) skill = getSkillFromTarget(name);
      current = current.parent;
    }
    if (sec) {
      setActiveSectionRef.current(sec);
      animateTo(sec);
      return;
    }
    if (skill) {
      playPressSoundRef.current();
      // Show TABS only in skills section
      if (activeSectionRef.current === "skills" || activeSection === "skills") {
        setSelectedSkillRef.current(skill);
        selectedSkillRef.current = skill;
        try { app.setVariable("heading", skill.label); app.setVariable("desc", skill.shortDescription); } catch (_) { }
      }
    }
  }, [animateTo]);

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
    <div ref={wrapperRef} className="w-full h-full fixed inset-0 z-[30]" style={{ opacity: 0, pointerEvents: "none" }}>
      <Suspense fallback={null}>
        {error && retryCount >= MAX_RETRY_ATTEMPTS ? <SplineErrorFallback onRetry={handleRetry} error={error} /> : null}
        {!error && (
          <Spline className="w-full h-full" style={{ pointerEvents: "auto" }} scene="/assets/iphone_main.spline" onLoad={(app: Application) => { setSplineApp(app); setError(null); setRetryCount(0); bypassLoading(); try { app.addEventListener("mouseHover", handleMouseHover); app.addEventListener("mouseDown", handleMouseDown); } catch (e) { } }} onError={(err: any) => { const e = err instanceof Error ? err : new Error(String(err)); if (retryCount < MAX_RETRY_ATTEMPTS) { setTimeout(() => setRetryCount(p => p + 1), RETRY_DELAY_MS); } else { setError(e); } bypassLoading(); }} />
        )}
      </Suspense>
    </div>
  );
};

export default AnimatedBackground;
