import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../constants/colors";
import { addCartItem } from "../../features/cart/cartSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/validators";

export default function ProductDetailScreen({ route }) {
  const dispatch = useDispatch();
  const { productId } = route.params;
  const product = useSelector((state) => state.products.items.find((item) => item.id === productId));
  const cartStatus = useSelector((state) => state.cart.status);

  const handleAdd = async () => {
    try {
      await dispatch(addCartItem(product)).unwrap();
      Alert.alert("Producto agregado", "El carrito se guardo en SQLite.");
    } catch (error) {
      Alert.alert("No se pudo agregar", getErrorMessage(error));
    }
  };

  if (!product) {
    return <EmptyState title="Producto no encontrado" message="Vuelve al catalogo y actualiza la lista." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.stock}>Stock disponible: {product.stock ?? 0}</Text>
        <PrimaryButton title="Agregar al carrito" onPress={handleAdd} loading={cartStatus === "loading"} style={styles.button} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 28,
  },
  image: {
    width: "100%",
    aspectRatio: 1.08,
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    padding: 20,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  price: {
    marginTop: 12,
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
  },
  description: {
    marginTop: 14,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  stock: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  button: {
    marginTop: 22,
  },
});