import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cacheCategories, cacheProducts, fetchCachedCategories, fetchCachedProducts } from "../../db/catalogRepository";
import { fetchCategoriesRemote, fetchProductsRemote } from "../../firebase/databaseService";
import { seedCategories } from "../../data/seedCategories";
import { seedProducts } from "../../data/seedProducts";
import { getErrorMessage } from "../../utils/validators";

export const fetchCatalog = createAsyncThunk("products/fetchCatalog", async (_, { rejectWithValue }) => {
  try {
    const [categories, products] = await Promise.all([
      fetchCategoriesRemote(),
      fetchProductsRemote(),
    ]);

    if (categories.length && products.length) {
      await Promise.all([cacheCategories(categories), cacheProducts(products)]);
      return { categories, products, source: "remote", warning: null };
    }

    throw new Error("Firebase no devolvio productos o categorias.");
  } catch (error) {
    const [cachedCategories, cachedProducts] = await Promise.all([
      fetchCachedCategories(),
      fetchCachedProducts(),
    ]);

    if (cachedCategories.length && cachedProducts.length) {
      return {
        categories: cachedCategories,
        products: cachedProducts,
        source: "local",
        warning: getErrorMessage(error, "Usando catalogo offline"),
      };
    }

    if (seedCategories.length && seedProducts.length) {
      await Promise.all([cacheCategories(seedCategories), cacheProducts(seedProducts)]);
      return {
        categories: seedCategories,
        products: seedProducts,
        source: "seed",
        warning: getErrorMessage(error, "Usando datos iniciales"),
      };
    }

    return rejectWithValue(getErrorMessage(error, "No se pudo cargar el catalogo"));
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    categories: [],
    items: [],
    status: "idle",
    source: "seed",
    error: null,
    warning: null,
    lastSync: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.categories;
        state.items = action.payload.products;
        state.source = action.payload.source;
        state.warning = action.payload.warning;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;