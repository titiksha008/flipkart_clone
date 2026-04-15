import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/cart');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload, thunkAPI) => {
    try {
      const res = await api.post('/cart', payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, thunkAPI) => {
    try {
      const res = await api.put(`/cart/${id}`, { quantity });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/cart/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to remove cart item'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      await api.delete('/cart');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingIndex = state.items.findIndex(
          (item) => item.id === newItem.id
        );

        if (existingIndex !== -1) {
          state.items[existingIndex] = newItem;
        } else {
          state.items.unshift(newItem);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex((item) => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;