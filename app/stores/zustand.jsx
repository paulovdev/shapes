import { create } from "zustand";

export const useFilter = create((set) => ({
  filterModal: false,

  setFilterModal: (value) => set({ filterModal: value }),
}));
