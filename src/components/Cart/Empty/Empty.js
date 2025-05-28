import { View, Text } from "react-native";
import { styles } from "./Empty.styles";

export function Empty() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ¡No te quedes sin tu próxima aventura! ¡Reserva un tour en chiva y
        descubre lo increíble que es viajar con nosotros!
      </Text>
    </View>
  );
}
