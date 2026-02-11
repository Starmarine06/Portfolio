export enum SkillNames {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  HTML = "html",
  CSS = "css",
  NEXTJS = "nextjs",
  TAILWIND = "tailwind",
  NODEJS = "nodejs",
  EXPRESS = "express",
  GIT = "git",
  GITHUB = "github",
  REACT = "react",
  NPM = "npm",
  LINUX = "linux",
  FIREBASE = "firebase",
  MONGODB = "mongodb",
  AWS = "aws",
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.JAVASCRIPT]: {
    id: 1,
    name: "javascript",
    label: "JavaScript",
    shortDescription: "Making the web interactive. console.log('Hello World')! �",
    color: "#f7df1e",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  [SkillNames.TYPESCRIPT]: {
    id: 2,
    name: "typescript",
    label: "TypeScript",
    shortDescription: "JavaScript with superpowers. No more undefined is not a function! 🟦",
    color: "#3178c6",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  [SkillNames.HTML]: {
    id: 3,
    name: "html",
    label: "HTML5",
    shortDescription: "The skeleton of the web. tag <> life! 🌐",
    color: "#e34f26",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  [SkillNames.CSS]: {
    id: 4,
    name: "css",
    label: "CSS3",
    shortDescription: "Making the ugly web beautiful. 🎨",
    color: "#1572b6",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  [SkillNames.NEXTJS]: {
    id: 5,
    name: "nextjs",
    label: "Next.js",
    shortDescription: "React on steroids. Server-side rendering FTW! �",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  [SkillNames.TAILWIND]: {
    id: 6,
    name: "tailwind",
    label: "Tailwind CSS",
    shortDescription: "CSS without the headache. Utility-first magic! 🌊",
    color: "#06b6d4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg",
  },
  [SkillNames.NODEJS]: {
    id: 7,
    name: "nodejs",
    label: "Node.js",
    shortDescription: "JavaScript outside the browser. Backend dominance! 🟢",
    color: "#339933",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  [SkillNames.EXPRESS]: {
    id: 8,
    name: "express",
    label: "Express",
    shortDescription: "The minimal web framework for Node.js. Choo choo! 🚂",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  [SkillNames.GIT]: {
    id: 9,
    name: "git",
    label: "Git",
    shortDescription: "Saving your code from yourself since 2005. 🌲",
    color: "#f05032",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  [SkillNames.GITHUB]: {
    id: 10,
    name: "github",
    label: "GitHub",
    shortDescription: "Sliding into those pull requests, IYKYK! �",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  [SkillNames.REACT]: {
    id: 11,
    name: "react",
    label: "React",
    shortDescription: "Building UI components like Lego blocks! ⚛️",
    color: "#61dafb",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  [SkillNames.NPM]: {
    id: 12,
    name: "npm",
    label: "NPM",
    shortDescription: "Standard registry for JavaScript packages. Don't delete node_modules! 📦",
    color: "#cb3837",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  },
  [SkillNames.LINUX]: {
    id: 13,
    name: "linux",
    label: "Linux",
    shortDescription: "There is no place like ~ 🐧",
    color: "#fcc624",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  [SkillNames.FIREBASE]: {
    id: 14,
    name: "firebase",
    label: "Firebase",
    shortDescription: "Backend as a Service. Real-time magic! 🔥",
    color: "#ffca28",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  [SkillNames.MONGODB]: {
    id: 15,
    name: "mongodb",
    label: "MongoDB",
    shortDescription: "NoSQL database for modern apps. Storing JSON-like documents! 🍃",
    color: "#47A248",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  [SkillNames.AWS]: {
    id: 16,
    name: "aws",
    label: "AWS",
    shortDescription: "The cloud computing giant. Infinite scalability! ☁️",
    color: "#ff9900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
};


export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};
