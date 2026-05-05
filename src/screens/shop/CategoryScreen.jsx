import { FlatList, StyleSheet, Text, View } from "react-native";
import EmptyState from "../../components/EmptyState";
import LoadingView from "../../components/LoadingView";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";
import { useCatalogData } from "../../hooks/useCatalogData";

export default function CategoryScreen({ navigation, route }) {
  const { categoryId, title } = route.params;
  const { products, isLoading, isError } = useCatalogData();
  const categoryProducts = products.filter((item) => item.categoryId === categoryId);

  if (isLoading) {
    return <LoadingView message="Cargando productos" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {isError ? <Text style={styles.warning}>Mostrando datos locales disponibles.</Text> : null}
      <FlatList
        data={categoryProducts}
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
  warning: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});