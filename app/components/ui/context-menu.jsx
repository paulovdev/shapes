"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MdFavorite, MdFavoriteBorder, MdShoppingBag } from "react-icons/md";
import { wordRevealHover } from "@/app/anim/modal.anim";
import { wordReveal } from "./reveal-text-hover";
import { useCartStore, useClose } from "@/app/stores/zustand";

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

export function ProductContextMenu({ product, position, onClose }) {
  const [hoveredOption, setHoveredOption] = useState(null);
  const { addToCart, removeFromCart, addToFavorite, isFavorite, isInCart } =
    useCartStore();
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

  const handleClose = () => {
    closingRef.current = true;
    clearTimeout(cursorTimerRef.current);
    setCloses(false);
    onClose();
  };

  useEffect(() => {
    if (product && position) {
      closingRef.current = false;
      openingRef.current = true;
    } else {
      clearTimeout(cursorTimerRef.current);
      setCloses(false);
    }

    return () => clearTimeout(cursorTimerRef.current);
  }, [product?.id, position?.x, position?.y, setCloses]);
  useEffect(() => {
    const handleClick = () => onClose();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!product || !position) return null;
  const favorite = isFavorite(product?.id);
  const inCart = isInCart(product?.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={{ top: position.y, left: position.x }}
        className="fixed z-301 w-56 bg-s text-p border border-s/20 p-2 shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <button
            type="button"
            onClick={() => {
              addToFavorite(product);

              onClose();
            }}
            onPointerEnter={() => setHoveredOption("favorite")}
            onPointerLeave={() => setHoveredOption(null)}
            className="w-full px-3 py-2 text-[.9em] font-semibold uppercase flex items-center justify-between 
            hover:bg-p/20 transition-colors text-p"
            data-cursor="hover"
          >
            <RevealText
              text={favorite ? "REMOVE WISHLIST" : "ADD TO WISHLIST"}
              animate={true}
              hover={hoveredOption === "favorite"}
            />
            <motion.span
              variants={wordReveal}
              initial="initial"
              animate="animate"
              className="shrink-0 ml-3"
            >
              {favorite ? (
                <MdFavorite size={16} className="text-red-500" />
              ) : (
                <MdFavoriteBorder size={16} />
              )}
            </motion.span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (inCart) {
                removeFromCart(product.id);
              } else {
                addToCart(product);
              }

              onClose();
            }}
            data-cursor="hover"
            onPointerEnter={() => setHoveredOption("bag")}
            onPointerLeave={() => setHoveredOption(null)}
            className="w-full px-3 py-2 text-[.9em] font-semibold uppercase flex items-center justify-between hover:bg-p/20 transition-colors text-p"
          >
            <RevealText
              text={inCart ? "REMOVE FROM BAG" : "ADD TO BAG"}
              animate={true}
              hover={hoveredOption === "bag"}
            />

            <motion.span
              variants={wordReveal}
              initial="initial"
              animate="animate"
              className="shrink-0 ml-3"
            >
              <MdShoppingBag size={16} />
            </motion.span>
          </button>
        </div>
      </motion.div>
      <motion.div
        onClick={handleClose}
        onMouseEnter={handleOverlayEnter}
        onMouseLeave={handleOverlayLeave}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 bg-s/5 z-300"
      />
    </>
  );
}
