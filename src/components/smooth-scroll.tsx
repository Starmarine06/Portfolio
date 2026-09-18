"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "@/lib/lenis";

interface LenisProps {
  children: React.ReactNode;
  isInsideModal?: boolean;
}

function SmoothScroll({ children, isInsideModal = false }: LenisProps) {
  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  useEffect(() => {
    if (!lenis) return;
    
    const handleDOMContentLoaded = () => {
      lenis?.stop();
      lenis?.start();
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
      return () => {
        document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
      };
    } else {
      lenis?.start();
    }
  }, [lenis]);

  return (
    <ReactLenis
      root
      options={{
        duration: 2,
        prevent: (node) => {
          if (isInsideModal) return true;
          if (
            typeof document !== "undefined" &&
            (document.body.getAttribute("data-lenis-prevent") === "true" ||
              document.documentElement.getAttribute("data-lenis-prevent") === "true")
          ) {
            return true;
          }
          return (
            node.classList.contains("modall") ||
            !!node.closest?.("[data-lenis-prevent='true']")
          );
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
