"use client";

import { motion } from "framer-motion";

export const HoverText = ({
  text,
  icon = null,
  className = "",
  animate = false,
}) => {
  const content = (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span>{text}</span>
    </span>
  );

  if (!animate) {
    return <span className={`inline-block ${className}`}>{content}</span>;
  }

  return (
    <motion.span
      className={`relative inline-block overflow-hidden ${className}`}
      initial="initial"
      animate="initial"
      whileHover="hover"
    >
      <span className="relative inline-block">
        <motion.span
          className="block"
          variants={{
            initial: { y: "0%" },
            hover: { y: "-100%" },
          }}
          transition={{
            duration: 0.75,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {content}
        </motion.span>

        <motion.span
          className="absolute left-0 top-full block"
          variants={{
            initial: { y: "0%" },
            hover: { y: "-100%" },
          }}
          transition={{
            duration: 0.75,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {content}
        </motion.span>
      </span>
    </motion.span>
  );
};
