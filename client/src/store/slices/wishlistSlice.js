import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/wishlist');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (product_id, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/wishlist/toggle', { product_id });

      await dispatch(fetchWishlist());

      return {
        product_id,
        wishlisted: res.data?.wishlisted,
        message: res.data?.message || '',
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update wishlist'
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    toggleLoading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wishlist';
      })

      .addCase(toggleWishlist.pending, (state) => {
        state.toggleLoading = true;
        state.error = '';
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.toggleLoading = false;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload || 'Failed to update wishlist';
      });
  },
});

export default wishlistSlice.reducer;