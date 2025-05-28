import { View, Text } from "react-native";
import { map } from "lodash";
import { Product } from "./Product";
import { styles } from "./ProductList.styles";

export function ProductList(props) {
  const { products, cartData, orderData } = props;

  return (
    <View>
      <Text style={styles.title}>
        ¡Elije cuántos asientos reservarás para tu próxima aventura!
      </Text>

      {map(products, (product) => (
        <Product
          key={product.id}
          product={product}
          cartData={cartData}
          orderData={orderData}
        />
      ))}
    </View>
  );
}
