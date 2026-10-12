import { motion } from "framer-motion";
import { useState } from "react";

const wordRevealHover = {
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

const Button = ({
  text = "",
  onClick,
  href,
  download,
  disabled = false,
  active = false,

  className = "",
  bgNormal = "bg-transparent",
  bgHover = "bg-s",

  textNormal = "text-s",
  textHover = "text-p",
}) => {
  const [hover, setHover] = useState(false);
  const isTriggered = active || hover;

  const content = (
    <>
      <motion.span
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{
          clipPath:
            isTriggered && !disabled
              ? "inset(0% 0% 0% 0%)"
              : "inset(100% 0% 0% 0%)",
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
            variants={wordRevealHover}
            initial="initial"
            animate={isTriggered && !disabled ? "animate" : "initial"}
            className="flex flex-col items-start justify-center"
          >
            <span
              className={`block ${textNormal} text-[.9em] font-normal uppercase leading-[1.2em] transition-colors duration-300`}
            >
              {text}
            </span>

            <span
              className={`block ${textHover} text-[.9em] font-normal uppercase leading-[1.2em] transition-colors duration-300`}
            >
              {text}
            </span>
          </motion.div>
        </div>
      </div>
    </>
  );

  const sharedClasses = `relative flex items-center justify-center py-2 px-4 h-12 border overflow-hidden transition-all isolate cursor-default
  ${bgNormal} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        download={download}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={sharedClasses}
        data-cursor="hover"
      >
        {content}
      </a>
    );
  }

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={sharedClasses}
      data-cursor="hover"
    >
      {content}
    </motion.button>
  );
};

export default Button;
