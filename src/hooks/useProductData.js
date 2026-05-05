import { useEffect, useState } from "react";
import { fetchCachedProducts } from "../db/catalogRepository";
import { seedProducts } from "../data/seedProducts";
import { useGetProductQuery } from "../services/shopApi";

export const useProductData = (productId) => {
  const productQuery = useGetProductQuery(productId, { skip: !productId });
  const [fallbackProduct, setFallbackProduct] = useState(null);

  useEffect(() => {
    let active = true;

    const loadFallback = async () => {
      const cachedProducts = await fetchCachedProducts();
      const product = cachedProducts.find((item) => item.id === productId)
        || seedProducts.find((item) => item.id === productId)
        || null;

      if (active) {
        setFallbackProduct(product);
      }
    };

    loadFallback().catch(() => {
      if (active) {
        setFallbackProduct(seedProducts.find((item) => item.id === productId) || null);
      }
    });

    return () => {
      active = false;
    };
  }, [productId]);

  return {
    product: productQuery.data || fallbackProduct,
    isLoading: productQuery.isLoading && !fallbackProduct,
    isError: productQuery.isError,
    error: productQuery.error,
    refetch: productQuery.refetch,
  };
};