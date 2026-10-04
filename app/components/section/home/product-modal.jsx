import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MdClose, MdCheck } from "react-icons/md";
import {
  FaCartPlus,
  FaFolderOpen,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  closeBtnAnim,
  drawerLeftAnim,
  itemAnim,
  overlayAnim,
} from "@/app/anim/modal.anim";
import Scramble from "../../common/scramble";
import { RevealText } from "../../ui/reveal-text";

const MINIMAP_IMAGES = [
  "/images/product-overview/product_minimap_01.jpg",
  "/images/product-overview/product_minimap_02.jpg",
  "/images/product-overview/product_minimap_03.jpg",
  "/images/product-overview/product_minimap_04.jpg",
  "/images/product-overview/product_minimap_05.jpg",
];

export function ProductModal({
  project,
  onClose,
  onAddToCart,
  purchasedIds = [],
  isInCart = () => false,
}) {
  if (!project) return null;

  const isPurchased = purchasedIds.includes(project.id);
  const inCart = isInCart(project.id);
  const [btnHover, setBtnHover] = useState(false);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState(
    project.sizes ? project.sizes[0] : "M",
  );

  const gallery = [
    project.img || MINIMAP_IMAGES[0],
    ...MINIMAP_IMAGES.slice(1),
  ];

  const handlePrevImage = () => {
    setSelectedImgIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImgIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-200 flex justify-start">
      {/* Background Overlay */}
      <motion.div
        variants={overlayAnim}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={onClose}
        className="absolute inset-0 bg-s/25 backdrop-blur-md"
      />

      {/* Drawer Container */}
      <motion.div
        variants={drawerLeftAnim}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 w-full max-w-180 h-screen bg-p text-s border-r border-s/15 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar font-chivo!"
      >
        <div>
          {/* Header Modal */}
          <div className="flex items-center justify-between w-full border-b border-s/15 pb-4">
            <motion.div
              custom={1}
              variants={itemAnim}
              className="flex items-center gap-3"
            >
              <span className="text-p text-[.8em] font-semibold uppercase bg-s px-4 py-2 tracking-wider">
                [{project.category || "APPAREL"}]
              </span>
              <span className="text-s text-[.8em] font-semibold uppercase">
                {project.id ? `${project.id}` : "APP-2026-X"}
              </span>
            </motion.div>

            <motion.button
              variants={closeBtnAnim}
              onClick={onClose}
              className="size-12.5 bg-s flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              data-cursor="hover"
            >
              <MdClose className="text-[1.5em] text-p" />
            </motion.button>
          </div>

          {/* Título e Subtítulo */}
          <motion.div custom={2} variants={itemAnim} className="mt-8">
            <RevealText
              text="GARMENT & APPAREL ARCHIVE"
              className="mb-5 text-s/50 text-[.8em] font-semibold uppercase"
            />
            <RevealText
              text={project.title || "UNTITLED PIECE"}
              className="text-[clamp(40px,8vw,72px)] font-instrument font-normal leading-[90%] tracking-[-6%] text-s"
            />
          </motion.div>

          {/* Galeria de Imagens Principais (Slide) */}
          <motion.div
            custom={3}
            variants={itemAnim}
            className="w-full h-112 p-2 border border-s/15 flex items-center justify-center relative overflow-hidden group mt-6 bg-s/5"
          >
            <Image
              src={gallery[selectedImgIndex]}
              alt={project.title}
              fill
              className="object-contain size-full transition-all duration-300"
            />

            {/* Navegação do Slide */}
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 bg-p/80 hover:bg-s hover:text-p text-s flex items-center justify-center border border-s/15 transition-all"
            >
              <FaChevronLeft className="text-[1.5em]" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-p/80 hover:bg-s hover:text-p text-s flex items-center justify-center border border-s/15 transition-all"
            >
              <FaChevronRight className="text-xs" />
            </button>

            <span className="absolute bottom-3 right-3 bg-s text-p text-[.8em] font-semibold uppercase px-2.5 py-1">
              {selectedImgIndex + 1} / {gallery.length}
            </span>
          </motion.div>

          <div className="grid grid-cols-5 gap-2 my-2.5">
            {gallery.map((imgSrc, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIndex(idx)}
                className={`relative h-20 border transition-all overflow-hidden ${
                  selectedImgIndex === idx
                    ? "border-s ring-1 ring-s opacity-100"
                    : "border-s/20 opacity-40 hover:opacity-80"
                }`}
              >
                <Image
                  src={imgSrc}
                  alt={`Minimap ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <motion.div
            custom={4}
            variants={itemAnim}
            className="w-full flex flex-col gap-2.5 my-2"
          >
            <div className="w-full flex items-center justify-between gap-2.5">
              {/* Preço */}
              <div className="w-full border border-s/15 p-5 py-8 flex flex-col items-center justify-center">
                <span className="mb-5 text-s/50 text-[.8em] font-semibold uppercase block">
                  PRICE
                </span>
                <p className="mb-5 text-[clamp(40px,8vw,56px)] text-center font-instrument font-normal leading-[90%] tracking-[-6%] text-s">
                  {project.price || "R$ 389,00"}
                </p>
                <span className="mb-5 text-s/50 text-[.8em] font-semibold uppercase">
                  BRL / TAX INCL.
                </span>
              </div>

              {/* Coleção / Ano */}
              <div className="w-full border border-s/15 p-5 py-8 flex flex-col items-center justify-center">
                <span className="mb-5 text-s/50 text-[.8em] font-semibold uppercase block">
                  COLLECTION
                </span>
                <p className="mb-5 text-[clamp(40px,8vw,56px)] text-center font-instrument font-normal leading-[90%] tracking-[-6%] text-s">
                  {project.year || "2026"}
                </p>
                <span className="mb-5 text-s/50 text-[.8em] font-semibold uppercase">
                  SEASON DROP
                </span>
              </div>
            </div>

            {/* Seleção de Tamanhos */}
            <div className="border border-s/15 p-5 flex flex-col items-center justify-center">
              <span className="mb-5 text-s/50 text-[.8em] font-semibold uppercase block">
                AVAILABLE SIZES
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {(project.sizes || ["P", "M", "G", "GG"]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`p-2 w-12.5 h-12.5 text-xs font-bold uppercase border transition-all ${
                      selectedSize === sz
                        ? "bg-s text-p border-s"
                        : "bg-transparent text-s border-s/20 hover:border-s"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/*  */}
          <motion.div custom={5} variants={itemAnim} className="space-y-2 mt-4">
            <h3 className="text-[.8em] font-semibold text-s/50 uppercase">
              // PRODUCT OVERVIEW & FABRIC SPECIFICATION
            </h3>
            <p className="text-[.8em] font-semibold text-s/50 uppercase leading-relaxed">
              {project.desc ||
                "Modelagem oversized contemporânea com costuras reforçadas, acabamento estruturado e caimento pesado de inspiração streetwear urbana."}
            </p>

            <div className="border border-s/15 divide-y divide-s/15 text-[.8em] my-4">
              <div className="flex justify-between p-2.5 bg-s/5">
                <span className="font-semibold text-s/50 uppercase">
                  COMPOSIÇÃO / MATERIAL
                </span>
                <span className="font-semibold text-s/50 uppercase">
                  {project.material || "100% ALGODÃO HEAVYWEIGHT"}
                </span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="font-semibold text-s/50 uppercase">
                  MODELAGEM / FIT
                </span>
                <span className="font-semibold text-s/50 uppercase">
                  OVERSIZED / BOX-FIT
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-s/5">
                <span className="font-semibold text-s/50 uppercase">
                  ORIGEM / FABRICAÇÃO
                </span>
                <span className="font-semibold text-s/50 uppercase">
                  NACIONAL / EDICÃO LIMITADA
                </span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="font-semibold text-s/50 uppercase">
                  CUIDADOS DE CONSERVAÇÃO
                </span>
                <span className="font-semibold text-s/50 uppercase">
                  LAVAR À MÃO / SECAR À SOMBRA
                </span>
              </div>
            </div>

            {/* Tags do Produto */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {(
                project.stack || ["STREETWEAR", "OVERSIZED", "HEAVY COTTON"]
              ).map((st, i) => (
                <span
                  key={i}
                  className="text-[.8em] font-bold uppercase bg-s/10 border border-s/15 px-2 py-1"
                >
                  #{st}
                </span>
              ))}
            </div>
          </motion.div>
          {/*  */}
        </div>

        <motion.div
          custom={6}
          variants={itemAnim}
          className="pt-8 mt-6 border-t border-s/15"
        >
          {isPurchased ? (
            <a
              href={project.downloadUrl || "#"}
              download
              onPointerEnter={() => setBtnHover(true)}
              onPointerLeave={() => setBtnHover(false)}
              className="w-full py-4 bg-s text-p font-bold uppercase flex items-center justify-center gap-2 hover:bg-s/90 transition-all text-sm tracking-wider"
              data-cursor="hover"
            >
              <FaFolderOpen className="text-base" />
              <Scramble text="BAIXAR NOTA & COMPROVANTE" trigger={btnHover} />
            </a>
          ) : (
            <button
              onClick={() => onAddToCart({ ...project, selectedSize })}
              disabled={inCart}
              onPointerEnter={() => setBtnHover(true)}
              onPointerLeave={() => setBtnHover(false)}
              className={`w-full py-4 font-bold uppercase flex items-center justify-center gap-2 transition-all text-sm tracking-wider cursor-pointer ${
                inCart
                  ? "bg-s/40 text-p cursor-not-allowed"
                  : "bg-s text-p hover:bg-s/90"
              }`}
              data-cursor="hover"
            >
              {inCart ? (
                <>
                  <MdCheck className="text-lg" />
                  <Scramble text="NO CARRINHO" trigger={btnHover} />
                </>
              ) : (
                <>
                  <FaCartPlus className="text-base" />
                  <Scramble
                    text={`ADICIONAR (${selectedSize}) — ${
                      project.price || "R$ 389,00"
                    }`}
                    trigger={btnHover}
                  />
                </>
              )}
            </button>
          )}

          <div className="flex justify-between items-center text-[.8em] opacity-40 mt-4">
            <span>XX.MOTTO // GARMENT ARCHIVE</span>
            <span>TRANSAÇÃO CRIPTOGRAFADA</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
