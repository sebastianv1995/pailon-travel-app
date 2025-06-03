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
      console.log('🔍 Detalles de la orden recibidos:', response);
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

  // ✅ FUNCIÓN CORREGIDA: Formateo de fechas SIN timezone issues
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    console.log('📅 Formateando fecha:', dateString);

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.log('❌ Fecha inválida:', dateString);
        return "Fecha no válida";
      }

      const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      const formattedDate = `${day} de ${month} de ${year}`;
      console.log('✅ Fecha formateada:', formattedDate);
      
      return formattedDate;
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Error en fecha";
    }
  };

  // ✅ FUNCIÓN CORREGIDA: Extraer hora correctamente
  const getTimeFromProduct = (product) => {
    console.log('🕐 Extrayendo hora del producto:', {
      date: product.date,
      schedule: product.schedule,
      productKeys: Object.keys(product)
    });

    // 🎯 PRIORIDAD 1: Extraer hora de product.date (que es donde se guarda)
    if (product.date) {
      try {
        const date = new Date(product.date);
        
        if (!isNaN(date.getTime())) {
          const hours = date.getHours();
          const minutes = date.getMinutes();
          
          console.log('🕐 Hora extraída de date:', { hours, minutes });
          
          // Si la hora NO es 00:00 (medianoche), usar esa hora
          if (hours !== 0 || minutes !== 0) {
            const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            console.log('✅ Hora final extraída:', timeString);
            return `${timeString} hrs`;
          }
        }
      } catch (error) {
        console.error("Error extrayendo hora de date:", error);
      }
    }

    // 🎯 PRIORIDAD 2: Buscar en schedule del producto
    if (product.schedule) {
      console.log('🔍 Buscando en schedule:', product.schedule);
      
      // Manejar diferentes estructuras de schedule
      let scheduleArray = null;
      
      if (Array.isArray(product.schedule)) {
        scheduleArray = product.schedule;
      } else if (product.schedule.schedule && Array.isArray(product.schedule.schedule)) {
        scheduleArray = product.schedule.schedule;
      } else if (typeof product.schedule === 'object' && product.schedule.schedule) {
        // Podría ser un objeto con schedule string
        if (typeof product.schedule.schedule === 'string') {
          try {
            scheduleArray = JSON.parse(product.schedule.schedule);
          } catch {
            scheduleArray = [product.schedule.schedule];
          }
        }
      }
      
      console.log('📋 Schedule array procesado:', scheduleArray);
      
      if (scheduleArray && scheduleArray.length > 0) {
        const firstTime = scheduleArray[0];
        console.log('✅ Primer horario del schedule:', firstTime);
        return `${firstTime} hrs`;
      }
    }

    // 🎯 PRIORIDAD 3: Buscar campo time directo (poco probable pero por si acaso)
    if (product.time) {
      console.log('✅ Campo time encontrado:', product.time);
      return `${product.time} hrs`;
    }

    console.log('⚠️ No se pudo determinar la hora, usando default');
    return "Hora por confirmar";
  };

  // ✅ FUNCIÓN PARA FORMATEAR FECHA Y HORA COMPLETA
  const formatDateTime = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Fecha no válida";
      }

      const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
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

  // 🔍 LOG PARA DEBUGGING
  useEffect(() => {
    if (order) {
      
      if (order.products) {
        console.log('🛍️ Productos en la orden:');
        order.products.forEach((product, index) => {
          console.log(`  Producto ${index + 1}:`, {
            title: product.title,
            date: product.date,
            schedule: product.schedule,
            price: product.price,
            quantity: product.quantity
          });
        });
      }
    }
  }, [order]);

  if (loading) {
    return <LoadingScreen text="Cargando detalles de la reserva" />;
  }

  if (!order) {
    return (
      <Layout.Basic>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 8 }}>
            Detalles de la Reserva #{orderId}
          </Text>
        </View>

        {/* Información de compra */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <IconButton icon="calendar" size={24} iconColor="#0098d3" />
              <View>
                <Text style={{ fontSize: 14, color: "#666" }}>Fecha de compra:</Text>
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
                  <Text style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#0098d3",
                    marginBottom: 16,
                  }}>
                    {product.title || product.name || "Producto"}
                  </Text>

                  {/* Fecha del tour */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <IconButton icon="calendar-check" size={24} iconColor="#0098d3" />
                    <View>
                      <Text style={{ fontSize: 14, color: "#666" }}>Fecha del tour:</Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {formatDate(product.date)}
                      </Text>
                    </View>
                  </View>

                  {/* ✅ Hora del tour - FUNCIÓN CORREGIDA */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <IconButton icon="clock" size={24} iconColor="#0098d3" />
                    <View>
                      <Text style={{ fontSize: 14, color: "#666" }}>Hora del tour:</Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {getTimeFromProduct(product)}
                      </Text>
                    </View>
                  </View>

                  {/* Cantidad de personas */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <IconButton icon="account-group" size={24} iconColor="#0098d3" />
                    <View>
                      <Text style={{ fontSize: 14, color: "#666" }}>Cantidad de personas:</Text>
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
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
              Resumen de Tours
            </Text>

            {order.products && order.products.map((product, index) => (
              <View key={index} style={{
                flexDirection: "row",
                marginBottom: 12,
                padding: 12,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
              }}>
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
                  <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
                    {product.title || product.name || "Producto"}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#d32f2f" }}>
                    ${product.price || "0.00"} x {product.quantity || 1} Asientos
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    📅 {formatDate(product.date)} - 🕐 {getTimeFromProduct(product)}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Total */}
        <Card>
          <Card.Content>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Total de la reserva:
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#0098d3",
              }}>
                $ {order.totalPayment || "0.00"}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Layout.Basic>
  );
}