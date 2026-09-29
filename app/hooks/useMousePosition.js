import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 600, damping: 45 });
  const smoothY = useSpring(y, { stiffness: 600, damping: 45 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x: smoothX, y: smoothY };
}
