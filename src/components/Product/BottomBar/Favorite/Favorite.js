import { useState, useEffect, useCallback } from "react";
import { IconButton } from "react-native-paper";
import Toast from "react-native-root-toast";
import { wishlistCtrl } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { styles } from "./Favorite.styles";

export function Favorite(props) {
  const { productId } = props;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasWishlist, setHasWishlist] = useState(false);

  const checkWishlist = useCallback(async () => {
    if (!productId || !user?.id) return;

    try {
      const response = await wishlistCtrl.check(user.id, productId);
      setHasWishlist(response);
    } catch (error) {
      console.error("Error verificando la wishlist:", error);
    }
  }, [productId, user?.id]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);

  const handleWishlistToggle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (hasWishlist) {
        await wishlistCtrl.delete(user.id, productId);
        setHasWishlist(false);
        Toast.show("Â¡Tour eliminado de tus favoritos! ðŸ˜”", {
          position: Toast.positions.CENTER,
        });
      } else {
        await wishlistCtrl.add(user.id, productId);
        setHasWishlist(true);
        Toast.show("Â¡Tour guardado para tu prÃ³xima escapada! ðŸŒ", {
          position: Toast.positions.CENTER,
        });
      }
    } catch (error) {
      Toast.show("Error al procesar la solicitud", {
        position: Toast.positions.CENTER,
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasWishlist === undefined) return null;

  return (
    <IconButton
      icon="heart"
      style={styles.iconButton}
      size={30}
      iconColor={hasWishlist ? "#16222b" : "#fff"}
      onPress={handleWishlistToggle}
      disabled={loading}
    />
  );
}
