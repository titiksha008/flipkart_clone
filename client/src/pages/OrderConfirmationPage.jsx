import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const STATUS_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => { setOrder(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return (
    <div className="text-center py-20 text-gray-500">Order not found.</div>
  );

  const getImage = (item) => {
    try {
      const p = Array.isArray(item?.product?.images)
        ? item.product.images
        : JSON.parse(item?.product?.images || '[]');
      return p[0] || '';
    } catch { return ''; }
  };

  const statusIdx = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered']
    .indexOf(order.status);

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 space-y-3">

        {/* Success banner */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#388e3c] px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">✓</span>
            <div className="min-w-0">
              <h1 className="text-white text-base sm:text-lg font-bold">Order Confirmed!</h1>
              <p className="text-green-200 text-xs sm:text-sm truncate">
                Your order #{order.id} has been placed successfully
              </p>
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                Estimated Delivery
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-800">
                {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                Payment
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-700">
                {order.payment_method} ·{' '}
                <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}>
                  {order.payment_status}
                </span>
              </p>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="px-3 sm:px-6 py-4 sm:py-5 overflow-x-auto">
            <div className="flex items-center min-w-max sm:min-w-0">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      i <= statusIdx
                        ? 'bg-[#388e3c] border-[#388e3c] text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {i <= statusIdx ? '✓' : i + 1}
                    </div>
                    <p className={`text-[9px] sm:text-[10px] mt-1 text-center max-w-[48px] sm:max-w-[60px] leading-tight ${
                      i <= statusIdx ? 'text-[#388e3c] font-semibold' : 'text-gray-400'
                    }`}>
                      {step}
                    </p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-0.5 sm:mx-1 mb-4 ${
                      i < statusIdx ? 'bg-[#388e3c]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">Items in your order</h2>
          <div className="space-y-3">
            {order.orderItems?.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 sm:gap-4 py-2 border-b border-gray-50 last:border-0"
              >
                <img
                  src={getImage(item) || 'https://via.placeholder.com/80'}
                  alt={item.product?.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain border border-gray-100 rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-xs sm:text-sm flex-shrink-0">
                  ₹{(Number(item.price_at_purchase) * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-sm sm:text-base mt-4 pt-3 border-t">
            <span>Order Total</span>
            <span>₹{Number(order.total_price).toLocaleString()}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-sm shadow-sm p-4">
          <h2 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Delivery Address</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">📍 {order.shipping_address}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 border-2 border-[#2874f0] text-[#2874f0] py-2.5 sm:py-3 font-bold rounded-sm hover:bg-blue-50 transition-colors text-xs sm:text-sm"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 bg-[#fb641b] hover:bg-[#f05b10] text-white py-2.5 sm:py-3 font-bold rounded-sm transition-colors text-xs sm:text-sm"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}