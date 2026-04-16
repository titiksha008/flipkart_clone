import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiUser, FiPackage, FiHeart, FiMapPin, FiEdit2, FiCheck, FiX,
  FiShoppingCart, FiChevronRight, FiGift, FiShield, FiMenu,
  FiLogOut, FiStar, FiSettings, FiBell,
} from 'react-icons/fi';
import { updateProfile, fetchMe } from '../store/slices/authSlice';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const NAV_ITEMS = [
  {
    section: 'Account Settings',
    items: [
      { key: 'profile', label: 'My Profile', icon: FiUser },
      { key: 'addresses', label: 'Manage Addresses', icon: FiMapPin },
      { key: 'notifications', label: 'Notifications', icon: FiBell },
    ],
  },
  {
    section: 'My Activity',
    items: [
      { key: 'orders', label: 'My Orders', icon: FiPackage },
      { key: 'wishlist', label: 'My Wishlist', icon: FiHeart },
      { key: 'reviews', label: 'My Reviews & Ratings', icon: FiStar },
    ],
  },
  {
    section: 'Payments & Rewards',
    items: [
      { key: 'coupons', label: 'Gift Cards & Coupons', icon: FiGift },
      { key: 'security', label: 'Account Security', icon: FiShield },
    ],
  },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useSelector((s) => s.auth);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);

  const [tab, setTab] = useState(searchParams.get('tab') || 'profile');
  const [showSidebar, setShowSidebar] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ line: '', city: '', pin: '', type: 'Home' });
  const [addingAddr, setAddingAddr] = useState(false);

  useEffect(() => { dispatch(fetchMe()); dispatch(fetchWishlist()); }, [dispatch]);
  useEffect(() => { if (user) setForm({ name: user.name || '', phone: user.phone || '' }); }, [user]);
  useEffect(() => { if (tab === 'orders') loadOrders(); }, [tab]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch { setOrders([]); }
    finally { setOrdersLoading(false); }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await dispatch(updateProfile(form)).unwrap();
      setSaveMsg('success');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg(typeof e === 'string' ? e : 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const getImage = (imgs) => {
    try { return (Array.isArray(imgs) ? imgs : JSON.parse(imgs || '[]'))[0] || ''; }
    catch { return ''; }
  };

  const getPrice = (p) =>
    Math.round(Number(p.price) * (1 - Number(p.discount || 0) / 100));

  const handleTabChange = (key) => { setTab(key); setShowSidebar(false); };

  if (authLoading && !user) return <Spinner />;
  if (!user) return (
    <div className="bg-[#f1f3f6] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-sm shadow-sm p-10 text-center">
        <p className="text-gray-600 mb-4 text-sm">Unable to load profile</p>
        <button onClick={() => navigate('/')} className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-bold text-sm">Go Home</button>
      </div>
    </div>
  );

  const SidebarContent = () => (
    <>
      {/* User info */}
      <div className="bg-[#2874f0] p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2874f0] font-bold text-base flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-blue-100 text-xs">Hello,</p>
            <p className="text-white font-bold text-sm truncate">{user.name}</p>
            <p className="text-blue-200 text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="py-1 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {group.section}
            </p>
            {group.items.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  tab === key
                    ? 'text-[#2874f0] bg-blue-50 border-r-2 border-[#2874f0] font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={15} className="flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                <FiChevronRight size={12} className="text-gray-300" />
              </button>
            ))}
          </div>
        ))}

        {/* Logout */}
        <div className="border-t border-gray-100 mt-2 pt-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
            <FiLogOut size={15} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 mb-3 bg-white rounded-sm shadow-sm px-4 py-3">
          <button onClick={() => setShowSidebar(true)} className="text-gray-700">
            <FiMenu size={20} />
          </button>
          <span className="font-bold text-gray-800 text-sm">
            {NAV_ITEMS.flatMap((g) => g.items).find((i) => i.key === tab)?.label || 'Profile'}
          </span>
        </div>

        <div className="flex gap-3 sm:gap-4 items-start">
          {/* Desktop Sidebar */}
          <aside className="w-60 lg:w-64 flex-shrink-0 bg-white rounded-sm shadow-sm overflow-hidden sticky top-20 hidden lg:block">
            <SidebarContent />
          </aside>

          {/* Mobile Sidebar Drawer */}
          {showSidebar && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="flex-1 bg-black bg-opacity-40" onClick={() => setShowSidebar(false)} />
              <div className="w-64 bg-white h-full overflow-y-auto shadow-2xl flex-shrink-0">
                <SidebarContent />
              </div>
            </div>
          )}

          {/* ── Main Content ────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-3">

            {/* PROFILE ─────────────────────────────────────────────────── */}
            {tab === 'profile' && (
              <>
                {/* Personal Info */}
                <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">Personal Information</h2>
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 text-[#2874f0] text-xs sm:text-sm font-semibold hover:underline"
                      >
                        <FiEdit2 size={12} /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex items-center gap-1 bg-[#2874f0] text-white px-4 py-1.5 text-xs font-bold rounded-sm disabled:opacity-60"
                        >
                          <FiCheck size={12} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => { setEditing(false); setForm({ name: user.name || '', phone: user.phone || '' }); }}
                          className="flex items-center gap-1 border border-gray-300 text-gray-600 px-4 py-1.5 text-xs font-bold rounded-sm hover:bg-gray-50"
                        >
                          <FiX size={12} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {saveMsg === 'success' && (
                    <div className="mb-4 px-3 py-2 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                      Profile updated successfully!
                    </div>
                  )}
                  {saveMsg && saveMsg !== 'success' && (
                    <div className="mb-4 px-3 py-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                      {saveMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'First Name', key: 'name', type: 'text' },
                      { label: 'Email Address', key: 'email', type: 'email', readonly: true },
                      { label: 'Mobile Number', key: 'phone', type: 'tel' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">{f.label}</label>
                        <input
                          type={f.type}
                          value={f.key === 'email' ? user.email : form[f.key]}
                          onChange={(e) => !f.readonly && setForm({ ...form, [f.key]: e.target.value })}
                          readOnly={f.readonly || !editing}
                          className={`w-full border-b py-2 text-sm outline-none transition-colors bg-transparent ${
                            editing && !f.readonly
                              ? 'border-[#2874f0] text-gray-800'
                              : 'border-gray-200 text-gray-700 cursor-default'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Gender */}
                  <div className="mt-5">
                    <label className="block text-xs text-gray-400 mb-2 font-medium">Gender</label>
                    <div className="flex gap-4">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                          <input type="radio" name="gender" value={g} disabled={!editing} className="accent-[#2874f0]" />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQs / Quick links */}
                <div className="bg-white rounded-sm shadow-sm p-4 sm:p-5">
                  <h2 className="text-sm font-bold text-gray-800 mb-3">Frequently Visited</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: FiPackage, label: 'My Orders', key: 'orders' },
                      { icon: FiHeart, label: 'Wishlist', key: 'wishlist' },
                      { icon: FiMapPin, label: 'Addresses', key: 'addresses' },
                      { icon: FiGift, label: 'Gift Cards', key: 'coupons' },
                    ].map(({ icon: Icon, label, key }) => (
                      <button
                        key={key}
                        onClick={() => handleTabChange(key)}
                        className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-sm hover:border-[#2874f0] hover:bg-blue-50 transition-colors group"
                      >
                        <Icon size={20} className="text-gray-400 group-hover:text-[#2874f0]" />
                        <span className="text-xs text-gray-600 group-hover:text-[#2874f0] font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ORDERS ──────────────────────────────────────────────────── */}
            {tab === 'orders' && (
              <>
                <div className="bg-white rounded-sm shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-gray-800">My Orders</h2>
                  <span className="text-xs text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                </div>

                {ordersLoading ? <Spinner /> : orders.length === 0 ? (
                  <div className="bg-white rounded-sm shadow-sm p-12 sm:p-16 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-700 font-semibold mb-1">No orders yet</p>
                    <p className="text-gray-400 text-sm mb-5">All your orders will appear here</p>
                    <button onClick={() => navigate('/products')} className="bg-[#2874f0] text-white px-8 py-2.5 font-bold rounded-sm text-sm">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                        {/* Order meta */}
                        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-4 sm:gap-6 text-xs text-gray-500 flex-wrap">
                            <div>
                              <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Order Placed</p>
                              <p className="text-gray-800 font-medium">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Total</p>
                              <p className="text-gray-800 font-medium">₹{Number(order.total_price).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Ship To</p>
                              <p className="text-gray-800 font-medium">{order.shipping_address?.split(',')[0]}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-gray-400 text-xs hidden sm:block">ORDER # {order.id}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                            }`}>{order.status}</span>
                          </div>
                        </div>

                        {/* Items */}
                        {order.orderItems?.map((item) => (
                          <div key={item.id} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 border-b border-gray-50 last:border-0">
                            <div
                              className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-100 rounded flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                              onClick={() => navigate(`/products/${item.product_id}`)}
                            >
                              <img
                                src={getImage(item.product?.images) || 'https://via.placeholder.com/80'}
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
                              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-sm">
                                ₹{(Number(item.price_at_purchase) * Number(item.quantity)).toLocaleString('en-IN')}
                              </p>
                              <button
                                onClick={() => { dispatch(addToCart({ product_id: item.product_id, quantity: 1 })); navigate('/cart'); }}
                                className="text-xs text-[#2874f0] font-semibold mt-1 hover:underline"
                              >Buy Again</button>
                            </div>
                          </div>
                        ))}

                        {/* Footer */}
                        <div className="px-4 sm:px-6 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/order-confirmation/${order.id}`)}
                            className="text-xs text-[#2874f0] font-bold hover:underline"
                          >View Details</button>
                          <span className="text-gray-300 text-xs">|</span>
                          <button className="text-xs text-[#2874f0] font-bold hover:underline">Track Order</button>
                          <span className="text-gray-300 text-xs">|</span>
                          <button className="text-xs text-[#2874f0] font-bold hover:underline">Get Help</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* WISHLIST ────────────────────────────────────────────────── */}
            {tab === 'wishlist' && (
              <>
                <div className="bg-white rounded-sm shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-gray-800">My Wishlist</h2>
                  <span className="text-xs text-gray-400">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-white rounded-sm shadow-sm p-12 sm:p-16 text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <p className="text-gray-700 font-semibold mb-1">Your wishlist is empty</p>
                    <p className="text-gray-400 text-sm mb-5">Save items you love here</p>
                    <button onClick={() => navigate('/products')} className="bg-[#2874f0] text-white px-8 py-2.5 font-bold rounded-sm text-sm">
                      Explore Products
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-sm shadow-sm divide-y divide-gray-50">
                    {wishlistItems.map((item) => {
                      const p = item.product;
                      const img = getImage(p?.images);
                      const price = p ? getPrice(p) : 0;
                      return (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4">
                          <div
                            className="w-20 h-20 sm:w-24 sm:h-24 border border-gray-100 rounded flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-blue-300 transition-colors overflow-hidden"
                            onClick={() => navigate(`/products/${p?.id}`)}
                          >
                            <img
                              src={img || 'https://via.placeholder.com/80'}
                              alt={p?.name}
                              className="max-w-full max-h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#2874f0] mb-1"
                              onClick={() => navigate(`/products/${p?.id}`)}
                            >
                              {p?.name}
                            </p>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                              {Number(p?.discount || 0) > 0 && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">₹{Number(p?.price).toLocaleString('en-IN')}</span>
                                  <span className="text-xs text-green-600 font-semibold">{p?.discount}% off</span>
                                </>
                              )}
                            </div>
                            <p className={`text-xs mt-1 font-semibold ${Number(p?.stock) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {Number(p?.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <button
                              onClick={() => { dispatch(addToCart({ product_id: p?.id, quantity: 1 })); navigate('/cart'); }}
                              className="flex items-center gap-1.5 bg-[#ff9f00] hover:bg-[#f0960a] text-white px-3 sm:px-4 py-2 text-xs font-bold rounded-sm transition-colors"
                            >
                              <FiShoppingCart size={12} />
                              <span className="hidden sm:inline">Move to Cart</span>
                              <span className="sm:hidden">Cart</span>
                            </button>
                            <button
                              onClick={() => dispatch(toggleWishlist(p?.id))}
                              className="border border-gray-200 text-gray-600 px-3 sm:px-4 py-2 text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors"
                            >Remove</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ADDRESSES ──────────────────────────────────────────────── */}
            {tab === 'addresses' && (
              <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm sm:text-base font-bold text-gray-800">Manage Addresses</h2>
                  <button
                    onClick={() => setAddingAddr(true)}
                    className="flex items-center gap-1.5 text-[#2874f0] text-xs font-bold border border-[#2874f0] px-3 py-1.5 rounded-sm hover:bg-blue-50"
                  >
                    + Add New Address
                  </button>
                </div>

                {addingAddr && (
                  <div className="border border-dashed border-[#2874f0] rounded-sm p-4 mb-4 bg-blue-50">
                    <p className="text-sm font-bold text-gray-700 mb-3">Add New Address</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'line', label: 'Address Line', placeholder: 'House No., Street, Area' },
                        { key: 'city', label: 'City', placeholder: 'Enter city' },
                        { key: 'pin', label: 'Pincode', placeholder: '6-digit pincode' },
                      ].map((f) => (
                        <div key={f.key} className={f.key === 'line' ? 'sm:col-span-2' : ''}>
                          <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                          <input
                            value={newAddress[f.key]}
                            onChange={(e) => setNewAddress((a) => ({ ...a, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:border-[#2874f0] focus:outline-none bg-white"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                        <div className="flex gap-2 mt-1">
                          {['Home', 'Work', 'Other'].map((t) => (
                            <label key={t} className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="radio" name="addrtype" value={t}
                                checked={newAddress.type === t}
                                onChange={() => setNewAddress((a) => ({ ...a, type: t }))}
                                className="accent-[#2874f0]"
                              />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          if (newAddress.line.trim()) {
                            setAddresses([...addresses, newAddress]);
                            setNewAddress({ line: '', city: '', pin: '', type: 'Home' });
                            setAddingAddr(false);
                          }
                        }}
                        className="bg-[#2874f0] text-white px-5 py-1.5 text-xs font-bold rounded-sm hover:bg-blue-700"
                      >Save Address</button>
                      <button
                        onClick={() => { setAddingAddr(false); setNewAddress({ line: '', city: '', pin: '', type: 'Home' }); }}
                        className="border border-gray-300 text-gray-600 px-5 py-1.5 text-xs font-bold rounded-sm hover:bg-gray-50"
                      >Cancel</button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !addingAddr ? (
                  <div className="text-center py-10">
                    <FiMapPin size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No saved addresses yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr, i) => (
                      <div key={i} className="border border-gray-200 rounded-sm p-4 flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <FiMapPin className="text-[#2874f0] mt-0.5 flex-shrink-0" size={16} />
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              addr.type === 'Work' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                            }`}>{addr.type}</span>
                            <p className="text-sm text-gray-800 font-medium mt-1">{addr.line}</p>
                            {addr.city && <p className="text-xs text-gray-500 mt-0.5">{addr.city} - {addr.pin}</p>}
                          </div>
                        </div>
                        <div className="flex gap-3 ml-3 flex-shrink-0">
                          <button className="text-xs text-[#2874f0] font-semibold hover:underline">Edit</button>
                          <button
                            onClick={() => setAddresses(addresses.filter((_, j) => j !== i))}
                            className="text-xs text-red-400 hover:text-red-600 font-semibold"
                          >Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COUPONS ─────────────────────────────────────────────────── */}
            {tab === 'coupons' && (
              <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-5">Gift Cards & Coupons</h2>
                <div className="flex gap-2 mb-5">
                  <input
                    placeholder="Enter coupon / gift card code"
                    className="flex-1 border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:border-[#2874f0] focus:outline-none"
                  />
                  <button className="bg-[#2874f0] text-white px-5 py-2.5 text-sm font-bold rounded-sm hover:bg-blue-700">
                    Apply
                  </button>
                </div>
                <div className="text-center py-10">
                  <FiGift size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No active coupons or gift cards</p>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS ───────────────────────────────────────────── */}
            {tab === 'notifications' && (
              <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-5">Notifications</h2>
                {[
                  { title: 'Order delivered', body: 'Your recent order has been delivered.', time: '2 hours ago', icon: '📦' },
                  { title: 'Price drop alert!', body: 'An item in your wishlist has dropped in price.', time: '1 day ago', icon: '💰' },
                  { title: 'New sale!', body: 'Big Billion Days sale has started. Up to 80% off.', time: '3 days ago', icon: '🎉' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 py-4 border-b border-gray-50 last:border-0">
                    <span className="text-xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECURITY ────────────────────────────────────────────────── */}
            {tab === 'security' && (
              <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FiShield className="text-[#2874f0]" /> Account Security
                </h2>
                {[
                  { label: 'Password', desc: 'Change your account password', action: 'Change' },
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', action: 'Enable' },
                  { label: 'Login Activity', desc: 'See your recent login devices', action: 'View' },
                  { label: 'Deactivate Account', desc: 'Temporarily disable your account', action: 'Deactivate', danger: true },
                ].map(({ label, desc, action, danger }) => (
                  <div key={label} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <button className={`text-xs font-bold px-3 py-1.5 rounded-sm border ${
                      danger
                        ? 'border-red-300 text-red-500 hover:bg-red-50'
                        : 'border-[#2874f0] text-[#2874f0] hover:bg-blue-50'
                    }`}>
                      {action}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* REVIEWS ─────────────────────────────────────────────────── */}
            {tab === 'reviews' && (
              <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FiStar className="text-yellow-400" /> My Reviews & Ratings
                </h2>
                <div className="text-center py-10">
                  <FiStar size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">You haven't reviewed any products yet</p>
                  <button onClick={() => navigate('/products')} className="mt-4 text-[#2874f0] text-sm font-bold hover:underline">
                    Shop & Review
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}