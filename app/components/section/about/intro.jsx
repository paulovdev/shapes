"use client";
import { motion } from "framer-motion";

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

const paragraphs = [
  "Front-end developer & UI/UX designer focused on building digital experiences that combine visual performance, interatividade and a deep sense of identity.",
  "I specialize in Next.js, component-driven architecture, design systems and motion design — creating products that feel alive, with clarity, ritmo e intenção.",
  "I enjoy solving complex problems and crafting interfaces that are memorable and aesthetically cohesive, blending branding, design and technology."
];

function chunk(p, size = 10) {
  const w = p.split(" ");
  const out = [];
  for (let i = 0; i < w.length; i += size) {
    out.push(w.slice(i, i + size).join(" "));
  }
  return out;
}

export default function AboutIntro() {
  return (
    <div className="mb-20">
      <div className="overflow-hidden mb-1">
        <motion.h2
          variants={textSlideAnim}
          initial="initial"
          animate="animate"
          custom={1}
          className="text-p text-[1.25em] max-lg:text-[.7em] max-md:text-[.6em] font-medium uppercase"
        >
          Paulo Vitor
        </motion.h2>
      </div>

      <div className="mb-8 flex items-center gap-2">
        <div className="overflow-hidden">
          <motion.p
            variants={textSlideAnim}
            initial="initial"
            animate="animate"
            custom={2}
            className="text-p text-[.8em] font-medium uppercase"
          >
            22 —
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.p
            variants={textSlideAnim}
            initial="initial"
            animate="animate"
            custom={3}
            className="text-p text-[.8em] font-medium uppercase"
          >
            Brazil — Rio de Janeiro
          </motion.p>
        </div>
      </div>

      {paragraphs.map((p, idx) => {
        const lines = chunk(p);
        const base = 4 + idx * 5;

        return (
          <div key={idx} className="mb-6">
            {lines.map((l, i) => (
              <div className="overflow-hidden" key={i}>
                <motion.p
                  variants={textSlideAnim}
                  initial="initial"
                  animate="animate"
                  custom={base + i}
                  className="text-p text-[.8em] font-medium uppercase mb-1"
                >
                  {l}
                </motion.p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
