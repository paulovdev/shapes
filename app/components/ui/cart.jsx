"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdShoppingBag } from "react-icons/md";

import { useCartStore, useClose } from "@/app/stores/zustand";
import DitherImage from "../dither/dither-image/dither-image";

import {
  closeBtnAnim,
  drawerRightAnim,
  itemAnim,
  overlayAnim,
} from "@/app/anim/modal.anim";
import { FaTrash } from "react-icons/fa6";
import Button from "./button";
import Image from "next/image";

export function CartDrawer() {
  const closingRef = useRef(false);
  const openingRef = useRef(true);
  const cursorTimerRef = useRef(null);

  const handleOverlayEnter = () => {
    if (closingRef.current) return;

    if (openingRef.current) {
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

  const { cart, isCartOpen, closeCart, removeFromCart, checkout, getTotal } =
    useCartStore();

  const setCloses = useClose((state) => state.setCloses);
  const total = getTotal ? getTotal() : 0;

  const handleClose = () => {
    closingRef.current = true;
    clearTimeout(cursorTimerRef.current);
    setCloses(false);
    closeCart();
  };

  useEffect(() => {
    if (isCartOpen) {
      closingRef.current = false;
      openingRef.current = true;
    } else {
      clearTimeout(cursorTimerRef.current);
      setCloses(false);
    }

    return () => clearTimeout(cursorTimerRef.current);
  }, [isCartOpen, setCloses]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-250 flex justify-end">
          <motion.div
            variants={overlayAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 z-0 bg-s/25 backdrop-blur-md"
          />

          <button
            type="button"
            aria-label="close bag"
            onClick={handleClose}
            onMouseEnter={handleOverlayEnter}
            onMouseLeave={handleOverlayLeave}
            className="absolute inset-0 z-[1]"
          />

          <motion.div
            variants={drawerRightAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-md h-screen bg-p border-l border-s/15 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="relative flex items-center justify-between w-full border-b border-s/15 pb-4">
                <motion.div
                  custom={1}
                  variants={itemAnim}
                  className="flex items-center gap-3 bg-s px-4 py-2 "
                >
                  <MdShoppingBag className="relative -top-0.5 text-[1em] text-p" />
                  <span className="text-[.9em] font-semibold text-p">
                    CART BAG ({cart.length})
                  </span>
                </motion.div>

                <motion.button
                  variants={closeBtnAnim}
                  onClick={handleClose}
                  className="size-12.5 bg-s flex items-center justify-center pointer-events-auto hover:opacity-80 transition-opacity"
                  data-cursor="hover"
                >
                  <MdClose className="text-[1.5em] text-p" />
                </motion.button>
              </div>

              <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[.9em] font-semibold text-s">
                      NO ITEMS IN YOUR ARCHIVE BAG
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between p-3 border border-s/15 bg-s/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 border border-s/15 flex items-center justify-center p-1 bg-p">
                          <Image
                            src={item.img}
                            alt={item.title}
                            width={231}
                            height={233}
                            className="object-contain size-full"
                          />
                        </div>
                        <div>
                          <h4 className="text-[.9em] font-semibold text-s">
                            {item.title}
                          </h4>
                          <span className="text-[.9em] font-semibold text-s">
                            ${item.price || "24.00"} USD
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:text-red-500 text-[1em] cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-s/15 pt-4 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[.9em] uppercase">SUBTOTAL</span>
                <span className="text-[.9em] font-black">
                  ${total.toFixed(2)} USD
                </span>
              </div>
              <Button
                onClick={checkout}
                disabled={cart.length === 0}
                className="w-full font-semibold uppercase text-[.9em] tracking-wider"
                text="PROCEED TO CHECKOUT"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
