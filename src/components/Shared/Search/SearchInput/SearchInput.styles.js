import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#16222b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backArrow: {
    position: "absolute",
    left: 0,
    top: 15,
    color: "#fff",
    zIndex: 2,
    padding: 5, // Área de toque más amplia
  },
  containerInput: {
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  searchBar: {
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 1,
  },
});
