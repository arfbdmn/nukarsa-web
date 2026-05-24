"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  className?: string;
  hoverY?: number;
  hoverScale?: number;
  isTapScale?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  y = 20,
  x = 0,
  scale = 1,
  className = "",
  hoverY = 0,
  hoverScale = 1,
  isTapScale = false
}: FadeInProps) {
  const initial = {
    opacity: 0,
    y: y,
    x: x,
    scale: scale,
  };

  const animate = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
  };

  const whileHover = {
    ...(hoverY !== 0 ? { y: hoverY } : {}),
    ...(hoverScale !== 1 ? { scale: hoverScale } : {}),
  };

  const whileTap = isTapScale ? { scale: 0.95 } : {};

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      whileHover={Object.keys(whileHover).length > 0 ? whileHover : undefined}
      whileTap={Object.keys(whileTap).length > 0 ? whileTap : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
