import { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingView from "../../components/LoadingView";
import OrderItem from "../../components/OrderItem";
import colors from "../../constants/colors";
import { useGetOrdersQuery } from "../../services/shopApi";

export default function OrdersScreen() {
  const { data: items = [], isLoading, isFetching, isError, refetch } = useGetOrdersQuery();

  const refreshOrders = useCallback(() => {
    refetch();
  }, [refetch]);

  useFocusEffect(refreshOrders);

  if (isLoading) {
    return <LoadingView message="Cargando ordenes" />;
  }

  if (isError && !items.length) {
    return <ErrorState title="No se pudieron cargar las ordenes" message="Revisa la conexion con Firebase." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refreshOrders} tintColor={colors.primary} />}
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
});