"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdShoppingBag } from "react-icons/md";

import { useCartStore } from "@/app/stores/zustand";
import DitherImage from "../dither/dither-image/dither-image";
import { BsTrash } from "react-icons/bs";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, checkout, getTotal } =
    useCartStore();

  const total = getTotal ? getTotal() : 0;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-250 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-p/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md h-screen bg-p border-l border-s/15 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-s/15 pb-4">
                <span className="text-[.8em] font-semibold text-s flex items-center gap-2 text-sm">
                  <MdShoppingBag /> [ CART BAG ({cart.length}) ]
                </span>
                <button
                  onClick={closeCart}
                  className="p-2 bg-s text-p rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  data-cursor="hover"
                >
                  <MdClose />
                </button>
              </div>

              <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[.8em] font-semibold text-s">
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
                          <DitherImage src={item.img} alt={item.title} />
                        </div>
                        <div>
                          <h4 className="text-[.8em] font-semibold text-s">
                            {item.title}
                          </h4>
                          <span className="text-[.8em] font-semibold text-s">
                            ${item.price || "24.00"} USD
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-400 hover:text-red-500 text-[1em] cursor-pointer"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-s/15 pt-4 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[.8em] uppercase opacity-60">
                  SUBTOTAL
                </span>
                <span className="text-2xl font-black">
                  ${total.toFixed(2)} USD
                </span>
              </div>

              <button
                onClick={checkout}
                disabled={cart.length === 0}
                className="w-full py-4 bg-s text-p font-bold text-[.8em] uppercase tracking-widest hover:bg-s/90 disabled:opacity-40 transition-all cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
