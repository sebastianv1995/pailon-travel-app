import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Estilos del botón normal - CORREGIDOS
  btn: {
    borderRadius: 8,
    backgroundColor: "#0098d3",
    minHeight: 50,
    // ❌ Removido flex: 1 para evitar problemas de layout
    marginVertical: 4, // Espaciado opcional
  },

  btnBuyContent: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center", // ✅ Centrar horizontalmente también
    // ❌ Removido backgroundColor para evitar conflictos
  },

  btnLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // ✅ Usando color explícito
    textAlign: "center",
    lineHeight: 20,
    // ✅ Agregado para asegurar visibilidad
    includeFontPadding: false,
  },

  // Estilos para estado deshabilitado - CORREGIDOS
  btnDisabled: {
    backgroundColor: "#cccccc",
    borderRadius: 8,
    minHeight: 50,
    // ❌ Removido opacity para evitar doble efecto
    marginVertical: 4,
  },

  btnBuyContentDisabled: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    // ❌ Removido backgroundColor duplicado
  },

  btnLabelDisabled: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    includeFontPadding: false,
  },
  customBtn: {
    borderRadius: 8,
    backgroundColor: "#0098d3",
    minHeight: 50,
    marginVertical: 4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  customBtnDisabled: {
    backgroundColor: "#cccccc",
  },

  customBtnLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },

  customBtnLabelDisabled: {
    color: "#666666",
  },
});
