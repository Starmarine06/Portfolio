"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SectionWrapper = ({ id, className, children, ...props }: SectionWrapperProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={cn("relative pointer-events-none", className)}
      {...props}
    >
      <motion.div
        style={{ opacity, scale }}
        className="w-full h-full pointer-events-none"
        // pointer-events:none ensures this framer-motion wrapper never blocks
        // mouse events from reaching the Spline canvas behind it
        data-no-pointer
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper;
