import { useMemo } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/CartItem";
import EmptyState from "../../components/EmptyState";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { clearCartItems, decrementCartItem, incrementCartItem, removeCartItem, selectCartTotal } from "../../features/cart/cartSlice";
import { useCheckoutOrderMutation, useGetProductsQuery } from "../../services/shopApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/validators";

export default function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const profile = useSelector((state) => state.profile.data);
  const { data: products = [] } = useGetProductsQuery();
  const [checkoutOrder, { isLoading: isCheckingOut }] = useCheckoutOrderMutation();
  const stockByProductId = useMemo(() => {
    return new Map(products.map((product) => [product.id, Number(product.stock ?? 0)]));
  }, [products]);

  const getAvailableStock = (item) => {
    const stock = Number(stockByProductId.get(item.productId) ?? item.stock);
    return Number.isFinite(stock) ? stock : undefined;
  };

  const handleIncrement = (item) => {
    const availableStock = getAvailableStock(item);

    if (Number.isFinite(availableStock) && item.quantity >= availableStock) {
      Alert.alert("No hay stock suficiente", "No quedan más unidades disponibles de este producto.");
      return;
    }

    dispatch(incrementCartItem(item.id)).unwrap().catch((error) => {
      Alert.alert("No se pudo actualizar el carrito", getErrorMessage(error));
    });
  };

  const handleCreateOrder = async () => {
    try {
      await checkoutOrder({
        items,
        total,
        customerName: profile?.displayName || "Invitado",
        source: "mobile",
      }).unwrap();
      await dispatch(clearCartItems()).unwrap();
      Alert.alert("Orden creada correctamente", "Tu pedido fue registrado con éxito.");
    } catch (error) {
      Alert.alert("No se pudo crear la orden", getErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, !items.length && styles.emptyList]}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={<EmptyState title="Carrito vacío" message="Agregá productos desde el catálogo." />}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            availableStock={getAvailableStock(item)}
            incrementDisabled={Number.isFinite(getAvailableStock(item)) && item.quantity >= getAvailableStock(item)}
            onIncrement={() => handleIncrement(item)}
            onDecrement={() => dispatch(decrementCartItem(item.id))}
            onRemove={() => dispatch(removeCartItem(item.id))}
          />
        )}
      />
      {items.length ? (
        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryTotal}>{formatCurrency(total)}</Text>
          </View>
          <PrimaryButton title="Confirmar" onPress={handleCreateOrder} loading={isCheckingOut} style={styles.confirmButton} />
        </View>
      ) : null}
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
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  summaryTotal: {
    marginTop: 2,
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900",
  },
  confirmButton: {
    minWidth: 142,
  },
});