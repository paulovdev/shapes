"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoMdContact } from "react-icons/io";
import { MdFavorite, MdShoppingBag } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "../stores/zustand";
import { wordReveal, wordRevealHover } from "../anim/modal.anim";

const navContainerAnim = {
  initial: {
    y: -20,
    opacity: 0,
  },

  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const wordReveal1 = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.33, 1, 0.68, 1],
    },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

const HoverText = ({
  text = "",
  icon,
  animate = false,
  hover = false,
  className = "",
  count = null,
}) => {
  const words = text.split(" ");

  return (
    <div className={`flex items-center ${className}`}>
      {icon && (
        <span className="relative inline-block overflow-hidden h-[20px] mr-[0.35em] shrink-0">
          <motion.span
            variants={wordReveal}
            initial="initial"
            animate={animate ? "animate" : "initial"}
            className="block will-change-transform"
          >
            <motion.span
              variants={wordRevealHover}
              initial="initial"
              animate={hover ? "animate" : "initial"}
              className="flex flex-col"
            >
              <span className="flex items-center h-[20px]">{icon}</span>
              <span className="flex items-center h-[20px]">{icon}</span>
            </motion.span>
          </motion.span>
        </span>
      )}

      <div className="flex items-center">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="relative inline-block overflow-hidden h-[20px] mr-[0.25em] last:mr-0"
          >
            <motion.span
              variants={wordReveal}
              initial="initial"
              animate={animate ? "animate" : "initial"}
              custom={index * 0.05}
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

        {count !== null && (
          <span className="flex items-center ml-[0.25em]">
            (
            <span className="relative inline-block overflow-hidden h-[20px] w-4 text-center align-middle">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  variants={wordReveal1}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col absolute inset-0 items-center justify-center"
                >
                  <span className="h-[20px]">{count}</span>
                </motion.span>
              </AnimatePresence>
            </span>
            )
          </span>
        )}
      </div>
    </div>
  );
};

const Nav = () => {
  const { openCart, cart = [], openFavorites, favoriteIds } = useCartStore();
  const [hovered, setHovered] = useState(null);

  const totalCartCount = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

  return (
    <motion.nav
      variants={navContainerAnim}
      initial="initial"
      animate="animate"
      className="fixed top-0 left-0 z-50 flex w-full items-center justify-between p-5 mix-blend-difference select-none max-md:p-3"
    >
      <div
        className="overflow-hidden relative"
        data-cursor="hover"
        onPointerEnter={() => setHovered("logo")}
        onPointerLeave={() => setHovered(null)}
      >
        <Link href="/">
          <HoverText
            text="shapes®"
            animate={true}
            hover={hovered === "logo"}
            className="text-p text-[.9em] font-light uppercase"
          />
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div
          className="overflow-hidden cursor-pointer"
          data-cursor="hover"
          onPointerEnter={() => setHovered("fav")}
          onPointerLeave={() => setHovered(null)}
          onClick={openFavorites}
        >
          <HoverText
            text="WISHLIST"
            count={favoriteIds.length}
            icon={<MdFavorite className="text-[1.1em]" />}
            animate={true}
            hover={hovered === "fav"}
            className="text-p text-[.9em] font-light uppercase"
          />
        </div>
        <div
          className="overflow-hidden cursor-pointer"
          data-cursor="hover"
          onPointerEnter={() => setHovered("bag")}
          onPointerLeave={() => setHovered(null)}
          onClick={openCart}
        >
          <HoverText
            text="BAG"
            count={totalCartCount}
            icon={<MdShoppingBag className="text-[1.1em]" />}
            animate={true}
            hover={hovered === "bag"}
            className="text-p text-[.9em] font-light uppercase"
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Nav;
