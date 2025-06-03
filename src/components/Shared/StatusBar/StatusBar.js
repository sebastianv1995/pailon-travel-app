import { StatusBar as StatusBarRN, SafeAreaView, Platform, View } from "react-native";
import { styled } from "./StatusBar.styles";

export function StatusBar(props) {
  const { backgroundColor, ...rest } = props;
  const styles = styled(backgroundColor);

  return (
    <>
      <StatusBarRN 
        backgroundColor={backgroundColor} 
        translucent={Platform.OS === 'android'} // ✅ Importante para Android
        {...rest} 
      />
      {/* ✅ SafeAreaView solo para la barra superior */}
      {Platform.OS === 'ios' && (
        <SafeAreaView style={styles.safeAreaView} />
      )}
      {/* ✅ Para Android, usar View con altura específica */}
      {Platform.OS === 'android' && (
        <View style={[styles.safeAreaView, styles.androidStatusBar]} />
      )}
    </>
  );
}