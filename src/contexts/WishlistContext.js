import React, { useState, createContext, useContext, useEffect } from "react";
import { wishlistCtrl } from "../api";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  console.log("🏗️ [WishlistContext] Provider inicializado");

  // 🔧 FIX: Función simple sin useCallback para evitar dependencias circulares
  const fetchWishlist = async (userId) => {
    console.log("🔍 [WishlistContext] fetchWishlist iniciado", { userId });
    
    if (!userId) {
      console.log("❌ [WishlistContext] No hay userId");
      setWishlistProducts([]);
      setCurrentUserId(null);
      return;
    }

    // Evitar cargas duplicadas para el mismo usuario
    if (loading && currentUserId === userId) {
      console.log("⏸️ [WishlistContext] Ya cargando para este usuario");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentUserId(userId);

    try {
      console.log("🌐 [WishlistContext] Llamando API getAllProducts");
      const result = await wishlistCtrl.getAllProducts(userId);
      console.log("📨 [WishlistContext] Respuesta del API:", result);

      const products = result?.data || [];
      console.log("✅ [WishlistContext] Productos procesados:", products);
      setWishlistProducts(products);
    } catch (err) {
      console.error("❌ [WishlistContext] Error en fetchWishlist:", err);
      setError(err.message);
      setWishlistProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (userId, productId) => {
    console.log("➕ [WishlistContext] addToWishlist", { userId, productId });
    
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setLoading(true);
      const result = await wishlistCtrl.add(userId, productId);
      console.log("📊 [WishlistContext] Add result:", result);
      
      // Refrescar solo si es el usuario actual
      if (userId === currentUserId) {
        await fetchWishlist(userId);
      }
      return result;
    } catch (error) {
      console.error("❌ [WishlistContext] Error adding to wishlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (userId, productId) => {
    console.log("➖ [WishlistContext] removeFromWishlist", { userId, productId });
    
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setLoading(true);
      const result = await wishlistCtrl.delete(userId, productId);
      console.log("📊 [WishlistContext] Remove result:", result);
      
      // Refrescar solo si es el usuario actual
      if (userId === currentUserId) {
        await fetchWishlist(userId);
      }
      return result;
    } catch (error) {
      console.error("❌ [WishlistContext] Error removing from wishlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    const inWishlist = wishlistProducts.some(
      (item) => item?.attributes?.product?.data?.id === productId
    );
    return inWishlist;
  };

  const refreshWishlist = async (userId = currentUserId) => {
    console.log("🔄 [WishlistContext] refreshWishlist llamado", { userId });
    if (userId) {
      await fetchWishlist(userId);
    }
  };

  const totalFavorites = wishlistProducts.length;
  const wishlistCount = wishlistProducts.length;

  const value = {
    wishlistProducts,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
    totalFavorites,
    wishlistCount,
    fetchWishlist,
    currentUserId,
  };

  console.log("📊 [WishlistContext] Provider data:", { totalFavorites, loading, productsCount: wishlistProducts.length });

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlistContext debe ser usado dentro de WishlistProvider");
  }
  return context;
};
