// thoda zada ts ho gya idhar
export enum SkillNames {
  UNITY = "unity",
  GITHUB = "github",
  UNREAL = "unreal",
  REACT = "react",
  VITE = "vite",
  POSTMAN = "postman",
  POWERBI = "powerbi",
  TENSORFLOW = "tensorflow",
  SCIKIT = "scikit",
  NEXTJS = "nextjs",
  NODEJS = "nodejs",
  MONGODB = "mongodb",
  EXPRESS = "express",
  POSTGRES = "postgres",
  TYPESCRIPT = "typescript",
  JAVASCRIPT = "javascript",
  PYTORCH = "pytorch",
  PYTHON = "python",
  NUMPY = "numpy",
  PANDAS = "pandas",
}
export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};
export const SKILLS: Partial<Record<SkillNames, Skill>> = {
  [SkillNames.UNITY]: {
    id: 1,
    name: "unity",
    label: "Unity",
    shortDescription: "Building immersive 3D worlds and games! 🎮✨",
    color: "#ffffff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
  },
  [SkillNames.GITHUB]: {
    id: 2,
    name: "github",
    label: "GitHub",
    shortDescription: "Sliding into those pull requests, IYKYK! 🐙",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  [SkillNames.UNREAL]: {
    id: 3,
    name: "unreal",
    label: "Unreal Engine",
    shortDescription: "High-fidelity graphics and intense C++ action! 🚀🔥",
    color: "#313131",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg",
  },
  [SkillNames.REACT]: {
    id: 4,
    name: "react",
    label: "React",
    shortDescription: "Declarative, efficient, and flexible JavaScript library for building user interfaces. ⚛️",
    color: "#61dafb",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  [SkillNames.VITE]: {
    id: 5,
    name: "vite",
    label: "Vite",
    shortDescription: "The next generation of frontend tooling. Fast AF! ⚡",
    color: "#646cff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
  },
  [SkillNames.POSTMAN]: {
    id: 6,
    name: "postman",
    label: "Postman",
    shortDescription: "Testing APIs like a pro, no cap! 📮",
    color: "#ff6c37",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },
  [SkillNames.POWERBI]: {
    id: 7,
    name: "powerbi",
    label: "Power BI",
    shortDescription: "Visualizing data and gaining insights! 📊📈",
    color: "#f2c811",
    icon: "https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/SVG/PowerBI.svg",
  },
  [SkillNames.TENSORFLOW]: {
    id: 8,
    name: "tensorflow",
    label: "Tensorflow",
    shortDescription: "Intelligence at your fingertips. ML go brrr! 🧠🤖",
    color: "#ff6f00",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  [SkillNames.SCIKIT]: {
    id: 9,
    name: "scikit",
    label: "SciKit-Learn",
    shortDescription: "Machine learning in Python, simplified! 🐍🔬",
    color: "#f7931e",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
  },
  [SkillNames.PYTORCH]: {
    id: 10,
    name: "pytorch",
    label: "PyTorch",
    shortDescription: "The preferred deep learning framework for researchers and developers alike. 🔥",
    color: "#ee4c2c",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  [SkillNames.PYTHON]: {
    id: 11,
    name: "python",
    label: "Python",
    shortDescription: "The Swiss Army knife of programming languages. 🐍",
    color: "#3776ab",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  [SkillNames.NUMPY]: {
    id: 12,
    name: "numpy",
    label: "NumPy",
    shortDescription: "The fundamental package for scientific computing with Python. 🔢",
    color: "#013243",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  [SkillNames.PANDAS]: {
    id: 13,
    name: "pandas",
    label: "Pandas",
    shortDescription: "Powerful data manipulation and analysis library for Python. 🐼",
    color: "#150458",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
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
