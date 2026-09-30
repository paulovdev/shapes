"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { MdClose } from "react-icons/md";
import { FaLink, FaFolderOpen, FaCube } from "react-icons/fa6";

import Scramble from "../../common/scramble";
import { shapesData } from "@/app/data/projects.data";
import { useDragging } from "@/app/stores/zustand";

const CATEGORIES = ["ALL", "ABSTRACT", "ORGANIC", "ARCHITECTURAL"];

const mod = (n, m) => ((n % m) + m) % m;

function InfiniteCardCell({
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
  isActive,
  isAnyOpen,
  loading,
  offsetY = 0,
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

  const animationDelay = loading
    ? Math.min((row + col) * 0.035, 0.9) + 5
    : Math.min((row + col) * 0.035, 0.9);
  return (
    <motion.div
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
      className="group select-none"
      data-cursor="hover"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.7,
          delay: animationDelay,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="relative flex size-full flex-col justify-between border-2 border-transparent p-4"
      >
        <div className="flex items-center justify-between text-p uppercase tracking-[-0.01em] opacity-0 transition-all group-hover:opacity-100">
          <Scramble
            text={itemData?.year || "2024"}
            trigger={Boolean(hover)}
            className="text-[.8em] font-semibold uppercase text-s"
          />

          <span className="max-w-[130px] truncate text-right">
            <Scramble
              text={itemData?.title || "UNTITLED"}
              trigger={Boolean(hover)}
              className="text-[.8em] font-semibold uppercase text-s"
            />
          </span>
        </div>

        <div className="relative my-2 flex w-full flex-1 items-center justify-center overflow-hidden rounded-lg p-2">
          {itemData.img ? (
            <img
              src={itemData.img}
              alt={itemData?.title || "3D Shape"}
              className="size-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-s/30">
              <FaCube className="animate-pulse text-4xl" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex -translate-y-0 items-center gap-1.5 bg-s px-3 py-1.5 text-[.8em] font-semibold uppercase text-p transition-transform group-hover:translate-y-0">
              <FaLink className="text-[0.9em]" />
              INSPECT SHAPE
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ShapeDetailModal({ project, onClose }) {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-200 flex items-center justify-center p-5 md:p-8 bg-s/60 backdrop-blur-md"
      onClick={onClose}
      data-cursor="normal"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-200 bg-s border border-s/20 p-5 shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-p hover:bg-p/90 text-s transition-colors"
          data-cursor="hover"
        >
          <MdClose className="text-[1.25em] text-s" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="w-full h-100 p-5 max-md:h-50 flex items-center justify-center border border-p/10">
            <img
              src={project.img}
              alt={project.title}
              className="size-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <span className="text-[.8em] text-s font-semibold uppercase bg-p px-2 py-0.5">
                {project.category}
              </span>
              <h2 className="text-[1.25em] text-p font-semibold uppercase mt-2">
                {project.title}
              </h2>
              <p className="text-[.8em] text-p/50 font-semibold">
                {project.year} ARCHIVE EDITION
              </p>
            </div>

            <p className="text-[.8em] text-p font-semibold">{project.desc}</p>

            <div className="space-y-2 border-t border-p/10 pt-4">
              <div className="flex justify-between">
                <span className="text-[.8em] text-p/50 font-semibold">
                  POLYGON COUNT:
                </span>
                <span className="text-[.8em] text-p font-semibold">
                  {project.polyCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[.8em] text-p/50 font-semibold truncate">
                  SURFACE MATERIAL:
                </span>
                <span className="text-[.8em] text-p font-semibold">
                  {project.material}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.stack?.map((st, i) => (
                <span
                  key={i}
                  className="text-[.8em] text-p font-semibold bg-p/5 border border-p/10 px-2 py-1"
                >
                  {st}
                </span>
              ))}
            </div>

            <button
              className="mt-2 w-full py-2.5 bg-p text-[.8em] text-s font-semibold 
            flex items-center justify-center gap-2"
            >
              <FaFolderOpen /> DOWNLOAD 3D ASSETS
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryHero({ loading }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [vw, setVw] = useState(1920);
  const [vh, setVh] = useState(1080);
  const { setDragginS } = useDragging();
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const filteredData = shapesData.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory,
  );

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const CARD_W = vw <= 768 ? 240 : vw <= 992 ? 280 : 240;
  const CARD_H = vw <= 768 ? 280 : vw <= 992 ? 320 : 280;
  const GAP = vw <= 768 ? 75 : 150;

  const CELL_W = CARD_W + GAP;
  const CELL_H = CARD_H + GAP;

  const COLS = Math.max(Math.ceil(vw / CELL_W) + 4, 8);
  const ROWS = Math.max(Math.ceil(vh / CELL_H) + 4, 8);

  const TOTAL_GRID_W = COLS * CELL_W;
  const TOTAL_GRID_H = ROWS * CELL_H;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 150, damping: 30 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 30 });

  const numItems = filteredData.length || 1;

  const handlePointerDown = (e) => {
    isDragging.current = false;

    lastPointer.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setDragginS(false);
  };

  const handlePointerMove = (e) => {
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    if (e.buttons === 1 && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      if (!isDragging.current) {
        isDragging.current = true;
        setDragginS(true);
      }
    }

    if (e.buttons !== 1) return;

    rawX.set(rawX.get() + dx);
    rawY.set(rawY.get() + dy);

    lastPointer.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setDragginS(false);
  };

  const handleCardClick = useCallback((itemData, cellIndex) => {
    if (isDragging.current) return;
    setSelectedProject(itemData);
    setSelectedCellIndex(cellIndex);
  }, []);

  const COLUMN_OFFSETS = [0, CELL_H * 0.45, -CELL_H * 0.25, CELL_H * 0.35];

  const gridCells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      gridCells.push({
        col: c,
        row: r,
        cellIndex: r * COLS + c,
        offsetY: COLUMN_OFFSETS[c % COLUMN_OFFSETS.length],
      });
    }
  }

  return (
    <main
      className="relative w-screen h-svh overflow-hidden bg-p text-s select-none
    overscroll-none touch-none"
    >
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1,
          delay: loading ? 5 : 0,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed top-0 left-0 w-full p-4 md:p-6 flex items-center justify-center z-100 select-none pointer-events-none"
      >
        <div
          onPointerLeave={() => setHoveredCategory(null)}
          className="hidden md:flex items-center gap-1 bg-s text-p p-1.5 shadow-2xl border border-white/20 select-none pointer-events-auto"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const isHovered = hoveredCategory === cat;

            const isTarget = hoveredCategory ? isHovered : isActive;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                onPointerEnter={() => setHoveredCategory(cat)}
                className={`relative px-4 py-1 font-semibold text-[.8em] uppercase transition-colors duration-200 z-10 ${
                  isTarget ? "text-s" : "text-p hover:opacity-80"
                }`}
                data-cursor="hover"
              >
                {isTarget && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 bg-p z-[-1]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </motion.nav>

      <div
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-1 
      bg-s text-p p-1.5 shadow-2xl border border-white/20 select-none"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-3 py-1 font-semibold text-[.8em] uppercase transition-colors duration-200 z-10 ${
                isActive ? "text-s" : "text-p hover:opacity-80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeMobileCategoryTab"
                  className="absolute inset-0 bg-p z-[-1]"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        <section
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative size-full overflow-hidden overscroll-none touch-none"
        >
          <div className="absolute inset-0 pointer-events-auto">
            {gridCells.map(({ col, row, cellIndex, offsetY }) => (
              <InfiniteCardCell
                key={`cell-${row}-${col}-${activeCategory}`}
                col={col}
                row={row}
                cellIndex={cellIndex}
                offsetY={offsetY}
                cellW={CELL_W}
                cellH={CELL_H}
                cardW={CARD_W}
                cardH={CARD_H}
                totalW={TOTAL_GRID_W}
                totalH={TOTAL_GRID_H}
                canvasX={springX}
                canvasY={springY}
                filteredData={filteredData}
                numItems={numItems}
                onSelect={handleCardClick}
                isActive={selectedCellIndex === cellIndex}
                isAnyOpen={!!selectedProject}
                loading={loading}
              />
            ))}
          </div>
        </section>
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ShapeDetailModal
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              setSelectedCellIndex(null);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
