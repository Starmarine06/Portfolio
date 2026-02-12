"use client";
import { useState } from "react";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import SkillCard from "./skill-card";
import { Skill, SkillCategory, SKILLS } from "@/data/constants";
import { useSkillKeyboard } from "@/hooks/use-skill-keyboard";
import { useSkillContext } from "@/contexts/skill-context";
import { cn } from "@/lib/utils";

const categories: { value: SkillCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'tools', label: 'Tools' },
  { value: 'cloud', label: 'Cloud' },
];

const SkillsSection = () => {
  const { selectedSkill, setSelectedSkill } = useSkillContext();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  // Enable keyboard shortcuts
  useSkillKeyboard({
    onSkillSelect: setSelectedSkill,
    enabled: true,
  });

  // Filter skills by category
  const filteredSkills = Object.values(SKILLS).filter(
    skill => activeCategory === 'all' || skill.category === activeCategory
  );

  return (
    <SectionWrapper id="skills" className="w-full h-screen md:h-[150dvh] relative">
      <SectionHeader
        id='skills'
        title="Tech Stack"
        desc="(hint: hover apps or start typing)"
      />

      {/* Category Filters */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
        <div className="flex gap-2 bg-white/5 dark:bg-black/20 backdrop-blur-xl rounded-full p-2 border border-white/10">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === category.value
                  ? "bg-white/20 text-white shadow-lg shadow-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcut Hints */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex gap-2 items-center text-xs text-gray-400">
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded">Q-H</kbd>
          <span>Quick access to skills</span>
        </div>
      </div>

      {/* Skill Card Display */}
      {selectedSkill && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <SkillCard
            skill={selectedSkill}
            position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default SkillsSection;
