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
  email: "devnambiar06@gmail.com",
  site: "https://devnambiar.site",

  // for github stars button
  githubUsername: "Starmarine06",
  githubRepo: "Portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    linkedin: "https://www.linkedin.com/in/dev-nambiar-0482a9342/",
    instagram: "https://www.instagram.com/dev.nambiar06",
    facebook: "https://www.facebook.com/dev.nambiar06/",
    github: "https://github.com/Starmarine06",
  },
};
export { config };
