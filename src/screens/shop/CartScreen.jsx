import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { clearCartItems, decrementCartItem, incrementCartItem, removeCartItem, selectCartTotal } from "../../features/cart/cartSlice";
import { createOrder } from "../../features/orders/ordersSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/validators";

function CartRow({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemBody}>
        <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" onPress={onDecrement} style={styles.counterButton}>
            <Text style={styles.counterText}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable accessibilityRole="button" onPress={onIncrement} style={styles.counterButton}>
            <Text style={styles.counterText}>+</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeText}>Quitar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const user = useSelector((state) => state.auth.user);
  const ordersStatus = useSelector((state) => state.orders.status);

  const handleCreateOrder = async () => {
    if (!user?.uid) {
      Alert.alert("Sesion requerida", "Inicia sesion para confirmar la orden.");
      return;
    }

    try {
      await dispatch(createOrder({ userId: user.uid, items, total })).unwrap();
      await dispatch(clearCartItems()).unwrap();
      Alert.alert("Orden creada", "Tu pedido quedo guardado en Firebase Realtime Database.");
    } catch (error) {
      Alert.alert("No se pudo crear la orden", getErrorMessage(error));
    }
  };

  if (!items.length) {
    return (
      <View style={styles.container}>
        <EmptyState title="Carrito vacio" message="Agrega productos desde el catalogo." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartRow
            item={item}
            onIncrement={() => dispatch(incrementCartItem(item.id))}
            onDecrement={() => dispatch(decrementCartItem(item.id))}
            onRemove={() => dispatch(removeCartItem(item.id))}
          />
        )}
      />
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryTotal}>{formatCurrency(total)}</Text>
        </View>
        <PrimaryButton title="Confirmar" onPress={handleCreateOrder} loading={ordersStatus === "loading"} style={styles.confirmButton} />
      </View>
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
  row: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 10,
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  itemBody: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  itemPrice: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  counterText: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
  },
  quantity: {
    minWidth: 22,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  removeButton: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  removeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800",
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