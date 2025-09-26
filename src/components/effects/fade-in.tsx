"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface FadeInProps {
  delay?: number;
  className?: string;
}

export const FadeIn = ({ children, delay = 0, className }: PropsWithChildren<FadeInProps>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;