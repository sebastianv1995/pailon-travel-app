import { View } from "react-native";
import { Favorite } from "./Favorite";
import { Buy } from "./Buy";
import { styles } from "./BottomBar.styles";

export function BottomBar(props) {
  const { productId, data, isValid = false } = props;

  return (
    <View style={styles.container}>
      <View style={styles.wishlist}>
        <Favorite productId={productId} />
      </View>
      <View style={styles.buy}>
        <Buy productId={productId} data={data} isValid={isValid} />
      </View>
    </View>
  );
}
