"use client";
import Image from "next/image";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "../ui/animated-modal";
import { FloatingDock } from "../ui/floating-dock";
import Link from "next/link";
import projects, { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { useOptionalSectionContext } from "@/contexts/section-context";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const ProjectsSection = () => {
  const sectionCtx = useOptionalSectionContext();
  const isInactive = sectionCtx ? sectionCtx.activeSection !== "projects" : false;

  return (
    <SectionWrapper
      id="projects"
      className={cn("max-w-7xl mx-auto py-12 md:py-20", isInactive && "pointer-inactive")}
    >
      <SectionHeader id="projects" title="Featured Projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6">
        {projects.map((project) => (
          <Modal key={project.id}>
            <ProjectCard project={project} />
          </Modal>
        ))}
      </div>
    </SectionWrapper>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <ModalTrigger className="bg-transparent p-0 flex justify-center group/modal-btn w-full rounded-2xl cursor-pointer">
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-neutral-600 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 group text-left"
          style={{ aspectRatio: "16/10" }}
        >
          <Image
            className="absolute w-full h-full top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-700"
            src={project.src}
            alt={project.title}
            width={600}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
          
          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider bg-black/60 text-neutral-300 border border-white/10 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 mb-1">
              {project.title}
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-2">
              Click to view architecture, tech stack & details
            </p>
          </div>
        </div>
      </ModalTrigger>

      <ModalBody className="max-h-[88vh]">
        <ModalContent className="p-6 md:p-8">
          <ProjectContents project={project} />
        </ModalContent>
        <ProjectModalFooter project={project} />
      </ModalBody>
    </div>
  );
};

const ProjectModalFooter = ({ project }: { project: Project }) => {
  const { setOpen } = useModal();

  return (
    <ModalFooter className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-100/50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
        className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        Close
      </Button>

      <div className="flex items-center gap-2">
        {project.github && (
          <Link href={project.github} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Github className="w-3.5 h-3.5" />
              GitHub
            </Button>
          </Link>
        )}
        {project.live && (
          <Link href={project.live} target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="sm" className="gap-2 text-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              Visit
            </Button>
          </Link>
        )}
      </div>
    </ModalFooter>
  );
};

const ProjectContents = ({ project }: { project: Project }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            {project.category}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {project.title}
        </h2>
      </div>

      {/* Tech Stack Floating Docks */}
      {(project.skills.frontend?.length > 0 || project.skills.backend?.length > 0) && (
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80">
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 text-center">
            Technologies & Frameworks
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            {project.skills.frontend?.length > 0 && (
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-medium text-neutral-400">Core / Frontend</span>
                <FloatingDock items={project.skills.frontend} />
              </div>
            )}
            {project.skills.backend?.length > 0 && (
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-medium text-neutral-400">Backend / Engine</span>
                <FloatingDock items={project.skills.backend} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content / Features */}
      <div className="text-sm leading-relaxed text-foreground">
        {project.content}
      </div>
    </div>
  );
};

export default ProjectsSection;