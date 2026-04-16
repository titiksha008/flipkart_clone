import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => { setOrder(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
      <div className="bg-white rounded-sm shadow-sm p-10 text-center">
        <p className="text-gray-500 mb-4">Order not found</p>
        <button onClick={() => navigate('/products')} className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-bold text-sm">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  const getImage = (item) => {
    try {
      const p = Array.isArray(item?.product?.images)
        ? item.product.images
        : JSON.parse(item?.product?.images || '[]');
      return p[0] || '';
    } catch { return ''; }
  };

  const statusIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const safeSIdx = statusIdx === -1 ? 0 : statusIdx;

  const estimatedDate = new Date(
    order.createdAt ? new Date(order.createdAt).getTime() + 5 * 86400000 : Date.now() + 5 * 86400000
  ).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const totalItems = order.orderItems?.reduce((s, i) => s + Number(i.quantity), 0) || 0;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 space-y-3">

        {/* ── Success Banner ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#388e3c] px-5 sm:px-6 py-4 sm:py-5 flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#388e3c] font-bold text-lg sm:text-xl">✓</span>
            </div>
            <div>
              <h1 className="text-white text-base sm:text-lg font-bold">
                Order #{order.id} Confirmed!
              </h1>
              <p className="text-green-100 text-xs sm:text-sm mt-1">
                Your order has been placed and will be delivered by{' '}
                <span className="font-semibold text-white">{estimatedDate}</span>
              </p>
            </div>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            {[
              {
                label: 'Order ID',
                value: `#${order.id}`,
              },
              {
                label: 'Payment',
                value: order.payment_method,
                sub: order.payment_status,
                subColor: order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500',
              },
              {
                label: 'Total',
                value: `₹${Number(order.total_price).toLocaleString('en-IN')}`,
                sub: `${totalItems} item${totalItems !== 1 ? 's' : ''}`,
                subColor: 'text-gray-400',
              },
            ].map(({ label, value, sub, subColor }) => (
              <div key={label} className="px-3 sm:px-5 py-3 sm:py-4">
                <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{value}</p>
                {sub && <p className={`text-[10px] sm:text-xs capitalize ${subColor}`}>{sub}</p>}
              </div>
            ))}
          </div>

          {/* Order Progress Tracker */}
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Order Status</p>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-[#388e3c] transition-all duration-500"
                  style={{ width: `${(safeSIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between relative z-10">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= safeSIdx;
                  const active = i === safeSIdx;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                          done
                            ? 'bg-[#388e3c] border-[#388e3c] text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        } ${active ? 'ring-2 ring-[#388e3c] ring-offset-2' : ''}`}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                      <p className={`text-[9px] sm:text-[11px] text-center leading-tight max-w-[56px] ${
                        done ? 'text-[#388e3c] font-semibold' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Order Items ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">
              Items in Your Order ({totalItems})
            </h2>
            <button className="text-xs text-[#2874f0] font-semibold flex items-center gap-1 hover:underline">
              <FiDownload size={12} /> Invoice
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {order.orderItems?.map((item) => (
              <div
                key={item.id}
                className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-100 rounded flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                  onClick={() => navigate(`/products/${item.product_id}`)}
                >
                  <img
                    src={getImage(item) || 'https://via.placeholder.com/80'}
                    alt={item.product?.name}
                    className="max-w-full max-h-full object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#2874f0]"
                    onClick={() => navigate(`/products/${item.product_id}`)}
                  >
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Qty: {item.quantity} × ₹{Number(item.price_at_purchase).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${item.product_id}`)}
                    className="text-xs text-[#2874f0] font-semibold mt-1 hover:underline flex items-center gap-1"
                  >
                    <FiRefreshCw size={10} /> Buy Again
                  </button>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm text-gray-900">
                    ₹{(Number(item.price_at_purchase) * Number(item.quantity)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-medium">Order Total</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                ₹{Number(order.total_price).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Payment</p>
              <p className="text-sm font-semibold text-gray-700">{order.payment_method}</p>
              <p className={`text-xs capitalize font-semibold ${
                order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'
              }`}>{order.payment_status}</p>
            </div>
          </div>
        </div>

        {/* ── Delivery Address ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Delivery Address</h2>
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">📍</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {order.shipping_address?.split(',')[0]}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {order.shipping_address}
              </p>
            </div>
          </div>
        </div>

        {/* ── CTA Buttons ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="border-2 border-[#2874f0] text-[#2874f0] py-3 font-bold rounded-sm hover:bg-blue-50 transition-colors text-xs sm:text-sm"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#fb641b] hover:bg-[#f05b10] text-white py-3 font-bold rounded-sm transition-colors text-xs sm:text-sm"
          >
            Continue Shopping
          </button>
        </div>

        {/* ── Help ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-sm shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Need help with your order?</p>
            <p className="text-xs text-gray-500 mt-0.5">Our support team is available 24×7</p>
          </div>
          <button className="border border-[#2874f0] text-[#2874f0] px-5 py-2 text-xs font-bold rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
            Get Help
          </button>
        </div>

      </div>
    </div>
  );
}