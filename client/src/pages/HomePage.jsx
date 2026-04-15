import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const HERO_BANNERS = [
  {
    bg: 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)',
    label: 'Big Billion Days Sale',
    sub: 'Up to 80% off on Electronics',
    cta: 'Shop Electronics',
    slug: 'electronics',
    accent: '#e65100',
  },
  {
    bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    label: 'Fashion Fiesta',
    sub: 'Trendy styles from top brands',
    cta: 'Shop Fashion',
    slug: 'clothing',
    accent: '#2e7d32',
  },
  {
    bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    label: 'Home Makeover Sale',
    sub: 'Furniture & appliances at best prices',
    cta: 'Shop Home',
    slug: 'home-kitchen',
    accent: '#1565c0',
  },
];

const AD_BANNERS = [
  { bg: '#fce4ec', label: 'Fashion Top Picks', sub: 'Min. 50–80% off', slug: 'clothing', color: '#c2185b', emoji: '👗' },
  { bg: '#e8eaf6', label: 'Electronics Sale', sub: 'Extra 10% bank offer', slug: 'electronics', color: '#3949ab', emoji: '🖥️' },
  { bg: '#e0f2f1', label: 'Home Essentials', sub: 'Starting at ₹199', slug: 'home-kitchen', color: '#00796b', emoji: '🛋️' },
  { bg: '#fff8e1', label: 'Travel Deals', sub: 'Up to 40% off on trips', slug: 'travel', color: '#f57f17', emoji: '✈️' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.products);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 16 }));
    const t = setInterval(() => {
      setBannerIdx((i) => (i + 1) % HERO_BANNERS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [dispatch]);

  const banner = HERO_BANNERS[bannerIdx];

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <div
        className="relative overflow-hidden"
        style={{ background: banner.bg, transition: 'background 0.5s ease' }}
      >
        <button
          onClick={() =>
            setBannerIdx((i) => (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)
          }
          className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 flex items-center justify-center bg-black bg-opacity-10 hover:bg-opacity-20 z-10 text-white text-2xl font-light transition-all"
        >
          ‹
        </button>

        <button
          onClick={() => setBannerIdx((i) => (i + 1) % HERO_BANNERS.length)}
          className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 flex items-center justify-center bg-black bg-opacity-10 hover:bg-opacity-20 z-10 text-white text-2xl font-light transition-all"
        >
          ›
        </button>

        <div className="max-w-7xl mx-auto px-10 sm:px-14 py-8 sm:py-12 flex items-center min-h-[180px] sm:min-h-[240px] lg:min-h-[280px]">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80"
              style={{ color: banner.accent }}
            >
              Limited Time Offer
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">
              {banner.label}
            </h1>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
              {banner.sub}
            </p>
            <button
              onClick={() => navigate(`/products?category=${banner.slug}`)}
              className="text-white text-xs sm:text-sm font-bold px-5 sm:px-8 py-2 sm:py-2.5 rounded-sm shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: banner.accent }}
            >
              {banner.cta} →
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === bannerIdx ? 'w-6 h-2 bg-gray-600' : 'w-2 h-2 bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {AD_BANNERS.map((b) => (
          <div
            key={b.slug}
            onClick={() => navigate(`/products?category=${b.slug}`)}
            className="rounded-sm p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-2 sm:gap-3"
            style={{ backgroundColor: b.bg }}
          >
            <span className="text-2xl sm:text-3xl">{b.emoji}</span>
            <div className="min-w-0">
              <p
                className="text-xs font-bold leading-tight truncate"
                style={{ color: b.color }}
              >
                {b.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 sm:mt-4">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-gray-800">Deal of the Day</h2>
              <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
                <span className="hidden xs:inline">LIMITED TIME</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-2 sm:px-4 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex gap-0 overflow-x-auto pb-1 scrollbar-hide divide-x divide-gray-100">
              {items.slice(0, 8).map((p) => (
                <div key={p.id} className="flex-shrink-0 w-36 sm:w-44 p-2 sm:p-3">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 sm:mt-4">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-gray-100">
            <h2 className="text-base sm:text-xl font-bold text-gray-800">
              Best of Electronics
            </h2>
            <button
              onClick={() => navigate('/products?category=electronics')}
              className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-2 sm:px-4 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0 divide-x divide-y divide-gray-100">
              {items.slice(0, 8).map((p) => (
                <div key={p.id} className="p-2 sm:p-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 sm:mt-4">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-gray-800">
                Fashion Top Picks
              </h2>
              <span className="text-xs font-bold text-pink-600 border border-pink-200 bg-pink-50 px-2 py-0.5 rounded">
                50-80% OFF
              </span>
            </div>
            <button
              onClick={() => navigate('/products?category=clothing')}
              className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-2 sm:px-4 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex gap-0 overflow-x-auto pb-1 scrollbar-hide divide-x divide-gray-100">
              {items.slice(4, 12).map((p) => (
                <div key={p.id} className="flex-shrink-0 w-36 sm:w-44 p-2 sm:p-3">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div
          onClick={() => navigate('/products?category=appliances')}
          className="rounded-sm p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center gap-3 sm:gap-4"
        >
          <span className="text-4xl sm:text-5xl">🧊</span>
          <div>
            <p className="text-sm sm:text-base font-bold text-indigo-800">
              Appliances for Home
            </p>
            <p className="text-xs sm:text-sm text-indigo-600 mt-1">Upto 55% off</p>
            <p className="text-xs text-indigo-500 mt-1 sm:mt-2 font-bold">Shop now →</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/products?category=mobiles')}
          className="rounded-sm p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-orange-50 to-amber-50 flex items-center gap-3 sm:gap-4"
        >
          <span className="text-4xl sm:text-5xl">📱</span>
          <div>
            <p className="text-sm sm:text-base font-bold text-orange-800">
              Best Selling Mobiles
            </p>
            <p className="text-xs sm:text-sm text-orange-600 mt-1">From ₹6,999</p>
            <p className="text-xs text-orange-500 mt-1 sm:mt-2 font-bold">Shop now →</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 sm:mt-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-gray-100">
            <h2 className="text-base sm:text-xl font-bold text-gray-800">
              Recommended For You
            </h2>
            <button
              onClick={() => navigate('/products')}
              className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-2 sm:px-4 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 divide-x divide-y divide-gray-100">
              {items.map((p) => (
                <div key={p.id} className="p-2">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}