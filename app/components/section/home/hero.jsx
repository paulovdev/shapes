"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

import { products } from "@/app/data/projects.data";
import { useDragging, useCartStore } from "@/app/stores/zustand";

import { ProductModal } from "./product-modal";
import { ProductCard } from "./product-card";
import { CartDrawer } from "../../ui/cart";
import { FilterDropdown } from "../../ui/filter-dropdown";
import Image from "next/image";

const CATEGORIES = ["ALL", "OUTERWEAR", "STREETWEAR", "TECHWEAR"];

export default function GalleryHero({ loading }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { cart, purchasedIds, addToCart, isInCart, openCart } = useCartStore();
  const [vw, setVw] = useState(1920);
  const [vh, setVh] = useState(1080);
  const { setDragginS } = useDragging();
  const clickLock = useRef(false);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const filteredData = useMemo(() => {
    let result = products.filter(
      (item) => activeCategory === "ALL" || item.category === activeCategory,
    );

    if (sortBy === "PRICE_ASC") {
      result = [...result].sort(
        (a, b) => parseFloat(a.price || 24) - parseFloat(b.price || 24),
      );
    } else if (sortBy === "PRICE_DESC") {
      result = [...result].sort(
        (a, b) => parseFloat(b.price || 24) - parseFloat(a.price || 24),
      );
    } else if (sortBy === "NAME_ASC") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [activeCategory, sortBy]);

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const CARD_W = vw <= 768 ? 250 : vw <= 992 ? 280 : 275;
  const CARD_H = vw <= 768 ? 400 : vw <= 992 ? 320 : 500;
  const GAP = vw <= 768 ? 100 : 150;

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
    lastPointer.current = { x: e.clientX, y: e.clientY };
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

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setDragginS(false);
  };

  const handleCardClick = useCallback((itemData, cellIndex) => {
    if (isDragging.current || clickLock.current) return;

    clickLock.current = true;
    setSelectedProject(itemData);
    setSelectedCellIndex(cellIndex);

    setTimeout(() => {
      clickLock.current = false;
    }, 150);
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
    <main className="relative w-screen h-svh overflow-hidden bg-p text-s select-none overscroll-none touch-none">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1,
          delay: loading ? 6 : 0,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed top-0 left-0 w-full p-4 flex items-center justify-center z-100 select-none pointer-events-none"
      >
        <div className="flex items-center gap-2.5">
          <div
            onPointerLeave={() => setHoveredCategory(null)}
            className="p-2 h-10 flex items-center gap-1 font-chivo bg-s text-p select-none pointer-events-auto"
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
                  className={`relative px-4 py-1 text-[.8em] font-semibold uppercase cursor-default transition-colors duration-200 z-10 ${
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
          <div className="pointer-events-auto">
            <FilterDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${activeCategory}-${sortBy}`}
          initial={{
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 0.98,
          }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
          }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            scale: 0.98,
          }}
          transition={{
            duration: 0.8,
            delay: loading ? 6 : 0,
            ease: [0.76, 0, 0.24, 1],
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative size-full overflow-hidden overscroll-none touch-none"
        >
          <div className="absolute inset-0 pointer-events-auto">
            {gridCells.map(({ col, row, cellIndex, offsetY }) => (
              <ProductCard
                key={`cell-${row}-${col}-${cellIndex}-${activeCategory}-${sortBy}`}
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
                animationIndex={cellIndex}
              />
            ))}
          </div>
        </motion.section>
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProductModal
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              setSelectedCellIndex(null);
            }}
            onAddToCart={(project) => {
              addToCart(project);
              openCart();
            }}
            purchasedIds={purchasedIds}
            isInCart={isInCart}
          />
        )}
      </AnimatePresence>

      <CartDrawer />

      <div className="absolute size-full inset-0 px-2.5 py-5 flex items-end justify-center pointer-events-none">
        <motion.figure
          initial={{
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 0.98,
          }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
          }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            scale: 0.98,
          }}
          transition={{
            duration: 0.8,
            delay: loading ? 6 : 0,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <Image
            alt=""
            src="/images/bars.png"
            width={423}
            height={416}
            className="object-cover w-45 h-8"
          />
        </motion.figure>
      </div>
    </main>
  );
}
