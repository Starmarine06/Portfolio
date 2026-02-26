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
import { useSounds } from "./realtime/hooks/use-sounds";

gsap.registerPlugin(ScrollTrigger);

// Map Spline object names to SkillNames enum keys
const SPLINE_TO_SKILL_MAP: Record<string, SkillNames> = {
  "tensorflow": SkillNames.TENSORFLOW,
  "unity": SkillNames.UNITY,
  "html": SkillNames.HTML,
  "css": SkillNames.CSS,
  "nextjs": SkillNames.NEXTJS,
  "tailwind": SkillNames.TAILWIND,
  "nodejs": SkillNames.NODEJS,
  "express": SkillNames.EXPRESS,
  "git": SkillNames.GIT,
  "github": SkillNames.GITHUB,
  "react": SkillNames.REACT,
  "npm": SkillNames.NPM,
  "linux": SkillNames.LINUX,
  "firebase": SkillNames.FIREBASE,
  "mongodb": SkillNames.MONGODB,
  "aws": SkillNames.AWS,
};

// Section states: CSS position/scale for wrapper + Spline object rotation
type SectionState = {
  desktop: { x: string; y: string; scale: number; rotY: number; rotX: number; rotZ: number };
  mobile: { x: string; y: string; scale: number; rotY: number; rotX: number; rotZ: number };
};

// Baseline offsets derived from user's manual debug calibration for the Tech Stack (face forward)
const X = -1.30;
const Y = -0.68;
const Z = -1.09;

const SECTION_STATES: Record<Section, SectionState> = {
  // Hero: Back of the phone (turned 180 deg from face forward)
  hero: {
    desktop: { x: "15vw", y: "0vh", scale: 0.85, rotY: Y + Math.PI, rotX: X, rotZ: Z },
    mobile: { x: "0vw", y: "10vh", scale: 1.0, rotY: Y + Math.PI, rotX: X, rotZ: Z },
  },
  // About: turned ~30° right from back of phone
  about: {
    desktop: { x: "-5vw", y: "-5vh", scale: 1.0, rotY: Y + Math.PI + Math.PI / 6, rotX: X, rotZ: Z },
    mobile: { x: "0vw", y: "10vh", scale: 0.9, rotY: Y + Math.PI + Math.PI / 6, rotX: X, rotZ: Z },
  },
  // Experience: turned ~45° left from back of phone
  experience: {
    desktop: { x: "-5vw", y: "-5vh", scale: 0.9, rotY: Y + Math.PI - Math.PI / 4, rotX: X + Math.PI / 12, rotZ: Z },
    mobile: { x: "0vw", y: "10vh", scale: 0.8, rotY: Y + Math.PI - Math.PI / 6, rotX: X + Math.PI / 12, rotZ: Z },
  },
  // Skills: Face fully forward (Apps visible), slight tilt up
  skills: {
    desktop: { x: "0vw", y: "-5vh", scale: 0.9, rotY: Y, rotX: X + Math.PI / 10, rotZ: Z },
    mobile: { x: "0vw", y: "0vh", scale: 0.8, rotY: Y, rotX: X + Math.PI / 10, rotZ: Z },
  },
  // Projects: showing side edge
  projects: {
    desktop: { x: "0vw", y: "-5vh", scale: 0.9, rotY: Y + Math.PI / 2, rotX: X, rotZ: Z },
    mobile: { x: "0vw", y: "10vh", scale: 0.7, rotY: Y + Math.PI / 2, rotX: X, rotZ: Z },
  },
  // Contact: Back of the phone, shifted right
  contact: {
    desktop: { x: "20vw", y: "-15vh", scale: 0.75, rotY: Y + Math.PI, rotX: X, rotZ: Z },
    mobile: { x: "0vw", y: "10vh", scale: 0.7, rotY: Y + Math.PI, rotX: X, rotZ: Z },
  },
};

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedSkillRef = useRef<Skill | null>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [revealed, setRevealed] = useState(false);
  const router = useRouter();
  const { setSelectedSkill } = useSkillContext();
  const { playPressSound, playReleaseSound } = useSounds();

  // --- Helpers ---

  const getRootObj = useCallback(() =>
    splineApp?.findObjectByName("iPhone 14 Pro") ||
    splineApp?.findObjectByName("keyboard") ||
    splineApp?.findObjectByName("Group"),
    [splineApp]);

  const getState = useCallback((section: Section) =>
    SECTION_STATES[section][isMobile ? "mobile" : "desktop"],
    [isMobile]);

  const getSkillFromTarget = useCallback((targetName: string): Skill | undefined => {
    const mappedName = SPLINE_TO_SKILL_MAP[targetName];
    if (mappedName) return SKILLS[mappedName];
    if (Object.values(SkillNames).includes(targetName as SkillNames))
      return SKILLS[targetName as SkillNames];
    return undefined;
  }, []);

  // Animate both CSS wrapper (position/scale) AND Spline object rotation
  const animateTo = useCallback((section: Section, duration = 1.2) => {
    const el = wrapperRef.current;
    const state = getState(section);
    if (el) {
      gsap.to(el, { x: state.x, y: state.y, scale: state.scale, duration, ease: "power2.out", overwrite: "auto" });
    }
    const root = getRootObj();
    if (root) {
      // Use proxy object and onUpdate to ensure Spline re-renders properly every frame 
      // when scrolling forward or backward
      gsap.to(root.rotation, {
        x: state.rotX,
        y: state.rotY,
        z: state.rotZ,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [getState, getRootObj]);

  // --- Spline Interaction Handlers ---

  const handleMouseHover = useCallback((e: SplineEvent) => {
    if (!splineApp) return;
    const target = e.target as any;
    if (target.name === "platform") return;

    let skill = getSkillFromTarget(target.name);
    if (!skill && target.parent) skill = getSkillFromTarget(target.parent.name);

    if (skill) {
      if (selectedSkillRef.current?.name !== skill.name) {
        if (selectedSkillRef.current) playReleaseSound();
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        try { splineApp.setVariable("heading", skill.label); splineApp.setVariable("desc", skill.shortDescription); } catch (_) { }
      }
    } else if (target.name === "body" || target.name === "iPhone 14 Pro") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      try { splineApp.setVariable("heading", ""); splineApp.setVariable("desc", ""); } catch (_) { }
    }
  }, [splineApp, getSkillFromTarget, setSelectedSkill, playPressSound, playReleaseSound]);

  const handleMouseDown = useCallback((e: SplineEvent) => {
    if (!splineApp) return;
    const target = e.target as any;
    let skill = getSkillFromTarget(target.name);
    if (!skill && target.parent) skill = getSkillFromTarget(target.parent.name);
    if (skill) {
      playPressSound();
      setSelectedSkill(skill);
      selectedSkillRef.current = skill;
      try { splineApp.setVariable("heading", skill.label); splineApp.setVariable("desc", skill.shortDescription); } catch (_) { }
    }
  }, [splineApp, getSkillFromTarget, setSelectedSkill, playPressSound]);

  // Event listeners are wired via onSplineMouseHover / onSplineMouseDown props below

  // --- Time Display ---
  useEffect(() => {
    if (!splineApp) return;
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const timeString = `${h}:${m}`;

      // Use .text property directly on the object (not setVariable)
      const textObj = splineApp.findObjectByName("Time") as any;
      if (textObj) {
        textObj.text = timeString;
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, [splineApp]);

  // --- Icon Reveal ---
  useEffect(() => {
    if (!splineApp || revealed) return;
    Object.keys(SPLINE_TO_SKILL_MAP).forEach((keyName, index) => {
      const obj = splineApp.findObjectByName(keyName);
      if (obj) {
        obj.visible = true;
        gsap.fromTo(obj.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.6 + index * 0.05 }
        );
      }
    });
  }, [splineApp, revealed]);

  // --- Scroll Animations ---
  const createTrigger = useCallback((
    triggerId: string, targetSection: Section, prevSection: Section, start = "top 50%",
  ) => {
    ScrollTrigger.create({
      trigger: triggerId,
      start,
      onEnter: () => { setActiveSection(targetSection); animateTo(targetSection); },
      onLeaveBack: () => { setActiveSection(prevSection); animateTo(prevSection); },
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
  }, [splineApp, isMobile, createTrigger]);

  // --- Hero Idle Rotation ---
  // Temporarily disabling the infinite idle rotation. 
  // It conflicts with GSAP scroll triggers causing the phone to not return exactly 
  // to its origin. Once rotations are dialed in perfectly, we can re-add it using 
  // a separate wrapper object inside Spline so it doesn't fight the camera state.
  useEffect(() => { }, []);

  // --- Reveal on first load ---
  const revealModel = useCallback(async () => {
    const el = wrapperRef.current;
    const root = getRootObj();
    if (!el) return;
    setRevealed(true);
    const state = getState("hero");
    // Wrapper: scale fade-in
    gsap.fromTo(el,
      { scale: 0.01, opacity: 0 },
      { x: state.x, y: state.y, scale: state.scale, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.6)", delay: 0.4 }
    );
    // Spline object: set initial rotation
    if (root) {
      gsap.set(root.rotation, { y: state.rotY, x: state.rotX, z: state.rotZ });
    }
  }, [getState, getRootObj]);

  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });
    if (!splineApp || isLoading || revealed) return;
    revealModel();
  }, [splineApp, isLoading, revealed, router, activeSection, revealModel]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full fixed -z-10"
      style={{ opacity: 0 }}
    >
      <Suspense fallback={null}>
        <Spline
          className="w-full h-full"
          scene="/assets/iphone_new.spline"
          onLoad={(app: Application) => {
            setSplineApp(app);
            bypassLoading();
          }}
          onError={(err: unknown) => {
            console.warn("[Spline] Scene failed to load:", err);
            bypassLoading();
          }}
          onSplineMouseHover={handleMouseHover}
          onSplineMouseDown={handleMouseDown}
        />
      </Suspense>
    </div>
  );
};

export default AnimatedBackground;
