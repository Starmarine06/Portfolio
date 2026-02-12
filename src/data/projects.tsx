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
  SiCsharp,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandFramerMotion } from "react-icons/tb";
const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
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
    title: "ShanCN UI",
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
    icon: <SiCsharp />,
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
    live: "https://devnambiar.vercel.app",
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
    id: "flood-management",
    category: "Web / Utility",
    title: "Flood Management System",
    src: "/assets/projects-screenshots/flood-management/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.js, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.mongo],
    },
    live: "https://github.com/Starmarine06/Flood-Management-App",
    github: "https://github.com/Starmarine06/Flood-Management-App",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Real-time Flood Disaster Management
          </TypographyP>
          <TypographyP className="font-mono">
            A comprehensive system for tracking flood levels, reporting disasters, and coordinating rescue efforts. Designed to provide real-time updates and critical information during flood events.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
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
    live: "https://github.com/Starmarine06/PrismCraft",
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
