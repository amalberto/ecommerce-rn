import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CategoryItem from "../../components/CategoryItem";
import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";
import { fetchCatalog } from "../../features/products/productsSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { categories, items, status, source, warning } = useSelector((state) => state.products);

  const refreshCatalog = () => {
    dispatch(fetchCatalog());
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={status === "loading"} onRefresh={refreshCatalog} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>{source === "remote" ? "Catalogo sincronizado" : "Catalogo disponible"}</Text>
        <Text style={styles.title}>Productos seleccionados para comprar desde el movil</Text>
        {warning ? <Text style={styles.warning}>{warning}</Text> : null}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorias</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categories}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onPress={() => navigation.navigate(ROUTES.CATEGORY, { categoryId: item.id, title: item.title })}
          />
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Destacados</Text>
      </View>
      {items.length ? (
        <View style={styles.grid}>
          {items.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: product.id })}
            />
          ))}
        </View>
      ) : (
        <EmptyState title="No hay productos" message="Tira para actualizar el catalogo." />
      )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 32,
  },
  warning: {
    marginTop: 10,
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
  categories: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
  },
});