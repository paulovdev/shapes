"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdFavorite, MdShoppingBag } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import Image from "next/image";

import { useCartStore, useClose } from "@/app/stores/zustand";
import { products } from "@/app/data/projects.data";
import Button from "./button";

import { drawerRightAnim, itemAnim, overlayAnim } from "@/app/anim/modal.anim";
import ButtonIcon from "./button-icon";
import { RiCloseLargeFill } from "react-icons/ri";
import Lenis from "lenis";
const wordReveal = {
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
export function FavoritesDrawer({ onAddToCart }) {
  const closingRef = useRef(false);
  const openingRef = useRef(true);
  const cursorTimerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const {
    favoriteIds,
    removeFromFavorites,
    addToCart,
    isFavoritesOpen,
    closeFavorites,
  } = useCartStore();

  const setCloses = useClose((state) => state.setCloses);
  const [notifyEmail, setNotifyEmail] = useState(false);

  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  const handleOverlayEnter = () => {
    if (closingRef.current) return;

    if (openingRef.current) {
      clearTimeout(cursorTimerRef.current);

      cursorTimerRef.current = setTimeout(() => {
        if (!closingRef.current) {
          setCloses(true);
          openingRef.current = false;
        }
      }, 750);

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
    closeFavorites();
  };

  useEffect(() => {
    if (isFavoritesOpen) {
      closingRef.current = false;
      openingRef.current = true;
    } else {
      clearTimeout(cursorTimerRef.current);
      setCloses(false);
    }

    return () => clearTimeout(cursorTimerRef.current);
  }, [isFavoritesOpen, setCloses]);

  useEffect(() => {
    const wrapper = scrollContainerRef.current;
    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper: wrapper,
      content: wrapper.firstElementChild,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <AnimatePresence>
      {isFavoritesOpen && (
        <div className="fixed inset-0 z-250 flex justify-end">
          <motion.div
            variants={overlayAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 z-0 bg-black/40 backdrop-blur-xs"
          />

          <button
            type="button"
            aria-label="Fechar favoritos"
            onClick={handleClose}
            onMouseEnter={handleOverlayEnter}
            onMouseLeave={handleOverlayLeave}
            className="absolute inset-0 z-1 cursor-default"
          />

          <motion.div
            ref={scrollContainerRef}
            variants={drawerRightAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-150 h-screen bg-p text-s border-l border-s/10 p-5 
            flex flex-col justify-between shadow-2xl overflow-y-auto custom-scrollbar overscroll-contain"
          >
            <div>
              <div className="relative flex items-center justify-between w-full border-b border-s/10 pb-4">
                <motion.div
                  custom={1}
                  variants={itemAnim}
                  className="flex items-center gap-2.5 bg-s p-2"
                >
                  <MdFavorite className="text-[1em] text-red-500" />

                  <span className="text-p text-[0.8rem] font-semibold tracking-widest flex items-center gap-1">
                    WISHLIST (
                    <span className="relative inline-block overflow-hidden h-[18px] w-4 text-center align-middle">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={favoriteIds}
                          variants={wordReveal}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="flex flex-col absolute inset-0 items-center justify-center"
                        >
                          <span className="h-[18px]">
                            {favoriteProducts.length}
                          </span>
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    )
                  </span>
                </motion.div>

                <ButtonIcon
                  icon={RiCloseLargeFill}
                  onClick={handleClose}
                  size="size-12"
                  iconSize="text-[1rem]"
                  bgNormal="bg-s/5"
                  bgHover="bg-s"
                  textNormal="text-s"
                  textHover="text-p"
                  className="border border-black/1"
                />
              </div>

              <div className="mt-5 space-y-3">
                {favoriteProducts.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-[.9em] font-semibold text-s/60 uppercase">
                      No items in your wishlist archive
                    </p>
                  </div>
                ) : (
                  favoriteProducts.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between p-2 border border-s/5 bg-p/50 hover:bg-p transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-14 h-14 border border-p/10 flex items-center justify-center p-1 bg-s/5">
                          <Image
                            src={item.img}
                            alt={item.title}
                            width={231}
                            height={233}
                            className="object-contain size-full"
                          />
                        </div>

                        <div>
                          <h4 className="text-[.9em] font-semibold text-s uppercase">
                            {item.title}
                          </h4>
                          <span className="text-[.9em] font-semibold text-s/60 uppercase">
                            ${item.price || "24.00"} USD
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <ButtonIcon
                          icon={MdShoppingBag}
                          onClick={() => {
                            addToCart?.(item);
                            onAddToCart?.(item);
                          }}
                          size="size-12"
                          iconSize="text-[.9rem]"
                          bgNormal="bg-s"
                          bgHover="bg-p"
                          textNormal="text-p"
                          textHover="text-s"
                          className="border border-s/1"
                        />
                        <ButtonIcon
                          icon={FaTrash}
                          onClick={() => removeFromFavorites(item.id)}
                          size="size-12"
                          iconSize="text-[.9rem]"
                          bgNormal="bg-s/5"
                          bgHover="bg-red-500"
                          textNormal="text-s/60"
                          textHover="text-p"
                          className="border border-s/1"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 border-t border-s/10 pt-4 space-y-2">
                <span className="text-s text-[.9rem] font-semibold uppercase block">
                  Archive Status
                </span>
                <p className="text-s/60 text-[.9rem] uppercase leading-relaxed">
                  Items saved in your wishlist remain reserved for a limited
                  time. Stock availability is not guaranteed.
                </p>
              </div>
            </div>

            <div className="border-t border-s/15 pt-4 space-y-4 mt-4 w-full">
              <label
                className="flex items-center gap-2.5 pb-1"
                data-cursor="hover"
              >
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="relative -top-0.5 accent-s size-3 rounded-none"
                />
                <span className="text-s/60 text-[.9rem] font-semibold uppercase">
                  Notify me about price drops on saved items
                </span>
              </label>

              <Button
                onClick={() => {
                  closeFavorites();
                  setCloses(false);
                }}
                text="CLOSE WISHLIST"
                bgNormal="bg-s"
                bgHover="bg-p"
                textNormal="text-p"
                textHover="text-s"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
