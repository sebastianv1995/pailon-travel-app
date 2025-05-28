import { useState, useCallback } from "react";
import { View, Text, Animated, RefreshControl, ScrollView } from "react-native";
import { IconButton, Badge } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { size } from "lodash";
import Toast from "react-native-root-toast";
import { orderCtrl } from "../../../api";
import { useAuth } from "../../../hooks";
import { LoadingScreen } from "../../../components/Shared";
import { Layout } from "../../../layouts";
import { OrderList } from "../../../components/Orders";
import { styles } from "./OrdersScreen.styles";

export function OrdersScreen() {
  const [orders, setOrders] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      getOrders();
    }, [])
  );

  const getOrders = async () => {
    try {
      const response = await orderCtrl.getAll(user.id);
      setOrders(response.data);
    } catch (error) {
      Toast.show("Error al obtener los pedidos", {
        position: Toast.positions.CENTER,
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getOrders();
    setRefreshing(false);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <IconButton
            icon="ticket-confirmation"
            size={30}
            iconColor="#0098d3"
            style={styles.headerIcon}
          />
          <Text style={styles.title}>Mis Reservas</Text>
        </View>
        {orders && orders.length > 0 && (
          <Badge size={24} style={styles.badge}>
            {orders.length}
          </Badge>
        )}
      </View>
      <Text style={styles.subtitle}>Gestiona tus próximas aventuras</Text>
    </View>
  );

  return (
    <Layout.Basic hideSearch>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {!orders ? (
          <LoadingScreen text="Cargando tus reservas" />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#0098d3"]}
                tintColor="#0098d3"
              />
            }
          >
            {renderHeader()}
            {size(orders) === 0 ? (
              <View style={styles.emptyContainer}>
                <IconButton icon="ticket-outline" size={60} iconColor="#ccc" />
                <Text style={styles.emptyTitle}>No tienes reservas aún</Text>
                <Text style={styles.emptySubtitle}>
                  Cuando realices tu primera reserva, aparecerá aquí
                </Text>
              </View>
            ) : (
              <View style={styles.ordersContainer}>
                <OrderList orders={orders} />
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </Layout.Basic>
  );
}
