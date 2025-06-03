import { ScrollView, SafeAreaView, Platform, StyleSheet } from "react-native";
import { Search, StatusBar } from "../components/Shared";

export function BasicLayout(props) {
  const { children, hideSearch = false } = props;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#16222b" barStyle="light-content" />
      {!hideSearch && <Search.Input />}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16222b', // ✅ CORREGIDO: Mismo color que SearchInput y headers
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff', // ✅ El contenido del scroll sigue siendo blanco
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#ffffff', // ✅ Asegurar que el contenido sea blanco
    // Padding adicional para Android si es necesario
    ...(Platform.OS === 'android' && {
      paddingTop: 0,
    }),
  },
});