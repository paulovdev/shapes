import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useDragging = create((set) => ({
  dragginS: false,

  setDragginS: (value) =>
    set((state) => (state.dragginS === value ? state : { dragginS: value })),
}));

export const useCartStore = create()(
  persist(
    (set, get) => ({
      cart: [],
      purchasedIds: [],
      isCartOpen: false,

      // Ações do Carrinho
      addToCart: (product) => {
        set((state) => {
          const exists = state.cart.some((item) => item.id === product.id);
          if (exists) return state;
          return { cart: [...state.cart, product] };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ cart: [] }),

      // Ações do Drawer (Modal do Carrinho)
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Checkout
      checkout: () => {
        const { cart } = get();
        const newPurchasedIds = cart.map((item) => item.id);

        set((state) => ({
          purchasedIds: [
            ...new Set([...state.purchasedIds, ...newPurchasedIds]),
          ],
          cart: [],
          isCartOpen: false,
        }));
      },

      // Helpers
      isInCart: (id) => get().cart.some((item) => item.id === id),
      isPurchased: (id) => get().purchasedIds.includes(id),
      getTotal: () =>
        get().cart.reduce(
          (acc, item) => acc + parseFloat(item.price || 24.0),
          0,
        ),
    }),
    {
      name: "shopping-cart-storage", // Salva o carrinho e compras no localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        purchasedIds: state.purchasedIds,
      }), // Persiste apenas os itens e histórico de compras
    },
  ),
);
