import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 18,
    color: "#0098d3",
    fontWeight: "600",
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#e0e0e0",
    height: 1,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  selectQuantity: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  btnQuantity: {
    backgroundColor: "#0098d3",
    margin: 0,
    borderRadius: 8,
  },
  inputQuantity: {
    textAlign: "center",
    fontSize: 16,
    minWidth: 40,
    color: "#333",
  },
  btnDelete: {
    backgroundColor: "#ff4444",
  },
});
