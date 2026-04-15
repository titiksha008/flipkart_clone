import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/orders');
        setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getImage = (item) => {
    const imgs = item?.product?.images;
    if (!imgs) return 'https://via.placeholder.com/100';

    try {
      const parsed = Array.isArray(imgs) ? imgs : JSON.parse(imgs);
      return parsed?.[0] || 'https://via.placeholder.com/100';
    } catch {
      return 'https://via.placeholder.com/100';
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <h1 className="text-base sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
          My Orders
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-sm mb-4 text-sm">
            {error}
          </div>
        )}

        {!error && orders.length === 0 ? (
          <div className="bg-white rounded-sm p-10 sm:p-16 text-center shadow-sm">
            <p className="text-4xl sm:text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">No orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#2874f0] text-white px-6 sm:px-8 py-2 font-semibold rounded-sm text-sm"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-sm shadow-sm p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-gray-800 text-sm sm:text-base">
                      Order #{order.id}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 sm:ml-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full capitalize flex-shrink-0 ${
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={getImage(item)}
                          alt={item.product?.name || 'Product'}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain border rounded flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">
                            {item.product?.name || 'Unnamed Product'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {Number(item.quantity)} × ₹
                            {Number(item.price_at_purchase).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <span className="font-bold text-xs sm:text-sm flex-shrink-0">
                          ₹
                          {(
                            Number(item.price_at_purchase) * Number(item.quantity)
                          ).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items found for this order.</p>
                  )}
                </div>

                <div className="border-t mt-3 pt-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      {order.payment_method} · {order.payment_status}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      📍 {order.shipping_address}
                    </p>
                  </div>

                  <span className="font-bold text-sm sm:text-base flex-shrink-0">
                    ₹{Number(order.total_price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}