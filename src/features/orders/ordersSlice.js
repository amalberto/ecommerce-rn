import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrderRemote, fetchOrdersRemote } from "../../firebase/databaseService";
import { getErrorMessage } from "../../utils/validators";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (userId, { rejectWithValue }) => {
  try {
    if (!userId) {
      return [];
    }

    return await fetchOrdersRemote(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudieron cargar las ordenes"));
  }
});

export const createOrder = createAsyncThunk("orders/createOrder", async ({ userId, items, total }, { rejectWithValue }) => {
  try {
    if (!items.length) {
      throw new Error("El carrito esta vacio");
    }

    return await createOrderRemote(userId, {
      items,
      total,
      status: "created",
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo crear la orden"));
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;