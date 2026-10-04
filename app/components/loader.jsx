"use client";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Loader({ setLoading }) {
  const [scope, animate] = useAnimate();
  const pRef = useRef(null);
  const starRef = useRef(null);
  const CHARS = "ABCD0123456789!@#$%^&*()";

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function scrambleIn(element, text) {
    return new Promise((resolve) => {
      let frame = 0;
      const totalFrames = text.length * 8;
      const resolved = Array(text.length).fill(false);

      function update() {
        let out = "";

        for (let i = 0; i < text.length; i++) {
          if (resolved[i]) out += text[i];
          else out += CHARS[Math.floor(Math.random() * CHARS.length)];

          if (frame > i * 8 + 8) resolved[i] = true;
        }

        element.textContent = out;
        frame++;

        if (frame <= totalFrames) requestAnimationFrame(update);
        else {
          element.textContent = text;
          resolve();
        }
      }

      update();
    });
  }

  function scrambleOut(element, removeCount) {
    return new Promise((resolve) => {
      let frame = 0;
      const text = element.textContent;
      const keep = text.slice(0, text.length - removeCount);
      let fading = text.slice(text.length - removeCount).split("");

      const totalFrames = removeCount * 6;

      function update() {
        let out = keep;

        fading = fading.map((ch) =>
          Math.random() > 0.8
            ? CHARS[Math.floor(Math.random() * CHARS.length)]
            : ch,
        );

        const prog = frame / totalFrames;
        const deleteIndex = Math.floor(prog * removeCount);

        const final = fading
          .map((ch, i) => (i < deleteIndex ? "" : ch))
          .join("");

        out += final;
        element.textContent = out;

        if (deleteIndex < removeCount) {
          frame++;
          requestAnimationFrame(update);
        } else {
          element.textContent = keep;
          resolve();
        }
      }

      update();
    });
  }

  useEffect(() => {
    async function runAnim() {
      const p = pRef.current;
      const star = starRef.current;

      const fullText = "shapes® — archive 2026";

      await scrambleIn(p, fullText);

      await wait(600);

      const removePart = " — archive 2026";
      await scrambleOut(p, removePart.length);

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
      await animate(
        star,
        { scale: 700 },
        { duration: 1, ease: [0.76, 0, 0.24, 1] },
      );

      setLoading(false);
    }

    runAnim();
  }, []);

  return (
    <div
      ref={scope}
      className="fixed inset-0 w-screen h-svh z-300 overflow-hidden overscroll-none touch-none"
    >
      <motion.div className="loader-bg absolute inset-0 bg-s flex items-center justify-center">
        <motion.p
          ref={pRef}
          className="fixed z-100 text-p text-[.8em] font-normal uppercase mix-blend-difference"
        />
        <motion.div
          ref={starRef}
          className="fixed z-100 mix-blend-difference"
          initial={{ opacity: 0, bottom: 25 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-p size-5"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
