import { View, Text, Image, TextInput } from "react-native";
import { Button, IconButton, Divider } from "react-native-paper";
import { useCart } from "../../../../hooks";
import { fn } from "../../../../utils";
import { styles } from "./Product.styles";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function Product(props) {
  const { product, cartData } = props;
  const currentCartData = cartData.filter((item) => item.id === product.id)[0];
  const { deleteProduct, increaseProduct, decreaseProduct } = useCart();

  const mainImagen = product.main_image.data.attributes.url;

  const onDeleteProduct = () => deleteProduct(product.id);
  const onIncreaseProduct = () => increaseProduct(product.id);
  const onDecreaseProduct = () => decreaseProduct(product.id);

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha no válida";
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error en fecha";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Hora no disponible";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Hora no válida";
      return format(date, "HH:mm 'hrs'", { locale: es });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Error en hora";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: mainImagen }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {product.title}
          </Text>
          <Text style={styles.currentPrice}>
            $ {fn.calcPrice(product.price, product.discount)} por persona
          </Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Fecha y Hora */}
      <View style={styles.dateTimeContainer}>
        {/* Fecha */}
        <View style={styles.dateTimeItem}>
          <IconButton icon="calendar" size={24} iconColor="#0098d3" />
          <Text style={styles.dateTimeText}>
            {formatDate(currentCartData?.date)}
          </Text>
        </View>

        {/* Hora */}
        <View style={styles.dateTimeItem}>
          <IconButton icon="clock" size={24} iconColor="#0098d3" />
          <Text style={styles.dateTimeText}>
            {formatTime(currentCartData?.date)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Asientos:</Text>
          <View style={styles.selectQuantity}>
            <IconButton
              icon="minus"
              iconColor="#fff"
              size={20}
              style={styles.btnQuantity}
              onPress={onDecreaseProduct}
            />
            <TextInput
              value={product.quantity.toString()}
              style={styles.inputQuantity}
              editable={false}
            />
            <IconButton
              icon="plus"
              iconColor="#fff"
              size={20}
              style={styles.btnQuantity}
              onPress={onIncreaseProduct}
            />
          </View>
        </View>

        <Button
          mode="contained"
          style={styles.btnDelete}
          icon="trash-can"
          onPress={onDeleteProduct}
        >
          Eliminar
        </Button>
      </View>
    </View>
  );
}
