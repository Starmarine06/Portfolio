import type { MetadataRoute } from "next";
import { config } from "@/data/config";

const ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/chamber-draw/main", priority: 0.8, changeFrequency: "monthly" },
  { path: "/chamber-draw/promo-video", priority: 0.5, changeFrequency: "yearly" },
  { path: "/chamber-draw/epic-games-account", priority: 0.3, changeFrequency: "yearly" },
  { path: "/chamber-draw/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/chamber-draw/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/openclaw", priority: 0.5, changeFrequency: "yearly" },
  { path: "/openclaw/pp", priority: 0.2, changeFrequency: "yearly" },
  { path: "/openclaw/tos", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${config.site}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
