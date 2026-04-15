import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null, // ✅ FIXED NAME
    loading: false,
    pagination: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload; // ✅ FIXED
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.loading = false;
        state.selectedProduct = null;
      });
  },
});

export default productSlice.reducer;