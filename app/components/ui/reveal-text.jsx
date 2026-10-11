"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

import { Reveal } from "./reveal";

export function RevealText({ text, tag = "p", className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref}>
      <Reveal
        text={text}
        animate={isInView ? "animate" : "initial"}
        exit="exit"
        tag={tag}
        className={className}
      />
    </div>
  );
}
