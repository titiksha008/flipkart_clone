import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProducts = createAsyncThunk('products/fetch', async (params) => {
  const res = await api.get('/products', { params });
  return res.data;
});

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], current: null, loading: false, pagination: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.current = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchProductById.rejected, (state) => { state.loading = false; });
  },
});

export default productSlice.reducer;