const config = {
  title: "Dev Nambiar | ML Engineer",
  description: {
    long: "Explore the portfolio of Dev Nambiar, a Machine Learning Engineer specializing in interactive AI experiences, 3D animations, and innovative ML projects. Discover my latest work and let's build something amazing together!",
    short:
      "Discover the portfolio of Dev Nambiar, a Machine Learning Engineer creating interactive AI experiences and innovative projects.",
  },
  keywords: [
    "Dev Nambiar",
    "portfolio",
    "Machine Learning Engineer",
    "ML Engineer",
    "AI development",
    "3D animations",
    "interactive websites",
    "web design",
    "GSAP",
    "React",
    "Next.js",
    "Spline",
    "Framer Motion",
  ],
  author: "Dev Nambiar",
  email: "dev.nambiar@example.com",
  site: "https://devnambiar.site",

  // for github stars button
  githubUsername: "dev-nambiar",
  githubRepo: "3d-portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/devnambiar",
    linkedin: "https://www.linkedin.com/in/dev-nambiar/",
    instagram: "https://www.instagram.com/devnambiar",
    facebook: "https://www.facebook.com/devnambiar/",
    github: "https://github.com/dev-nambiar",
  },
};
export { config };
