import { StyleSheet, Platform, StatusBar } from "react-native";

export const styled = (backgroundColor) => {
  return StyleSheet.create({
    safeAreaView: {
      flex: 0,
      backgroundColor: backgroundColor,
    },
    // ✅ Estilo específico para Android
    androidStatusBar: {
      height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
  });
};