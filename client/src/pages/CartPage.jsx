import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCartError,
} from '../store/slices/cartSlice';
import Spinner from '../components/Spinner';
import { FiTrash2, FiHeart, FiShield, FiTruck, FiTag } from 'react-icons/fi';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const safeItems = Array.isArray(items) ? items.filter((i) => i && i.product) : [];

  const getPrice = (item) =>
    Math.round(Number(item?.product?.price || 0) * (1 - Number(item?.product?.discount || 0) / 100));

  const totalMrp = safeItems.reduce((s, i) => s + Number(i.product.price || 0) * Number(i.quantity || 0), 0);
  const total = safeItems.reduce((s, i) => s + getPrice(i) * Number(i.quantity || 0), 0);
  const savings = totalMrp - total;

  const images = (item) => {
    const imgs = item?.product?.images;
    if (!imgs) return [];
    try { return Array.isArray(imgs) ? imgs : JSON.parse(imgs); }
    catch { return []; }
  };

  const handleIncrease = (item) => {
    dispatch(clearCartError());
    dispatch(updateCartItem({ id: item.id, quantity: Number(item.quantity) + 1 }));
  };

  const handleDecrease = (item) => {
    dispatch(clearCartError());
    if (Number(item.quantity) > 1)
      dispatch(updateCartItem({ id: item.id, quantity: Number(item.quantity) - 1 }));
    else
      dispatch(removeFromCart(item.id));
  };

  const handleRemove = (item) => {
    dispatch(clearCartError());
    dispatch(removeFromCart(item.id));
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">

        {/* ── Empty State ─────────────────────────────────────────────────── */}
        {safeItems.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-base sm:text-xl font-bold text-gray-800">My Cart (0 items)</h1>
            </div>
            <div className="p-10 sm:p-16 text-center">
              <div className="text-7xl mb-4">🛒</div>
              <p className="text-lg text-gray-700 font-medium mb-2">Your cart is empty!</p>
              <p className="text-sm text-gray-500 mb-6">Add items to it now</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-[#2874f0] text-white px-8 sm:px-12 py-3 font-bold rounded-sm hover:bg-blue-700 text-sm"
              >
                Shop Now
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start">

            {/* ── Left: Cart Items ──────────────────────────────────────────── */}
            <div className="flex-1 w-full space-y-0">
              <div className="bg-white rounded-sm shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h1 className="text-base sm:text-lg font-bold text-gray-800">
                    My Cart ({safeItems.length} {safeItems.length === 1 ? 'item' : 'items'})
                  </h1>
                </div>

                {error && (
                  <div className="mx-4 mt-3 bg-red-50 text-red-600 px-4 py-3 rounded text-sm border border-red-100">
                    {error}
                  </div>
                )}

                {safeItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`px-4 py-4 sm:px-6 sm:py-5 flex gap-4 ${
                      idx < safeItems.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    {/* Image */}
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 border border-gray-100 rounded flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/products/${item.product_id}`)}
                    >
                      <img
                        src={images(item)[0] || 'https://via.placeholder.com/120'}
                        alt={item?.product?.name}
                        className="max-w-full max-h-full object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#2874f0] mb-0.5"
                        onClick={() => navigate(`/products/${item.product_id}`)}
                      >
                        {item?.product?.name}
                      </p>

                      {item?.product?.brand && (
                        <p className="text-xs text-gray-400 mb-2">{item.product.brand}</p>
                      )}

                      {/* Delivery info */}
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <FiTruck size={12} className="text-green-600" />
                        <span className="text-green-600 font-medium">Free delivery</span>
                        <span>· Usually delivered in 3–5 days</span>
                      </p>

                      {/* Price row */}
                      <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ₹{getPrice(item).toLocaleString()}
                        </span>
                        {Number(item?.product?.discount || 0) > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{Number(item?.product?.price || 0).toLocaleString()}
                            </span>
                            <span className="text-sm text-green-600 font-semibold">
                              {item.product.discount}% off
                            </span>
                          </>
                        )}
                      </div>

                      {/* Qty + actions */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg rounded-l border-r border-gray-300"
                          >−</button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="w-8 h-8 flex items-center justify-center text-[#2874f0] hover:bg-blue-50 font-bold text-lg rounded-r border-l border-gray-300"
                          >+</button>
                        </div>

                        <button
                          onClick={() => handleRemove(item)}
                          className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium"
                        >
                          <FiTrash2 size={14} /> Remove
                        </button>

                        <button className="text-sm text-gray-500 hover:text-[#2874f0] transition-colors flex items-center gap-1.5 font-medium">
                          <FiHeart size={14} /> Save for Later
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Place order sticky bar (mobile) */}
                <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex items-center justify-between bg-white rounded-b-sm">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
                    {savings > 0 && (
                      <p className="text-xs text-green-600 font-medium">You save ₹{savings.toLocaleString()}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 px-8 sm:px-12 rounded-sm transition-colors text-sm"
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right: Price Details ──────────────────────────────────────── */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
              {/* Price summary */}
              <div className="bg-white rounded-sm shadow-sm p-4 lg:sticky lg:top-20">
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest border-b pb-3 mb-3">
                  Price Details
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Price ({safeItems.length} items)</span>
                    <span>₹{totalMrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>− ₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-dashed pt-3 mt-1 flex justify-between font-bold text-base text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                {savings > 0 && (
                  <p className="text-green-600 text-sm font-semibold mt-4 pt-3 border-t border-dashed">
                    You will save ₹{savings.toLocaleString()} on this order 🎉
                  </p>
                )}
              </div>

              {/* Offers */}
              <div className="bg-white rounded-sm shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FiTag className="text-[#2874f0]" /> Available Offers
                </h3>
                <ul className="space-y-2">
                  {[
                    '10% off on SBI Credit Card, up to ₹1500',
                    '5% Unlimited Cashback on Flipkart Axis Bank Card',
                    'No Cost EMI on select cards above ₹3000',
                  ].map((o, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security note */}
              <div className="bg-white rounded-sm shadow-sm p-4 flex items-start gap-3">
                <FiShield className="text-[#2874f0] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500 leading-5">
                  Safe and secure payments. Easy returns. 100% Authentic products.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}