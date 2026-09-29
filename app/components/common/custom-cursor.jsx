"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { RiDragMoveFill } from "react-icons/ri";
import { useFilter } from "@/app/stores/zustand";

export default function CustomCursor() {
  const { filterModal } = useFilter();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const smoothX = useSpring(x, { stiffness: 500, damping: 40 });
  const smoothY = useSpring(y, { stiffness: 500, damping: 40 });

  const [mode, setMode] = useState("normal");
  const [insideGrid, setInsideGrid] = useState(false);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX + 15);
      y.set(e.clientY + 19);
    };

    const down = () => {
      if (insideGrid) setMode("drag");
    };

    const up = () => setMode("normal");

    const checkHover = (e) => {
      const target = e.target;

      if (target.closest("[data-cursor='hover']")) {
        if (mode !== "drag") setMode("hover");
      }
  
      else if (target.closest("[data-cursor='about']")) {
        if (mode !== "drag") setMode("about");
      }

      else if (mode !== "drag") {
        setMode("normal");
      }

      setInsideGrid(!!target.closest(".grid-section"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [insideGrid, mode]);

 
  const size =
    mode === "drag"
      ? 50
      : mode === "hover"
      ? 10
      : mode === "about"
      ? 125
      : 15;

  return (
    <motion.div
      className={`
        fixed top-0 left-0 pointer-events-none
        z-999
        rounded-full
        ${filterModal ? "bg-s" : "bg-s mix-blend-exclusion"}
      `}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ translateX: smoothX, translateY: smoothY }}
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {!filterModal && mode === "drag" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="select-none flex items-center justify-center"
          >
            <RiDragMoveFill className="text-[1.5em] text-p" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
