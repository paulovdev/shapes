"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdMoreVert, MdSort, MdCheck } from "react-icons/md";
import { wordRevealHover } from "@/app/anim/modal.anim";
import { wordReveal } from "./reveal-text-hover";
import { useClose } from "@/app/stores/zustand";

const HoverText = ({ text, hover }) => {
  return (
    <motion.div
      variants={wordRevealHover}
      initial="initial"
      animate={hover ? "animate" : "initial"}
      className="flex flex-col items-start justify-center"
    >
      <span className="block h-[20px]">{text}</span>
      <span className="block h-[20px]">{text}</span>
    </motion.div>
  );
};

const RevealText = ({
  text = "",
  animate = false,
  hover = false,
  delay = 0,
  className = "",
}) => {
  const words = text.split(" ");

  return (
    <div className={`flex items-center ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="relative inline-block overflow-hidden mr-[0.25em] h-[20px]"
        >
          <motion.span
            variants={wordReveal}
            initial="initial"
            animate={animate ? "animate" : "initial"}
            exit="exit"
            custom={delay + index * 0.05}
            className="block will-change-transform"
          >
            <motion.span
              variants={wordRevealHover}
              initial="initial"
              animate={hover ? "animate" : "initial"}
              className="flex flex-col"
            >
              <span className="block h-[20px]">{word}</span>
              <span className="block h-[20px]">{word}</span>
            </motion.span>
          </motion.span>
        </span>
      ))}
    </div>
  );
};

export function FilterDropdown({
  sortBy,
  onSortChange,
  showOnlyInStock,
  onToggleInStock,
}) {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const setCloses = useClose((state) => state.setCloses);

  const closingRef = useRef(false);
  const openingRef = useRef(true);
  const cursorTimerRef = useRef(null);

  const handleOverlayEnter = () => {
    if (closingRef.current) return;

    if (openingRef.current) {
      clearTimeout(cursorTimerRef.current);

      cursorTimerRef.current = setTimeout(() => {
        if (!closingRef.current) {
          setCloses(true);
          openingRef.current = false;
        }
      }, 150);

      return;
    }

    setCloses(true);
  };

  const handleOverlayLeave = () => {
    clearTimeout(cursorTimerRef.current);
    setCloses(false);
  };

  const handleCloseDropdown = () => {
    closingRef.current = true;
    clearTimeout(cursorTimerRef.current);
    setCloses(false);
    setIsOpen(false);
    setHoveredOption(null);
  };

  useEffect(() => {
    if (isOpen) {
      closingRef.current = false;
      openingRef.current = true;
    } else {
      clearTimeout(cursorTimerRef.current);
      setCloses(false);
    }

    return () => clearTimeout(cursorTimerRef.current);
  }, [isOpen, setCloses]);

  const sortOptions = [
    { label: "DEFAULT", value: "DEFAULT" },
    { label: "PRICE: LOW TO HIGH", value: "PRICE_ASC" },
    { label: "PRICE: HIGH TO LOW", value: "PRICE_DESC" },
    { label: "NAME: A - Z", value: "NAME_ASC" },
  ];

  return (
    <>
      <div
        className="relative inline-block text-left z-100"
        data-cursor="hover"
        aria-label="Options Menu"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`p-3 h-12.5 border border-s/20 transition-all ${
            isOpen ? "bg-p text-s" : "bg-s text-p hover:bg-p hover:text-s"
          }`}
        >
          <div className="overflow-hidden h-[20px]">
            <HoverText text={<MdMoreVert size={22} />} hover={hover} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="absolute bottom-15 right-0 mt-2 w-56 bg-s text-p border border-s/20 p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-s/10">
                  <div className="flex items-center justify-between">
                    <RevealText
                      text="SORT & FILTER"
                      animate={true}
                      className="text-[.9em] font-semibold uppercase"
                    />

                    <motion.div
                      variants={wordReveal}
                      initial="initial"
                      animate="animate"
                      className="shrink-0"
                    >
                      <MdSort size={16} />
                    </motion.div>
                  </div>
                </div>

                <div className="py-1">
                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    const isHovered = hoveredOption === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSortChange(opt.value);
                          setIsOpen(false);
                          setHoveredOption(null);
                          handleCloseDropdown();
                        }}
                        onPointerEnter={() => setHoveredOption(opt.value)}
                        onPointerLeave={() => setHoveredOption(null)}
                        className={`w-full px-3 py-2 text-[.9em] font-semibold uppercase flex items-center justify-between 
                        hover:bg-p/20 transition-colors ${
                          isSelected ? "text-p font-bold" : "text-p/50"
                        }`}
                      >
                        <RevealText
                          text={opt.label}
                          animate={true}
                          hover={isHovered}
                        />

                        {isSelected && (
                          <motion.span
                            variants={wordReveal}
                            initial="initial"
                            animate="animate"
                            custom={0.15}
                            className="shrink-0 ml-3"
                          >
                            <MdCheck size={16} />
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {onToggleInStock && (
                  <div className="border-t border-p/25 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleInStock();
                        setIsOpen(false);
                      }}
                      className="w-full px-3 py-2 text-[11px] font-semibold uppercase flex items-center justify-between hover:bg-s/10 transition-colors opacity-70"
                    >
                      <span>AVAILABLE ONLY</span>

                      {showOnlyInStock && <MdCheck size={14} />}
                    </button>
                  </div>
                )}
              </motion.div>
              <motion.div
                onClick={handleCloseDropdown}
                onMouseEnter={handleOverlayEnter}
                onMouseLeave={handleOverlayLeave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-0 bg-s/5 z-40"
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
