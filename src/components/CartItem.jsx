import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { formatCurrency } from "../utils/formatCurrency";

export default function CartItem({ item, availableStock, incrementDisabled = false, onIncrement, onDecrement, onRemove }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemBody}>
        <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        {Number.isFinite(availableStock) ? <Text style={styles.itemStock}>Disponible: {availableStock}</Text> : null}
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" onPress={onDecrement} style={styles.counterButton}>
            <Text style={styles.counterText}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onIncrement}
            disabled={incrementDisabled}
            style={[styles.counterButton, incrementDisabled && styles.counterButtonDisabled]}
          >
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

const styles = StyleSheet.create({
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
  itemStock: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
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
  counterButtonDisabled: {
    opacity: 0.45,
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
});