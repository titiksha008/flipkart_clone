import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Spinner from '../components/Spinner';
import api from '../api/axios';

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

export default function ProductListPage() {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector(s => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('');

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ search, category, page, sort, limit: 12 }));
  }, [dispatch, search, category, page, sort]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 hidden md:block">
        <CategoryFilter categories={categories} selected={category} onSelect={v => setParam('category', v)} />
      </div>

      {/* Main */}
      <div className="flex-1">
        {/* Sort bar */}
        <div className="bg-white rounded-sm shadow-sm px-4 py-3 flex items-center gap-4 mb-3">
          <span className="text-sm text-gray-500 font-semibold">Sort By:</span>
          {SORT_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setSort(o.value)}
              className={`text-sm px-2 py-1 rounded transition ${sort === o.value ? 'text-[#2874f0] font-bold border-b-2 border-[#2874f0]' : 'text-gray-600 hover:text-[#2874f0]'}`}
            >
              {o.label}
            </button>
          ))}
          {(search || category) && (
            <span className="ml-auto text-xs text-gray-400">
              {pagination.total} results {search && `for "${search}"`}
            </span>
          )}
        </div>

        {loading ? <Spinner /> : items.length === 0 ? (
          <div className="bg-white rounded-sm p-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); }}
                    className={`px-3 py-1 rounded text-sm font-semibold ${p === page ? 'bg-[#2874f0] text-white' : 'bg-white text-gray-600 hover:bg-blue-50 border'}`}
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
  );
}