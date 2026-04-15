import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiShield,
  FiCheckCircle,
} from 'react-icons/fi';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
  });
  const [payment, setPayment] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPrice = (item) =>
    Math.round(Number(item.product.price) * (1 - Number(item.product.discount || 0) / 100));

  const totalMrp = useMemo(
    () =>
      items.reduce(
        (s, i) => s + Number(i.product.price || 0) * Number(i.quantity || 0),
        0
      ),
    [items]
  );

  const total = useMemo(
    () => items.reduce((s, i) => s + getPrice(i) * i.quantity, 0),
    [items]
  );

  const totalSavings = useMemo(
    () =>
      items.reduce(
        (s, i) => s + (Number(i.product.price) - getPrice(i)) * i.quantity,
        0
      ),
    [items]
  );

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.city || !form.pincode) {
      setError('Please fill all required fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const shipping = `${form.name}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, Ph: ${form.phone}`;

      const res = await api.post('/orders', {
        shipping_address: shipping,
        payment_method: payment,
      });

      navigate(`/order-confirmation/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Left side */}
        <div className="space-y-4">
          {/* Login status style block */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
              <span className="bg-white text-[#2874f0] text-xs font-bold w-5 h-5 rounded-sm flex items-center justify-center">
                1
              </span>
              <span className="text-sm font-semibold">LOGIN</span>
              <span className="text-xs opacity-90">Default user active</span>
            </div>
            <div className="px-4 py-4 text-sm text-gray-700 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-semibold">You are checking out as the default user.</span>
                <p className="text-xs text-gray-500 mt-1">
                  Login is disabled for this assignment build.
                </p>
              </div>
              <FiCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
              <span className="bg-white text-[#2874f0] text-xs font-bold w-5 h-5 rounded-sm flex items-center justify-center">
                2
              </span>
              <span className="text-sm font-semibold flex items-center gap-2">
                <FiMapPin className="text-sm" />
                DELIVERY ADDRESS
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {error && (
                <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 p-3 rounded-sm">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name *', placeholder: 'Enter your name' },
                  { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number' },
                  { key: 'pincode', label: 'Pincode *', placeholder: '6-digit pincode' },
                  { key: 'city', label: 'City *', placeholder: 'Enter city' },
                  { key: 'state', label: 'State', placeholder: 'Enter state' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
                    <input
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none"
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Address (House No, Street) *
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Enter flat no, street, area"
                    rows={3}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
              <span className="bg-white text-[#2874f0] text-xs font-bold w-5 h-5 rounded-sm flex items-center justify-center">
                3
              </span>
              <span className="text-sm font-semibold flex items-center gap-2">
                <FiCreditCard className="text-sm" />
                PAYMENT OPTIONS
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {[
                {
                  value: 'COD',
                  label: 'Cash on Delivery',
                  desc: 'Pay when your order is delivered',
                },
                {
                  value: 'UPI',
                  label: 'UPI / Net Banking',
                  desc: 'Demo mode — payment simulated',
                },
                {
                  value: 'CARD',
                  label: 'Credit / Debit Card',
                  desc: 'Demo mode — payment simulated',
                },
              ].map((p) => (
                <label
                  key={p.value}
                  className={`flex items-start gap-3 p-3 border rounded-sm cursor-pointer transition-colors ${
                    payment === p.value
                      ? 'border-[#2874f0] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.value}
                    checked={payment === p.value}
                    onChange={() => setPayment(p.value)}
                    className="accent-[#2874f0] mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{p.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right side summary */}
        <div className="bg-white rounded-sm shadow-sm h-fit lg:sticky lg:top-20 overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Price Details
            </h3>
          </div>

          <div className="p-4">
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-700 line-clamp-2 flex-1">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    ₹{(getPrice(item) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Price ({items.length} items)</span>
                <span>₹{totalMrp.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{totalSavings.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>

              <div className="flex justify-between text-green-600 text-xs pt-1">
                <span>You save</span>
                <span className="font-semibold">₹{totalSavings.toLocaleString()}</span>
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-base text-gray-900">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-green-600 text-sm font-medium mt-4">
              You will save ₹{totalSavings.toLocaleString()} on this order
            </p>

            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <FiShield className="text-sm" />
                <span>Safe and secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-sm" />
                <span>Fast delivery with order tracking</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || items.length === 0}
              className="w-full bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 mt-5 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Placing Order...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}