"use client";

import { motion } from "framer-motion";
import { IoMdAlert } from "react-icons/io";
import { BsFillFilterCircleFill } from "react-icons/bs";

import { useFilter } from "../stores/zustand";
import ScrambleHover from "./common/scramble-hover";

const textSlideAnim = {
  initial: { y: "100%" },
  animate: (i) => ({
    y: "0",
    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.5 + 0.075 * i,
    },
  }),
};

const Footer = () => {
  const { setFilterModal } = useFilter();
  return (
    <footer className="fixed bottom-0 left-0 p-5 w-full flex items-center justify-between z-100 mix-blend-difference max-md:p-3">
      <div className="overflow-hidden pointer-events-none">
        <motion.p
          {...textSlideAnim}
          custom={1}
          className="text-s   text-[.8em] max-lg:text-[.75em] max-md:text-[.7em] font-normal flex items-center gap-2 uppercase"
        >
          <IoMdAlert className="text-s text-[1em]" />
          drag your mouse to navigate
        </motion.p>
      </div>
      <div className="overflow-hidden pointer-events-auto">
        <motion.button
          {...textSlideAnim}
          custom={2}
          onClick={() => setFilterModal(true)}
          data-cursor="hover"
        >
          <ScrambleHover
            text="FILTERS"
            icon={<BsFillFilterCircleFill className="text-[1em]" />}
            className="text-s text-[.8em] max-lg:text-[.75em] max-md:text-[.7em]  font-normal  uppercase"
          />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
