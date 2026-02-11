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

// Map Spline object names (short) to SkillNames enum keys
const SPLINE_TO_SKILL_MAP: Record<string, SkillNames> = {
  "js": SkillNames.JAVASCRIPT,
  "ts": SkillNames.TYPESCRIPT,
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
  "aws": SkillNames.AWS
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

  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>();

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const router = useRouter();

  // --- Helpers ---

  const getSkillFromTarget = (targetName: string): Skill | undefined => {
    // Check direct match
    if (Object.values(SkillNames).includes(targetName as SkillNames)) {
      return SKILLS[targetName as SkillNames];
    }
    // Check map
    const mappedName = SPLINE_TO_SKILL_MAP[targetName];
    if (mappedName) {
      return SKILLS[mappedName];
    }
    return undefined;
  };

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform" || e.target.name === "iphone") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = getSkillFromTarget(e.target.name);
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

    const handleKeyUp = () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    };

    const handleKeyDown = (e: SplineEvent) => {
      if (!splineApp || isInputFocused()) return;
      const skill = getSkillFromTarget(e.target.name);
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    };

    const handleMouseDown = (e: SplineEvent) => {
      console.log("Clicked Spline Object:", e.target.name);
      const skill = getSkillFromTarget(e.target.name);
      if (skill && splineApp) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    };

    splineApp.addEventListener("keyUp", handleKeyUp);
    splineApp.addEventListener("keyDown", handleKeyDown);
    splineApp.addEventListener("mouseHover", handleMouseHover);
    splineApp.addEventListener("mouseDown", handleMouseDown);

    return () => {
      splineApp.removeEventListener("keyUp", handleKeyUp);
      splineApp.removeEventListener("keyDown", handleKeyDown);
      splineApp.removeEventListener("mouseHover", handleMouseHover);
      splineApp.removeEventListener("mouseDown", handleMouseDown);
    };
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
    // Try to find the root object. User mentioned iPhone, keeping fallback to keyboard just in case.
    const rootObj = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard") || splineApp.findObjectByName("Group");

    if (!rootObj) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(rootObj.scale, { ...state.scale, duration: 1 });
          gsap.to(rootObj.position, { ...state.position, duration: 1 });
          gsap.to(rootObj.rotation, { ...state.rotation, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile, });
          gsap.to(rootObj.scale, { ...state.scale, duration: 1 });
          gsap.to(rootObj.position, { ...state.position, duration: 1 });
          gsap.to(rootObj.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  };

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) return;
    const rootObj = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard") || splineApp.findObjectByName("Group");
    if (!rootObj) return;

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(rootObj.scale, heroState.scale);
    gsap.set(rootObj.position, heroState.position);

    // Section transitions
    createSectionTimeline("#skills", "skills", "hero");
    createSectionTimeline("#projects", "projects", "skills", "top 70%");
    createSectionTimeline("#contact", "contact", "projects", "top 30%");
  };

  // --- Time Update for iPhone ---
  useEffect(() => {
    if (!splineApp) return;

    const updateTime = () => {
      const textObj = splineApp.findObjectByName("Text");
      if (textObj) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        try {
          splineApp.setVariable("Time", timeString);
          splineApp.setVariable("Text", timeString);
        } catch (e) {
          console.warn("Could not set time variable", e);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, [splineApp]);

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const start = () => {
      removePrevTweens();
      Object.keys(SPLINE_TO_SKILL_MAP)
        .sort(() => Math.random() - 0.5)
        .forEach((keyName, idx) => {
          const keycap = splineApp.findObjectByName(keyName);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 20 + 20,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.1,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "sine.inOut",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.keys(SPLINE_TO_SKILL_MAP).forEach((keyName) => {
        const keycap = splineApp.findObjectByName(keyName);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1500);
    };

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const rootObj = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard") || splineApp.findObjectByName("Group");
    if (!rootObj) return;

    rootObj.visible = false;
    await sleep(400);
    rootObj.visible = true;

    setKeyboardRevealed(true);

    // Enable/Reveal Keys based on user row mapping
    const skillKeys = Object.keys(SPLINE_TO_SKILL_MAP); // ordered as defined if JS preserves order (it mostly does for string keys)
    // Actually relying on order is flaky. Let's use the explicit list.
    const mapping = [
      "js", "ts", "html", "css",
      "nextjs", "tailwind", "nodejs", "express",
      "git", "github", "react", "npm",
      "linux", "firebase", "mongodb", "aws"
    ];

    mapping.forEach(async (keyName, index) => {
      const obj = splineApp.findObjectByName(keyName);
      if (obj) {
        obj.visible = true;
        // Also try to find a "keycap" child inside if necessary
        // Depending on model structure, but user said "Each object has a keycap... to be enabled"
        // We set the object itself visible.
        // Add a small staggered animation
        await sleep(index * 50);
        gsap.fromTo(obj.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.7)" });
      }
    });

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      rootObj.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    keycapAnimationsRef.current = getKeycapsAnimation();

    // Cleanup if any animations need stopping
    return () => {
      keycapAnimationsRef.current?.stop();
    };
  }, [splineApp, isMobile]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill, splineApp]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const rootObj = splineApp.findObjectByName("iPhone 14 Pro") || splineApp.findObjectByName("keyboard") || splineApp.findObjectByName("Group");

    if (rootObj) {
      rotateKeyboard = gsap.to(rootObj.rotation, {
        y: Math.PI * 2 + rootObj.rotation.y,
        duration: 20, // Slower rotation for phone
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "sine.inOut",
        delay: 2.5,
        paused: true, // Start paused
      });

      // Adjust teardown animation for phone if needed
      teardownKeyboard = gsap.fromTo(
        rootObj.rotation,
        { y: 0, x: 0, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      // Reset text if not in skills
      if (activeSection !== "skills") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        await sleep(600);
        teardownKeyboard?.restart();
      } else {
        await sleep(600);
        teardownKeyboard?.pause();
      }
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection, keyboardRevealed, router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="w-full h-full fixed"
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          bypassLoading();
        }}
        scene="/assets/iphone_new.spline"
      />
    </Suspense>
  );
};

export default AnimatedBackground;
