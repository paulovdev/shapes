"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARS = "ABCD0123456789!@#$%^&*()";

export default function Scramble({
  text,
  icon = null,
  className = "",
  trigger = false,
}) {
  const spanRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startAnimation = useCallback(() => {
    const el = spanRef.current;
    if (!el) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    let frame = 0;
    const speed = text.length <= 8 ? 20 : 10;
    const totalFrames = text.length * speed;
    const resolved = Array(text.length).fill(false);

    function update() {
      let out = "";

      for (let i = 0; i < text.length; i++) {
        // Preserva espaços em branco intactos
        if (text[i] === " ") {
          out += " ";
          continue;
        }

        if (resolved[i]) {
          out += text[i];
          continue;
        }

        const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        out += randomChar;

        if (frame > i * speed + speed) {
          resolved[i] = true;
        }
      }

      el.textContent = out;
      frame++;

      if (frame <= totalFrames) {
        animationFrameRef.current = requestAnimationFrame(update);
      } else {
        el.textContent = text;
      }
    }

    update();
  }, [text]);

  // Reanima sempre que `trigger` for verdadeiro
  useEffect(() => {
    if (trigger) {
      startAnimation();
    } else if (spanRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      spanRef.current.textContent = text;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, startAnimation, text]);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span ref={spanRef} className=" inline-block whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}
