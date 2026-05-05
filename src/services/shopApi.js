import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cacheCategories, cacheProducts } from "../db/catalogRepository";
import { firebaseRestBaseUrl } from "../firebase/firebaseConfig";

const firebaseObjectToArray = (value) => {
  if (!value || typeof value !== "object") {
    return [];
  }

  return Object.entries(value).map(([key, item]) => ({
    id: item?.id ? String(item.id) : key,
    ...item,
  }));
};

const normalizeCategory = (category) => ({
  ...category,
  id: String(category.id),
});

const normalizeProduct = (product) => ({
  ...product,
  id: String(product.id),
  categoryId: product.categoryId || product.category_id || product.category,
});

const sortByCreatedAtDesc = (items) => {
  return [...items].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
};

const collectionTags = (type, result) => {
  const baseTag = { type, id: "LIST" };

  if (!Array.isArray(result)) {
    return [baseTag];
  }

  return [
    ...result.map((item) => ({ type, id: item.id })),
    baseTag,
  ];
};

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: firebaseRestBaseUrl,
  }),
  tagTypes: ["Products", "Categories", "Orders"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products.json",
      transformResponse: (response) => firebaseObjectToArray(response).map(normalizeProduct),
      providesTags: (result) => collectionTags("Products", result),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.length) {
            await cacheProducts(data);
          }
        } catch (error) {
          // SQLite fallback is handled by the UI hook.
        }
      },
    }),
    getProduct: builder.query({
      query: (productId) => `/products/${productId}.json`,
      transformResponse: (response, meta, productId) => (response ? normalizeProduct({ id: productId, ...response }) : null),
      providesTags: (result, error, productId) => [{ type: "Products", id: productId }],
    }),
    getProductsByCategory: builder.query({
      query: (categoryId) => ({
        url: "/products.json",
        params: {
          orderBy: '"categoryId"',
          equalTo: `"${categoryId}"`,
        },
      }),
      transformResponse: (response) => firebaseObjectToArray(response).map(normalizeProduct),
      providesTags: (result) => collectionTags("Products", result),
    }),
    getCategories: builder.query({
      query: () => "/categories.json",
      transformResponse: (response) => firebaseObjectToArray(response).map(normalizeCategory),
      providesTags: (result) => collectionTags("Categories", result),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.length) {
            await cacheCategories(data);
          }
        } catch (error) {
          // SQLite fallback is handled by the UI hook.
        }
      },
    }),
    getOrders: builder.query({
      query: () => "/orders.json",
      transformResponse: (response) => sortByCreatedAtDesc(firebaseObjectToArray(response)),
      providesTags: (result) => collectionTags("Orders", result),
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders.json",
        method: "POST",
        body: {
          ...order,
          status: order.status || "created",
          createdAt: order.createdAt || new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = shopApi;