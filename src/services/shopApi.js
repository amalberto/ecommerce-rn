import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cacheCategories, cacheProducts } from "../db/catalogRepository";
import { firebaseRestBaseUrl } from "../firebase/firebaseConfig";

const objectToArray = (value) => {
  if (!value) {
    return [];
  }

  return Object.entries(value).map(([key, item]) => ({
    id: item?.id || key,
    ...item,
  }));
};

const normalizeProduct = (product) => ({
  ...product,
  categoryId: product.categoryId || product.category_id,
});

const sortByCreatedAtDesc = (items) => {
  return [...items].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
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
      transformResponse: (response) => objectToArray(response).map(normalizeProduct),
      providesTags: ["Products"],
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
    getCategories: builder.query({
      query: () => "/categories.json",
      transformResponse: objectToArray,
      providesTags: ["Categories"],
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
      transformResponse: (response) => sortByCreatedAtDesc(objectToArray(response)),
      providesTags: ["Orders"],
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
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = shopApi;