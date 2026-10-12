"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdShoppingBag } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import Image from "next/image";

import { useCartStore, useClose } from "@/app/stores/zustand";
import Button from "./button";

import {
  closeBtnAnim,
  drawerRightAnim,
  itemAnim,
  overlayAnim,
} from "@/app/anim/modal.anim";
import ButtonIcon from "./button-icon";
import { RiCloseLargeFill } from "react-icons/ri";

export function CartDrawer() {
  const closingRef = useRef(false);
  const openingRef = useRef(true);
  const cursorTimerRef = useRef(null);

  const { cart, isCartOpen, closeCart, removeFromCart, checkout, getTotal } =
    useCartStore();

  const setCloses = useClose((state) => state.setCloses);
  const total = getTotal ? getTotal() : 0;

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
            className="absolute inset-0 z-0 bg-black/40 backdrop-blur-xs"
          />

          <button
            type="button"
            aria-label="close bag"
            onClick={handleClose}
            onMouseEnter={handleOverlayEnter}
            onMouseLeave={handleOverlayLeave}
            className="absolute inset-0 z-1 cursor-default"
          />

          <motion.div
            variants={drawerRightAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-[480px] h-screen bg-p text-s border-l border-s/10 p-5 
            flex flex-col justify-between shadow-2xl"
          >
            <div>
              <div className="relative flex items-center justify-between w-full border-b border-s/10 pb-4">
                <motion.div
                  custom={1}
                  variants={itemAnim}
                  className="flex items-center gap-2.5 bg-s text-p p-2"
                >
                  <MdShoppingBag className="text-[1em]" />
                  <span className="text-[0.8rem] font-bold tracking-widest">
                    CART BAG ({cart.length})
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

              <div className="mt-6 space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-[.9em] font-semibold text-s/60 uppercase">
                      No items in your archive bag
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
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

                      <ButtonIcon
                        icon={FaTrash}
                        onClick={() => removeFromCart(item.id)}
                        size="size-12"
                        iconSize="text-[.9rem]"
                        bgNormal="bg-s/5"
                        bgHover="bg-red-500"
                        textNormal="text-s/60"
                        textHover="text-p"
                        className="border border-s/1"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-s/10 pt-4 space-y-4">
              <div className="flex justify-between items-baseline px-1">
                <span className="text-[.9em] font-semibold text-s/60 uppercase">
                  SUBTOTAL
                </span>
                <span className="text-[.9em] font-semibold text-s uppercase">
                  ${total.toFixed(2)} USD
                </span>
              </div>

              <div className="w-full">
                <Button
                  onClick={checkout}
                  disabled={cart.length === 0}
                  text="PAY"
                  bgNormal="bg-s"
                  bgHover="bg-p"
                  textNormal="text-p"
                  textHover="text-s"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
