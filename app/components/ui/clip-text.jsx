import { wordReveal } from "@/app/anim/modal.anim";
import { motion } from "motion/react";

export const ClipText = ({
  text,
  className,
  delay = 0,
  animate,
  children,
  indent = 0,
}) => {
  const words = text.split(" ");

  return (
    <h2 className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden mr-[0.25em]"
          style={index === 0 ? { marginLeft: indent } : undefined}
        >
          <motion.span
            variants={wordReveal}
            initial="initial"
            animate={animate}
            exit="exit"
            custom={delay + index * 0.025}
            className="inline-block will-change-transform"
          >
            {word} {children}
          </motion.span>
        </span>
      ))}
    </h2>
  );
};
