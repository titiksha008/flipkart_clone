import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import api from '../api/axios';
import { FiFilter, FiX } from 'react-icons/fi';

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: 'Over ₹10,000', min: 10000, max: 999999 },
];

const RATINGS = [4, 3, 2, 1];

export default function ProductListPage() {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector(s => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ search, category, page, sort, limit: 20 }));
  }, [dispatch, search, category, page, sort]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const filtered = items.filter(p => {
    const price = p.price * (1 - p.discount / 100);
    const passPrice = !priceRange || (price >= priceRange.min && price <= priceRange.max);
    const passRating = !minRating || p.rating >= minRating;
    return passPrice && passRating;
  });

  const clearAll = () => {
    setPriceRange(null);
    setMinRating(null);
    setParam('category', '');
  };

  const FilterPanel = () => (
    <div className="space-y-3">
      {/* Filters header */}
      <div className="bg-white rounded-sm shadow-sm px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800 text-base">Filters</span>
        <button
          onClick={clearAll}
          className="text-[#2874f0] text-xs font-semibold hover:underline"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Category */}
      <div className="bg-white rounded-sm shadow-sm p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={!category}
              onChange={() => setParam('category', '')}
              className="accent-blue-600"
            />
            <span className="text-gray-700">All</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={category === cat.slug}
                onChange={() => setParam('category', category === cat.slug ? '' : cat.slug)}
                className="accent-blue-600"
              />
              <span className="text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-sm shadow-sm p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Price</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={priceRange?.label === r.label}
                onChange={() => setPriceRange(priceRange?.label === r.label ? null : r)}
                className="accent-blue-600"
              />
              <span className="text-gray-700">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-sm shadow-sm p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Customer Ratings</h3>
        <div className="space-y-2">
          {RATINGS.map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={minRating === r}
                onChange={() => setMinRating(minRating === r ? null : r)}
                className="accent-blue-600"
              />
              <span className="text-gray-700">{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex gap-3">

        {/* Sidebar - desktop */}
        <aside className="w-56 lg:w-60 flex-shrink-0 hidden md:block self-start sticky top-16">
          <FilterPanel />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">

          {/* Sort bar */}
          <div className="bg-white rounded-sm shadow-sm px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 lg:gap-6 mb-3 overflow-x-auto">
            {/* Mobile filter button */}
            <button
              className="md:hidden flex items-center gap-1.5 text-sm text-gray-700 font-semibold border border-gray-300 px-3 py-1.5 rounded flex-shrink-0"
              onClick={() => setShowMobileFilters(true)}
            >
              <FiFilter className="text-sm" /> Filters
            </button>

            <span className="text-xs sm:text-sm text-gray-500 font-semibold flex-shrink-0 hidden sm:inline">
              Sort By
            </span>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto">
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value)}
                  className={`text-xs sm:text-sm px-1 py-2 flex-shrink-0 border-b-2 transition-colors whitespace-nowrap ${
                    sort === o.value
                      ? 'text-[#2874f0] font-bold border-[#2874f0]'
                      : 'text-gray-600 border-transparent hover:text-[#2874f0]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {(search || category) && (
              <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                {pagination?.total || filtered.length} results
                {search && ` for "${search}"`}
              </span>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-sm p-10 sm:p-16 text-center shadow-sm">
              <p className="text-4xl sm:text-5xl mb-3">🔍</p>
              <p className="text-gray-500 text-base sm:text-lg font-medium">No results found</p>
              <p className="text-gray-400 text-sm mt-1">Try different keywords or filters</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-sm shadow-sm divide-y divide-gray-100">
                {filtered.map(p => (
                  <div key={p.id} className="hover:bg-gray-50 transition-colors">
                    <ProductCard product={p} listView />
                  </div>
                ))}
              </div>
              {pagination?.totalPages > 1 && (
                <div className="flex justify-center gap-1 mt-4 flex-wrap">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        const sp = new URLSearchParams(searchParams);
                        sp.set('page', p);
                        setSearchParams(sp);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-semibold border rounded transition-colors ${
                        p === page
                          ? 'bg-[#2874f0] text-white border-[#2874f0]'
                          : 'bg-white text-gray-600 hover:bg-blue-50 border-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="w-72 bg-[#f1f3f6] h-full overflow-y-auto shadow-2xl flex-shrink-0">
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b sticky top-0 z-10">
              <span className="font-bold text-gray-800">Filters</span>
              <button onClick={() => setShowMobileFilters(false)}>
                <FiX className="text-xl text-gray-600" />
              </button>
            </div>
            <div className="p-3">
              <FilterPanel />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-3">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-[#2874f0] text-white py-2.5 font-bold rounded-sm text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}