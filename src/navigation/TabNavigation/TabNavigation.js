import { View } from "react-native";
import { Badge } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useCart } from "../../hooks";
import { useWishlist } from "../../hooks"; // Importar el nuevo hook
import { screensName } from "../../utils";
import { HomeStack, WishlistStack, CartStack, AccountStack } from "../stacks";
import { styles } from "./TabNavigation.styles";

const Tab = createBottomTabNavigator();

export function TabNavigation() {
  const { totalProducts } = useCart();
  const { totalFavorites } = useWishlist(); // 🔧 FIX: Mover hook al nivel del componente
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (routeStatus) => setIcon(route, routeStatus, totalProducts, totalFavorites),
        tabBarActiveTintColor: "#000",
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={screensName.home.root}
        component={HomeStack}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name={screensName.wishlist.root}
        component={WishlistStack}
        options={{ title: "Favoritos" }}
      />
      <Tab.Screen
        name={screensName.cart.root}
        component={CartStack}
        options={{ title: "Pago" }}
      />
      <Tab.Screen
        name={screensName.account.root}
        component={AccountStack}
        options={{ title: "Mi cuenta" }}
      />
    </Tab.Navigator>
  );
}

function setIcon(route, routeStatus, totalProducts, totalFavorites) {
  console.log("🔄 [TabNavigation] setIcon render", { route: route.name, totalFavorites, totalProducts });
  
  let iconName = "";
  let color = "#fff";

  if (routeStatus.focused) {
    color = "#0098d3";
  }

  if (route.name == screensName.home.root) {
    iconName = "home";
  }

  if (route.name == screensName.account.root) {
    iconName = "user";
  }

  // Tab de favoritos con badge - 🔧 FIX: Usa context global
  if (route.name == screensName.wishlist.root) {
    return (
      <View>
        <AwesomeIcon name="heart" color={color} style={styles.icon} />
        {totalFavorites > 0 && (
          <Badge style={styles.totalCart}>{totalFavorites}</Badge>
        )}
      </View>
    );
  }

  // Tab de carrito con badge (mantener original)
  if (route.name == screensName.cart.root) {
    return (
      <View>
        <AwesomeIcon name="shopping-cart" color={color} style={styles.icon} />
        {totalProducts > 0 && (
          <Badge style={styles.totalCart}>{totalProducts}</Badge>
        )}
      </View>
    );
  }

  return <AwesomeIcon name={iconName} color={color} style={styles.icon} />;
}
