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
import { SectionProvider } from "@/contexts/section-context";
import SectionTabs from "@/components/section-tabs";

function MainPage() {
  return (
    <SectionProvider>
      <SkillProvider>
        <SmoothScroll>
          {/* z-0: decorative matrix */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <MatrixBackground />
          </div>

          {/* z-20: Spline canvas — ABOVE main (z-10) to guarantee pointer events.
              Headings in sections use z-30 so text appears in front of the model.
              Buttons/links use z-40 so they stay clickable above everything. */}
          <AnimatedBackground />

          {/* z-10: page content — rendered below Spline canvas visually.
              canvas-overlay-mode makes the entire tree pointer-events:none
              except for explicitly overridden interactive elements. */}
          <main className={cn("relative z-[40] bg-transparent canvas-overlay-mode")}>
            <HeroSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </main>

          {/* z-50: section nav tabs */}
          <SectionTabs />
        </SmoothScroll>
      </SkillProvider>
    </SectionProvider>
  );
}

export default MainPage;
