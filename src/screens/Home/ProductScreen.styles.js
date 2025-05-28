import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ✅ Estilos existentes (los que ya tenías)
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
  },
  priceSection: {
    marginVertical: 10,
  },
  characteristicsSection: {
    marginVertical: 10,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerIcon: {
    margin: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  dateTimeContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
  },
  selectionContainer: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  datePickerButtonError: {
    borderColor: "#ff4444",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  errorText: {
    color: "#ff4444",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  errorMessage: {
    color: "#d32f2f",
    fontSize: 14,
    marginLeft: 5,
    flex: 1,
  },

  // ✅ Nuevos estilos para validaciones
  validationContainer: {
    marginTop: 15,
    paddingHorizontal: 5,
  },

  validationSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },

  validationSuccessText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
    flex: 1,
  },

  validationWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },

  validationWarningText: {
    color: "#e65100",
    fontSize: 14,
    marginLeft: 5,
    flex: 1,
  },
});
