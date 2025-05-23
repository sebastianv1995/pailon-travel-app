import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Importamos MaterialIcons
import Toast from "react-native-root-toast";
import { map } from "lodash";
import { searchHistoryCtrl } from "../../../../api";
import { useSearch } from "../../../../hooks";
import { styles } from "./SearchHistory.styles";

export function SearchHistory(props) {
  const { open, height, onSearch } = props;
  const [history, setHistory] = useState(null);
  const { setSearchText } = useSearch();
  const containerStyles = { top: height };

  useEffect(() => {
    if (open) getHistory();
  }, [open]);

  const getHistory = async () => {
    try {
      const response = await searchHistoryCtrl.get();
      setHistory(response);
    } catch (error) {
      Toast.show("Error al obtener el historial de busqueda", {
        position: Toast.positions.CENTER,
      });
    }
  };

  const onSearchWrapper = (text) => {
    onSearch(text);
    setSearchText(text);
  };

  if (!open) return null;

  return (
    <View style={[containerStyles, styles.container]}>
      {map(history, (item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSearchWrapper(item.search)}
        >
          <View style={styles.historyItem}>
            <Text style={styles.text}>{item.search}</Text>
            {/* Implementación de la Opción 1: Material Design arrow-forward-ios */}
            <MaterialIcons
              name="arrow-forward-ios"
              size={16}
              color="#333"
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
