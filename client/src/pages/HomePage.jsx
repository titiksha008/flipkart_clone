import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const BANNERS = [
  { label: 'Electronics', slug: 'electronics', color: 'from-blue-500 to-blue-700', emoji: '📱' },
  { label: 'Clothing', slug: 'clothing', color: 'from-pink-500 to-rose-600', emoji: '👕' },
  { label: 'Books', slug: 'books', color: 'from-yellow-500 to-orange-500', emoji: '📚' },
  { label: 'Home & Kitchen', slug: 'home-kitchen', color: 'from-green-500 to-teal-600', emoji: '🏠' },
  { label: 'Sports', slug: 'sports', color: 'from-purple-500 to-violet-600', emoji: '⚽' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(s => s.products);

  useEffect(() => { dispatch(fetchProducts({ limit: 8 })); }, [dispatch]);

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      {/* Hero Banner */}
      <div className="bg-[#2874f0] text-white py-8 px-4 mb-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">India's Best Online Store</h1>
          <p className="text-blue-200 mb-6">Millions of products at unbeatable prices</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-[#2874f0] font-bold px-8 py-3 rounded-sm hover:bg-blue-50 transition"
          >
            Shop Now →
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-5 gap-3">
          {BANNERS.map(b => (
            <button
              key={b.slug}
              onClick={() => navigate(`/products?category=${b.slug}`)}
              className={`bg-gradient-to-br ${b.color} text-white rounded-sm p-4 text-center hover:opacity-90 transition shadow-sm`}
            >
              <div className="text-3xl mb-1">{b.emoji}</div>
              <div className="text-sm font-semibold">{b.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
          <button onClick={() => navigate('/products')} className="text-[#2874f0] text-sm font-semibold hover:underline">
            View All →
          </button>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}