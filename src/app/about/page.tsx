"use client";
import React, { useEffect, useState } from "react";
import { DiMongodb, DiNginx, DiNpm, DiPostgresql, DiVim } from "react-icons/di";
import {
  FaAws,
  FaCss3,
  FaDocker,
  FaEnvelope,
  FaGit,
  FaGithub,
  FaHtml5,
  FaLinkedin,
  FaLinux,
  FaNodeJs,
  FaPhone,
  FaReact,
  FaVuejs,
  FaYarn,
} from "react-icons/fa6";
import {
  RiFirebaseFill,
  RiJavascriptFill,
  RiNextjsFill,
  RiTailwindCssFill,
} from "react-icons/ri";
import {
  SiExpress,
  SiJavascript,
  SiKubuntu,
  SiPm2,
  SiPrettier,
  SiTypescript,
  SiVercel,
  SiVscodium,
  SiTensorflow,
  SiScikitlearn,
  SiUnity,
  SiUnrealengine,
  SiPostman,
  SiPowerbi,
  SiPython,
  SiVite,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { TbTerminal2 } from "react-icons/tb";

const CONTACT_LINKS = [
  {
    name: "Email",
    content: "dev.nambiar@example.com",
    href: "mailto:dev.nambiar@example.com",
    icon: <FaEnvelope height={"50px"} />,
  },
  {
    name: "Phone",
    content: "+1 (555) 000-0000",
    href: "tel:+15550000000",
    icon: <FaPhone height={"50px"} />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/dev-nambiar/",
    content: "/dev-nambiar",
    icon: <FaLinkedin height={"50px"} />,
  },
  {
    name: "GitHub",
    href: "https://github.com/dev-nambiar",
    content: "/dev-nambiar",
    icon: <FaGithub height={"50px"} />,
  },
];

const TOOLS = [
  {
    name: "Tensorflow",
    content: "Open-source library for machine learning",
    icon: <SiTensorflow size={"50px"} color={"#FF6F00"} />,
    color: "#FF6F00",
  },
  {
    name: "SciKit-Learn",
    content: "Machine learning library for Python",
    icon: <SiScikitlearn size={"50px"} color={"#F7931E"} />,
    color: "#F7931E",
  },
  {
    name: "Unity",
    content: "Game engine and ML-Agents platform",
    icon: <SiUnity size={"50px"} color="#fff" />,
    color: "#000000",
  },
  {
    name: "Unreal Engine",
    content: "Advanced 3D creation tool",
    icon: <SiUnrealengine size={"50px"} color="#fff" />,
    color: "#000000",
  },
  {
    name: "Python",
    content: "The language of AI",
    icon: <SiPython size={"50px"} color="#3776AB" />,
    color: "#3776AB",
  },
  {
    name: "Postman",
    content: "API development platform",
    icon: <SiPostman size={"50px"} color="#FF6C37" />,
    color: "#FF6C37",
  },
  {
    name: "Power BI",
    content: "Business analytics service",
    icon: <SiPowerbi size={"50px"} color="#F2C811" />,
    color: "#F2C811",
  },
  {
    name: "React.js",
    content: "Frontend library for interactive UI",
    icon: <FaReact size={"50px"} color="#61dafb" />,
    color: "#61dafb",
  },
  {
    name: "GitHub",
    content: "Version control and collaboration",
    icon: <FaGithub size={"50px"} color="#fff" />,
    color: "#000000",
  },
  {
    name: "Vite",
    content: "Next generation frontend tooling",
    icon: <SiVite size={"50px"} color="#646CFF" />,
    color: "#646CFF",
  },
  {
    name: "Docker",
    content: "Containerization for ML environments",
    icon: <FaDocker size={"50px"} color="#2496ed" />,
    color: "#2496ed",
  },
  {
    name: "Linux",
    content: "The developer's OS",
    icon: <FaLinux size={"50px"} color="#fff" />,
    color: "#000000",
  },
];

function Page() {
  const [toolsLoaded, setToolsLoaded] = useState(false);
  useEffect(() => {
    setToolsLoaded(true);
  }, []);
  return (
    <div className="container mx-auto px-4 md:px-[50px] xl:px-[200px] text-zinc-300 pt-20 pb-20">
      <div className="flex flex-col lg:flex-row gap-5">
        <aside className="w-full md:basis-1/4">
          <div
            className="p-4 md:p-8 lg:p-10 rounded-2xl border-[.5px] border-zinc-600"
            style={{
              backdropFilter: "blur(2px)",
            }}
          >
            <div className="flex flex-row lg:flex-col items-center">
              <div className="flex justify-center items-center lg:w-full lg:aspect-square bg-zinc-800 rounded-xl lg:mb-5">
                <img
                  className="rounded-full p-4 lg:p-10 w-[100px] md:w-[150px] lg:w-[200px] aspect-square  bg-zinc-800"
                  alt="me"
                  src="/assets/me.jpg"
                />
              </div>
              <div className="flex flex-col gap-3 lg:items-center ml-10 md:ml-20 lg:ml-0">
                <p className="text-center text-xl">Dev Nambiar</p>
                <div className="text-xs bg-zinc-700 w-fit px-3 py-1 rounded-full">
                  ML Engineer
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <hr className="my-10 border-zinc-600" />
              <ul className="flex flex-col gap-3">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      className="flex items-center px-3 gap-3 w-full h-12 border-zinc-700 bg-zinc-800 hover:border-zinc-600 border-[.5px] rounded-md "
                      href={link.href}
                    >
                      <div className="w-8">{link.icon}</div>
                      <div className="flex flex-col">
                        <div className="text-sm">{link.name}</div>
                        <div className="text-xs text-zinc-500">
                          {link.content}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <main className="basis-3/4 w-[500px]">
          <div
            className="p-10 border-[.5px] rounded-md border-zinc-600"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <h1 className="text-3xl mb-10 lg:md-20">About me</h1>
            <p className="mb-10 text-roboto">
              Hey there! I&apos;m Dev, a Machine Learning Engineer passionate about
              creating intelligent and interactive digital experiences. With expertise in AI
              development, I thrive on turning complex data into reality through coding
              and innovative ML solutions. My journey began with a fascination for intelligence and
              a drive to push the boundaries of technology.
            </p>
            <p className="mb-10">
              When I&apos;m not coding, you can find me [Your
              Interests/Hobbies], exploring new technologies, or sipping coffee
              while brainstorming my next project.
            </p>
            <h1 className="text-3xl mb-10 lg:md-20">Stuff I use</h1>
            <div className="mb-5">
              {!toolsLoaded ? (
                <p className="h-[100px]"></p>
              ) : (
                <Splide
                  options={{
                    type: "loop",
                    interval: 2000,
                    autoplay: true,
                    pagination: false,
                    speed: 2000,
                    perPage: 5,
                    perMove: 1,
                    rewind: true,
                    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                    arrows: false,
                  }}
                  aria-label="My Favorite Images"
                >
                  {TOOLS.reverse().map((tool) => (
                    <SplideSlide key={tool.name}>
                      <div
                        key={tool.name}
                        className="w-fit p-2 border-[.5px] border-zinc-600 rounded-md"
                      >
                        {tool.icon}
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              )}
            </div>
            {/* <div className="">
              <Splide
                options={{
                  type: "loop",
                  interval: 2000,
                  autoplay: true,
                  pagination: false,
                  speed: 3000,
                  perPage: 5,
                  perMove: 1,
                  rewind: true,
                  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                  arrows: false,
                }}
                aria-label="My Favorite Images"
              >
                {TOOLS.map((tool) => (
                  <SplideSlide key={tool.name}>
                    <div
                      key={tool.name}
                      className="w-fit p-2 border-[.5px] border-zinc-600 rounded-md"
                    >
                      {tool.icon}
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
