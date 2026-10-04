"use client";

import { motion } from "framer-motion";
import DitherImage from "../../dither/dither-image/dither-image";
import Image from "next/image";

export default function AboutGallery() {
  const imgs = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png",
    "/images/5.png",
  ];

  return (
    <div className="mt-20 w-[calc(100vw-40px)] flex items-center justify-between gap-5">
      {imgs.map((src, i) => (
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            transition: {
              duration: 0.75,
              delay: i * 0.025,
            },
          }}
          exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
          key={i}
          className="w-100 h-125 bg-s flex items-center justify-center"
        >
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{
              clipPath: "inset(0% 0% 0% 0%)",
              transition: {
                duration: 0.75,
                delay: 0.25 + i * 0.025,
              },
            }}
            exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
            key={i}
            className="w-100 h-100 object-contain bg-s"
          >
            <Image src={src} alt="loading" fill />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
