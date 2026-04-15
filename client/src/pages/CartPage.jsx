import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import Spinner from '../components/Spinner';
import { FiTrash2 } from 'react-icons/fi';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const safeItems = items.filter((item) => item && item.product);

  const getPrice = (item) => {
    const price = Number(item.product?.price || 0);
    const discount = Number(item.product?.discount || 0);
    return Math.round(price * (1 - discount / 100));
  };

  const subtotal = safeItems.reduce(
    (sum, item) => sum + getPrice(item) * item.quantity,
    0
  );

  const savings = safeItems.reduce((sum, item) => {
    const originalPrice = Number(item.product?.price || 0);
    return sum + (originalPrice - getPrice(item)) * item.quantity;
  }, 0);

  const images = (item) => {
    const imgs = item.product?.images;
    if (!imgs) return [];

    try {
      return Array.isArray(imgs) ? imgs : JSON.parse(imgs);
    } catch {
      return [];
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          My Cart ({safeItems.length} items)
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-sm mb-4">
            {error}
          </div>
        )}

        {safeItems.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-16 text-center">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-lg text-gray-500 mb-4">Your cart is empty!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#2874f0] text-white px-8 py-2 font-semibold rounded-sm hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-2">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-sm shadow-sm p-4 flex gap-4"
                >
                  <img
                    src={images(item)[0] || 'https://via.placeholder.com/100'}
                    alt={item.product?.name || 'Product'}
                    className="w-24 h-24 object-contain cursor-pointer"
                    onClick={() => navigate(`/products/${item.product_id}`)}
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                      {item.product?.name}
                    </h3>

                    <p className="text-xs text-gray-500 mb-2">
                      {item.product?.brand}
                    </p>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold">
                        ₹{getPrice(item).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{Number(item.product?.price || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        {Number(item.product?.discount || 0)}% off
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? dispatch(
                                  updateCartItem({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  })
                                )
                              : dispatch(removeFromCart(item.id))
                          }
                          className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 rounded-full font-bold"
                        >
                          −
                        </button>

                        <span className="px-3 text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            dispatch(
                              updateCartItem({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-lg text-blue-600 hover:bg-blue-50 rounded-full font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
                <h3 className="text-gray-500 text-sm font-semibold border-b pb-3 mb-3 uppercase tracking-wide">
                  Price Details
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price ({safeItems.length} items)</span>
                    <span>₹{(subtotal + savings).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>− ₹{savings.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between font-bold text-base border-t pt-3 mt-2">
                    <span>Total Amount</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-green-600 text-sm font-semibold mt-3">
                  You save ₹{savings.toLocaleString()} on this order 🎉
                </p>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 mt-4 rounded-sm text-base transition-colors"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}