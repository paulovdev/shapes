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

const CATEGORIES = ["ALL", "ABSTRACT", "ORGANIC", "ARCHITECTURAL"];
const CHARS = "!<>-_\\/[]{}—=+*^?#__";

/* Helper para cálculo modular seguro */
const mod = (n, m) => ((n % m) + m) % m;

function ScrambleText({ text = "", trigger = false, className = "" }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let frame = 0;
    let animationFrame;
    const totalFrames = text.length * 4;

    if (trigger) {
      const update = () => {
        let out = "";
        for (let i = 0; i < text.length; i++) {
          if (frame > i * 4) {
            out += text[i];
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplayText(out);
        frame++;
        if (frame <= totalFrames) {
          animationFrame = requestAnimationFrame(update);
        } else {
          setDisplayText(text);
        }
      };
      update();
    } else {
      setDisplayText(text);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [trigger, text]);

  return <span className={className}>{displayText}</span>;
}

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
}) {
  const baseX = col * cellW;
  const baseY = row * cellH;
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
  const stackText = Array.isArray(itemData?.stack)
    ? itemData.stack.slice(0, 2).join(" · ")
    : "SHAPE";

  return (
    <motion.div
      onClick={() => onSelect(itemData, cellIndex)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      animate={{
        opacity: isAnyOpen && !isActive ? 0.2 : 1,
        scale: isActive ? 1.05 : hover ? 1.02 : 1,
        filter:
          isAnyOpen && !isActive
            ? "brightness(40%) blur(2px)"
            : "brightness(100%) blur(0px)",
      }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: renderX,
        y: renderY,
        width: cardW,
        height: cardH,
      }}
      className="group cursor-pointer select-none"
    >
      <div
        className="relative size-full p-4 flex flex-col justify-between 
      "
      >
        <div
          className="flex justify-between items-center text-p uppercase tracking-[-0.01em]

      group-hover:opacity-100 opacity-0 transition-all"
        >
          <Scramble
            text={itemData?.year || "2024"}
            trigger={Boolean(hover)}
            className="font-chivo text-[.8em] text-s font-semibold uppercase"
          />

          <span className="truncate max-w-[130px] text-right">
            <Scramble
              text={itemData?.title || "UNTITLED"}
              trigger={Boolean(hover)}
              className="font-chivo text-[.8em] text-s font-semibold uppercase"
            />
          </span>
        </div>

        {/* Imagem do Shape 3D */}
        <div className="relative my-2 w-full flex-1 flex items-center justify-center p-2 overflow-hidden rounded-lg ">
          {itemData.img ? (
            <img
              src={itemData.img}
              alt={itemData?.title || "3D Shape"}
              className="size-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-s/30">
              <FaCube className="text-4xl animate-pulse" />
            </div>
          )}

          {/* Badge Central no Hover estilo Sans Stack */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300
          "
          >
            <span
              className="bg-s font-chivo text-[.8em] text-p font-semibold uppercase px-3 py-1.5
            flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform"
            >
              <FaLink className="text-[0.9em]" /> INSPECT SHAPE
            </span>
          </div>
        </div>
      </div>
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
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-200 bg-p border border-s/20 p-6 md:p-8 shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-s/5 hover:bg-s/10 text-s transition-colors"
        >
          <MdClose className="text-xl" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="w-full h-64 md:h-80 p-4 flex items-center justify-center border border-s/10">
            <img
              src={project.img}
              alt={project.title}
              className="size-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex flex-col gap-4 ">
            <div>
              <span className="font-chivo text-[.8em] text-p font-semibold uppercase bg-s px-2 py-0.5">
                {project.category}
              </span>
              <h2 className="font-chivo text-[.9em] text-s font-semibold uppercase mt-2">
                {project.title}
              </h2>
              <p className="font-chivo text-[.8em] text-s/50 font-semibold">
                {project.year} ARCHIVE EDITION
              </p>
            </div>

            <p className="font-chivo text-[.8em] text-s font-semibold">
              {project.desc}
            </p>

            <div className="space-y-2 border-t border-s/10 pt-4">
              <div className="flex justify-between">
                <span className="font-chivo text-[.8em] text-s/50 font-semibold">
                  POLYGON COUNT:
                </span>
                <span className="font-chivo text-[.8em] text-s font-semibold">
                  {project.polyCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-chivo text-[.8em] text-s/50 font-semibold truncate">
                  SURFACE MATERIAL:
                </span>
                <span className="font-chivo text-[.8em] text-s font-semibold">
                  {project.material}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.stack?.map((st, i) => (
                <span
                  key={i}
                  className="font-chivo text-[.8em] text-s font-semibold bg-s/5 border border-s/10 px-2 py-1"
                >
                  {st}
                </span>
              ))}
            </div>

            <button
              className="mt-2 w-full py-2.5 bg-s font-chivo text-[.8em] text-p font-semibold 
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

export default function GalleryHero() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [vw, setVw] = useState(1920);
  const [vh, setVh] = useState(1080);

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

  // Cálculos de dimensão dos Cards na Grid
  const CARD_W = vw <= 768 ? 240 : vw <= 992 ? 280 : 340;
  const CARD_H = vw <= 768 ? 280 : vw <= 992 ? 320 : 380;
  const GAP = vw <= 768 ? 20 : 32;

  const CELL_W = CARD_W + GAP;
  const CELL_H = CARD_H + GAP;

  const COLS = Math.max(Math.ceil(vw / CELL_W) + 4, 8);
  const ROWS = Math.max(Math.ceil(vh / CELL_H) + 4, 8);

  const TOTAL_GRID_W = COLS * CELL_W;
  const TOTAL_GRID_H = ROWS * CELL_H;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 350, damping: 40 });
  const springY = useSpring(rawY, { stiffness: 350, damping: 40 });

  const numItems = filteredData.length || 1;

  /* Manipuladores de Drag da Canvas */
  const handlePointerDown = (e) => {
    isDragging.current = false;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    const deltaX = Math.abs(e.clientX - lastPointer.current.x);
    const deltaY = Math.abs(e.clientY - lastPointer.current.y);

    if (deltaX > 4 || deltaY > 4) {
      isDragging.current = true;
    }

    if (e.buttons === 1) {
      rawX.set(rawX.get() + (e.clientX - lastPointer.current.x));
      rawY.set(rawY.get() + (e.clientY - lastPointer.current.y));
      lastPointer.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleCardClick = useCallback((itemData, cellIndex) => {
    if (isDragging.current) return;
    setSelectedProject(itemData);
    setSelectedCellIndex(cellIndex);
  }, []);

  // Montagem da matriz de posições
  const gridCells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      gridCells.push({
        col: c,
        row: r,
        cellIndex: r * COLS + c,
      });
    }
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-p text-s select-none font-sans cursor-grab active:cursor-grabbing">
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 flex items-center justify-center z-100  select-none pointer-events-none">
        <div
          onPointerLeave={() => setHoveredCategory(null)}
          className="hidden md:flex items-center gap-1 bg-s text-p p-1.5 shadow-2xl border border-white/20 select-none pointer-events-auto"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const isHovered = hoveredCategory === cat;

            // O indicador segue o hover; se não houver hover, fica na categoria ativa
            const isTarget = hoveredCategory ? isHovered : isActive;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                onPointerEnter={() => setHoveredCategory(cat)}
                className={`relative px-4 py-1 font-chivo font-semibold text-[.8em] uppercase transition-colors duration-200 z-10 ${
                  isTarget ? "text-s" : "text-p hover:opacity-80"
                }`}
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
      </nav>

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
              className={`relative px-3 py-1 font-chivo font-semibold text-[.8em] uppercase transition-colors duration-200 z-10 ${
                isActive ? "text-s" : "text-p hover:opacity-80"
              }`}
            >
              {/* Pílula/Indicador desliza até a opção selecionada no toque */}
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

      {/* 4. Canvas da Galeria Infinita */}
      <section
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative size-full overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-auto">
          {gridCells.map(({ col, row, cellIndex }) => (
            <InfiniteCardCell
              key={`cell-${row}-${col}`}
              col={col}
              row={row}
              cellIndex={cellIndex}
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
            />
          ))}
        </div>
      </section>

      {/* 5. Modal de Detalhes do Shape */}
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
