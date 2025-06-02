import { View, Text } from "react-native";
import { map } from "lodash";
import { Product } from "./Product";
import { styles } from "./WishlistList.styles";

export function WishlistList(props) {
  const { title, products, onReload } = props;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      {map(products, (product) => (
        <Product
          key={product.id}
          product={product}
          onReload={onReload}
        />
      ))}
    </View>
  );
}
