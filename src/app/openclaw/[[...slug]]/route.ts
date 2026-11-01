import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOURCE_DIR = path.join(process.cwd(), "openclaw");

const PAGES: Record<string, string> = {
  "": "index.html",
  pp: "pp.html",
  tos: "tos.html",
};

export async function GET(
  _request: Request,
  { params }: { params: { slug?: string[] } },
) {
  const key = (params.slug ?? []).join("/");
  const file = PAGES[key];
  if (!file) return new NextResponse("Not found", { status: 404 });

  const html = await fs.readFile(path.join(SOURCE_DIR, file), "utf-8");
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
