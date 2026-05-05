import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <Text style={styles.stock}>Stock {product.stock ?? 0}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    maxWidth: "48%",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.86,
  },
  image: {
    width: "100%",
    aspectRatio: 1.12,
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    minHeight: 112,
    padding: 12,
  },
  title: {
    minHeight: 40,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  price: {
    marginTop: 8,
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  stock: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },
});