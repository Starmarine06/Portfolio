"use client";

import MatrixBackground from "@/components/MatrixBackground";
import RemoteCursors from "@/components/realtime/remote-cursors";
import ElasticCursor from "@/components/ui/ElasticCursor";
import RadialMenu from "@/components/radial-menu/index";

export default function AppOverlays() {
  return (
    <>
      <MatrixBackground />
      <RemoteCursors />
      <ElasticCursor />
      <RadialMenu />
    </>
  );
}
