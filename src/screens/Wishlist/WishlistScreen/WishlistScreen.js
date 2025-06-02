import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { forEach, size } from "lodash";
import { useAuth, useWishlist } from "../../../hooks";
import { Layout } from "../../../layouts";
import { LoadingScreen } from "../../../components/Shared";
import { WishlistList } from "../../../components/Wishlist";
import { styles } from "./WishlistScreen.styles";

export function WishlistScreen() {
  const [products, setProducts] = useState(null);
  const { user } = useAuth();
  const { wishlistProducts, totalFavorites, refreshWishlist, loading } =
    useWishlist();

  // 🔧 FIX: Usar useEffect en lugar de useFocusEffect para evitar bucle infinito
  const getProductsWishlist = useCallback(() => {
    console.log("🔍 [WishlistScreen] getProductsWishlist iniciado");
    console.log("📊 [WishlistScreen] wishlistProducts:", wishlistProducts?.length || 0);

    try {
      if (wishlistProducts && wishlistProducts.length > 0) {
        console.log(
          "✅ [WishlistScreen] Hay productos en wishlist, procesando..."
        );
        const productTemp = [];

        forEach(wishlistProducts, (item, index) => {
          // 🔧 FIX: Acceder correctamente a los datos del producto
          if (item?.attributes?.product?.data) {
            console.log(
              `✅ [WishlistScreen] Producto ${index} válido:`,
              item.attributes.product.data
            );
            productTemp.push(item.attributes.product.data);
          } else {
            console.log(
              `❌ [WishlistScreen] Producto ${index} inválido - estructura:`,
              {
                hasAttributes: !!item?.attributes,
                hasProduct: !!item?.attributes?.product,
                hasData: !!item?.attributes?.product?.data,
              }
            );
          }
        });

        console.log(
          "🎆 [WishlistScreen] Productos finales para WishlistList:",
          productTemp.length
        );
        setProducts(productTemp);
      } else {
        console.log("❌ [WishlistScreen] No hay productos en wishlist");
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ [WishlistScreen] Error procesando wishlist:", error);
      Toast.show("Error al obtener la lista de deseos", {
        position: Toast.positions.CENTER,
      });
      setProducts([]);
    }
  }, [wishlistProducts]); // 🔧 FIX: Solo depender de wishlistProducts

  // 🔧 FIX: Usar useFocusEffect SIN dependencias para evitar bucle infinito
  useFocusEffect(
    useCallback(() => {
      console.log("🔎 [WishlistScreen] useFocusEffect ejecutado");
      // Solo refrescar datos del servidor, no procesar localmente
      if (user?.id) {
        refreshWishlist(user.id);
      }
    }, [user?.id]) // 🔧 FIX: Solo depender del usuario
  );

  // 🔧 FIX: Usar useEffect separado para procesar productos cuando cambien
  React.useEffect(() => {
    getProductsWishlist();
  }, [getProductsWishlist]);

  const onReload = async () => {
    console.log("🔄 [WishlistScreen] onReload ejecutado");
    if (user?.id) {
      await refreshWishlist(user.id);
    }
    // No necesitamos llamar getProductsWishlist() porque el useEffect se encarga
  };

  return (
    <Layout.Basic>
      {loading || !products ? (
        <LoadingScreen text="Cargando lista" />
      ) : size(products) === 0 ? (
        <View style={styles.container}>
          <Text style={styles.title}>Lista de deseos</Text>
          <Text>No tienes ningún producto en tu lista</Text>
          <Text style={{ marginTop: 10, color: "#666" }}>
            Total de favoritos: {totalFavorites}
          </Text>
        </View>
      ) : (
        <>
          <WishlistList
            title={`Lista de Aventuras que quieres Reservar (${totalFavorites})`}
            products={products}
            onReload={onReload}
          />
        </>
      )}
    </Layout.Basic>
  );
}
