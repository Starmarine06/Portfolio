import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiChakraui,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReactquery,
  SiSanity,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
  SiUnity,
  SiTelegram,
  SiNvidia,
} from "react-icons/si";
import { FaJava, FaRobot, FaWindows } from "react-icons/fa";
import { TbBrandFramerMotion } from "react-icons/tb";
const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3 my-4 mb-6">
      {live && (
        <Link
          className="no-underline inline-flex"
          rel="noopener noreferrer"
          target="_blank"
          href={live}
        >
          <Button variant={"default"} size={"sm"} className="gap-2 font-medium">
            Visit Project
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
      {repo && (
        <Link
          className="no-underline inline-flex"
          rel="noopener noreferrer"
          target="_blank"
          href={repo}
        >
          <Button variant={"outline"} size={"sm"} className="gap-2 font-medium">
            GitHub Repo
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  chakra: {
    title: "Chakra UI",
    bg: "black",
    fg: "white",
    icon: <SiChakraui />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <SiPython />,
  },
  nvidia: {
    title: "NVIDIA AI",
    bg: "black",
    fg: "white",
    icon: <SiNvidia />,
  },
  telegram: {
    title: "Telegram Bot API",
    bg: "black",
    fg: "white",
    icon: <SiTelegram />,
  },
  windows: {
    title: "Windows Automation",
    bg: "black",
    fg: "white",
    icon: <FaWindows />,
  },
  ai: {
    title: "LLM Agent",
    bg: "black",
    fg: "white",
    icon: <FaRobot />,
  },
  prisma: {
    title: "prisma",
    bg: "black",
    fg: "white",
    icon: <SiPrisma />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  reactQuery: {
    title: "React Query",
    bg: "black",
    fg: "white",
    icon: <SiReactquery />,
  },
  shadcn: {
    title: "Shadcn UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  docker: {
    title: "Docker",
    bg: "black",
    fg: "white",
    icon: <SiDocker />,
  },
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  sockerio: {
    title: "Socket.io",
    bg: "black",
    fg: "white",
    icon: <SiSocketdotio />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  vue: {
    title: "Vue.js",
    bg: "black",
    fg: "white",
    icon: <SiVuedotjs />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  sanity: {
    title: "Sanity",
    bg: "black",
    fg: "white",
    icon: <SiSanity />,
  },
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: {
    title: "GSAP",
    bg: "black",
    fg: "white",
    icon: "",
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },
  csharp: {
    title: "C#",
    bg: "black",
    fg: "white",
    icon: <FaJava />,
  },
  unity: {
    title: "Unity",
    bg: "black",
    fg: "white",
    icon: <SiUnity />,
  },
  java: {
    title: "Java",
    bg: "black",
    fg: "white",
    icon: <FaJava />,
  },
  minecraft: {
    title: "Minecraft",
    bg: "black",
    fg: "white",
    icon: "⛏️",
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "bouncelol",
    category: "Game",
    title: "BounceLOL",
    src: "/assets/projects-screenshots/bouncelol/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.csharp, PROJECT_SKILLS.unity],
      backend: [],
    },
    live: "https://github.com/Starmarine06/BounceLOL",
    github: "https://github.com/Starmarine06/BounceLOL",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            The game bouncelol on google play store
          </TypographyP>
          <TypographyP className="font-mono">
            BounceLOL is a vibrant and highly random game featuring an in-game store with various skins and trails. Compete with your friends on the inbuilt leaderboard and enjoy the colorful chaos!
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>In-game Store with skins and trails</li>
            <li>Monetization through ads and in-game currency</li>
            <li>Inbuilt Leaderboard for social competition</li>
            <li>Visually dynamic and randomized gameplay</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "recommendme",
    category: "Web Application",
    title: "RecommendMe",
    src: "/assets/projects-screenshots/recommendme/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.ts, PROJECT_SKILLS.next, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.firebase],
    },
    live: "https://recommendme-101.web.app/",
    github: "https://github.com/Starmarine06/RecommendMe",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            A website that will recommend you anything!
          </TypographyP>
          <TypographyP className="font-mono">
            RecommendMe provides personalized recommendations across media categories like Anime, Movies, and Cartoon Series. Discover your next favorite show with ease.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Media Categories</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>Anime</li>
            <li>Movies</li>
            <li>Cartoon Series</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "portfolio",
    category: "Portfolio",
    title: "Professional Portfolio",
    src: "/assets/projects-screenshots/portfolio/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.spline,
        PROJECT_SKILLS.framerMotion,
      ],
      backend: [],
    },
    live: "https://devnambiar.in",
    github: "https://github.com/Starmarine06/Portfolio",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            AI & ML Engineer Portfolio
          </TypographyP>
          <TypographyP className="font-mono">
            A high-performance personal portfolio showcasing expertise in machine learning and web development. Features interactive 3D elements and a sleek, modern design.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
        </div>
      );
    },
  },
  {
    id: "graves",
    category: "Minecraft Datapack",
    title: "Graves",
    src: "/assets/projects-screenshots/graves/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.minecraft, PROJECT_SKILLS.java],
      backend: [],
    },
    live: "https://www.planetminecraft.com/data-pack/graves-by-starmarine06/",
    github: "https://github.com/Starmarine06/Graves",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Adds a simple grave to Minecraft
          </TypographyP>
          <TypographyP className="font-mono">
            Tired of losing your items on death? Graves automatically creates a grave at your death location, safely storing your items until you return to claim them.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
        </div>
      );
    },
  },
  {
    id: "ai-assistant",
    category: "AI/ML",
    title: "AI Assistant",
    src: "/assets/projects-screenshots/ai-assistant/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.ai,
        PROJECT_SKILLS.telegram,
        PROJECT_SKILLS.windows,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.nvidia,
      ],
    },
    live: "https://github.com/Starmarine06/AIAssistant",
    github: "https://github.com/Starmarine06/AIAssistant",
    get content() {
      return (
        <div className="space-y-4">
          <TypographyP className="text-xl font-semibold text-center text-foreground/90">
            Windows-based Autonomous Personal AI Assistant
          </TypographyP>
          <TypographyP className="text-muted-foreground leading-relaxed">
            AI Assistant is a desktop automation and intelligent assistant system powered by NVIDIA-hosted LLMs and the Telegram Bot API. It seamlessly bridges mobile control with desktop automation, giving you complete remote mastery over your Windows workstation.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          
          <TypographyH3 className="my-3 mt-6 text-lg font-bold">Key Capabilities</TypographyH3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="block text-foreground mb-1">🖥️ PC Automation & Control</strong>
              <span className="text-muted-foreground">Run terminal commands, launch applications/websites, manage clipboard, and lock/unlock Windows workstation.</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="block text-foreground mb-1">🎯 Vision & Coordinate Grid</strong>
              <span className="text-muted-foreground">Grid screenshot overlay (A1-J10) and coordinate-based mouse clicking and typing simulation.</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="block text-foreground mb-1">📅 Smart Scheduler & Calendar</strong>
              <span className="text-muted-foreground">Google Calendar synchronization, background interval tasks, custom timers, and WhatsApp messaging via local address book.</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="block text-foreground mb-1">⚡ Dynamic Skills & Tray GUI</strong>
              <span className="text-muted-foreground">Dynamically register custom Python modules, system tray controls, macro recorder, and configuration GUI.</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "prismcraft",
    category: "Minecraft Mod",
    title: "PrismCraft Mod",
    src: "/assets/projects-screenshots/prismcraft/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.minecraft, PROJECT_SKILLS.java],
      backend: [],
    },
    live: "https://www.curseforge.com/minecraft/mc-mods/prismcraft-dyeable-blocks",
    github: "https://github.com/Starmarine06/PrismCraft",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Infinite Spectrum of Colors
          </TypographyP>
          <TypographyP className="font-mono">
            Imagine having the power to create any shade you desire, bringing unparalleled customization and vibrancy to your builds. This mod introduces a powerful mechanic to dye blocks, unleashing a world of color you&apos;ve only dreamed of. By mixing up to three dyes, you can generate unique custom colors and apply them to your favorite blocks.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Unleash Creativity</TypographyH3>
          <TypographyP className="font-mono">
            Whether you&apos;re building a sprawling city or a cozy cottage, you&apos;ll never have to compromise on your color scheme again. Transform your Minecraft world with an infinite spectrum of colors and elevate your building game.
          </TypographyP>
        </div>
      );
    },
  },
];
export default projects;
