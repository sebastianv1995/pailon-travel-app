import { useContext } from "react";
import { useWishlistContext } from "../contexts/WishlistContext";

// 🔧 FIX: Hook simplificado SIN useAuth para evitar dependencia circular
export function useWishlist() {
  const context = useWishlistContext();
  
  return {
    wishlistProducts: context.wishlistProducts,
    loading: context.loading,
    error: context.error,
    totalFavorites: context.totalFavorites,
    wishlistCount: context.wishlistCount,
    isInWishlist: context.isInWishlist,
    addToWishlist: context.addToWishlist,
    removeFromWishlist: context.removeFromWishlist,
    refreshWishlist: context.refreshWishlist,
    fetchWishlist: context.fetchWishlist,
  };
}

export const useIsInWishlist = (productId) => {
  const context = useWishlistContext();
  return context.isInWishlist(productId);
};
