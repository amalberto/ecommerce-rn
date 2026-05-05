import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";

export default function CategoryScreen({ navigation, route }) {
  const { categoryId, title } = route.params;
  const products = useSelector((state) => state.products.items.filter((item) => item.categoryId === categoryId));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title="Categoria vacia" message="No hay productos para mostrar." />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
});