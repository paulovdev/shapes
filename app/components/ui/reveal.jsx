"use client";

import { wordReveal } from "@/app/anim/modal.anim";
import { motion } from "framer-motion";

export const Reveal = ({
  icon = null,
  className = "",
  text = "",
  delay = 0,
  animate = true,
  indent = 0,
}) => {
  const words = text.split(" ");

  return (
    <>
      <h2 className={className}>
        {icon && (
          <span className="relative inline-block overflow-hidden mr-[0.4em] top-[0.1em] ">
            <motion.span
              variants={wordReveal}
              initial="initial"
              animate={animate ? "animate" : "initial"}
              exit="exit"
              custom={delay}
              className="inline-flex items-center will-change-transform"
            >
              {icon}
            </motion.span>
          </span>
        )}

        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden mr-[0.25em]"
            style={index === 0 && indent ? { marginLeft: indent } : undefined}
          >
            <motion.span
              variants={wordReveal}
              initial="initial"
              animate={animate ? "animate" : "initial"}
              exit="exit"
              custom={delay + index * 0.025}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>

      {/*  */}

      {/*     <span className={`inline-block overflow-hidden ${className}`}>
        <motion.span
          className="inline-block"
          initial={{ y: "100%" }}
          animate={{ y: show ? "0%" : "100%" }}
          exit={{ y: "100%" }}
          transition={{
            duration: 0.75,
            ease: [0.33, 1, 0.68, 1],
            delay,
          }}
        >
          {content}
        </motion.span>
      </span> */}
    </>
  );
};
