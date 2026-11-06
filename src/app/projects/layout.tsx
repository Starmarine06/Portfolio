import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Dev Nambiar",
  description:
    "ML tools, Android apps, Minecraft mods and games built by Dev Nambiar, including Chamber Draw, RadialActions and PrismCraft.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Projects | Dev Nambiar" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
