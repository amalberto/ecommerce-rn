import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/CartItem";
import EmptyState from "../../components/EmptyState";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { clearCartItems, decrementCartItem, incrementCartItem, removeCartItem, selectCartTotal } from "../../features/cart/cartSlice";
import { useCreateOrderMutation } from "../../services/shopApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/validators";

export default function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const profile = useSelector((state) => state.profile.data);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const handleCreateOrder = async () => {
    try {
      await createOrder({
        items,
        total,
        customerName: profile?.displayName || "Invitado",
        source: "mobile",
      }).unwrap();
      await dispatch(clearCartItems()).unwrap();
      Alert.alert("Orden creada", "Tu pedido quedo guardado en Firebase Realtime Database.");
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
        ListEmptyComponent={<EmptyState title="Carrito vacio" message="Agrega productos desde el catalogo." />}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrement={() => dispatch(incrementCartItem(item.id))}
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
          <PrimaryButton title="Confirmar" onPress={handleCreateOrder} loading={isCreatingOrder} style={styles.confirmButton} />
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