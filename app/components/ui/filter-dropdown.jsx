"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdMoreVert, MdSort, MdCheck } from "react-icons/md";
import ScrambleHover from "../common/scramble-hover";

export function FilterDropdown({
  sortBy,
  onSortChange,
  showOnlyInStock,
  onToggleInStock,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { label: "DEFAULT", value: "DEFAULT" },
    { label: "PRICE: LOW TO HIGH", value: "PRICE_ASC" },
    { label: "PRICE: HIGH TO LOW", value: "PRICE_DESC" },
    { label: "NAME: A - Z", value: "NAME_ASC" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={() => setIsOpen(false)}
        style={{ display: isOpen ? "block" : "none" }}
      />
      <div
        className="relative inline-block text-left z-100 group"
        data-cursor="hover"
        aria-label="Options Menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <button
          className={`p-2 h-10 border border-s/20 flex items-center justify-center 
        transition-all cursor-pointer ${isOpen ? "bg-p text-s" : "bg-s text-p hover:bg-p hover:text-s"}`}
        >
          <MdMoreVert size={22} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-56 bg-s text-p border border-s/20 p-2 "
            >
              <div className="px-3 py-2 border-b border-s/10 text-p text-[.8em] font-semibold uppercase flex items-center gap-1">
                <MdSort size={16} /> SORT & FILTER
              </div>

              <div className="py-1">
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onSortChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-p text-[.8em] font-semibold uppercase flex items-center justify-between 
                        hover:bg-p/20 transition-colors ${
                          isSelected ? "text-p font-bold" : "opacity-50"
                        }`}
                    >
                      <ScrambleHover text={opt.label} />

                      {isSelected && <MdCheck size={16} />}
                    </button>
                  );
                })}
              </div>

              {onToggleInStock && (
                <div className="border-t border-p/25 pt-1 mt-1">
                  <button
                    onClick={() => {
                      onToggleInStock();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[11px] font-semibold uppercase flex items-center justify-between hover:bg-s/10 transition-colors opacity-70"
                  >
                    <span>AVAILABLE ONLY</span>
                    {showOnlyInStock && <MdCheck size={14} />}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
