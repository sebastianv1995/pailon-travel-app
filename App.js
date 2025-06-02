import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SearchProvider } from "./src/contexts/SearchContext";
import { CartProvider } from "./src/contexts/CartContext";
import { WishlistProvider } from "./src/contexts/WishlistContext";
import { RootNavigation } from "./src/navigation";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <SearchProvider>
            <PaperProvider>
              <RootNavigation />
            </PaperProvider>
          </SearchProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
