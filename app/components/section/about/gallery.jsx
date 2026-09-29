"use client";
import { motion } from "framer-motion";
import Image from "next/image";
 

const clipAnim = {
  initial: { clipPath: "inset(100% 0% 0% 0%)" },
  animate: (i) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.2 + i * 0.1,
    },
  }),
};

export default function AboutGallery() {
  const imgs = [
    "/works/work-4.webp",
    "/works/work-5.webp",
    "/works/work-6.webp",
    "/works/work-7.webp",
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mt-6 mb-20">
      {imgs.map((src, i) => (
        <div key={i} className="overflow-hidden w-full h-[300px]">
          <motion.figure
            initial="initial"
            animate="animate"
            variants={clipAnim}
            custom={i}
            className="w-full h-full"
          >
            <Image
              src={src}
              width={1000}
              height={1000}
              alt=""
              className="object-cover size-full"
            />
          </motion.figure>
        </div>
      ))}
    </div>
  );
}
