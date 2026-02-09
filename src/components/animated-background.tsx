"use client";
import React, { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "./realtime/hooks/use-sounds";

gsap.registerPlugin(ScrollTrigger);

const SPLINE_TO_SKILL_MAP: Record<string, SkillNames> = {
  js: SkillNames.JAVASCRIPT,
  ts: SkillNames.TYPESCRIPT,
  html: SkillNames.HTML,
  css: SkillNames.CSS,
  react: SkillNames.REACT,
  vue: SkillNames.VITE, // Vue is mapped to Vite as a fallback
  nextjs: SkillNames.NEXTJS,
  tailwind: SkillNames.TAILWIND,
  nodejs: SkillNames.NODEJS,
  express: SkillNames.EXPRESS,
  postgres: SkillNames.POSTGRES,
  mongodb: SkillNames.MONGODB,
  git: SkillNames.GIT,
  github: SkillNames.GITHUB,
  npm: SkillNames.GITHUB, // Fallback
  firebase: SkillNames.FIREBASE,
  linux: SkillNames.PYTHON, // Fallback
  docker: SkillNames.DOCKER,
  aws: SkillNames.AWS,
  python: SkillNames.PYTHON,
};

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const router = useRouter();

  // --- Helper Functions ---

  const setSplineVariables = useCallback((heading: string, description: string) => {
    if (!splineApp) return;
    try {
      splineApp.setVariable("headingl", heading);
      splineApp.setVariable("desc", description);
    } catch (e) {
      // Silently fail if variables are not in the model
    }
  }, [splineApp]);

  // --- Event Handlers ---

  const handleMouseHover = useCallback((e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform" || e.target.name === "keyboard" || e.target.name === "Body-Screen") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      setSplineVariables("", "");
    } else {
      const skillKey = SPLINE_TO_SKILL_MAP[e.target.name] || (e.target.name as SkillNames);
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== skillKey) {
        const skill = SKILLS[skillKey as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  }, [splineApp, playPressSound, playReleaseSound, setSplineVariables]);

  const handleSplineInteractions = useCallback(() => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      setSplineVariables("", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skillKey = SPLINE_TO_SKILL_MAP[e.target.name] || (e.target.name as SkillNames);
      const skill = SKILLS[skillKey as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setSplineVariables(skill.label, skill.shortDescription);
      }
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);
    splineApp.addEventListener("mouseDown", (e) => {
      const skillKey = SPLINE_TO_SKILL_MAP[e.target.name] || (e.target.name as SkillNames);
      const skill = SKILLS[skillKey as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setSplineVariables(skill.label, skill.shortDescription);

        const target = splineApp.findObjectByName(e.target.name);
        if (target) {
          gsap.to(target.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
          });
        }
      }
    });
  }, [splineApp, handleMouseHover, playPressSound, playReleaseSound, setSplineVariables]);

  // --- Animation Setup Helpers ---

  const createSectionTimeline = useCallback((
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile, });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  }, [splineApp, isMobile]);

  const setupScrollAnimations = useCallback(() => {
    if (!splineApp || !splineContainer.current) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);
    gsap.set(kbd.rotation, heroState.rotation);

    // Section transitions
    createSectionTimeline("#skills", "skills", "hero");
    createSectionTimeline("#projects", "projects", "skills", "top 70%");
    createSectionTimeline("#contact", "contact", "projects", "top 30%");
  }, [splineApp, isMobile, createSectionTimeline]);

  const updateKeyboardTransform = useCallback(async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const splineObjectNames = Object.keys(SPLINE_TO_SKILL_MAP);
    const skillObjects = allObjects.filter((obj) => splineObjectNames.includes(obj.name));

    await sleep(900);

    skillObjects.forEach(async (obj, idx) => {
      obj.visible = false;
      await sleep(idx * 40);
      obj.visible = true;
      gsap.fromTo(
        obj.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    });
  }, [splineApp, activeSection, isMobile]);

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();

    // Clock update logic
    const updateTime = () => {
      const timeObj = splineApp.findObjectByName("Time");
      if (timeObj) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        // @ts-ignore
        timeObj.text = `${hours}:${minutes}`;
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 60); // Update every minute

    return () => {
      clearInterval(timer);
    }

  }, [splineApp, isMobile, handleSplineInteractions, setupScrollAnimations]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    setSplineVariables(selectedSkill.label, selectedSkill.shortDescription);

    // Fallback for models without variables
    const textObj = splineApp.findObjectByName("Text");
    if (textObj) {
      // @ts-ignore
      textObj.text = `${selectedSkill.label}\n${selectedSkill.shortDescription}`;
    }
  }, [selectedSkill, splineApp, setSplineVariables]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 0.1 + kbd.rotation.y,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });
    }

    const manageAnimations = async () => {
      if (activeSection !== "skills") {
        setSplineVariables("", "");
      }

      if (activeSection === "hero") {
        rotateKeyboard?.restart();
      } else {
        rotateKeyboard?.pause();
      }
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
    };
  }, [activeSection, splineApp, setSplineVariables]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection, keyboardRevealed, router, updateKeyboardTransform]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="w-full h-full fixed"
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          (window as any).spline = app;
          bypassLoading();
        }}
        scene="/assets/skills-keyboard.spline"
      />
    </Suspense>
  );
};

export default AnimatedBackground;
