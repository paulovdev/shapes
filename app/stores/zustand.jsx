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
          const existingIndex = state.cart.findIndex(
            (item) => item.id === product.id,
          );

          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity =
              (updatedCart[existingIndex].quantity || 1) + 1;
            return { cart: updatedCart };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        });
      },

      // Atualiza ou remove se a quantidade for <= 0
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              cart: state.cart.filter((item) => item.id !== id),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
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

      // Drawer Actions
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

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

      // Calcula subtotal multiplicando o preço pela quantidade
      getTotal: () =>
        get().cart.reduce((acc, item) => {
          const price = parseFloat(item.price || 24.0);
          const quantity = item.quantity || 1;
          return acc + price * quantity;
        }, 0),
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
