"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const iconRevealHover = {
  initial: {
    y: "0%",
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  },
  animate: {
    y: "-50%",
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

const ButtonIcon = ({
  icon: Icon,
  onClick,
  size = "size-12",
  iconSize = "",
  bgNormal = "bg-p",
  bgHover = "bg-s",
  textNormal = "text-s",
  textHover = "text-p",
  className = "",
}) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="hover"
      className={`relative flex items-center justify-center border overflow-hidden isolate cursor-default select-none 
        ${size} ${bgNormal} ${className}`}
    >
      <motion.span
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{
          clipPath: hover ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        }}
        transition={{
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={`absolute inset-0 size-full z-0 ${bgHover}`}
      />

      <div className="relative z-10 flex items-center justify-center gap-2">
        <div className="relative h-[14px] overflow-hidden cursor-default">
          <motion.div
            variants={iconRevealHover}
            initial="initial"
            animate={hover ? "animate" : "initial"}
            className="flex flex-col items-start justify-center"
          >
            <span
              className={`block h-[20px] ${iconSize} ${textNormal} transition-colors duration-300`}
            >
              {Icon && <Icon />}
            </span>
            <span
              className={`block h-[20px] ${iconSize} ${textHover} transition-colors duration-300`}
            >
              {Icon && <Icon />}
            </span>
          </motion.div>
        </div>
      </div>
    </button>
  );
};

export default ButtonIcon;
