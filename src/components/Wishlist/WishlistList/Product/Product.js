import { useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { useAuth, useWishlist } from "../../../../hooks";
import { fn, screensName } from "../../../../utils";
import { styles } from "./Product.styles";

export function Product(props) {
  const { product, onReload } = props;
  const productInfo = product.attributes;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { removeFromWishlist } = useWishlist(); // 🔧 FIX: Usar context
  const navigation = useNavigation();

  const goToProduct = () => {
    try {
      navigation.navigate(screensName.home.root, {
        screen: screensName.home.product,
        params: { productId: product.id },
      });
    } catch (error) {
      Toast.show("Error al abrir el producto", {
        position: Toast.positions.CENTER,
        duration: Toast.durations.SHORT,
        backgroundColor: "#e74c3c",
        textColor: "#ffffff",
      });
    }
  };

  const deleteFavorite = async () => {
    console.log("🗑️ [WishlistProduct] deleteFavorite iniciado", { productId: product.id });
    
    if (!user?.id) return;
    
    try {
      setLoading(true);

      // 🔧 FIX: Usar context para eliminar - actualiza automáticamente
      const result = await removeFromWishlist(user.id, product.id);
      console.log("📊 [WishlistProduct] Resultado de delete:", result);

      Toast.show("¡Producto eliminado de favoritos! 🗑️", {
        position: Toast.positions.CENTER,
        duration: Toast.durations.SHORT,
        backgroundColor: "#e74c3c",
        textColor: "#ffffff",
        opacity: 1.0,
        containerStyle: {
          zIndex: 9999,
          elevation: 9999,
        },
      });
      
      // 🔧 FIX: Actualizar lista local también
      if (onReload) {
        onReload();
      }
    } catch (error) {
      console.error("❌ [WishlistProduct] Error al eliminar:", error);
      Toast.show("Error al eliminar de favoritos", {
        position: Toast.positions.CENTER,
        duration: Toast.durations.SHORT,
        backgroundColor: "#e74c3c",
        textColor: "#ffffff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image
          source={{ uri: productInfo.main_image.data.attributes.url }}
          style={styles.image}
        />
      </View>
      <View style={styles.info}>
        <View>
          <Text style={styles.name} numberOfLines={3} ellipsizeMode="tail">
            {productInfo.title}
          </Text>
          <View style={styles.prices}>
            <Text style={styles.currentPrice}>
              ${fn.calcPrice(productInfo.price, productInfo.discount)}
            </Text>
            {productInfo.discount && (
              <Text style={styles.oldPrice}>${productInfo.price}</Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            style={styles.btnGoToProduct}
            mode="contained"
            onPress={goToProduct}
            disabled={loading}
          >
            Ver producto
          </Button>
          <IconButton
            icon="delete"
            iconColor="#fff"
            style={styles.btnDelete}
            onPress={deleteFavorite}
            disabled={loading}
          />
        </View>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
}
