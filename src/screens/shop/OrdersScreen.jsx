import { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import colors from "../../constants/colors";
import { fetchOrders } from "../../features/orders/ordersSlice";
import { formatCurrency } from "../../utils/formatCurrency";

function OrderItem({ item }) {
  return (
    <View style={styles.order}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{String(item.id).slice(-6).toUpperCase()}</Text>
        <Text style={styles.status}>{item.status || "created"}</Text>
      </View>
      <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleString("es-AR") : "Sin fecha"}</Text>
      <Text style={styles.items}>{item.items?.length || 0} productos</Text>
      <Text style={styles.total}>{formatCurrency(item.total)}</Text>
    </View>
  );
}

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items, status, error } = useSelector((state) => state.orders);

  const refreshOrders = useCallback(() => {
    if (user?.uid) {
      dispatch(fetchOrders(user.uid));
    }
  }, [dispatch, user?.uid]);

  useFocusEffect(refreshOrders);

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={status === "loading"} onRefresh={refreshOrders} tintColor={colors.primary} />}
        ListEmptyComponent={<EmptyState title="Sin ordenes" message="Tus compras confirmadas apareceran aca." />}
        renderItem={({ item }) => <OrderItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  error: {
    marginHorizontal: 20,
    marginTop: 12,
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
  },
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