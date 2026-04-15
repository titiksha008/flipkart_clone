import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const res = await api.get('/wishlist');
  return res.data.data;
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product_id) => {
  const res = await api.post('/wishlist/toggle', { product_id });
  return { product_id, wishlisted: res.data.wishlisted };
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { product_id, wishlisted } = action.payload;
        if (!wishlisted) {
          state.items = state.items.filter(i => i.product_id !== product_id);
        }
      });
  },
});

export default wishlistSlice.reducer;