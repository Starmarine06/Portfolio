"use client";

import React from "react";
import SmoothScroll from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/animated-background";
import SkillsSection from "@/components/sections/skills";
import ProjectsSection from "@/components/sections/projects";
import ContactSection from "@/components/sections/contact";
import HeroSection from "@/components/sections/hero";
import MatrixBackground from "@/components/MatrixBackground";
import { SkillProvider } from "@/contexts/skill-context";

function MainPage() {
  return (
    <SkillProvider>
      <SmoothScroll>
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <MatrixBackground />
        </div>
        <AnimatedBackground />
        <main className={cn("bg-white/40 dark:bg-transparent canvas-overlay-mode")}>
          <HeroSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </SmoothScroll>
    </SkillProvider>
  );
}

export default MainPage;
