"use client";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Loader({ setLoading }) {
  const [scope, animate] = useAnimate();
  const pRef = useRef(null);
  const starRef = useRef(null);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    async function runAnim() {
      const p = pRef.current;
      const star = starRef.current;

      p.textContent = "shapes®";

      await wait(600);

      const rect = p.getBoundingClientRect();

      animate(
        star,
        { x: 0, y: -450 },
        { duration: 1.1, ease: [0.76, 0, 0.24, 1] },
      );
      await animate(
        star,
        { rotate: 120 },
        { duration: 1, ease: [0.76, 0, 0.24, 1] },
      );
      await animate(
        p,
        { x: -rect.left + 20, y: -rect.top + 20 },
        { duration: 1.1, ease: [0.76, 0, 0.24, 1] },
      );
      animate(star, { rotate: 120 }, { duration: 1, ease: [0.76, 0, 0.24, 1] });

      // Expande a estrela
      await animate(
        star,
        { scale: 700 },
        { duration: 1, ease: [0.76, 0, 0.24, 1] },
      );

      await animate(
        scope.current,
        { opacity: 0 },
        { duration: 0.6, ease: "easeOut" },
      );

      setLoading(false);
    }

    runAnim();
  }, [animate, scope, setLoading]);

  return (
    <div
      ref={scope}
      className="fixed inset-0 w-screen h-svh z-300 overflow-hidden overscroll-none pointer-events-none"
    >
      <motion.div className="loader-bg absolute inset-0 bg-s flex items-center justify-center">
        <motion.p
          ref={pRef}
          className="fixed z-100 text-p text-[.9em] font-normal uppercase mix-blend-difference"
        />
        <motion.div
          ref={starRef}
          className="fixed z-100 mix-blend-difference"
          initial={{ opacity: 0, bottom: 25 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-p size-5"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
