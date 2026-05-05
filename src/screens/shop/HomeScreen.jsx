import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import CategoryItem from "../../components/CategoryItem";
import EmptyState from "../../components/EmptyState";
import LoadingView from "../../components/LoadingView";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";
import { useCatalogData } from "../../hooks/useCatalogData";

export default function HomeScreen({ navigation }) {
  const { categories, products, isLoading, isFetching, isError, source, refetch } = useCatalogData();

  if (isLoading) {
    return <LoadingView message="Cargando catalogo" />;
  }

  return (
    <FlatList
      style={styles.container}
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      initialNumToRender={6}
      windowSize={5}
      removeClippedSubviews
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />}
      ListHeaderComponent={(
        <View>
          <View style={styles.header}>
            <Text style={styles.kicker}>{source === "remote" ? "Catalogo sincronizado" : "Catalogo disponible"}</Text>
            <Text style={styles.title}>Productos seleccionados para comprar desde el movil</Text>
            {isError && source !== "remote" ? <Text style={styles.warning}>Mostrando datos locales mientras Firebase no responde.</Text> : null}
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
            initialNumToRender={4}
            windowSize={3}
            ListEmptyComponent={<EmptyState title="Sin categorias" message="Tira para actualizar el catalogo." />}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                onPress={() => navigation.navigate(ROUTES.CATEGORY, { categoryId: item.id, title: item.title })}
              />
            )}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<EmptyState title="No hay productos" message="Tira para actualizar el catalogo." />}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })}
        />
      )}
    />
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
  row: {
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
});