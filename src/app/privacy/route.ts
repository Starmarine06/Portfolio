import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOURCE_DIR = path.join(process.cwd(), "privacy");
const FILE = "policy.html";

export async function GET() {
  const html = await fs.readFile(path.join(SOURCE_DIR, FILE), "utf-8");
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}