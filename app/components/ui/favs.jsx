"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFavorite, MdShoppingBag } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import Image from "next/image";

import { useCartStore } from "@/app/stores/zustand";
import { products } from "@/app/data/projects.data";
import Button from "./button";

import {
  closeBtnAnim,
  drawerRightAnim,
  itemAnim,
  overlayAnim,
} from "@/app/anim/modal.anim";

export function FavoritesDrawer({ onAddToCart }) {
  const { favoriteIds, removeFromFavorites, isFavoritesOpen, closeFavorites } =
    useCartStore();

  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <AnimatePresence>
      {isFavoritesOpen && (
        <div className="fixed inset-0 z-250 flex justify-end">
          <motion.div
            variants={overlayAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={closeFavorites}
            className="absolute inset-0 bg-s/25 backdrop-blur-md"
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
                  className="flex items-center gap-3 bg-s px-4 py-2"
                >
                  <MdFavorite className="relative -top-0.5 text-[1em] text-p text-red-500" />
                  <span className="text-[.9em] font-semibold text-p">
                    FAVORITES ({favoriteProducts.length})
                  </span>
                </motion.div>

                <motion.button
                  variants={closeBtnAnim}
                  onClick={closeFavorites}
                  className="size-12.5 bg-s flex items-center justify-center pointer-events-auto hover:opacity-80 transition-opacity"
                  data-cursor="hover"
                >
                  <MdClose className="text-[1.5em] text-p" />
                </motion.button>
              </div>

              <div className="mt-6 space-y-3 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {favoriteProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[.9em] font-semibold text-s">
                      NO ITEMS IN YOUR FAVORITES ARCHIVE
                    </p>
                  </div>
                ) : (
                  favoriteProducts.map((item) => (
                    <div
                      key={item.id}
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

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onAddToCart?.(item)}
                          className="p-2 text-s hover:opacity-75 transition-opacity text-[1.1em] cursor-pointer"
                          title="Add to Bag"
                        >
                          <MdShoppingBag />
                        </button>

                        <button
                          onClick={() => removeFromFavorites(item.id)}
                          className="p-2 text-red-400 hover:text-red-500 text-[1em] cursor-pointer"
                          title="Remove Favorite"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-s/15 pt-4">
              <Button
                onClick={closeFavorites}
                className="w-full font-semibold uppercase text-[.9em] tracking-wider"
                text="CLOSE FAVORITES"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
