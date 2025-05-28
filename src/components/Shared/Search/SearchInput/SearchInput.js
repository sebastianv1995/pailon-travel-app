import { useState, useEffect } from "react";
import { View, Animated, Keyboard } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { searchHistoryCtrl } from "../../../../api";
import { useSearch } from "../../../../hooks";
import { screensName } from "../../../../utils";
import { SearchHistory } from "../SearchHistory";
import { AnimatedIcon, searchAnimation } from "./SearchInput.animation";
import { styles } from "./SearchInput.styles";

export function SearchInput() {
  const [containerHeight, setContainerHeight] = useState(0);
  const [openHistory, setOpenHistory] = useState(false);
  const [searchBarWidth, setSearchBarWidth] = useState("100%");
  const { searchText, setSearchText } = useSearch();
  const navigation = useNavigation();

  // Escuchar los cambios en searchAnimation.inputWidth para actualizar el ancho manualmente
  useEffect(() => {
    // Crear listener para el valor animado
    const widthListener = searchAnimation.inputWidth.addListener(
      ({ value }) => {
        // Calcular porcentaje basado en el valor animado (0-1)
        const newWidth = 100 - value * 15; // 100% cuando value=0, 85% cuando value=1
        setSearchBarWidth(`${newWidth}%`);
      }
    );

    // Limpiar listener cuando el componente se desmonte
    return () => {
      searchAnimation.inputWidth.removeListener(widthListener);
    };
  }, []);

  const openCloseHistory = () => setOpenHistory((prevState) => !prevState);

  const openSearch = () => {
    searchAnimation.transition.start();
    openCloseHistory();
  };

  const closeSearch = () => {
    searchAnimation.transitionReset.start();
    Keyboard.dismiss();
    openCloseHistory();
  };

  const onSearch = async (reuseSearch) => {
    const isReuse = typeof reuseSearch === "string";

    if (!isReuse) {
      await searchHistoryCtrl.update(searchText);
    }

    closeSearch();
    navigation.navigate(screensName.home.search);
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <View style={styles.containerInput}>
        {/* Flecha con animación */}
        <AnimatedIcon
          name="arrow-back-ios"
          size={22}
          style={[styles.backArrow, searchAnimation.arrow]}
          onPress={closeSearch}
        />

        {/* Usamos width dinámico de state en lugar de animación directa */}
        <Animated.View
          style={[{ width: searchBarWidth }, searchAnimation.input]}
        >
          <Searchbar
            placeholder="Busca tu destino"
            autoCapitalize="none"
            style={styles.searchBar}
            onFocus={openSearch}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearch}
          />
        </Animated.View>
      </View>

      <SearchHistory
        open={openHistory}
        height={containerHeight}
        onSearch={onSearch}
      />
    </View>
  );
}
