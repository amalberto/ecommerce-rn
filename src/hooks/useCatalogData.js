import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCachedCategories, fetchCachedProducts } from "../db/catalogRepository";
import { seedCategories } from "../data/seedCategories";
import { seedProducts } from "../data/seedProducts";
import { useGetCategoriesQuery, useGetProductsQuery } from "../services/shopApi";

export const useCatalogData = () => {
  const productsQuery = useGetProductsQuery();
  const categoriesQuery = useGetCategoriesQuery();
  const [cachedCategories, setCachedCategories] = useState([]);
  const [cachedProducts, setCachedProducts] = useState([]);

  const loadCache = useCallback(async () => {
    const [localCategories, localProducts] = await Promise.all([
      fetchCachedCategories(),
      fetchCachedProducts(),
    ]);
    setCachedCategories(localCategories);
    setCachedProducts(localProducts);
  }, []);

  useEffect(() => {
    loadCache().catch(() => undefined);
  }, [loadCache]);

  const categories = categoriesQuery.data?.length
    ? categoriesQuery.data
    : cachedCategories.length
      ? cachedCategories
      : seedCategories;

  const products = productsQuery.data?.length
    ? productsQuery.data
    : cachedProducts.length
      ? cachedProducts
      : seedProducts;

  const source = productsQuery.data?.length && categoriesQuery.data?.length
    ? "remote"
    : cachedProducts.length && cachedCategories.length
      ? "local"
      : "seed";

  const isLoading = (productsQuery.isLoading || categoriesQuery.isLoading) && source === "seed";
  const isError = productsQuery.isError || categoriesQuery.isError;

  const refetch = useCallback(() => {
    productsQuery.refetch();
    categoriesQuery.refetch();
    loadCache().catch(() => undefined);
  }, [categoriesQuery, loadCache, productsQuery]);

  return useMemo(() => ({
    categories,
    products,
    source,
    isLoading,
    isFetching: productsQuery.isFetching || categoriesQuery.isFetching,
    isError,
    error: productsQuery.error || categoriesQuery.error,
    refetch,
  }), [
    categories,
    isError,
    isLoading,
    products,
    productsQuery.isFetching,
    categoriesQuery.isFetching,
    refetch,
    source,
  ]);
};