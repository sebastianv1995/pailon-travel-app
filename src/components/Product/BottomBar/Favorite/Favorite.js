import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { IconButton } from "react-native-paper";
import Toast from "react-native-root-toast";
import { useAuth, useWishlist } from "../../../../hooks";
import { styles } from "./Favorite.styles";

export function Favorite(props) {
  const { productId } = props;
  const { user } = useAuth();
  const { totalFavorites, isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [hasWishlist, setHasWishlist] = useState(false);

  useEffect(() => {
    if (productId) {
      const inWishlist = isInWishlist(productId);
      console.log("🔄 [Favorite] Actualizando estado hasWishlist:", { productId, inWishlist, totalFavorites });
      setHasWishlist(inWishlist);
    }
  }, [productId, isInWishlist, totalFavorites]);

  const showSuccessMessage = (message, isSuccess = true) => {
    try {
      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: isSuccess ? "#27ae60" : "#e74c3c",
        textColor: "#ffffff",
        opacity: 1.0,
        shadowColor: "#000000",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        containerStyle: {
          zIndex: 9999,
          elevation: 9999,
        },
      });

      setTimeout(() => {
        if (isSuccess) {
          Alert.alert(
            "¡Éxito! 🎉",
            message,
            [{ text: "OK", style: "default" }],
            { cancelable: true }
          );
        }
      }, 100);
    } catch (error) {
      Alert.alert(isSuccess ? "¡Éxito!" : "Error", message, [{ text: "OK" }]);
    }
  };

  const handleWishlistToggle = async () => {
    console.log("🔍 [Favorite] handleWishlistToggle iniciado", { productId, hasWishlist, loading });
    
    if (loading || !user?.id) return;

    setLoading(true);

    try {
      if (hasWishlist) {
        console.log("🗑️ [Favorite] Eliminando de wishlist...");
        
        // 🔧 FIX: Actualizar UI inmediatamente
        setHasWishlist(false);
        
        const result = await removeFromWishlist(user.id, productId);
        console.log("📊 [Favorite] Resultado de delete:", result);

        showSuccessMessage("¡Tour eliminado de tus favoritos! 😔", false);
      } else {
        console.log("❤️ [Favorite] Agregando a wishlist...");
        
        // 🔧 FIX: Actualizar UI inmediatamente
        setHasWishlist(true);
        
        const result = await addToWishlist(user.id, productId);
        console.log("📊 [Favorite] Resultado de add:", result);

        if (result && result.data && result.data.id) {
          console.log("✅ [Favorite] Producto agregado exitosamente");
          showSuccessMessage(
            "¡Tour guardado para tu próxima escapada! 🌟",
            true
          );
        } else if (result.message?.includes("ya está")) {
          console.log("🔄 [Favorite] Producto ya existía");
          showSuccessMessage(
            "Este producto ya está en tu lista de deseos",
            true
          );
        } else if (result.message?.includes("progreso")) {
          console.log("⏳ [Favorite] Operación en progreso");
          // Revertir al estado real
          const currentState = isInWishlist(productId);
          setHasWishlist(currentState);
          showSuccessMessage(
            "Procesando... inténtalo de nuevo en un momento",
            true
          );
        } else {
          console.log("ℹ️ [Favorite] Agregado con mensaje genérico");
          showSuccessMessage("¡Tour agregado a favoritos! ❤️", true);
        }
      }
    } catch (error) {
      console.error("❌ [Favorite] Error en handleWishlistToggle:", error);
      
      // 🔧 FIX: En caso de error, revertir al estado real
      const actualState = isInWishlist(productId);
      setHasWishlist(actualState);
      
      showSuccessMessage(
        "Error al procesar la solicitud. Inténtalo de nuevo.",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      icon="heart"
      style={[styles.iconButton, { opacity: loading ? 0.6 : 1.0 }]}
      size={30}
      iconColor={hasWishlist ? "#16222b" : "#fff"}
      onPress={handleWishlistToggle}
      disabled={loading}
    />
  );
}
