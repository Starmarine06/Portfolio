"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Section } from "@/components/animated-background-config";

interface SectionContextType {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  /** Called by SectionTabs when a tab is clicked — triggers model rotation */
  navigateToSection: ((section: Section) => void) | null;
  /** Registered by AnimatedBackground so tabs can trigger model rotation */
  registerNavigate: (fn: (section: Section) => void) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const SectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [navigateToSection, setNavigateToSection] = useState<((section: Section) => void) | null>(null);

  const registerNavigate = useCallback((fn: (section: Section) => void) => {
    setNavigateToSection(() => fn);
  }, []);

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection, navigateToSection, registerNavigate }}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSectionContext = () => {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error("useSectionContext must be used within SectionProvider");
  return ctx;
};
