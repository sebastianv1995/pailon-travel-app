import { useState, useEffect } from "react";
import Toast from "react-native-root-toast";
import { homeBannerCtrl, productCtrl } from "../../api";
import { useAuth } from "../../hooks";
import { Layout } from "../../layouts";
import { ProductBanners, GridProducts } from "../../components/Shared";

export function HomeScreen() {
  const { logout } = useAuth();
  const [banners, setBanners] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getBanners();
    getProducts();
  }, []);

  const getBanners = async () => {
    try {
      const response = await homeBannerCtrl.getAll();

      if (response && response.data) {
        setBanners(response.data);
      } else {
        setBanners([]);
      }
    } catch (error) {
      Toast.show(`Error al obtener banners: ${error.message}`, {
        position: Toast.positions.CENTER,
      });
    }
  };

  const getProducts = async () => {
    try {
      const response = await productCtrl.getLatestPublished();

      if (response && response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      Toast.show(`Error al obtener productos: ${error.message}`, {
        position: Toast.positions.CENTER,
      });
    }
  };

  return (
    <Layout.Basic>
      {banners && <ProductBanners banners={banners} />}
      <GridProducts
        title="Explora Baños en Chiva con Pailon Travel"
        products={products}
      />
    </Layout.Basic>
  );
}

export default HomeScreen;
