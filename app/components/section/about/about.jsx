"use client";

import Lenis from "lenis";
import AboutGallery from "./gallery";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ScrambleHover from "../../common/scramble-hover";
import { MdArrowBackIos } from "react-icons/md";
import Link from "next/link";
import { RevealText } from "../../ui/reveal-text";
import { wordReveal } from "@/app/anim/modal.anim";

export default function About() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, duration: 1 });
    lenisRef.current = lenis;

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <motion.nav className="fixed top-0 left-0 p-5 w-full flex items-end justify-end mix-blend-exclusion z-100">
        <div className="h-fit overflow-hidden">
          <motion.p
            variants={wordReveal}
            initial="initial"
            animate="animate"
            custom={0}
          >
            <Link href={"/"}>
              <ScrambleHover
                text="BACK"
                icon={<MdArrowBackIos className="text-[.8em]" />}
                className="text-p text-[.8em] font-medium uppercase cursor-pointer"
              />
            </Link>
          </motion.p>
        </div>
      </motion.nav>

      <section className="bg-p p-5 w-full overflow-hidden">
        <div className="w-full flex flex-col items-center ">
          {/* Header */}
          <div className="py-20 w-full h-[60vh] bg-p flex flex-col items-start justify-end">
            <RevealText
              text="shapes® — archive 2026"
              className="text-s/50 text-[.8em] font-medium uppercase tracking-wider mb-2"
            />
            <RevealText
              text="About Us"
              className="text-[clamp(60px,12vw,160px)] font-instrument font-normal leading-[90%] tracking-[-6%] text-s"
            />
          </div>

          {/* Galeria de destaque */}
          <div className="w-full my-10">
            <AboutGallery />
          </div>

          {/* Seção 01: Visão Geral */}
          <div className="my-20 w-full">
            <div className="w-full flex flex-col lg:flex-row items-start gap-10">
              <div className="w-full lg:w-1/4">
                <RevealText
                  text="Overview"
                  className="text-s text-[.8em] font-medium uppercase tracking-wider sticky top-10"
                />
              </div>
              <div className="w-full lg:w-3/4 flex flex-col gap-8">
                <RevealText
                  text="shapes® is a curated digital archive exploring the intersection of raw 3D geometry, dither algorithms, and tactile digital textures."
                  tag="h1"
                  className="text-[clamp(28px,3.9vw,64px)] font-instrument font-normal leading-[105%] tracking-[-4%] text-s"
                />
                <RevealText
                  text="Designed for designers, creative technologists, and visual artists, our library transforms complex 3D assets into lightweight, high-contrast dithered PNGs ready for contemporary web and print identity systems."
                  tag="p"
                  className="text-s/60 text-[1em] font-instrument font-normal leading-[140%] max-w-3xl"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 bg-s/15 w-full h-px"></div>

          {/* Seção 02: Estatísticas / Números do Acervo */}
          <div className="my-16 w-full">
            <div className="flex items-center justify-between">
              <div>
                <RevealText
                  text="500+"
                  className="text-[clamp(36px,5vw,128px)] font-instrument text-s"
                />
                <RevealText
                  text="Dithered Shapes"
                  className="text-s/50 text-[.8em] font-medium uppercase"
                />
              </div>
              <div>
                <RevealText
                  text="04"
                  className="text-[clamp(36px,5vw,128px)] font-instrument text-s"
                />
                <RevealText
                  text="Core Categories"
                  className="text-s/50 text-[.8em] font-medium uppercase"
                />
              </div>
              <div>
                <RevealText
                  text="4K"
                  className="text-[clamp(36px,5vw,128px)] font-instrument text-s"
                />
                <RevealText
                  text="Transparent PNGs"
                  className="text-s/50 text-[.8em] font-medium uppercase"
                />
              </div>
              <div>
                <RevealText
                  text="100%"
                  className="text-[clamp(36px,5vw,128px)] font-instrument text-s"
                />
                <RevealText
                  text="Vector Precision"
                  className="text-s/50 text-[.8em] font-medium uppercase"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 bg-s/15 w-full h-px"></div>

          {/* Seção 03: Pilares / Categorias */}
          <div className="my-20 w-full">
            <div className="w-full flex flex-col lg:flex-row items-start gap-10">
              <div className="w-full lg:w-1/4">
                <RevealText
                  text="Archive Pillars"
                  className="text-s text-[.8em] font-medium uppercase tracking-wider sticky top-10"
                />
              </div>
              <div className="w-full lg:w-3/4">
                <RevealText
                  text="Categorized for visual exploration"
                  tag="h2"
                  className="text-[clamp(28px,3.5vw,72px)] font-instrument font-normal leading-[110%] tracking-[-4%] text-s mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Pillar 01 */}
                  <div className="flex flex-col items-start border-t border-s/15 pt-6">
                    <RevealText
                      text="[ 01 ]"
                      className="mb-10 text-s/50 text-[.95em] font-medium uppercase"
                    />
                    <RevealText
                      text="Abstract Primitives"
                      tag="h3"
                      className="mb-4 text-s text-[1.25em] font-medium uppercase"
                    />
                    <RevealText
                      text="Pure geometric shapes, twisted toruses, and mathematical surfaces transformed through halftone dithering patterns."
                      className="text-s/70 text-[1.15em] font-instrument font-normal leading-[135%]"
                    />
                  </div>

                  {/* Pillar 02 */}
                  <div className="flex flex-col items-start border-t border-s/15 pt-6">
                    <RevealText
                      text="[ 02 ]"
                      className="mb-10 text-s/50 text-[.95em] font-medium uppercase"
                    />
                    <RevealText
                      text="Organic Formations"
                      tag="h3"
                      className="mb-4 text-s text-[1.25em] font-medium uppercase"
                    />
                    <RevealText
                      text="Fluid silhouettes, botanical scans, hands, and biological contours captured in ultra-high contrast pixel structures."
                      className="text-s/70 text-[1.15em] font-instrument font-normal leading-[135%]"
                    />
                  </div>

                  {/* Pillar 03 */}
                  <div className="flex flex-col items-start border-t border-s/15 pt-6">
                    <RevealText
                      text="[ 03 ]"
                      className="mb-10 text-s/50 text-[.95em] font-medium uppercase"
                    />
                    <RevealText
                      text="Architectural Structures"
                      tag="h3"
                      className="mb-4 text-s text-[1.25em] font-medium uppercase"
                    />
                    <RevealText
                      text="Monolithic blocks, stairs, gridded surfaces, and spatial voids inspired by brutalist architecture and technical blueprints."
                      className="text-s/70 text-[1.15em] font-instrument font-normal leading-[135%]"
                    />
                  </div>

                  {/* Pillar 04 */}
                  <div className="flex flex-col items-start border-t border-s/15 pt-6">
                    <RevealText
                      text="[ 04 ]"
                      className="mb-10 text-s/50 text-[.95em] font-medium uppercase"
                    />
                    <RevealText
                      text="Dither Processing"
                      tag="h3"
                      className="mb-4 text-s text-[1.25em] font-medium uppercase"
                    />
                    <RevealText
                      text="Custom Floyd-Steinberg and Atkinson algorithms applied frame-by-frame to achieve analog print fidelity in digital environments."
                      className="text-s/70 text-[1.15em] font-instrument font-normal leading-[135%]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 bg-s/15 w-full h-px"></div>

          {/* Seção 04: Contato / Links */}
          <div className="w-full my-20">
            <div className="flex flex-col gap-6">
              <h2 className="text-s text-[.8em] font-medium uppercase tracking-wider">
                CONNECT & EXPLORE
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  "instagram,",
                  "x.com,",
                  "github,",
                  "figma,",
                  "arena,",
                  "contact@shapes.archive",
                ].map((s, i) => (
                  <div
                    className="overflow-hidden cursor-pointer"
                    key={i}
                    data-cursor="hover"
                  >
                    <motion.p
                      variants={wordReveal}
                      initial="initial"
                      animate="animate"
                      custom={0.25 + i * 0.05}
                    >
                      <ScrambleHover
                        text={s}
                        className="text-s text-[1.1em] max-md:text-[.8em] font-normal uppercase hover:opacity-60 transition-opacity"
                      />
                    </motion.p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
