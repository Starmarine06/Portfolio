"use client";

import MatrixBackground from "@/components/MatrixBackground";
import RemoteCursors from "@/components/realtime/remote-cursors";
import ElasticCursor from "@/components/ui/ElasticCursor";

export default function AppOverlays() {
  return (
    <>
      <MatrixBackground />
      <RemoteCursors />
      <ElasticCursor />
    </>
  );
}
