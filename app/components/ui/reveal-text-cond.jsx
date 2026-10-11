"use client";

import { wordReveal } from "@/app/anim/modal.anim";
import { motion } from "framer-motion";

export function RevealTextCond({
  text,
  className = "",
  tag = "p",
  delay = 0,
  indent = 0,
  isHovered = false,
  children,
}) {
  const words = text ? text.split(" ") : [];
  const Tag = motion[tag] || motion.p;

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden mr-[0.25em]"
          style={index === 0 ? { marginLeft: indent } : undefined}
        >
          <motion.span
            variants={wordReveal}
            initial="initial"
            animate={isHovered ? "animate" : "initial"}
            exit="exit"
            custom={delay + index * 0.025}
            className="inline-block will-change-transform"
          >
            {word} {children}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
