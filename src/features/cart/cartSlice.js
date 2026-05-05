import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearCart, deleteCartItem, fetchCartItems, saveCartItem } from "../../db/cartRepository";
import { getErrorMessage } from "../../utils/validators";

export const loadCartFromSQLite = createAsyncThunk("cart/loadCartFromSQLite", async (_, { rejectWithValue }) => {
  try {
    return await fetchCartItems();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo cargar el carrito local"));
  }
});

export const addCartItem = createAsyncThunk("cart/addCartItem", async (product, { getState, rejectWithValue }) => {
  try {
    const existing = getState().cart.items.find((item) => item.productId === product.id);
    const item = {
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: existing ? existing.quantity + 1 : 1,
    };

    await saveCartItem(item);
    return item;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo agregar al carrito"));
  }
});

export const incrementCartItem = createAsyncThunk("cart/incrementCartItem", async (id, { getState, rejectWithValue }) => {
  try {
    const existing = getState().cart.items.find((item) => item.id === id);
    if (!existing) {
      throw new Error("Producto no encontrado en el carrito");
    }

    const item = { ...existing, quantity: existing.quantity + 1 };
    await saveCartItem(item);
    return item;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo actualizar el carrito"));
  }
});

export const decrementCartItem = createAsyncThunk("cart/decrementCartItem", async (id, { getState, rejectWithValue }) => {
  try {
    const existing = getState().cart.items.find((item) => item.id === id);
    if (!existing) {
      throw new Error("Producto no encontrado en el carrito");
    }

    if (existing.quantity <= 1) {
      await deleteCartItem(id);
      return { id, removed: true };
    }

    const item = { ...existing, quantity: existing.quantity - 1 };
    await saveCartItem(item);
    return item;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo actualizar el carrito"));
  }
});

export const removeCartItem = createAsyncThunk("cart/removeCartItem", async (id, { rejectWithValue }) => {
  try {
    await deleteCartItem(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo eliminar el producto"));
  }
});

export const clearCartItems = createAsyncThunk("cart/clearCartItems", async (_, { rejectWithValue }) => {
  try {
    await clearCart();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo vaciar el carrito"));
  }
});

const upsertItem = (items, item) => {
  const index = items.findIndex((current) => current.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromSQLite.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        upsertItem(state.items, action.payload);
      })
      .addCase(incrementCartItem.fulfilled, (state, action) => {
        upsertItem(state.items, action.payload);
      })
      .addCase(decrementCartItem.fulfilled, (state, action) => {
        if (action.payload.removed) {
          state.items = state.items.filter((item) => item.id !== action.payload.id);
        } else {
          upsertItem(state.items, action.payload);
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.items = [];
      })
      .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"), (state) => {
        state.status = "succeeded";
      })
      .addMatcher((action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"), (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;