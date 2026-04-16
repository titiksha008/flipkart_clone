import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
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
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'products/fetchRecommendations',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}/recommendations`);
      return res.data.data; // { similar, alsoBought, fbtCompanions }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch recommendations'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    pagination: {},
    error: null,
    recommendations: {
      similar: [],
      alsoBought: [],
      fbtCompanions: [],
    },
    recommendationsLoading: false,
    recommendationsError: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearProductsCache: (state) => {
      state.items = [];
      state.pagination = {};
      state.selectedProduct = null;
      state.error = null;
    },
    updateProductStockLocally: (state, action) => {
      const orderedItems = action.payload || [];

      orderedItems.forEach((orderedItem) => {
        const productId = Number(orderedItem.product_id);
        const orderedQty = Number(orderedItem.quantity || 0);

        const listProduct = state.items.find((p) => Number(p.id) === productId);
        if (listProduct) {
          listProduct.stock = Math.max(0, Number(listProduct.stock || 0) - orderedQty);
        }

        if (state.selectedProduct && Number(state.selectedProduct.id) === productId) {
          state.selectedProduct.stock = Math.max(
            0,
            Number(state.selectedProduct.stock || 0) - orderedQty
          );
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchProducts ──────────────────────────────────────────────────────
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      // ── fetchProductById ───────────────────────────────────────────────────
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.selectedProduct = null;
        state.error = action.payload || 'Failed to fetch product';
      })

      // ── fetchRecommendations ───────────────────────────────────────────────
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.recommendationsError = null;
        state.recommendations = { similar: [], alsoBought: [], fbtCompanions: [] };
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = {
          similar: action.payload.similar ?? [],
          alsoBought: action.payload.alsoBought ?? [],
          fbtCompanions: action.payload.fbtCompanions ?? [],
        };
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendationsError = action.payload || 'Failed to fetch recommendations';
        state.recommendations = { similar: [], alsoBought: [], fbtCompanions: [] };
      });
  },
});

export const {
  clearSelectedProduct,
  clearProductsCache,
  updateProductStockLocally,
} = productSlice.actions;

export default productSlice.reducer;