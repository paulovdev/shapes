import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useDragging = create((set) => ({
  dragginS: false,

  setDragginS: (value) =>
    set((state) => (state.dragginS === value ? state : { dragginS: value })),
}));

export const useClose = create((set) => ({
  closes: false,
  setCloses: (value) =>
    set((state) => (state.closes === value ? state : { closes: value })),
}));

export const useCartStore = create()(
  persist(
    (set, get) => ({
      cart: [],
      purchasedIds: [],
      favoriteIds: [],
      isCartOpen: false,
      isFavoritesOpen: false,  

      addToCart: (product) => {
        set((state) => {
          const exists = state.cart.some((item) => item.id === product.id);

          return {
            cart: exists
              ? state.cart.filter((item) => item.id !== product.id)
              : [...state.cart, product],
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ cart: [] }),

      addToFavorite: (product) => {
        const id = typeof product === "object" ? product.id : product;

        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
            : [...state.favoriteIds, id],
        }));
      },

      removeFromFavorites: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id,
          ),
        }));
      },

      // Ações do Drawer do Carrinho
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Ações do Drawer de Favoritos (Novas)
      openFavorites: () => set({ isFavoritesOpen: true }),
      closeFavorites: () => set({ isFavoritesOpen: false }),
      toggleFavorites: () =>
        set((state) => ({ isFavoritesOpen: !state.isFavoritesOpen })),

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
      isFavorite: (id) => get().favoriteIds.includes(id),

      isPurchased: (id) => get().purchasedIds.includes(id),

      getTotal: () =>
        get().cart.reduce(
          (acc, item) => acc + parseFloat(item.price || 24.0),
          0,
        ),
    }),
    {
      name: "shopping-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        purchasedIds: state.purchasedIds,
        favoriteIds: state.favoriteIds,
      }),
    },
  ),
);
