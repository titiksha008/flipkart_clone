import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  FiMapPin, FiCreditCard, FiTruck, FiShield,
  FiCheckCircle, FiChevronDown, FiChevronUp,
  FiSmartphone, FiDollarSign, FiLock, FiPlus, FiCheck,
} from 'react-icons/fi';

// ─── Step Header ──────────────────────────────────────────────────────────────
function StepHeader({ num, title, subtitle, done, active }) {
  return (
    <div className={`px-4 py-3 flex items-center gap-3 ${active ? 'bg-[#2874f0]' : 'bg-white border-b border-gray-100'}`}>
      <span className={`text-xs font-bold w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 ${
        active ? 'bg-white text-[#2874f0]' : done ? 'bg-[#388e3c] text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {done ? '✓' : num}
      </span>
      <div className="flex-1">
        <span className={`text-sm font-bold ${active ? 'text-white' : done ? 'text-gray-800' : 'text-gray-400'}`}>
          {title}
        </span>
        {subtitle && <span className={`text-xs ml-2 ${active ? 'text-blue-100' : 'text-gray-400'}`}>{subtitle}</span>}
      </div>
    </div>
  );
}

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

// ─── Card helpers ─────────────────────────────────────────────────────────────
function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + ' / ' + digits.slice(2);
  return digits;
}
function getCardType(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'VISA';
  if (/^5[1-5]/.test(n)) return 'MC';
  if (/^6/.test(n)) return 'RUPAY';
  if (/^3[47]/.test(n)) return 'AMEX';
  return null;
}
const CARD_LOGOS = {
  VISA:  { label: 'VISA',  color: '#1a1f71' },
  MC:    { label: 'MC',    color: '#eb001b' },
  RUPAY: { label: 'RuPay', color: '#1a8c3e' },
  AMEX:  { label: 'AMEX',  color: '#007bc1' },
};

// ─── Demo Modal ───────────────────────────────────────────────────────────────
function DemoModal({ method, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white rounded-md shadow-2xl p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-base font-bold text-gray-800 mb-1">Demo Payment</h3>
        <p className="text-sm text-gray-500 mb-4">
          This is a demo app — no real payment will be processed.<br />
          Method: <strong>{method}</strong>
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-sm text-sm font-semibold hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-[#2874f0] text-white py-2 rounded-sm text-sm font-bold hover:bg-blue-700">Confirm Order</button>
        </div>
      </div>
    </div>
  );
}

// ─── Address Selector ─────────────────────────────────────────────────────────
function AddressSelector({ savedAddresses, selectedIdx, onSelect, onAddNew }) {
  return (
    <div className="space-y-2">
      {savedAddresses.map((addr, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={`flex items-start gap-3 border rounded-sm p-3 cursor-pointer transition-colors ${
            selectedIdx === i
              ? 'border-[#2874f0] bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 bg-white'
          }`}
        >
          {/* Radio dot */}
          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selectedIdx === i ? 'border-[#2874f0]' : 'border-gray-300'
          }`}>
            {selectedIdx === i && <div className="w-2 h-2 rounded-full bg-[#2874f0]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                addr.type === 'Work' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>{addr.type}</span>
            </div>
            <p className="text-sm font-medium text-gray-800">{addr.line}</p>
            {addr.city && <p className="text-xs text-gray-500 mt-0.5">{addr.city} — {addr.pin}</p>}
          </div>
          {selectedIdx === i && <FiCheck size={15} className="text-[#2874f0] flex-shrink-0 mt-0.5" />}
        </div>
      ))}

      {/* Add new address tile */}
      <button
        onClick={onAddNew}
        className="w-full flex items-center gap-2 border border-dashed border-[#2874f0] rounded-sm p-3 text-[#2874f0] text-sm font-semibold hover:bg-blue-50 transition-colors"
      >
        <FiPlus size={15} />
        Add a new address
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);

  // Load saved addresses from localStorage (same source as ProfilePage)
  const [savedAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user_addresses') || '[]'); }
    catch { return []; }
  });

  const [selectedAddrIdx, setSelectedAddrIdx] = useState(savedAddresses.length > 0 ? 0 : -1);
  const [showNewAddrForm, setShowNewAddrForm] = useState(savedAddresses.length === 0);

  // Manual form (used when adding new addr or no saved addrs exist)
  const [form, setForm] = useState({ name: '', phone: '', pincode: '', address: '', city: '', state: '' });

  const [payment, setPayment] = useState('COD');
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showItems, setShowItems] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [cardError, setCardError] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  const [selectedBank, setSelectedBank] = useState('');
  const [bankError, setBankError] = useState('');

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

  // Build shipping string for API
  const buildShipping = () => {
    if (!showNewAddrForm && selectedAddrIdx >= 0 && savedAddresses[selectedAddrIdx]) {
      const a = savedAddresses[selectedAddrIdx];
      return `${a.line}, ${a.city} - ${a.pin}`;
    }
    return `${form.name}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, Ph: ${form.phone}`;
  };

  // Summary for collapsed step 2
  const addressSummary = () => {
    if (!showNewAddrForm && selectedAddrIdx >= 0 && savedAddresses[selectedAddrIdx]) {
      const a = savedAddresses[selectedAddrIdx];
      return { name: `${a.type} address`, line: `${a.line}, ${a.city} - ${a.pin}`, phone: '' };
    }
    return { name: form.name, line: `${form.address}, ${form.city} - ${form.pincode}`, phone: form.phone };
  };

  const handleAddressContinue = () => {
    // Using a saved address — no validation needed
    if (!showNewAddrForm && selectedAddrIdx >= 0) {
      setError('');
      setStep(3);
      return;
    }
    if (!form.name || !form.address || !form.city || !form.pincode) {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    setStep(3);
  };

  const handlePayClick = () => {
    setError(''); setCardError(''); setUpiError(''); setBankError('');
    if (payment === 'UPI' && (!upiId.trim() || !upiId.includes('@'))) {
      setUpiError('Please enter a valid UPI ID (e.g. name@upi)'); return;
    }
    if (payment === 'CARD') {
      if (card.number.replace(/\s/g, '').length < 16) { setCardError('Enter a valid 16-digit card number'); return; }
      if (card.expiry.replace(/\s/g, '').length < 5)  { setCardError('Enter a valid expiry date'); return; }
      if (card.cvv.length < 3)   { setCardError('Enter a valid CVV'); return; }
      if (!card.name.trim())     { setCardError('Enter the name on card'); return; }
    }
    if (payment === 'NET_BANKING' && !selectedBank) {
      setBankError('Please select a bank'); return;
    }
    setShowModal(true);
  };

  const DB_PAYMENT_MAP = { UPI: 'UPI', CARD: 'CARD', NET_BANKING: 'NET_BANKING', COD: 'COD' };

  const handleSubmit = async () => {
    setShowModal(false);
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', {
        shipping_address: buildShipping(),
        payment_method: DB_PAYMENT_MAP[payment] || 'COD',
      });
      navigate(`/order-confirmation/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardType  = getCardType(card.number);
  const cardLogo  = cardType ? CARD_LOGOS[cardType] : null;
  const paymentOptions = [
    { value: 'UPI',         label: 'UPI',                      icon: FiSmartphone, recommended: true },
    { value: 'CARD',        label: 'Credit / Debit / ATM Card', icon: FiCreditCard },
    { value: 'NET_BANKING', label: 'Net Banking',               icon: FiDollarSign },
    { value: 'COD',         label: 'Cash on Delivery',          icon: FiDollarSign },
  ];
  const paymentLabel = paymentOptions.find(p => p.value === payment)?.label || payment;
  const summary = addressSummary();

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      {showModal && (
        <DemoModal method={paymentLabel} onClose={() => setShowModal(false)} onConfirm={handleSubmit} />
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="space-y-3">

            {/* Step 1 */}
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

            {/* Step 2: Address */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <StepHeader num="2" title="DELIVERY ADDRESS" active={step === 2} done={step > 2} />

              {step === 2 && (
                <div className="p-4 sm:p-5">
                  {error && (
                    <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 p-3 rounded-sm">{error}</p>
                  )}

                  {/* Saved addresses */}
                  {savedAddresses.length > 0 && (
                    <>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Your Saved Addresses
                      </p>
                      <AddressSelector
                        savedAddresses={savedAddresses}
                        selectedIdx={showNewAddrForm ? -1 : selectedAddrIdx}
                        onSelect={(i) => { setSelectedAddrIdx(i); setShowNewAddrForm(false); setError(''); }}
                        onAddNew={() => { setSelectedAddrIdx(-1); setShowNewAddrForm(true); setError(''); }}
                      />
                    </>
                  )}

                  {/* New address form */}
                  {showNewAddrForm && (
                    <div className={savedAddresses.length > 0 ? 'mt-4 border border-dashed border-[#2874f0] rounded-sm p-4 bg-blue-50' : ''}>
                      {savedAddresses.length > 0 && (
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <FiMapPin size={13} className="text-[#2874f0]" /> New Address
                          </p>
                          <button
                            onClick={() => { setShowNewAddrForm(false); setSelectedAddrIdx(0); setError(''); }}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                          >Cancel</button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Full Name" required value={form.name} onChange={set('name')} placeholder="Enter full name" />
                        <Input label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" />
                        <Input label="Pincode" required value={form.pincode} onChange={set('pincode')} placeholder="6-digit pincode" maxLength={6} />
                        <Input label="City / District / Town" required value={form.city} onChange={set('city')} placeholder="Enter city" />
                        <Input label="State" value={form.state} onChange={set('state')} placeholder="Enter state" />
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={form.address} onChange={set('address')}
                            placeholder="Flat / House No, Floor, Building, Street, Area"
                            rows={3}
                            className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0] transition-colors resize-none bg-white"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Type of address</p>
                        <div className="flex gap-3">
                          {['Home', 'Work'].map((t) => (
                            <label key={t} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-[#2874f0] text-sm transition-colors bg-white">
                              <input type="radio" name="addrtype" value={t} defaultChecked={t === 'Home'} className="accent-[#2874f0]" />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

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
                    <div className="flex items-center gap-2 mb-1">
                      <FiMapPin size={13} className="text-[#2874f0]" />
                      <p className="text-sm font-semibold text-gray-800">{summary.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 max-w-sm">{summary.line}</p>
                    {summary.phone && <p className="text-xs text-gray-500 mt-0.5">📞 {summary.phone}</p>}
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs font-bold text-[#2874f0] border border-[#2874f0] px-3 py-1.5 rounded-sm hover:bg-blue-50 flex-shrink-0 ml-3">
                    CHANGE
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <StepHeader num="3" title="PAYMENT OPTIONS" active={step === 3} done={false} />

              {step === 3 && (
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-56 border-b sm:border-b-0 sm:border-r border-gray-100">
                    {paymentOptions.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => { setPayment(p.value); setError(''); setCardError(''); setUpiError(''); setBankError(''); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-50 transition-colors ${
                          payment === p.value
                            ? 'bg-blue-50 border-r-2 border-r-[#2874f0] text-[#2874f0] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <p.icon size={16} className="flex-shrink-0" />
                        <span className="flex-1">{p.label}</span>
                        {p.recommended && (
                          <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded">RECOMMENDED</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-4 sm:p-5">

                    {payment === 'COD' && (
                      <div>
                        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-sm p-3 mb-4">
                          <span className="text-yellow-600 text-xl">⚠️</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                            <p className="text-xs text-gray-600 mt-1">Cash / UPI accepted at delivery. No extra charges.</p>
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
                        <div className="relative">
                          <FiSmartphone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            value={upiId}
                            onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                            placeholder="yourname@upi"
                            className={`w-full border rounded-sm pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${upiError ? 'border-red-400' : 'border-gray-300 focus:border-[#2874f0] focus:ring-[#2874f0]'}`}
                          />
                        </div>
                        {upiError && <p className="text-red-500 text-xs mt-1">{upiError}</p>}
                        <p className="text-xs text-gray-400 mt-2">Demo only — no actual payment will occur</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                            <button key={app} onClick={() => { setUpiId(`demo@${app.toLowerCase()}`); setUpiError(''); }} className="text-xs border border-gray-200 px-2.5 py-1 rounded hover:border-[#2874f0] hover:text-[#2874f0] transition-colors">{app}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {payment === 'CARD' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-gray-800">Credit / Debit Card</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400"><FiLock size={11} /> Secure</div>
                        </div>
                        {/* Card preview */}
                        <div className="rounded-lg p-4 mb-4 text-white" style={{ background: cardLogo ? `linear-gradient(135deg, ${cardLogo.color}cc, ${cardLogo.color})` : 'linear-gradient(135deg, #2874f0cc, #2874f0)' }}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-5 bg-yellow-300 rounded-sm opacity-80" />
                            {cardLogo && <span className="font-bold text-sm tracking-widest opacity-90">{cardLogo.label}</span>}
                          </div>
                          <p className="tracking-widest text-sm font-mono mb-3 opacity-90">{card.number || '•••• •••• •••• ••••'}</p>
                          <div className="flex justify-between text-xs">
                            <span className="opacity-70">{card.name || 'CARD HOLDER'}</span>
                            <span className="opacity-70">{card.expiry || 'MM/YY'}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Card Number <span className="text-red-500">*</span></label>
                            <input value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))} placeholder="1234 5678 9012 3456" maxLength={19} className={`w-full border rounded-sm px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 transition-colors ${cardError ? 'border-red-400' : 'border-gray-300 focus:border-[#2874f0] focus:ring-[#2874f0]'}`} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1.5">Expiry <span className="text-red-500">*</span></label>
                              <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))} placeholder="MM / YY" maxLength={7} className={`w-full border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${cardError ? 'border-red-400' : 'border-gray-300 focus:border-[#2874f0] focus:ring-[#2874f0]'}`} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1.5">CVV <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <input value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="•••" maxLength={4} type={showCvv ? 'text' : 'password'} className={`w-full border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors pr-8 ${cardError ? 'border-red-400' : 'border-gray-300 focus:border-[#2874f0] focus:ring-[#2874f0]'}`} />
                                <button type="button" onClick={() => setShowCvv((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showCvv ? '🙈' : '👁'}</button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Name on Card <span className="text-red-500">*</span></label>
                            <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))} placeholder="AS ON CARD" className={`w-full border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${cardError ? 'border-red-400' : 'border-gray-300 focus:border-[#2874f0] focus:ring-[#2874f0]'}`} />
                          </div>
                        </div>
                        {cardError && <p className="text-red-500 text-xs mt-2 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">{cardError}</p>}
                        <div className="flex items-center gap-2 mt-3">
                          <FiLock size={11} className="text-green-600" />
                          <p className="text-xs text-gray-400">Demo only — no actual charge. Use any test number.</p>
                        </div>
                        <button onClick={() => setCard({ number: '4111 1111 1111 1111', expiry: '12 / 27', cvv: '123', name: 'TEST USER' })} className="mt-2 text-xs text-[#2874f0] hover:underline font-medium">
                          + Use test card
                        </button>
                      </div>
                    )}

                    {payment === 'NET_BANKING' && (
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-3">Select Bank</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {[{ id: 'SBI', label: 'SBI Bank' }, { id: 'HDFC', label: 'HDFC Bank' }, { id: 'ICICI', label: 'ICICI Bank' }, { id: 'AXIS', label: 'Axis Bank' }].map((bank) => (
                            <label key={bank.id} className={`flex items-center gap-2 border rounded px-3 py-2.5 cursor-pointer text-sm transition-colors ${selectedBank === bank.id ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-semibold' : 'border-gray-200 hover:border-[#2874f0] text-gray-700'}`}>
                              <input type="radio" name="bank" value={bank.id} checked={selectedBank === bank.id} onChange={() => { setSelectedBank(bank.id); setBankError(''); }} className="accent-[#2874f0]" />
                              {bank.label}
                            </label>
                          ))}
                        </div>
                        {bankError && <p className="text-red-500 text-xs mb-2">{bankError}</p>}
                        <p className="text-xs text-gray-400">Demo only — no actual payment will occur</p>
                      </div>
                    )}

                    {error && <p className="text-red-500 text-sm mt-3 bg-red-50 border border-red-100 p-3 rounded-sm">{error}</p>}

                    <button
                      onClick={handlePayClick}
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Details</h3>
              </div>
              <div className="p-4">
                <button onClick={() => setShowItems((v) => !v)} className="w-full flex items-center justify-between text-sm text-gray-700 mb-3">
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
                        const parsed = Array.isArray(item.product.images) ? item.product.images : JSON.parse(item.product.images || '[]');
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
                    <span>Discount</span><span>− ₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Charges</span><span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-dashed pt-3 flex justify-between font-bold text-base text-gray-900">
                    <span>Total Amount</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                {savings > 0 && (
                  <p className="text-green-600 text-sm font-semibold mt-3 pt-3 border-t border-dashed">
                    You will save ₹{savings.toLocaleString()} on this order
                  </p>
                )}
              </div>
            </div>

            {/* Saved addresses hint in sidebar */}
            {savedAddresses.length > 0 && step === 2 && (
              <div className="bg-white rounded-sm shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin size={13} className="text-[#2874f0]" />
                  <p className="text-xs font-bold text-gray-600">
                    {savedAddresses.length} saved address{savedAddresses.length > 1 ? 'es' : ''} available
                  </p>
                </div>
                <p className="text-xs text-gray-400 mb-2">Pick from your saved addresses or add a new one.</p>
                <button onClick={() => navigate('/profile?tab=addresses')} className="text-xs text-[#2874f0] hover:underline font-medium">
                  Manage addresses →
                </button>
              </div>
            )}

            <div className="bg-white rounded-sm shadow-sm p-4 space-y-3">
              {[
                { icon: FiShield, text: 'Safe and Secure Payments. Easy returns. 100% Authentic.' },
                { icon: FiTruck,  text: 'Fast delivery with real-time order tracking.' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <Icon size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />{text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}