"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineDrag } from "react-icons/ai";
import { isMobile } from "react-device-detect";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const smoothX = useSpring(x, { stiffness: 400, damping: 35 });
  const smoothY = useSpring(y, { stiffness: 400, damping: 35 });

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

      if (cursorElem) {
        const cursorType = cursorElem.getAttribute("data-cursor");

        if (cursorType) setMode(cursorType);
      } else {
        setMode("normal");
      }
    };

    const handleMouseDown = (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.closest(".grid-section")) {
        setMode("drag");
      }
    };

    const handleMouseUp = () => {
      setMode("normal");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [x, y]);

  const sizeMap = {
    drag: 40,
    about: 20,
    hover: 10,
    normal: 5,
  };

  const size = sizeMap[mode] || 12;

  return (
    <>
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-99999 -translate-x-1/2 -translate-y-1/2"
          style={{
            translateX: smoothX,
            translateY: smoothY,
          }}
        >
          <motion.div
            animate={{ width: size, height: size }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="pointer-events-none flex items-center justify-center bg-s text-p"
          >
            {mode === "drag" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="pointer-events-none flex items-center justify-center"
              >
                <AiOutlineDrag size={24} className="text-p" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
