import { useState, useEffect } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { productCtrl } from "../../../api";
import { useCart } from "../../../hooks";
import { Layout } from "../../../layouts";
import { LoadingScreen, Search } from "../../../components/Shared";
import { Cart } from "../../../components/Cart";
import { fn } from "../../../utils";
import { styles } from "./CartScreen.styles";

export function CartScreen() {
  const [products, setProducts] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // AÃ±adido estado de loading
  const { cart } = useCart();

  useEffect(() => {
    if (cart) {
      getProducts();
    }
  }, [cart]);

  const getProducts = async () => {
    try {
      setIsLoading(true);
      if (!cart || cart.length === 0) {
        setProducts([]);
        setTotalPayment(0);
        return;
      }

      const productsTemp = [];
      let totalPaymentTemp = 0;

      // Usar Promise.all para manejar mÃºltiples promesas
      const productPromises = cart.map(async (item) => {
        try {
          const response = await productCtrl.getById(item.id);
          const data = response.data.attributes;
          const productWithDetails = {
            ...data,
            ...item,
            id: item.id,
            reservationDateTime: item.date,
          };

          const priceProduct = fn.calcPrice(data.price, data.discount);
          totalPaymentTemp += priceProduct * item.quantity;

          return productWithDetails;
        } catch (error) {
          console.error(`Error fetching product ${item.id}:`, error);
          return null;
        }
      });

      const resolvedProducts = await Promise.all(productPromises);
      const validProducts = resolvedProducts.filter(
        (product) => product !== null
      );

      setProducts(validProducts);
      setTotalPayment(totalPaymentTemp);
    } catch (error) {
      console.error("Error in getProducts:", error);
      setProducts([]);
      setTotalPayment(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout.Cart>
      {isLoading ? (
        <LoadingScreen text="Cargando " />
      ) : !products || products.length === 0 ? (
        <>
          <Search.Input />
          <Cart.Empty />
        </>
      ) : (
        <KeyboardAwareScrollView extraScrollHeight={25}>
          <View style={styles.container}>
            <Cart.ProductList products={products} cartData={cart} />
            <Cart.Payment totalPayment={totalPayment} products={products} />
          </View>
        </KeyboardAwareScrollView>
      )}
    </Layout.Cart>
  );
}
