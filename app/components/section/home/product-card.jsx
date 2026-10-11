"use client";

import React, { useState, memo, useMemo, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { FaShirt, FaEye } from "react-icons/fa6";
import { wordReveal } from "@/app/anim/modal.anim";

const mod = (n, m) => ((n % m) + m) % m;

const TextReveal = memo(function TextReveal({
  text = "",
  icon,
  animate = false,
  className = "",
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const isAnimated = Boolean(animate); // Força um booleano estrito para a variant

  return (
    <div className={`flex items-center ${className}`}>
      {icon && (
        <span className="relative inline-block overflow-hidden h-[20px] mr-[0.35em] shrink-0">
          <motion.span
            variants={wordReveal}
            initial="initial"
            animate={isAnimated ? "animate" : "initial"}
            className="block"
          >
            <span className="flex items-center h-[20px]">{icon}</span>
          </motion.span>
        </span>
      )}

      <div className="w-full flex items-center">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="relative inline-block overflow-hidden h-[20px] mr-[0.25em] last:mr-0"
          >
            <motion.span
              variants={wordReveal}
              initial="initial"
              animate={isAnimated ? "animate" : "initial"}
              custom={index * 0.05}
              className="block"
            >
              <span className="block h-[20px]">{word}</span>
            </motion.span>
          </span>
        ))}
      </div>
    </div>
  );
});

export const ProductCard = memo(function ProductCard({
  col,
  row,
  cellIndex,
  cellW,
  cellH,
  cardW,
  cardH,
  totalW,
  totalH,
  canvasX,
  canvasY,
  filteredData,
  numItems,
  onSelect,
  offsetY = 0,
  isModalOpen = false,
  onContextMenu,
  contextMenu,
}) {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setHover(false);
    }
  }, [isModalOpen]);

  const baseX = col * cellW;
  const baseY = row * cellH + offsetY;

  const renderX = useTransform(
    canvasX,
    (currentX) => mod(baseX + currentX + cellW, totalW) - cellW,
  );

  const renderY = useTransform(
    canvasY,
    (currentY) => mod(baseY + currentY + cellH, totalH) - cellH,
  );

  const itemData = useMemo(() => {
    return filteredData[cellIndex % numItems] || {};
  }, [filteredData, cellIndex, numItems]);

  return (
    <motion.div
      onClick={() => onSelect(itemData, cellIndex)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerCancel={() => setHover(false)}
      onContextMenu={onContextMenu}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: renderX,
        y: renderY,
        width: cardW,
        height: cardH,
      }}
      className="relative w-full select-none group will-change-transform"
      data-cursor="hover"
    >
      <div className="relative flex size-full flex-col justify-between p-4 ">
        <div className="w-full flex items-start justify-between text-p uppercase">
          <TextReveal
            text={itemData?.price || "R$ 389,00"}
            animate={hover}
            className="w-full text-[.9em] font-semibold uppercase text-s"
          />

          <div className="max-w-55">
            <TextReveal
              text={itemData?.title || "UNTITLED GARMENT"}
              animate={hover}
              className="w-full text-right text-[.9em] font-semibold uppercase text-s"
            />
          </div>
        </div>

        <div className="relative size-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-95">
          {itemData.img ? (
            <Image
              src={itemData.img}
              alt={itemData.title || "Product image"}
              fill
              sizes="(max-width: 768px) 250px, 280px"
              priority={cellIndex < 8}
              className="size-full object-contain pointer-events-none"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-s/30">
              <FaShirt className="animate-pulse text-4xl" />
            </div>
          )}

          <div className="absolute inset-0 h-full flex items-center justify-center">
            <motion.div
              initial={false}
              animate={{
                clipPath: hover ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
              }}
              transition={{
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative flex items-center justify-center"
            >
              <TextReveal
                text="VIEW GARMENT"
                animate={hover}
                icon={<FaEye className="text-[.9em] relative -top-0.5" />}
                className="flex items-center gap-1.5 truncate bg-s px-3 py-1.5 text-[.9em] font-semibold uppercase text-p"
              />
            </motion.div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <TextReveal
            text={itemData?.category || "APPAREL"}
            animate={hover}
            className="max-w-50 w-full text-[.9em] font-semibold uppercase text-s"
          />
          <div className="max-w-40">
            <TextReveal
              text={itemData?.sizes ? itemData.sizes.join(" / ") : "P / M / G"}
              animate={hover}
              className="w-full text-right text-[.9em] font-semibold uppercase text-s"
            />
          </div>
        </div>
      </div>

      {hover && (
        <div className="pointer-events-none absolute inset-0 size-full border border-s/15 transition-all duration-700 delay-100" />
      )}
    </motion.div>
  );
});
