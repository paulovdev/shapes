"use client";

import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { closeBtnAnim } from "@/anim/modal.anim";

export function CloseButton({ onClick }) {
  return (
    <motion.div
      key="close-button"
      onClick={onClick}
      variants={closeBtnAnim}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute right-2.5 top-2.5 z-30"
    >
      <motion.button
        whileTap={{ scale: 1.1 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Close modal"
        className="group flex size-12.5 cursor-pointer items-center justify-center bg-ts backdrop-blur-2xl"
      >
        <IoClose className="text-[24px] text-p transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:rotate-90" />
      </motion.button>
    </motion.div>
  );
}
