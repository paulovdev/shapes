"use client";

import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Lenis from "lenis";
import { MdFavorite } from "react-icons/md";

import { drawerLeftAnim, itemAnim, overlayAnim } from "@/app/anim/modal.anim";

import { Reveal } from "../../ui/reveal";
import Button from "../../ui/button";
import { useCartStore, useClose } from "@/app/stores/zustand";
import ButtonIcon from "../../ui/button-icon";
import { RiCloseLargeFill } from "react-icons/ri";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";

const MINIMAP_IMAGES = [
  "/images/product-overview/product_minimap_01.jpg",
  "/images/product-overview/product_minimap_02.jpg",
  "/images/product-overview/product_minimap_03.jpg",
  "/images/product-overview/product_minimap_04.jpg",
  "/images/product-overview/product_minimap_05.jpg",
];

const clipPathDirectionalVariants = {
  enter: (direction) => ({
    clipPath: direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: (direction) => ({
    clipPath: direction > 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
};

export const ProductModal = memo(function ProductModal({ product, onClose }) {
  if (!product) return null;

  const closingRef = useRef(false);
  const openingRef = useRef(true);
  const cursorTimerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const { setCloses } = useClose();
  const {
    addToCart,
    addToFavorite,
    isFavorite,
    isInCart,
    openCart,
    purchasedIds,
  } = useCartStore();

  const [[selectedImgIndex, direction], setPage] = useState([0, 0]);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : "M",
  );
  const isPurchased = purchasedIds.includes(product.id);
  const favorite = isFavorite(product?.id);
  const inCart = isInCart(product?.id);

  const gallery = useMemo(() => {
    return [product.img || MINIMAP_IMAGES[0], ...MINIMAP_IMAGES.slice(1)];
  }, [product.img]);

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

  const changeImage = (newIndex) => {
    if (newIndex === selectedImgIndex) return;
    const newDirection = newIndex > selectedImgIndex ? 1 : -1;
    setPage([newIndex, newDirection]);
  };

  const handlePrevImage = () => {
    const nextIndex =
      selectedImgIndex === 0 ? gallery.length - 1 : selectedImgIndex - 1;
    setPage([nextIndex, -1]);
  };

  const handleNextImage = () => {
    const nextIndex =
      selectedImgIndex === gallery.length - 1 ? 0 : selectedImgIndex + 1;
    setPage([nextIndex, 1]);
  };

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
    onClose();
  };

  useEffect(() => {
    if (product) {
      closingRef.current = false;
      openingRef.current = true;
    }

    clearTimeout(cursorTimerRef.current);
    setCloses(false);

    return () => clearTimeout(cursorTimerRef.current);
  }, [product, setCloses]);

  return (
    <div className="fixed inset-0 z-200 flex justify-start">
      <motion.div
        variants={overlayAnim}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0 z-0 bg-s/25 backdrop-blur-md"
      />

      <button
        type="button"
        aria-label="Fechar produto"
        onClick={handleClose}
        onMouseEnter={handleOverlayEnter}
        onMouseLeave={handleOverlayLeave}
        className="absolute inset-0 z-1"
      />

      <motion.div
        ref={scrollContainerRef}
        variants={drawerLeftAnim}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 w-full max-w-180 h-screen bg-p text-s border-r border-s/15 p-5 overflow-y-auto custom-scrollbar overscroll-contain"
      >
        <div className="flex flex-col justify-between min-h-full">
          <div>
            <div className="relative flex items-center justify-between w-full border-b border-s/15 pb-4">
              <motion.div
                custom={1}
                variants={itemAnim}
                className="flex items-center gap-3"
              >
                <span className="text-p text-[.9em] font-semibold uppercase bg-s px-4 py-2 tracking-wider">
                  [{product.category || "APPAREL"}]
                </span>
                <span className="text-s text-[.9em] font-semibold uppercase">
                  {product.id ? `${product.id}` : "APP-2026-X"}
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

            <div className="mt-8">
              <Reveal
                text="GARMENT & APPAREL ARCHIVE"
                delay={0.25}
                className="mb-5 text-s/50 text-[.9em] font-semibold uppercase"
              />
              <Reveal
                text={product.title || "UNTITLED PIECE"}
                delay={0.5}
                className="text-[clamp(40px,8vw,82px)] font-pp-l font-semibold leading-[90%] tracking-[-6%] text-s"
              />
            </div>

            <motion.div
              custom={3}
              variants={itemAnim}
              className="w-full h-112 p-2 border border-s/15 flex items-center justify-center relative overflow-hidden group mt-6 bg-s/5"
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selectedImgIndex}
                  custom={direction}
                  variants={clipPathDirectionalVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 size-full "
                >
                  <Image
                    src={gallery[selectedImgIndex]}
                    alt={product.title || "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    priority
                    className="object-contain size-full"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                <ButtonIcon
                  icon={TfiAngleLeft}
                  onClick={handlePrevImage}
                  size="size-12"
                  iconSize="text-[.9em]"
                  bgNormal="bg-s"
                  bgHover="bg-p"
                  textNormal="text-p"
                  textHover="text-s"
                  className="border border-s/1"
                />
              </div>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                <ButtonIcon
                  icon={TfiAngleRight}
                  onClick={handleNextImage}
                  size="size-12"
                  iconSize="text-[.9em]"
                  bgNormal="bg-s"
                  bgHover="bg-p"
                  textNormal="text-p"
                  textHover="text-s"
                  className="border border-s/1"
                />
              </div>

              <span className="absolute bottom-3 right-3 bg-s text-p text-[.9em] font-semibold uppercase px-2.5 py-1 z-20">
                {selectedImgIndex + 1} / {gallery.length}
              </span>
            </motion.div>

            <div className="grid grid-cols-5 gap-2 my-2.5">
              {gallery.map((imgSrc, idx) => {
                const isSelected = selectedImgIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => changeImage(idx)}
                    className={`relative h-20 border transition-all overflow-hidden ${
                      isSelected
                        ? "border-s ring-1 ring-s opacity-100"
                        : "border-s/20 opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Minimap ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />

                    <motion.div
                      initial={false}
                      animate={{
                        clipPath: isSelected
                          ? "inset(0% 0% 0% 0%)"
                          : direction >= 0
                            ? "inset(0% 100% 0% 0%)"
                            : "inset(0% 0% 0% 100%)",
                      }}
                      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                      className="absolute inset-0 bg-s/30 pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>

            <motion.div
              custom={4}
              variants={itemAnim}
              className="w-full flex flex-col gap-2.5 my-2"
            >
              <div className="w-full flex items-center justify-between gap-2.5">
                <div className="w-full border border-s/15 p-5 py-8 flex flex-col items-center justify-center">
                  <span className="mb-5 text-s/50 text-[.9em] font-semibold uppercase block">
                    PRICE
                  </span>
                  <p className="mb-5 text-[clamp(40px,8vw,82px)] font-pp-l text-center font-semibold leading-[90%] tracking-[-6%] text-s">
                    {product.price || "R$ 389,00"}
                  </p>
                  <span className="mb-5 text-s/50 text-[.9em] font-semibold uppercase">
                    USD / TAX INCL.
                  </span>
                </div>

                <div className="w-full border border-s/15 p-5 py-8 flex flex-col items-center justify-center">
                  <span className="mb-5 text-s/50 text-[.9em] font-semibold uppercase block">
                    COLLECTION
                  </span>
                  <p className="mb-5 text-[clamp(40px,8vw,82px)] font-pp-l text-center font-semibold leading-[90%] tracking-[-6%] text-s">
                    {product.year || "2026"}
                  </p>
                  <span className="mb-5 text-s/50 text-[.9em] font-semibold uppercase">
                    SEASON DROP
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col items-center justify-center">
                <span className="mb-5 text-s/50 text-[.9em] font-semibold uppercase block">
                  AVAILABLE SIZES
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {(product.sizes || ["P", "M", "G", "GG"]).map((sz) => (
                    <Button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      text={sz}
                      active={selectedSize === sz}
                    />
                  ))}
                </div>
              </div>

              <motion.div custom={6} variants={itemAnim} className="mt-2">
                <div className="flex items-center gap-2.5">
                  {isPurchased ? (
                    <Button
                      href={product.downloadUrl || "#"}
                      download
                      text="DOWNLOAD RECEIPT & PROOF"
                      className="w-full text-[.9em] font-semibold uppercase"
                    />
                  ) : (
                    <Button
                      onClick={() => {
                        if (inCart) {
                          addToCart({ ...product, selectedSize });
                        } else {
                          addToCart({ ...product, selectedSize });
                          openCart();
                        }
                      }}
                      text={
                        inCart
                          ? "REMOVE FROM BAG"
                          : `ADD (${selectedSize}) — $${product.price || "38"}`
                      }
                      className="w-full text-[.9em] font-semibold uppercase"
                    />
                  )}

                  <ButtonIcon
                    icon={MdFavorite}
                    onClick={() => addToFavorite(product)}
                    size="size-12"
                    iconSize="text-[.9rem]"
                    bgNormal="bg-s"
                    bgHover="bg-p"
                    textNormal="text-p"
                    textHover="text-s"
                    className="border border-s/1"
                  />
                </div>

                <div className="flex justify-between items-center text-s text-[.9em] mt-10">
                  <span>SHAPES // GARMENT ARCHIVE</span>
                  <span>ENCRYPTED TRANSACTION</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});
