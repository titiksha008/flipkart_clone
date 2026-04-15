import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => { setOrder(r.data.data); setLoading(false); });
  }, [id]);

  if (loading) return <Spinner />;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-6">Order ID: <span className="font-bold text-gray-800">#{order?.id}</span></p>

          <div className="text-left border rounded p-4 mb-6">
            <h3 className="font-bold mb-3 text-gray-700">Order Summary</h3>
            {order?.orderItems?.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                <span className="text-gray-600">{item.product?.name} × {item.quantity}</span>
                <span className="font-semibold">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base mt-3 pt-2 border-t">
              <span>Total Paid</span>
              <span>₹{Number(order?.total_price).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded p-3 mb-6 text-sm text-left">
            <p className="font-semibold text-gray-700 mb-1">📦 Delivery Address:</p>
            <p className="text-gray-600">{order?.shipping_address}</p>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/orders')} className="border border-[#2874f0] text-[#2874f0] px-6 py-2 font-semibold rounded-sm hover:bg-blue-50">
              My Orders
            </button>
            <button onClick={() => navigate('/products')} className="bg-[#2874f0] text-white px-6 py-2 font-semibold rounded-sm hover:bg-blue-700">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}