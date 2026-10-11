"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const wordReveal = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: (custom) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
  exit: (custom) => ({
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
};

export function RevealTextHover({
  text,
  className = "",
  icon,
  tag = "p",
  delay = 0,
  indent = 0,
  isHovered: externalHover,
  children,
}) {
  const [internalHover, setInternalHover] = useState(false);

  // Se 'externalHover' for passado (ex: do ProductCard), usamos ele. Senão, usamos o hover interno.
  const activeHover =
    externalHover !== undefined ? externalHover : internalHover;

  const words = text ? text.split(" ") : [];
  const Tag = motion[tag] || motion.p;

  return (
    <Tag
      className={`inline-flex items-center cursor-pointer select-none ${className}`}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      {icon && (
        <span className="mr-[0.35em] inline-flex items-center">{icon}</span>
      )}

      {words.map((word, index) => {
        const itemDelay = delay + index * 0.025;

        return (
          <span
            key={index}
            className="relative inline-block overflow-hidden mr-[0.25em]"
            style={index === 0 ? { marginLeft: indent } : undefined}
          >
            {/* Texto Principal (Sobe ao dar hover) */}
            <motion.span
              variants={wordReveal}
              initial="animate"
              animate={activeHover ? "exit" : "animate"}
              custom={itemDelay}
              className="inline-block will-change-transform"
            >
              {word} {children}
            </motion.span>

            {/* Texto Duplicado (Vem de baixo ao dar hover) */}
            <motion.span
              variants={wordReveal}
              initial="initial"
              animate={activeHover ? "animate" : "exit"}
              custom={itemDelay}
              className="absolute top-0 left-0 inline-block will-change-transform"
              aria-hidden="true"
            >
              {word} {children}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
