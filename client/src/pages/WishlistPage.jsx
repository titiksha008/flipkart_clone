import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const getPrice = (p) => Math.round(Number(p.price) * (1 - Number(p.discount || 0) / 100));

  const getImages = (p) => {
    try {
      return Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
    } catch {
      return [];
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-sm sm:text-base font-bold text-gray-800">
              My Wishlist{' '}
              <span className="text-gray-400 font-normal">({items.length} items)</span>
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="p-12 sm:p-20 text-center">
              <FiHeart className="text-6xl sm:text-7xl text-gray-200 mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-gray-500 font-medium mb-1">Empty Wishlist</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                You have no items in your wishlist. Start adding!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-[#2874f0] text-white px-8 sm:px-10 py-2.5 font-bold rounded-sm hover:bg-blue-700 text-sm"
              >
                EXPLORE PRODUCTS
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const p = item.product;
                const imgs = getImages(p || {});
                const price = p ? getPrice(p) : 0;
                const savings = p ? Number(p.price) - price : 0;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 sm:gap-6 px-3 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center cursor-pointer"
                      onClick={() => navigate(`/products/${p?.id}`)}
                    >
                      <img
                        src={imgs[0] || 'https://via.placeholder.com/128'}
                        alt={p?.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => navigate(`/products/${p?.id}`)}
                        className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-1 sm:mb-2 cursor-pointer hover:text-[#2874f0]"
                      >
                        {p?.name}
                      </h3>

                      <StarRating rating={p?.rating || 0} count={p?.review_count || 0} />

                      <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                        <span className="text-base sm:text-xl font-bold text-gray-900">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ₹{Number(p?.price || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs sm:text-sm text-green-600 font-bold">
                          {p?.discount || 0}% off
                        </span>
                      </div>

                      {savings > 0 && (
                        <p className="text-xs text-green-600 mt-0.5">
                          You save ₹{savings.toLocaleString('en-IN')}
                        </p>
                      )}

                      <p
                        className={`text-xs mt-1 font-semibold ${
                          Number(p?.stock) > 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {Number(p?.stock) > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                      </p>

                      <div className="flex gap-2 mt-3 sm:hidden">
                        <button
                          onClick={() => {
                            dispatch(addToCart({ product_id: p.id, quantity: 1 }));
                            navigate('/cart');
                          }}
                          className="flex items-center gap-1 bg-[#ff9f00] hover:bg-[#f0960a] text-white px-3 py-2 text-xs font-bold rounded-sm transition-colors"
                        >
                          <FiShoppingCart className="text-xs" /> Cart
                        </button>
                        <button
                          onClick={() => dispatch(toggleWishlist(p.id))}
                          className="flex items-center gap-1 border border-gray-300 text-gray-600 px-3 py-2 text-xs font-semibold rounded-sm hover:border-red-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="text-xs" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col gap-2 flex-shrink-0 pt-1">
                      <button
                        onClick={() => {
                          dispatch(addToCart({ product_id: p.id, quantity: 1 }));
                          navigate('/cart');
                        }}
                        className="flex items-center gap-2 bg-[#ff9f00] hover:bg-[#f0960a] text-white px-5 lg:px-6 py-2.5 text-sm font-bold rounded-sm transition-colors whitespace-nowrap"
                      >
                        <FiShoppingCart /> MOVE TO CART
                      </button>
                      <button
                        onClick={() => dispatch(toggleWishlist(p.id))}
                        className="flex items-center gap-2 border border-gray-300 text-gray-600 px-5 lg:px-6 py-2.5 text-sm font-semibold rounded-sm hover:border-red-400 hover:text-red-500 transition-colors whitespace-nowrap"
                      >
                        <FiTrash2 /> REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}