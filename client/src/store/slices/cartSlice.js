import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/cart');
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch cart'
    );
  }
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ product_id, quantity = 1 }, thunkAPI) => {
    try {
      const res = await api.post('/cart/add', { product_id, quantity });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ id, quantity }, thunkAPI) => {
    try {
      const res = await api.put(`/cart/update/${id}`, { quantity });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/cart/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch cart
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
        state.error = action.payload || 'Failed to fetch cart';
      })

      // add to cart
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingIndex = state.items.findIndex((i) => i.id === newItem.id);

        if (existingIndex !== -1) {
          state.items[existingIndex] = newItem;
        } else {
          state.items.push(newItem);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add item to cart';
      })

      // update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex((i) => i.id === updatedItem.id);

        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update cart item';
      })

      // remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove item from cart';
      });
  },
});

export default cartSlice.reducer;