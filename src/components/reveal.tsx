"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ y: 10 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 0.45 }}
    >
      {children}
    </motion.div>
  );
}
