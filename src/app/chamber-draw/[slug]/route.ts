import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOURCE_DIR = path.join(process.cwd(), "chamber-draw");

const HTML_PAGES: Record<string, string> = {
  main: "main.html",
  privacy: "privacy_policy.html",
  "epic-games-account": "epic_games_account.html",
  "promo-video": "promo_video.html",
};

const LINK_REWRITES: Record<string, string> = {
  "main.html": "/chamber-draw/main",
  "privacy_policy.html": "/chamber-draw/privacy",
  "epic_games_account.html": "/chamber-draw/epic-games-account",
  "promo_video.html": "/chamber-draw/promo-video",
};

const MEDIA_FILES = [
  "chamber-draw-promo-2026.mp4",
  "chamber-draw-promo-portrait-2026.mp4",
];

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".mp4": "video/mp4",
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  const pageFile = HTML_PAGES[slug];
  if (pageFile) {
    const raw = await fs.readFile(path.join(SOURCE_DIR, pageFile), "utf-8");
    const html = Object.entries(LINK_REWRITES).reduce(
      (result, [from, to]) => result.split(`href="${from}"`).join(`href="${to}"`),
      raw,
    );
    return new NextResponse(html, {
      headers: {
        "Content-Type": MIME_TYPES[".html"] ?? "text/html; charset=utf-8",
      },
    });
  }

  if (MEDIA_FILES.includes(slug)) {
    const filePath = path.join(SOURCE_DIR, slug);
    try {
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) return new NextResponse("Not found", { status: 404 });
      const stream = createReadStream(filePath);
      return new NextResponse(stream as unknown as ReadableStream, {
        headers: {
          "Content-Type": MIME_TYPES[path.extname(slug)] ?? "application/octet-stream",
          "Content-Length": String(stat.size),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  return new NextResponse("Not found", { status: 404 });
}