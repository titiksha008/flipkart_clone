import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_BANNERS = [
  {
    bg: 'linear-gradient(120deg, #ffe0b2 0%, #ffcc80 100%)',
    label: 'Big Billion Days',
    sub: 'Up to 80% off on Electronics',
    cta: 'Shop Electronics',
    slug: 'electronics',
    accent: '#e65100',
    img: '🖥️',
  },
  {
    bg: 'linear-gradient(120deg, #e8f5e9 0%, #c8e6c9 100%)',
    label: 'Fashion Fiesta',
    sub: 'Trendy styles from top brands',
    cta: 'Shop Fashion',
    slug: 'clothing',
    accent: '#2e7d32',
    img: '👗',
  },
  {
    bg: 'linear-gradient(120deg, #e3f2fd 0%, #bbdefb 100%)',
    label: 'Home Makeover Sale',
    sub: 'Furniture & Appliances at best prices',
    cta: 'Shop Home',
    slug: 'home-kitchen',
    accent: '#1565c0',
    img: '🛋️',
  },
  {
    bg: 'linear-gradient(120deg, #fce4ec 0%, #f8bbd0 100%)',
    label: 'Beauty & Personal Care',
    sub: 'Top brands up to 60% off',
    cta: 'Shop Beauty',
    slug: 'beauty',
    accent: '#c2185b',
    img: '💄',
  },
];

const CATEGORY_GRID = [
  { label: 'Mobiles', emoji: '📱', slug: 'mobiles', bg: '#e3f2fd', color: '#1565c0' },
  { label: 'Electronics', emoji: '🖥️', slug: 'electronics', bg: '#fff8e1', color: '#e65100' },
  { label: 'Fashion', emoji: '👗', slug: 'clothing', bg: '#fce4ec', color: '#c2185b' },
  { label: 'Home & Kitchen', emoji: '🏠', slug: 'home-kitchen', bg: '#e8f5e9', color: '#2e7d32' },
  { label: 'Beauty', emoji: '💄', slug: 'beauty', bg: '#f3e5f5', color: '#7b1fa2' },
  { label: 'Sports', emoji: '⚽', slug: 'sports', bg: '#e0f7fa', color: '#00838f' },
  { label: 'Grocery', emoji: '🛒', slug: 'grocery', bg: '#f9fbe7', color: '#558b2f' },
  { label: 'Toys', emoji: '🧸', slug: 'toys', bg: '#fff3e0', color: '#e65100' },
];

// ─── Scrollable Product Row ────────────────────────────────────────────────────
function ProductRow({ title, badge, products, onViewAll, compact = true }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-sm shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">{title}</h2>
          {badge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded border"
              style={{ color: badge.color, borderColor: badge.color, background: badge.bg }}>
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hidden sm:flex">
            <FiChevronLeft size={14} />
          </button>
          <button onClick={() => scroll(1)}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hidden sm:flex">
            <FiChevronRight size={14} />
          </button>
          <button onClick={onViewAll}
            className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-3 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
            View All →
          </button>
        </div>
      </div>
      <div ref={rowRef} className="flex overflow-x-auto pb-1 scrollbar-hide divide-x divide-gray-100">
        {products.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-36 sm:w-44 p-2 sm:p-3">
            <ProductCard product={p} compact={compact} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Grid Product Section ──────────────────────────────────────────────────────
function ProductGrid({ title, badge, products, cols = 4, onViewAll }) {
  const colClass = {
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  }[cols] || 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className="bg-white rounded-sm shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">{title}</h2>
          {badge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded border"
              style={{ color: badge.color, borderColor: badge.color, background: badge.bg }}>
              {badge.label}
            </span>
          )}
        </div>
        <button onClick={onViewAll}
          className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-3 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
          View All →
        </button>
      </div>
      <div className={`grid ${colClass} gap-0 divide-x divide-y divide-gray-100`}>
        {products.map((p) => (
          <div key={p.id} className="p-2 sm:p-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.products);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 24 }));
  }, [dispatch]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % HERO_BANNERS.length), 4000);
    return () => clearInterval(t);
  }, [isPaused]);

  const banner = HERO_BANNERS[bannerIdx];

  return (
    <div className="bg-[#f1f3f6] min-h-screen">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: banner.bg, transition: 'background 0.6s ease' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          onClick={() => setBannerIdx((i) => (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
          className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 flex items-center justify-center bg-black bg-opacity-10 hover:bg-opacity-20 z-10 text-white text-3xl font-light transition-all"
        >‹</button>
        <button
          onClick={() => setBannerIdx((i) => (i + 1) % HERO_BANNERS.length)}
          className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 flex items-center justify-center bg-black bg-opacity-10 hover:bg-opacity-20 z-10 text-white text-3xl font-light transition-all"
        >›</button>

        <div className="max-w-7xl mx-auto px-12 sm:px-16 py-10 sm:py-14 flex items-center justify-between min-h-[200px] sm:min-h-[260px] lg:min-h-[300px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80"
              style={{ color: banner.accent }}>
              Limited Time Offer
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">
              {banner.label}
            </h1>
            <p className="text-gray-600 mb-5 text-sm sm:text-base lg:text-lg">{banner.sub}</p>
            <button
              onClick={() => navigate(`/products?category=${banner.slug}`)}
              className="text-white text-xs sm:text-sm font-bold px-6 sm:px-8 py-2.5 rounded-sm shadow hover:opacity-90 transition-opacity"
              style={{ backgroundColor: banner.accent }}
            >
              {banner.cta} →
            </button>
          </div>
          <div className="text-7xl sm:text-9xl opacity-30 hidden sm:block select-none">
            {banner.img}
          </div>
        </div>

        {/* Dots */}
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

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-3 sm:space-y-4 mt-3 sm:mt-4 pb-8">

        {/* ── Category Grid ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-sm shadow-sm p-3 sm:p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {CATEGORY_GRID.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => navigate(`/products?category=${cat.slug}`)}
                className="flex flex-col items-center gap-1 sm:gap-2 group"
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.bg }}
                >
                  {cat.emoji}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Deal of the Day ───────────────────────────────────────────────── */}
        {loading ? (
          <div className="bg-white rounded-sm shadow-sm p-8 flex justify-center"><Spinner /></div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Deal of the Day</h2>
                <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                  <span>ENDS IN</span>
                  <DealTimer />
                </div>
              </div>
              <button
                onClick={() => navigate('/products')}
                className="text-[#2874f0] text-xs sm:text-sm font-bold border border-[#2874f0] px-3 py-1 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                View All →
              </button>
            </div>
            <div className="flex overflow-x-auto pb-1 scrollbar-hide divide-x divide-gray-100">
              {items.slice(0, 8).map((p) => (
                <div key={p.id} className="flex-shrink-0 w-36 sm:w-44 p-2 sm:p-3">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Best of Electronics ───────────────────────────────────────────── */}
        {!loading && (
          <ProductGrid
            title="Best of Electronics"
            products={items.slice(0, 8)}
            cols={4}
            onViewAll={() => navigate('/products?category=electronics')}
          />
        )}

        {/* ── Promo Banners 2-col ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { bg: 'linear-gradient(120deg,#e8eaf6,#c5cae9)', emoji: '📱', title: 'Best Selling Mobiles', sub: 'From ₹6,999', tc: '#283593', slug: 'mobiles' },
            { bg: 'linear-gradient(120deg,#fff8e1,#ffe082)', emoji: '🧊', title: 'Appliances for Home', sub: 'Upto 55% off', tc: '#e65100', slug: 'appliances' },
          ].map((b) => (
            <div
              key={b.slug}
              onClick={() => navigate(`/products?category=${b.slug}`)}
              className="rounded-sm p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
              style={{ background: b.bg }}
            >
              <span className="text-5xl sm:text-6xl">{b.emoji}</span>
              <div>
                <p className="text-sm sm:text-base font-bold" style={{ color: b.tc }}>{b.title}</p>
                <p className="text-xs sm:text-sm mt-1" style={{ color: b.tc, opacity: 0.75 }}>{b.sub}</p>
                <p className="text-xs mt-2 font-bold" style={{ color: b.tc }}>Shop now →</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Fashion Top Picks ─────────────────────────────────────────────── */}
        {!loading && (
          <ProductRow
            title="Fashion Top Picks"
            badge={{ label: '50–80% OFF', color: '#c2185b', bg: '#fce4ec' }}
            products={items.slice(4, 12)}
            onViewAll={() => navigate('/products?category=clothing')}
          />
        )}

        {/* ── 4-col Promo ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { bg: '#e8f5e9', emoji: '🌿', title: 'Organic Grocery', sub: 'Min 30% off', color: '#2e7d32', slug: 'grocery' },
            { bg: '#e3f2fd', emoji: '🎮', title: 'Gaming Zone', sub: 'New arrivals', color: '#1565c0', slug: 'gaming' },
            { bg: '#fce4ec', emoji: '💅', title: 'Beauty Sale', sub: 'Top brands', color: '#c2185b', slug: 'beauty' },
            { bg: '#fff3e0', emoji: '📚', title: 'Books & More', sub: 'Starting ₹99', color: '#e65100', slug: 'books' },
          ].map((b) => (
            <div
              key={b.slug}
              onClick={() => navigate(`/products?category=${b.slug}`)}
              className="rounded-sm p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-2 sm:gap-3"
              style={{ backgroundColor: b.bg }}
            >
              <span className="text-2xl sm:text-3xl">{b.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight truncate" style={{ color: b.color }}>{b.title}</p>
                <p className="text-xs mt-0.5 hidden sm:block" style={{ color: b.color, opacity: 0.7 }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recommended For You ───────────────────────────────────────────── */}
        {!loading && (
          <ProductGrid
            title="Recommended For You"
            cols={6}
            products={items}
            onViewAll={() => navigate('/products')}
          />
        )}

      </div>
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function DealTimer() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 0);
    return Math.floor((end - now) / 1000);
  });

  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');

  return <span className="font-mono tracking-wider">{h}:{m}:{s}</span>;
}