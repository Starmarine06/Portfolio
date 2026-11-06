import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Dev Nambiar",
  description:
    "Dev Nambiar is a machine learning engineer and indie game developer. Background, tools, and the stack behind the projects.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About | Dev Nambiar" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
