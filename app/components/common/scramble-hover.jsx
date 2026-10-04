"use client";

import { useRef } from "react";

const CHARS = "ABCD0123456789!@#$%^&*()";

export default function ScrambleHover({ text, icon = null, className = "" }) {
  const spanRef = useRef(null);
  const animFrameId = useRef(null);

  function scrambleText() {
    const element = spanRef.current;
    if (!element) return;

    // Cancela qualquer animação anterior que ainda esteja rodando
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
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

      element.textContent = out;
      frame++;

      if (frame <= totalFrames) {
        animFrameId.current = requestAnimationFrame(update);
      } else {
        element.textContent = text;
      }
    }

    update();
  }

  function handleMouseLeave() {
    // Cancela a animação e restaura o texto original instantaneamente
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
    if (spanRef.current) {
      spanRef.current.textContent = text;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
      onMouseEnter={scrambleText}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span ref={spanRef} className="inline-block whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}
