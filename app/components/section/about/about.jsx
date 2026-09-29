"use client";

import Lenis from "lenis";
import AboutGallery from "./gallery";
import AboutIntro from "./intro";
import AboutSections from "./sections";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ScrambleHover from "../../common/scramble-hover";
import { MdArrowBackIos } from "react-icons/md";
import Link from "next/link";

const textSlideAnim = {
  initial: { y: "100%" },
  animate: (i) => ({
    y: "0",
    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.25 + 0.075 * i,
    },
  }),
};
export default function About() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, duration: 1 });
    lenisRef.current = lenis;

    return () => lenis.destroy();
  }, []);

  return (
    <>
      {" "}
      <motion.nav className="fixed top-0 left-0 p-5 w-full flex items-end justify-end backdrop-blur-md z-100">
        <div className="h-fit overflow-hidden" data-cursor="hover">
          <motion.p
            variants={textSlideAnim}
            initial="initial"
            animate="animate"
            custom={0}
          >
            <Link href={"/"}>
              <ScrambleHover
                text="BACK"
                icon={<MdArrowBackIos className="text-[1em]" />}
                className="text-p text-[.8em] max-lg:text-[.7em] max-md:text-[.6em] font-medium uppercase cursor-default"
              />
            </Link>
          </motion.p>
        </div>
      </motion.nav>
      <section className="bg-s ">
        <div className="mt-40 p-5 max-w-[800px] mx-auto flex flex-col items-start">
          <AboutIntro />
          <AboutGallery />
          <AboutSections />
          <div className="w-full mb-20">
            <h2 className="text-p text-[1.25em] font-medium uppercase mb-4">
              CONTACT
            </h2>
            <div className="flex items-center gap-2">
              {["instagram,", "x,", "facebook,", "youtube,", "linkedin"].map(
                (s, i) => (
                  <div className="overflow-hidden" key={i} data-cursor="hover">
                    <motion.p {...textSlideAnim}>
                      <ScrambleHover
                        text={s}
                        className="text-p text-[.8em] max-lg:text-[.7em] max-md:text-[.6em] font-normal uppercase"
                      />
                    </motion.p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
