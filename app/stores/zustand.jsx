import { create } from "zustand";

export const useDragging = create((set) => ({
  dragginS: false,

  setDragginS: (value) =>
    set((state) => (state.dragginS === value ? state : { dragginS: value })),
}));
