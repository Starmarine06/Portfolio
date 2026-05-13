"use client";
import { useCallback } from "react";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { useSkillContext } from "@/contexts/skill-context";
import { useSkillKeyboard } from "@/hooks/use-skill-keyboard";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skill } from "@/data/constants";

// ── Proficiency stars ────────────────────────────────────────────────────────
const ProficiencyStars = ({ level }: { level: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3].map((star) => (
      <svg
        key={star}
        className={cn("w-4 h-4", star <= level ? "text-yellow-400 fill-yellow-400" : "text-gray-500 fill-gray-500/30")}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

const CATEGORY_COLOUR: Record<string, string> = {
  frontend: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  backend:  "bg-green-500/20 text-green-300 border-green-500/40",
  tools:    "bg-purple-500/20 text-purple-300 border-purple-500/40",
  cloud:    "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

// ── Skill Info Panel ─────────────────────────────────────────────────────────
// Rendered as FIXED so it's immune to SectionWrapper's scroll-based opacity/scale
const SkillPanel = ({ skill, onClose }: { skill: Skill; onClose: () => void }) => (
  <motion.div
    key={skill.name}
    initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, x: -30, filter: "blur(8px)", transition: { duration: 0.25 } }}
    transition={{ type: "spring", damping: 22, stiffness: 120 }}
    // FIXED positioning: independent of any parent scroll/transform/opacity animation
    className={cn(
      "fixed left-6 md:left-16 top-1/2 -translate-y-1/2",
      "w-72 md:w-80 rounded-2xl p-6",
      "bg-black/70 backdrop-blur-2xl",
      "border border-white/15",
      "shadow-2xl shadow-black/60",
      // z-[60]: above header (z-[60]), visible over everything
      "z-[90]",
      // pointer-events auto: close button and text must be interactive
      "pointer-events-auto",
    )}
  >
    <div className="flex items-start gap-3 mb-3">
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-white leading-tight">{skill.label}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{skill.shortDescription}</p>
      </div>
      {skill.keyboardShortcut && (
        <kbd className="mt-1 flex items-center justify-center w-7 h-7 rounded-lg
                        bg-white/10 border border-white/20 text-xs font-mono font-bold text-white shrink-0">
          {skill.keyboardShortcut.toUpperCase()}
        </kbd>
      )}
    </div>

    <div className="flex items-center gap-3 mb-3">
      <ProficiencyStars level={skill.proficiency} />
      {skill.yearsOfExperience && (
        <span className="text-xs text-gray-400">{skill.yearsOfExperience}+ yrs</span>
      )}
    </div>

    <span className={cn(
      "inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4",
      CATEGORY_COLOUR[skill.category] ?? "bg-gray-500/20 text-gray-300 border-gray-500/40",
    )}>
      {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
    </span>

    <p className="text-sm text-gray-300 leading-relaxed">{skill.description}</p>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
  </motion.div>
);

// ── Section ──────────────────────────────────────────────────────────────────
import { useSectionContext } from "@/contexts/section-context";

const SkillsSection = () => {
  const { activeSection } = useSectionContext();
  const { selectedSkill, setSelectedSkill } = useSkillContext();
  const handleClose = useCallback(() => setSelectedSkill(null), [setSelectedSkill]);

  useSkillKeyboard({ onSkillSelect: setSelectedSkill, enabled: true });
  const isInactive = activeSection !== "skills";

  return (
    <>
      {/* Fixed skill panel — outside SectionWrapper so scroll animations don't clip it */}
      <AnimatePresence mode="wait">
        {selectedSkill && <SkillPanel skill={selectedSkill} onClose={handleClose} />}
      </AnimatePresence>

      <SectionWrapper id="skills" className={cn("w-full min-h-screen md:min-h-[150dvh] relative", isInactive && "pointer-inactive")}>
        <SectionHeader
          id="skills"
          title="Tech Stack"
          desc="(click an app icon on the phone)"
        />
      </SectionWrapper>
    </>
  );
};

export default SkillsSection;
