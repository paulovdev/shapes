"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdShoppingBag } from "react-icons/md";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa6";
import Image from "next/image";
import Lenis from "lenis";
import { useCartStore, useClose } from "@/app/stores/zustand";
import Button from "./button";

import { drawerRightAnim, itemAnim, overlayAnim } from "@/app/anim/modal.anim";
import ButtonIcon from "./button-icon";
import { RiCloseLargeFill } from "react-icons/ri";

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

export function CartDrawer() {
  const closingRef = useRef(false);
  const openingRef = useRef(true);
  const cursorTimerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    checkout,
    getTotal,
  } = useCartStore();

  const setCloses = useClose((state) => state.setCloses);
  const subtotal = getTotal ? getTotal() : 0;

  const [promoCode, setPromoCode] = useState("OFFSET20");
  const [appliedPromo, setAppliedPromo] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const promoDiscount = appliedPromo ? 20 : 0;
  const generalDiscount = 40;
  const bonuses = 0;
  const delivery = 0;
  const total = Math.max(
    0,
    subtotal - promoDiscount - generalDiscount + delivery,
  );

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

  const totalItemsCount = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

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
            ref={scrollContainerRef}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-150 h-screen bg-p text-s border-l border-s/10 p-5 
            flex flex-col justify-between shadow-2xl overflow-y-auto custom-scrollbar overscroll-contain"
          >
            <div>
              {/* Header */}
              <div className="relative flex items-center justify-between w-full border-b border-s/10 pb-4">
                <motion.div
                  custom={1}
                  variants={itemAnim}
                  className="flex items-center gap-2.5 bg-s p-2"
                >
                  <MdShoppingBag className="text-[1em] text-p" />
                  <span className="text-p text-[0.8rem] font-semibold tracking-widest flex items-center gap-1">
                    CART BAG (
                    <span className="relative inline-block overflow-hidden h-[18px] w-4 text-center align-middle">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={totalItemsCount}
                          variants={wordReveal}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="flex flex-col absolute inset-0 items-center justify-center"
                        >
                          <span className="h-[18px]">{totalItemsCount}</span>
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

              {/* Items List */}
              <div className="mt-5 space-y-3 overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-[.9em] font-semibold text-s/60 uppercase">
                      No items in your archive bag
                    </p>
                  </div>
                ) : (
                  cart.map((item, i) => {
                    const quantity = item.quantity || 1;
                    const itemPrice = parseFloat(item.price || 24.0);
                    const itemTotalPrice = itemPrice * quantity;

                    return (
                      <div
                        key={item.id || i}
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
                            <span className="text-[.9em] font-semibold text-s/60 uppercase relative inline-block overflow-hidden h-[22px]">
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  key={itemTotalPrice}
                                  variants={wordReveal}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  className="flex flex-col"
                                >
                                  <span className="h-[22px]">
                                    ${itemTotalPrice.toFixed(2)} USD
                                  </span>
                                </motion.span>
                              </AnimatePresence>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="flex items-center">
                            <ButtonIcon
                              icon={FaMinus}
                              onClick={() =>
                                updateQuantity(item.id, quantity - 1)
                              }
                              size="size-10"
                              iconSize="text-[.9rem]"
                              bgNormal="bg-s"
                              bgHover="bg-p"
                              textNormal="text-p"
                              textHover="text-s"
                              className="border border-black/1"
                            />
                            <span className="relative inline-block overflow-hidden h-[20px] w-10 text-center">
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  key={quantity}
                                  variants={wordReveal}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  className="flex flex-col absolute inset-0 items-center justify-center"
                                >
                                  <span className="h-[20px] text-s text-[.9rem] font-semibold uppercase">
                                    {quantity}
                                  </span>
                                </motion.span>
                              </AnimatePresence>
                            </span>
                            <ButtonIcon
                              icon={FaPlus}
                              onClick={() =>
                                updateQuantity(item.id, quantity + 1)
                              }
                              size="size-10"
                              iconSize="text-[.9rem]"
                              bgNormal="bg-s"
                              bgHover="bg-p"
                              textNormal="text-p"
                              textHover="text-s"
                              className="border border-black/1"
                            />
                          </div>

                          <ButtonIcon
                            icon={FaTrash}
                            onClick={() => removeFromCart(item.id)}
                            size="size-10"
                            iconSize="text-[.9rem]"
                            bgNormal="bg-s/5"
                            bgHover="bg-red-500"
                            textNormal="text-s/60"
                            textHover="text-p"
                            className="border border-s/1"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Promocode */}
              <div className="mt-5 flex items-center justify-between  border-b border-s/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-s text-[.9rem] font-semibold uppercase">
                    Promocode:
                  </span>
                  <span className="text-s/60 text-[.9rem] font-semibold uppercase">
                    {appliedPromo ? promoCode : "NONE"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(!appliedPromo)}
                  className="text-s text-[.9rem] font-semibold uppercase"
                >
                  {appliedPromo ? "Cancel" : "Add"}
                </button>
              </div>

              {/* Detail Breakdown */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-s/60 text-[.9rem] font-semibold uppercase">
                    Items:
                  </span>
                  <span className="text-s text-[.9rem] font-semibold uppercase relative inline-block overflow-hidden h-[20px]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={subtotal}
                        variants={wordReveal}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex flex-col"
                      >
                        <span className="h-[20px]">${subtotal.toFixed(0)}</span>
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center">
                    <span className="text-s/60 text-[.9rem] font-semibold uppercase">
                      Promocode:
                    </span>
                    <span className="text-[.9rem] font-semibold uppercase text-red-500">
                      -${promoDiscount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-s text-[.9rem] font-semibold uppercase">
                    Bonuses:
                  </span>
                  <span className="text-s text-[.9rem] font-semibold uppercase">
                    {bonuses}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-s text-[.9rem] font-semibold uppercase">
                    Discount:
                  </span>
                  <span className="text-[.9rem] font-semibold uppercase text-red-500">
                    -${generalDiscount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-s text-[.9rem] font-semibold uppercase">
                    Delivery:
                  </span>
                  <span className="text-s text-[.9rem] font-semibold uppercase">
                    {delivery}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-s/15 pt-4 space-y-4 mt-4">
              <div className="flex justify-between items-baseline px-1">
                <span className="text-s text-[.9rem] font-semibold uppercase">
                  Total:
                </span>
                <span className="text-s text-[1.25rem] font-semibold uppercase relative inline-block overflow-hidden h-[26px]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={total}
                      variants={wordReveal}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex flex-col"
                    >
                      <span className="h-[26px]">${total.toFixed(0)}</span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer pb-1">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="relative -top-0.5 accent-s size-3 rounded-none"
                />
                <span className="text-s/60 text-[.9rem] font-semibold uppercase">
                  I want to sign up for the newsletter
                </span>
              </label>

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
