import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  FiMapPin, FiCreditCard, FiTruck, FiShield,
  FiCheckCircle, FiChevronDown, FiChevronUp,
  FiSmartphone, FiDollarSign,
} from 'react-icons/fi';

// ─── Step Header ──────────────────────────────────────────────────────────────
function StepHeader({ num, title, subtitle, done, active }) {
  return (
    <div
      className={`px-4 py-3 flex items-center gap-3 ${
        active ? 'bg-[#2874f0]' : done ? 'bg-white border-b border-gray-100' : 'bg-white border-b border-gray-100'
      }`}
    >
      <span
        className={`text-xs font-bold w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 ${
          active ? 'bg-white text-[#2874f0]' : done ? 'bg-[#388e3c] text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        {done ? '✓' : num}
      </span>
      <div className="flex-1">
        <span className={`text-sm font-bold ${active ? 'text-white' : done ? 'text-gray-800' : 'text-gray-400'}`}>
          {title}
        </span>
        {subtitle && (
          <span className={`text-xs ml-2 ${active ? 'text-blue-100' : 'text-gray-400'}`}>{subtitle}</span>
        )}
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0] transition-colors"
        {...props}
      />
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);

  const [form, setForm] = useState({ name: '', phone: '', pincode: '', address: '', city: '', state: '' });
  const [payment, setPayment] = useState('COD');
  const [step, setStep] = useState(2); // 1=login, 2=address, 3=payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showItems, setShowItems] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const getPrice = (item) =>
    Math.round(Number(item.product.price) * (1 - Number(item.product.discount || 0) / 100));

  const totalMrp = useMemo(
    () => items.reduce((s, i) => s + Number(i.product.price || 0) * Number(i.quantity || 0), 0),
    [items]
  );
  const total = useMemo(
    () => items.reduce((s, i) => s + getPrice(i) * i.quantity, 0),
    [items]
  );
  const savings = totalMrp - total;

  const handleAddressContinue = () => {
    if (!form.name || !form.address || !form.city || !form.pincode) {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
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

  const paymentOptions = [
    {
      value: 'UPI',
      label: 'UPI',
      icon: FiSmartphone,
      desc: 'Google Pay, PhonePe, Paytm & more',
      recommended: true,
    },
    {
      value: 'CARD',
      label: 'Credit / Debit / ATM Card',
      icon: FiCreditCard,
      desc: 'Visa, Mastercard, Rupay accepted',
    },
    {
      value: 'NET_BANKING',
      label: 'Net Banking',
      icon: FiDollarSign,
      desc: 'All major banks supported',
    },
    {
      value: 'COD',
      label: 'Cash on Delivery',
      icon: FiDollarSign,
      desc: 'Pay when your order arrives',
    },
  ];

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="space-y-3">

            {/* Step 1: Login (always done) */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <StepHeader num="1" title="LOGIN" subtitle="Default user active" done />
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Checking out as default user</p>
                  <p className="text-xs text-gray-400 mt-0.5">Login is auto-applied in demo mode</p>
                </div>
                <FiCheckCircle className="text-green-600 text-2xl flex-shrink-0" />
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <StepHeader
                num="2"
                title="DELIVERY ADDRESS"
                active={step === 2}
                done={step > 2}
              />

              {step === 2 && (
                <div className="p-4 sm:p-5">
                  {error && (
                    <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 p-3 rounded-sm">
                      {error}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" required value={form.name} onChange={set('name')} placeholder="Enter full name" />
                    <Input label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" />
                    <Input label="Pincode" required value={form.pincode} onChange={set('pincode')} placeholder="6-digit pincode" maxLength={6} />
                    <Input label="City / District / Town" required value={form.city} onChange={set('city')} placeholder="Enter city" />
                    <Input label="State" value={form.state} onChange={set('state')} placeholder="Enter state" />
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1.5">
                        Address (House No., Building, Street) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.address}
                        onChange={set('address')}
                        placeholder="Flat / House No, Floor, Building, Street, Area"
                        rows={3}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Address type */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Type of address</p>
                    <div className="flex gap-3">
                      {['Home', 'Work'].map((t) => (
                        <label key={t} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-[#2874f0] text-sm transition-colors">
                          <input type="radio" name="addrtype" value={t} defaultChecked={t === 'Home'} className="accent-[#2874f0]" />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddressContinue}
                    className="mt-5 bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 px-10 rounded-sm transition-colors text-sm"
                  >
                    DELIVER HERE
                  </button>
                </div>
              )}

              {step > 2 && (
                <div className="px-5 py-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{form.name}</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm">{form.address}, {form.city} - {form.pincode}</p>
                    {form.phone && <p className="text-xs text-gray-500 mt-0.5">📞 {form.phone}</p>}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#2874f0] border border-[#2874f0] px-3 py-1.5 rounded-sm hover:bg-blue-50 flex-shrink-0 ml-3"
                  >
                    CHANGE
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <StepHeader
                num="3"
                title="PAYMENT OPTIONS"
                active={step === 3}
                done={false}
              />

              {step === 3 && (
                <div className="flex flex-col sm:flex-row">
                  {/* Payment method list */}
                  <div className="sm:w-56 border-b sm:border-b-0 sm:border-r border-gray-100">
                    {paymentOptions.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPayment(p.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-50 transition-colors ${
                          payment === p.value
                            ? 'bg-blue-50 border-r-2 border-r-[#2874f0] text-[#2874f0] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <p.icon size={16} className="flex-shrink-0" />
                        <span className="flex-1">{p.label}</span>
                        {p.recommended && (
                          <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded">
                            RECOMMENDED
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Payment detail panel */}
                  <div className="flex-1 p-4 sm:p-5">
                    {payment === 'COD' && (
                      <div>
                        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-sm p-3 mb-4">
                          <span className="text-yellow-600 text-xl">⚠️</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Cash / UPI accepted at delivery. No extra charges.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <input type="checkbox" defaultChecked className="accent-[#2874f0]" />
                          <span>I agree to Terms & Conditions</span>
                        </div>
                      </div>
                    )}

                    {payment === 'UPI' && (
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-3">Pay via UPI</p>
                        <input
                          placeholder="Enter UPI ID (e.g. name@upi)"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none mb-2"
                        />
                        <p className="text-xs text-gray-400 mb-4">This is a demo — no actual payment will occur</p>
                      </div>
                    )}

                    {payment === 'CARD' && (
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-3">Credit / Debit Card</p>
                        <div className="space-y-3">
                          <input placeholder="Card number" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none" />
                          <div className="grid grid-cols-2 gap-3">
                            <input placeholder="MM / YY" className="border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none" />
                            <input placeholder="CVV" className="border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none" />
                          </div>
                          <input placeholder="Name on card" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none" />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Demo only — no actual charge will occur</p>
                      </div>
                    )}

                    {payment === 'NET_BANKING' && (
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-3">Select Bank</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) => (
                            <label key={bank} className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 cursor-pointer hover:border-[#2874f0] text-sm">
                              <input type="radio" name="bank" value={bank} className="accent-[#2874f0]" />
                              {bank} Bank
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">Demo only — no actual payment will occur</p>
                      </div>
                    )}

                    {error && (
                      <p className="text-red-500 text-sm mt-3 bg-red-50 border border-red-100 p-3 rounded-sm">
                        {error}
                      </p>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={loading || items.length === 0}
                      className="mt-5 bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 px-10 rounded-sm transition-colors disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Placing Order...' : `PAY ₹${total.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}

              {step < 3 && (
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-400">Complete delivery address first</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Order Summary ──────────────────────────────────────── */}
          <div className="space-y-3 lg:sticky lg:top-4 self-start">
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Price Details
                </h3>
              </div>

              <div className="p-4">
                {/* Items toggle */}
                <button
                  onClick={() => setShowItems((v) => !v)}
                  className="w-full flex items-center justify-between text-sm text-gray-700 mb-3"
                >
                  <span>Price ({items.length} items)</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">₹{totalMrp.toLocaleString()}</span>
                    {showItems ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </div>
                </button>

                {showItems && (
                  <div className="bg-gray-50 rounded p-3 mb-3 max-h-48 overflow-y-auto space-y-2">
                    {items.map((item) => {
                      let img = 'https://via.placeholder.com/48';
                      try {
                        const parsed = Array.isArray(item.product.images)
                          ? item.product.images
                          : JSON.parse(item.product.images || '[]');
                        if (parsed[0]) img = parsed[0];
                      } catch {}
                      return (
                        <div key={item.id} className="flex items-center gap-2">
                          <img src={img} alt="" className="w-10 h-10 object-contain border border-gray-200 rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-gray-500">× {item.quantity}</p>
                          </div>
                          <span className="text-xs font-medium">₹{(getPrice(item) * item.quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-2 text-sm border-t pt-3">
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>− ₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-dashed pt-3 flex justify-between font-bold text-base text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {savings > 0 && (
                  <p className="text-green-600 text-sm font-semibold mt-3 pt-3 border-t border-dashed">
                    You will save ₹{savings.toLocaleString()} on this order
                  </p>
                )}
              </div>
            </div>

            {/* Trust */}
            <div className="bg-white rounded-sm shadow-sm p-4 space-y-3">
              {[
                { icon: FiShield, text: 'Safe and Secure Payments. Easy returns. 100% Authentic.' },
                { icon: FiTruck, text: 'Fast delivery with real-time order tracking.' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <Icon size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}