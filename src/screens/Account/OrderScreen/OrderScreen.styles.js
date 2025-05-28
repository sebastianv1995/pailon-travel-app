import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  purchaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoCardMargin: {
    marginTop: 8,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0098d3',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 12,
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  totalPayment: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0098d3',
  },
});