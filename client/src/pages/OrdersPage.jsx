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

  useEffect(() => {
    api.get('/orders').then(r => { setOrders(r.data.data); setLoading(false); });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-sm p-16 text-center shadow-sm">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-4">No orders yet</p>
            <button onClick={() => navigate('/products')} className="bg-[#2874f0] text-white px-8 py-2 font-semibold rounded-sm">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-sm shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-gray-800">Order #{order.id}</span>
                    <span className="text-xs text-gray-400 ml-3">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.orderItems?.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={Array.isArray(item.product?.images) ? item.product.images[0] : JSON.parse(item.product?.images || '[]')[0]}
                        alt={item.product?.name}
                        className="w-14 h-14 object-contain border rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{Number(item.price_at_purchase).toLocaleString()}</p>
                      </div>
                      <span className="font-bold text-sm">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-3 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{order.payment_method} · {order.payment_status}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">📍 {order.shipping_address}</p>
                  </div>
                  <span className="font-bold text-base">₹{Number(order.total_price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}