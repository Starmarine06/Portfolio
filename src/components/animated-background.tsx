"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
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
  linux: SkillNames.PYTHON,
  mongodb: SkillNames.NUMPY,
  express: SkillNames.PANDAS,
  firebase: SkillNames.PYTORCH,
  nodejs: SkillNames.TENSORFLOW,
  tailwind: SkillNames.SCIKIT,
  react: SkillNames.REACT,
  github: SkillNames.GITHUB,
  nextjs: SkillNames.VITE,
  html: SkillNames.REACT,
  css: SkillNames.VITE,
  npm: SkillNames.GITHUB,
  javascript: SkillNames.JAVASCRIPT,
  typescript: SkillNames.TYPESCRIPT,
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

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>();
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>();

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const router = useRouter();

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform" || e.target.name === "iPhone 14 Pro" || e.target.name === "Body-Screen") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("headingl") && splineApp.getVariable("desc")) {
        splineApp.setVariable("headingl", "");
        splineApp.setVariable("desc", "");
      }
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
  };

  const handleSplineInteractions = () => {
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
      splineApp.setVariable("headingl", "");
      splineApp.setVariable("desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skillKey = SPLINE_TO_SKILL_MAP[e.target.name] || (e.target.name as SkillNames);
      const skill = SKILLS[skillKey as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("headingl", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
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
        splineApp.setVariable("headingl", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);

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
  };

  // --- Animation Setup Helpers ---

  const createSectionTimeline = (
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard");
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
  };

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) return;
    const kbd = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard");
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
  };

  const getBongoAnimation = () => {
    return { start: () => { }, stop: () => { } };
  };

  const getKeycapsAnimation = () => {
    return { start: () => { }, stop: () => { } };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard");
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
  };

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

  }, [splineApp, isMobile]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("headingl", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    const kbd = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard");

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
        splineApp.setVariable("headingl", "");
        splineApp.setVariable("desc", "");
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
  }, [activeSection, splineApp]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

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
        scene="https://my.spline.design/skillskeyboard-jVDuxaTuaIbrR4WL6hRBQmSb/"
      />
    </Suspense>
  );
};

export default AnimatedBackground;
