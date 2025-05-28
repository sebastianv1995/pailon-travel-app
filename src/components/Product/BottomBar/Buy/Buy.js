import { Button, View } from "react-native-paper";
import { View as RNView } from "react-native";
import Toast from "react-native-root-toast";
import { useCart } from "../../../../hooks";
import { styles } from "./Buy.styles";

export function Buy(props) {
  const { productId, data, isValid = false } = props;
  const { addCart } = useCart();

  const addProductCart = async () => {
    if (!isValid) {
      Toast.show("Por favor selecciona fecha y horario", {
        position: Toast.positions.CENTER,
      });
      return;
    }

    if (!data || !data.date) {
      Toast.show("Error: datos de reserva no disponibles", {
        position: Toast.positions.CENTER,
      });
      return;
    }

    try {
      await addCart({
        id: productId,
        quantity: 1,
        date: data.date,
      });

      Toast.show("¡Reserva confirmada! 🎉", {
        position: Toast.positions.CENTER,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast.show("Error al realizar la reserva", {
        position: Toast.positions.CENTER,
      });
    }
  };

  return (
    // ✅ SOLUCIÓN RÁPIDA: Wrapper con altura y alineación fijas
    <RNView
      style={{
        height: 50, // ✅ Altura fija igual al botón de favoritos
        justifyContent: "center", // ✅ Centrar verticalmente
        alignItems: "stretch", // ✅ Estirar horizontalmente
      }}
    >
      <Button
        mode="contained"
        style={[
          styles.btn,
          !isValid && styles.btnDisabled,
          // ✅ Override de estilos para alineación perfecta
          {
            marginVertical: 0, // ✅ Sin márgenes verticales
            height: 50, // ✅ Altura exacta
            justifyContent: "center", // ✅ Centrar contenido
          },
        ]}
        labelStyle={[styles.btnLabel, !isValid && styles.btnLabelDisabled]}
        onPress={addProductCart}
        disabled={!isValid}
        compact={false}
        uppercase={false}
        theme={{
          colors: {
            primary: isValid ? "#0098d3" : "#cccccc",
          },
        }}
      >
        {isValid ? "Añadir al carrito" : "Selecciona fecha y hora"}
      </Button>
    </RNView>
  );
}
