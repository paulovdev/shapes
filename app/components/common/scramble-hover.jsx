"use client";
import { useRef, useEffect } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#__";

export default function ScrambleHover({ text, icon = null, className = "" }) {
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      spanRef.current.style.display = "inline-block";
      spanRef.current.style.width = rect.width + "px";
      spanRef.current.style.height = rect.height + "px";
      spanRef.current.style.lineHeight = rect.height + "px";
    }
  }, [text]);

  function scrambleText(element, text) {
    let frame = 0;

    const speed = text.length <= 8 ? 20 : 10;
    const totalFrames = text.length * speed;

    const resolved = Array(text.length).fill(false);

    function update() {
      let out = "";

      for (let i = 0; i < text.length; i++) {
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

      if (frame <= totalFrames) requestAnimationFrame(update);
      else element.textContent = text;
    }

    update();
  }

  return (
    <span
      className={`flex items-center gap-2  ${className}`}
      onMouseEnter={() => scrambleText(spanRef.current, text)}
      onMouseLeave={() => (spanRef.current.textContent = text)}
    >
      {icon && <span>{icon}</span>}
      <span ref={spanRef}>{text}</span>
    </span>
  );
}
