import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useSelector(s => s.cart);
  const [form, setForm] = useState({ name: '', phone: '', pincode: '', address: '', city: '', state: '' });
  const [payment, setPayment] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPrice = (item) => Math.round(item.product.price * (1 - item.product.discount / 100));
  const total = items.reduce((s, i) => s + getPrice(i) * i.quantity, 0);

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.city || !form.pincode) {
      setError('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      const shipping = `${form.name}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, Ph: ${form.phone}`;
      const res = await api.post('/orders', { shipping_address: shipping, payment_method: payment });
      navigate(`/order-confirmation/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏠 Delivery Address</h2>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name *', placeholder: 'Enter your name' },
                { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number' },
                { key: 'pincode', label: 'Pincode *', placeholder: '6-digit pincode' },
                { key: 'city', label: 'City *', placeholder: 'Enter city' },
                { key: 'state', label: 'State', placeholder: 'Enter state' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Address (House No, Street) *</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter flat no, street, area"
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-sm shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">💳 Payment Method</h2>
            <div className="space-y-2">
              {[
                { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                { value: 'UPI', label: 'UPI / Net Banking', desc: 'Instant & secure' },
                { value: 'CARD', label: 'Credit / Debit Card', desc: 'All major cards accepted' },
              ].map(p => (
                <label key={p.value} className={`flex items-center gap-3 p-3 border rounded cursor-pointer ${payment === p.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="payment" value={p.value} checked={payment === p.value} onChange={() => setPayment(p.value)} className="accent-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-sm shadow-sm p-4 self-start sticky top-20">
          <h3 className="font-bold text-gray-800 border-b pb-3 mb-3">Order Summary</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 line-clamp-1 flex-1 pr-2">{item.product.name} × {item.quantity}</span>
                <span className="font-semibold flex-shrink-0">₹{(getPrice(item) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-base mb-4">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || items.length === 0}
              className="w-full bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'CONFIRM ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}