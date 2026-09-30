"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineDrag } from "react-icons/ai";
import { isMobile } from "react-device-detect";

import { useDragging } from "@/app/stores/zustand";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const smoothX = useSpring(x, {
    stiffness: 400,
    damping: 35,
  });

  const smoothY = useSpring(y, {
    stiffness: 400,
    damping: 35,
  });

  const dragginS = useDragging((state) => state.dragginS);

  const [mode, setMode] = useState("normal");

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;

      if (!(target instanceof HTMLElement)) return;

      const cursorElem = target.closest("[data-cursor]");

      if (!cursorElem) {
        setMode("normal");
        return;
      }

      const cursorType = cursorElem.getAttribute("data-cursor");

      if (cursorType === "hover") {
        setMode("hover");
      } else {
        setMode("normal");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    window.addEventListener("mouseover", handleMouseOver, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [x, y]);

  if (isMobile) return null;

  const cursorMode = dragginS ? "drag" : mode;

  const size = cursorMode === "drag" ? 40 : cursorMode === "hover" ? 10 : 5;

  return (
    <motion.div
      className="pointer-events-none mix-blend-exclusion fixed top-0 left-0 z-99999 -translate-x-1/2 -translate-y-1/2"
      style={{
        translateX: smoothX,
        translateY: smoothY,
      }}
    >
      <motion.div
        animate={{
          width: size,
          height: size,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
        className="pointer-events-none flex items-center justify-center bg-p text-p"
      >
        {dragginS && (
          <AiOutlineDrag size={24} className="pointer-events-none text-s" />
        )}
      </motion.div>
    </motion.div>
  );
}
