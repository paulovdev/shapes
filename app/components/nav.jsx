"use client";

import { motion } from "framer-motion";
import { IoMdContact } from "react-icons/io";
import ScrambleHover from "./common/scramble-hover";
import Link from "next/link";

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

const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 p-7 w-full flex items-center justify-between z-100 mix-blend-difference select-none max-md:p-3">
      <div className="overflow-hidden" data-cursor="hover">
        <ScrambleHover
          text="shapes®"
          className="text-p text-[.8em] font-semibold uppercase"
        />
      </div>

      <div className="overflow-hidden" data-cursor="hover">
        <motion.div {...textSlideAnim} custom={1}>
          <Link href={"/about"}>
            <ScrambleHover
              text="about"
              icon={<IoMdContact className="text-[1em]" />}
              className="text-p text-[.8em] font-semibold uppercase cursor-default"
            />
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;
