export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'cloud';
export type SkillProficiency = 1 | 2 | 3; // 1: Beginner, 2: Intermediate, 3: Expert

export interface Skill {
  name: string;
  label: string;
  shortDescription: string;
  description: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  yearsOfExperience?: number;
  keyboardShortcut?: string;
  icon?: string;
}

export enum SkillNames {
  // Row 1
  TENSORFLOW = "tensorflow",
  UNITY = "unity",
  HTML = "html",
  CSS = "css",
  // Row 2
  NEXTJS = "nextjs",
  TAILWIND = "tailwind",
  NODEJS = "nodejs",
  EXPRESS = "express",
  // Row 3
  GIT = "git",
  GITHUB = "github",
  REACT = "react",
  NPM = "npm",
  // Row 4
  LINUX = "linux",
  FIREBASE = "firebase",
  MONGODB = "mongodb",
  AWS = "aws"
}

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.TENSORFLOW]: {
    name: SkillNames.TENSORFLOW,
    label: "TensorFlow",
    shortDescription: "Machine learning framework for building AI models",
    description: "TensorFlow is an open-source machine learning framework developed by Google. Used for building and training neural networks, deep learning models, and AI applications.",
    category: "tools",
    proficiency: 2,
    yearsOfExperience: 2,
    keyboardShortcut: "q",
  },
  [SkillNames.UNITY]: {
    name: SkillNames.UNITY,
    label: "Unity",
    shortDescription: "Game engine for 2D/3D game development",
    description: "Unity is a cross-platform game engine for creating 2D and 3D games, simulations, and interactive experiences. Supports C# scripting and real-time rendering.",
    category: "tools",
    proficiency: 2,
    yearsOfExperience: 1,
    keyboardShortcut: "w",
  },
  [SkillNames.HTML]: {
    name: SkillNames.HTML,
    label: "HTML",
    shortDescription: "Markup language for web structure",
    description: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. Defines the structure and content of websites.",
    category: "frontend",
    proficiency: 3,
    yearsOfExperience: 4,
    keyboardShortcut: "e",
  },
  [SkillNames.CSS]: {
    name: SkillNames.CSS,
    label: "CSS",
    shortDescription: "Styling language for web design",
    description: "CSS (Cascading Style Sheets) is used for styling and laying out web pages. Controls colors, fonts, spacing, animations, and responsive design.",
    category: "frontend",
    proficiency: 3,
    yearsOfExperience: 4,
    keyboardShortcut: "r",
  },
  [SkillNames.NEXTJS]: {
    name: SkillNames.NEXTJS,
    label: "Next.js",
    shortDescription: "React framework for production-ready applications",
    description: "Next.js is a React framework for building full-stack web applications with server-side rendering, static site generation, and API routes.",
    category: "frontend",
    proficiency: 3,
    yearsOfExperience: 3,
    keyboardShortcut: "t",
  },
  [SkillNames.TAILWIND]: {
    name: SkillNames.TAILWIND,
    label: "Tailwind CSS",
    shortDescription: "Utility-first CSS framework",
    description: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces with pre-defined classes.",
    category: "frontend",
    proficiency: 3,
    yearsOfExperience: 3,
    keyboardShortcut: "y",
  },
  [SkillNames.NODEJS]: {
    name: SkillNames.NODEJS,
    label: "Node.js",
    shortDescription: "JavaScript runtime for server-side development",
    description: "Node.js is a JavaScript runtime built on Chrome's V8 engine. Enables building scalable server-side applications with JavaScript.",
    category: "backend",
    proficiency: 3,
    yearsOfExperience: 3,
    keyboardShortcut: "u",
  },
  [SkillNames.EXPRESS]: {
    name: SkillNames.EXPRESS,
    label: "Express",
    shortDescription: "Fast web framework for Node.js",
    description: "Express is a minimal and flexible Node.js web application framework for building APIs and web applications with robust features.",
    category: "backend",
    proficiency: 3,
    yearsOfExperience: 3,
    keyboardShortcut: "i",
  },
  [SkillNames.GIT]: {
    name: SkillNames.GIT,
    label: "Git",
    shortDescription: "Version control system for tracking code changes",
    description: "Git is a distributed version control system for tracking changes in source code during software development. Essential for collaboration.",
    category: "tools",
    proficiency: 3,
    yearsOfExperience: 4,
    keyboardShortcut: "o",
  },
  [SkillNames.GITHUB]: {
    name: SkillNames.GITHUB,
    label: "GitHub",
    shortDescription: "Platform for hosting and collaborating on code",
    description: "GitHub is a web-based platform for version control and collaboration using Git. Hosts repositories and provides project management tools.",
    category: "tools",
    proficiency: 3,
    yearsOfExperience: 4,
    keyboardShortcut: "p",
  },
  [SkillNames.REACT]: {
    name: SkillNames.REACT,
    label: "React",
    shortDescription: "JavaScript library for building user interfaces",
    description: "React is a JavaScript library for building component-based user interfaces. Developed by Facebook, it's the foundation of modern web development.",
    category: "frontend",
    proficiency: 3,
    yearsOfExperience: 3,
    keyboardShortcut: "a",
  },
  [SkillNames.NPM]: {
    name: SkillNames.NPM,
    label: "NPM",
    shortDescription: "Package manager for JavaScript",
    description: "NPM (Node Package Manager) is the default package manager for Node.js. Manages dependencies and packages for JavaScript projects.",
    category: "tools",
    proficiency: 3,
    yearsOfExperience: 3,
    keyboardShortcut: "s",
  },
  [SkillNames.LINUX]: {
    name: SkillNames.LINUX,
    label: "Linux",
    shortDescription: "Open-source operating system",
    description: "Linux is an open-source Unix-like operating system. Widely used for servers, development environments, and cloud infrastructure.",
    category: "tools",
    proficiency: 2,
    yearsOfExperience: 2,
    keyboardShortcut: "d",
  },
  [SkillNames.FIREBASE]: {
    name: SkillNames.FIREBASE,
    label: "Firebase",
    shortDescription: "Backend platform for web and mobile apps",
    description: "Firebase is Google's platform for building web and mobile applications. Provides authentication, database, hosting, and cloud functions.",
    category: "cloud",
    proficiency: 2,
    yearsOfExperience: 2,
    keyboardShortcut: "f",
  },
  [SkillNames.MONGODB]: {
    name: SkillNames.MONGODB,
    label: "MongoDB",
    shortDescription: "NoSQL database for modern applications",
    description: "MongoDB is a document-oriented NoSQL database for storing and retrieving data in JSON-like format. Highly scalable and flexible.",
    category: "backend",
    proficiency: 3,
    yearsOfExperience: 2,
    keyboardShortcut: "g",
  },
  [SkillNames.AWS]: {
    name: SkillNames.AWS,
    label: "AWS",
    shortDescription: "Cloud computing platform by Amazon",
    description: "Amazon Web Services (AWS) is a comprehensive cloud computing platform offering compute power, storage, databases, and more.",
    category: "cloud",
    proficiency: 2,
    yearsOfExperience: 1,
    keyboardShortcut: "h",
  },
};

export const themeDisclaimers = {
  light: [
    "Are you sure? The light can be blinding! ☀️",
    "Warning: May cause sudden productivity! 💡",
    "Embrace the brightness! Your eyes will adjust... eventually 😎",
    "Going light mode? Bold choice! 🌟",
    "Light mode activated! Time to shine! ✨",
  ],
  dark: [
    "Welcome to the dark side 🌙",
    "Your eyes will thank you later 😌",
    "Darkness is your friend 🖤",
    "Join us in the shadows... 🌑",
    "Dark mode: Because your retinas matter 👀",
  ],
};
