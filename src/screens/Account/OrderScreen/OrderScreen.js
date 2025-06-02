import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { IconButton, Card, Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { orderCtrl } from "../../../api";
import { LoadingScreen } from "../../../components/Shared";
import { Layout } from "../../../layouts";

export function OrderScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const orderId = route.params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      Toast.show("ID de orden no encontrado", {
        position: Toast.positions.CENTER,
      });
      navigation.goBack();
      return;
    }

    getOrderDetails();
  }, [orderId]);

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderCtrl.getById(orderId);
      setOrder(response);
    } catch (error) {
      console.error("Error al obtener detalles de la orden:", error);
      Toast.show("Error al cargar los detalles de la reserva", {
        position: Toast.positions.CENTER,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔧 SOLUCION 1: Formateo de fechas SIN Luxon (corrige el "null")
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Fecha no válida";
      }

      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} de ${month} de ${year}`;
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Error en fecha";
    }
  };

  // 🔧 SOLUCION 2: Extraer hora del schedule (corrige el "undefined")
  const getTimeFromProduct = (product) => {
    // Si hay campo time directo
    if (product.time) {
      return `${product.time} hrs`;
    }

    // Si hay horarios en schedule, usar el primero
    if (product.schedule?.schedule && product.schedule.schedule.length > 0) {
      return `${product.schedule.schedule[0]} hrs`;
    }

    // Extraer hora de la fecha si no es 00:00
    if (product.date) {
      try {
        const date = new Date(product.date);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        if (hours !== "00" || minutes !== "00") {
          return `${hours}:${minutes} hrs`;
        }
      } catch (error) {
        console.error("Error extrayendo hora:", error);
      }
    }

    return "Hora por confirmar";
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Fecha no válida";
      }

      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day} de ${month} de ${year} - ${hours}:${minutes} hrs`;
    } catch (error) {
      console.error("Error formateando fecha/hora:", error);
      return "Error en fecha";
    }
  };

  if (loading) {
    return <LoadingScreen text="Cargando detalles de la reserva" />;
  }

  if (!order) {
    return (
      <Layout.Basic>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Error al cargar la reserva</Text>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        </View>
      </Layout.Basic>
    );
  }

  return (
    <Layout.Basic hideSearch>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 8 }}>
            Detalles de la Reserva #{orderId}
          </Text>
        </View>

        {/* Información de compra */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <IconButton icon="calendar" size={24} iconColor="#0098d3" />
              <View>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  Fecha de compra:
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {formatDateTime(order.createdAt)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Información del tour */}
        {order.products && order.products.length > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <Card.Content>
              {order.products.map((product, index) => (
                <View key={index}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#0098d3",
                      marginBottom: 16,
                    }}
                  >
                    {product.title || product.name || "Producto"}
                  </Text>

                  {/* Fecha del tour */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <IconButton
                      icon="calendar-check"
                      size={24}
                      iconColor="#0098d3"
                    />
                    <View>
                      <Text style={{ fontSize: 14, color: "#666" }}>
                        Fecha del tour:
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {formatDate(product.date)}
                      </Text>
                    </View>
                  </View>

                  {/* Hora del tour - SOLUCION APLICADA */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <IconButton icon="clock" size={24} iconColor="#0098d3" />
                    <View>
                      <Text style={{ fontSize: 14, color: "#666" }}>
                        Hora del tour:
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {getTimeFromProduct(product)}
                      </Text>
                    </View>
                  </View>

                  {/* Cantidad de personas */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <IconButton
                      icon="account-group"
                      size={24}
                      iconColor="#0098d3"
                    />
                    <View>
                      <Text style={{ fontSize: 14, color: "#666" }}>
                        Cantidad de personas:
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {product.quantity || 1}
                      </Text>
                    </View>
                  </View>

                  {index < order.products.length - 1 && (
                    <Divider style={{ marginVertical: 16 }} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Resumen de productos */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}
            >
              Resumen de Tours
            </Text>

            {order.products &&
              order.products.map((product, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 12,
                    padding: 12,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 8,
                  }}
                >
                  {product.main_image?.data?.attributes?.url && (
                    <Image
                      source={{ uri: product.main_image.data.attributes.url }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        marginRight: 12,
                      }}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      {product.title || product.name || "Producto"}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#d32f2f" }}>
                      ${product.price || "0.00"} x {product.quantity || 1}{" "}
                      Asientos
                    </Text>
                  </View>
                </View>
              ))}
          </Card.Content>
        </Card>

        {/* Total */}
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Total de la reserva:
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#0098d3",
                }}
              >
                $ {order.totalPayment || "0.00"}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Layout.Basic>
  );
}
