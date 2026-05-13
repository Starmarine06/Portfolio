"use client";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSectionContext } from "@/contexts/section-context";
import { Section } from "./animated-background-config";

interface TabConfig {
  section: Section;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { section: "hero",     label: "Home",     icon: "⌂" },
  { section: "skills",   label: "Skills",   icon: "⚡" },
  { section: "projects", label: "Projects", icon: "◈" },
  { section: "contact",  label: "Contact",  icon: "✉" },
];

const SECTION_TO_ID: Record<Section, string> = {
  hero:       "hero",
  about:      "about",
  experience: "experience",
  skills:     "skills",
  projects:   "projects",
  contact:    "contact",
};

export const SectionTabs: React.FC = () => {
  const { activeSection, navigateToSection } = useSectionContext();

  const handleTabClick = useCallback(
    (section: Section) => {
      if (navigateToSection) navigateToSection(section);
      const el = document.getElementById(SECTION_TO_ID[section]);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [navigateToSection],
  );

  return (
    <nav
      id="section-tabs"
      aria-label="Section navigation"
      className={cn(
        "fixed right-4 md:right-6 top-1/2 -translate-y-1/2",
        "z-[80]",
        "flex flex-col gap-3",
      )}
    >
      {TABS.map(({ section, label, icon }) => {
        const isActive = activeSection === section;
        return (
          <button
            key={section}
            id={`tab-btn-${section}`}
            onClick={() => handleTabClick(section)}
            aria-label={`Navigate to ${label}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center justify-end overflow-hidden",
              "rounded-full border transition-all duration-300 ease-out",
              "cursor-pointer select-none",
              "h-3 w-3",
              "hover:h-9 hover:w-28",
              isActive && "h-9 w-28",
              // Adaptive Colours: border and background change based on theme
              isActive
                ? "border-foreground/50 bg-foreground/10 shadow-lg shadow-black/5 dark:shadow-white/5"
                : "border-foreground/20 bg-foreground/5 hover:border-foreground/40 hover:bg-foreground/10",
            )}
          >
            {/* Icon — adaptive color */}
            <span
              className={cn(
                "absolute left-0 flex-shrink-0 flex items-center justify-center",
                "w-9 h-9 text-sm text-foreground",
                "opacity-0 transition-opacity duration-200",
                "group-hover:opacity-100",
                isActive && "opacity-100",
              )}
            >
              {icon}
            </span>

            {/* Label — adaptive color */}
            <span
              className={cn(
                "pr-3 text-xs font-medium whitespace-nowrap text-foreground",
                "opacity-0 transition-opacity duration-200 delay-75",
                "group-hover:opacity-100",
                isActive && "opacity-100",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default SectionTabs;
