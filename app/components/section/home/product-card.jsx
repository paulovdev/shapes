import React, { useState } from "react";
import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { FaShirt, FaEye } from "react-icons/fa6";
import Scramble from "../../common/scramble";

const mod = (n, m) => ((n % m) + m) % m;

export function ProductCard({
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

  animationIndex = 0,
}) {
  const baseX = col * cellW;
  const baseY = row * cellH + offsetY;
  const [hover, setHover] = useState(false);

  const renderX = useTransform(
    canvasX,
    (currentX) => mod(baseX + currentX + cellW, totalW) - cellW,
  );

  const renderY = useTransform(
    canvasY,
    (currentY) => mod(baseY + currentY + cellH, totalH) - cellH,
  );

  const itemData = filteredData[cellIndex % numItems] || {};
  const animationDelay = ((col + row) % 6) * 0.04;
  return (
    <motion.div
      initial={{
        clipPath: "inset(100% 0% 0% 0%)",
        scale: 0.96,
        opacity: 0.4,
      }}
      animate={{
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        opacity: 1,
      }}
      exit={{
        clipPath: "inset(0% 0% 100% 0%)",
        opacity: 0,
        scale: 0.4,
      }}
      transition={{
        duration: 0.7,
        delay: animationDelay,
        ease: [0.76, 0, 0.24, 1],
      }}
      onClick={() => onSelect(itemData, cellIndex)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: renderX,
        y: renderY,
        width: cardW,
        height: cardH,
      }}
      className="group select-none relative cursor-pointer w-full"
      data-cursor="hover"
    >
      <motion.div className="relative flex size-full flex-col justify-between font-chivo p-4">
        <div className="flex items-center justify-between text-p uppercase opacity-0 transition-all group-hover:opacity-100">
          <Scramble
            text={itemData?.price || "R$ 389,00"}
            trigger={Boolean(hover)}
            className="text-[.8em] font-semibold uppercase text-s"
          />

          <span className="max-w-50 truncate text-right">
            <Scramble
              text={itemData?.title || "UNTITLED GARMENT"}
              trigger={Boolean(hover)}
              className="text-[.8em] font-semibold uppercase text-s"
            />
          </span>
        </div>

        <div
          className="relative my-2 flex w-full flex-1 items-center justify-center overflow-hidden rounded-lg p-2 
        group-hover:scale-95 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        >
          {itemData.img ? (
            <Image
              src={itemData.img}
              alt={itemData.title || "Product image"}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-s/30">
              <FaShirt className="animate-pulse text-4xl" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 bg-s truncate px-3 py-1.5 text-[.75em] font-semibold uppercase text-p">
              <FaEye className="text-[.8em]" />
              <Scramble text="VIEW GARMENT" trigger={hover} />
            </span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Scramble
            text={`[${itemData?.category || "APPAREL"}]`}
            trigger={Boolean(hover)}
            className="w-full text-[.7em] font-semibold uppercase text-s"
          />
          <Scramble
            text={itemData?.sizes ? itemData.sizes.join(" / ") : "P / M / G"}
            trigger={Boolean(hover)}
            className="text-[.7em] font-semibold uppercase text-s"
          />
        </div>
      </motion.div>

      <div
        className="absolute inset-0 size-full border border-s/99 transition-all duration-500 opacity-0 
      group-hover:opacity-100 pointer-events-none"
      ></div>
    </motion.div>
  );
}
