import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { formatCurrency } from "../utils/formatCurrency";

export default function OrderItem({ item }) {
  return (
    <View style={styles.order}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{String(item.id || item.name || "orden").slice(-6).toUpperCase()}</Text>
        <Text style={styles.status}>{item.status || "created"}</Text>
      </View>
      <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleString("es-AR") : "Sin fecha"}</Text>
      <Text style={styles.items}>{item.items?.length || 0} productos</Text>
      <Text style={styles.total}>{formatCurrency(item.total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  order: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  orderId: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
  },
  status: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  date: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
  },
  items: {
    marginTop: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  total: {
    marginTop: 10,
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },
});