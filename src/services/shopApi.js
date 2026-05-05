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

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const mutationError = (message) => ({
  error: {
    status: "CUSTOM_ERROR",
    error: message,
  },
});

const normalizeCategory = (category) => ({
  ...category,
  id: String(category.id),
});

const normalizeProduct = (product) => ({
  ...product,
  id: String(product.id),
  categoryId: product.categoryId || product.category_id || product.category,
  price: toNumber(product.price),
  stock: toNumber(product.stock),
});

const buildOrder = (order) => ({
  ...order,
  status: order.status || "created",
  createdAt: order.createdAt || new Date().toISOString(),
});

const createFirebaseKey = () => `order-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeCheckoutItem = (item) => {
  const productId = item.productId || item.id || "";

  return {
    id: String(productId),
    productId: String(productId),
    title: item.title,
    price: toNumber(item.price),
    quantity: toNumber(item.quantity),
    image: item.image || null,
  };
};

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
        body: buildOrder(order),
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    checkoutOrder: builder.mutation({
      async queryFn(order = {}, _queryApi, _extraOptions, baseQuery) {
        const checkoutItems = (order.items || []).map(normalizeCheckoutItem);

        if (!checkoutItems.length) {
          return mutationError("El carrito está vacío.");
        }

        const stockUpdates = [];

        for (const item of checkoutItems) {
          if (!item.productId || item.quantity <= 0) {
            return mutationError("Hay un producto inválido en el carrito.");
          }

          const productResult = await baseQuery(`/products/${item.productId}.json`);

          if (productResult.error) {
            return { error: productResult.error };
          }

          if (!productResult.data) {
            return mutationError(`${item.title || "El producto"} ya no está disponible.`);
          }

          const currentProduct = normalizeProduct({ ...productResult.data, id: item.productId });

          if (currentProduct.stock < item.quantity) {
            return mutationError("No hay stock suficiente.");
          }

          stockUpdates.push({
            productId: item.productId,
            nextStock: currentProduct.stock - item.quantity,
          });
        }

        const createdAt = new Date().toISOString();
        const orderId = createFirebaseKey();
        const orderItems = checkoutItems.map((item) => ({
          ...item,
          subtotal: item.price * item.quantity,
        }));
        const total = Number.isFinite(Number(order.total))
          ? Number(order.total)
          : orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const nextOrder = buildOrder({
          ...order,
          id: orderId,
          items: orderItems,
          total,
          createdAt,
        });
        const updates = {
          [`orders/${orderId}`]: nextOrder,
        };

        stockUpdates.forEach(({ productId, nextStock }) => {
          updates[`products/${productId}/stock`] = nextStock;
        });

        const checkoutResult = await baseQuery({
          url: "/.json",
          method: "PATCH",
          body: updates,
        });

        if (checkoutResult.error) {
          return { error: checkoutResult.error };
        }

        return { data: nextOrder };
      },
      invalidatesTags: (result, error, order) => {
        if (!result) {
          return [];
        }

        return [
          { type: "Orders", id: "LIST" },
          { type: "Products", id: "LIST" },
          ...(order?.items || []).map((item) => ({ type: "Products", id: String(item.productId || item.id) })),
        ];
      },
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
  useCheckoutOrderMutation,
} = shopApi;