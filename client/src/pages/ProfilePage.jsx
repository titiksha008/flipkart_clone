import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiEdit2,
  FiCheck,
  FiX,
  FiShoppingCart,
  FiChevronRight,
  FiGift,
  FiShield,
  FiMenu,
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
    ],
  },
  {
    section: 'My Stuff',
    items: [
      { key: 'orders', label: 'My Orders', icon: FiPackage },
      { key: 'wishlist', label: 'My Wishlist', icon: FiHeart },
    ],
  },
  {
    section: 'Payments & Rewards',
    items: [{ key: 'coupons', label: 'Gift Cards & Coupons', icon: FiGift }],
  },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((s) => s.auth);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);

  const [tab, setTab] = useState('profile');
  const [showSidebar, setShowSidebar] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [addingAddr, setAddingAddr] = useState(false);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'orders') {
      loadOrders();
    }
  }, [tab]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await dispatch(updateProfile(form)).unwrap();
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg(typeof e === 'string' ? e : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const getImage = (imgs) => {
    try {
      return (Array.isArray(imgs) ? imgs : JSON.parse(imgs || '[]'))[0] || '';
    } catch {
      return '';
    }
  };

  const getPrice = (p) =>
    Math.round(Number(p.price) * (1 - Number(p.discount || 0) / 100));

  const handleTabChange = (key) => {
    setTab(key);
    setShowSidebar(false);
  };

  if (authLoading && !user) return <Spinner />;

  if (!user) {
    return (
      <div className="bg-[#f1f3f6] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-sm shadow-sm p-8 text-center max-w-md w-full">
          <p className="text-gray-600 mb-4">Unable to load profile right now.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="bg-[#2874f0] p-4 flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#2874f0] font-bold text-base sm:text-lg flex-shrink-0">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-blue-200">Hello,</p>
          <p className="text-white font-bold text-sm truncate">{user.name}</p>
          <p className="text-blue-200 text-xs truncate">{user.email}</p>
        </div>
      </div>

      <nav className="py-2">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
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
                <Icon className="text-base flex-shrink-0" />
                {label}
                <FiChevronRight className="ml-auto text-gray-300 text-sm" />
              </button>
            ))}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="lg:hidden flex items-center gap-3 mb-3 bg-white rounded-sm shadow-sm px-4 py-3">
          <button onClick={() => setShowSidebar(true)} className="text-gray-700">
            <FiMenu className="text-xl" />
          </button>
          <span className="font-bold text-gray-800 text-sm capitalize">
            {NAV_ITEMS.flatMap((g) => g.items).find((i) => i.key === tab)?.label || 'Profile'}
          </span>
        </div>

        <div className="flex gap-3 sm:gap-4 items-start">
          <aside className="w-60 lg:w-64 flex-shrink-0 bg-white rounded-sm shadow-sm overflow-hidden sticky top-20 hidden lg:block">
            <SidebarContent />
          </aside>

          {showSidebar && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="flex-1 bg-black bg-opacity-40"
                onClick={() => setShowSidebar(false)}
              />
              <div className="w-64 bg-white h-full overflow-y-auto shadow-2xl flex-shrink-0">
                <SidebarContent />
              </div>
            </div>
          )}

          <main className="flex-1 min-w-0">
            {tab === 'profile' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">
                      Personal Information
                    </h2>
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 text-[#2874f0] text-xs sm:text-sm font-semibold hover:underline"
                      >
                        <FiEdit2 className="text-xs" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex items-center gap-1 bg-[#2874f0] text-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-sm disabled:opacity-60"
                        >
                          <FiCheck /> {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditing(false);
                            setForm({ name: user.name || '', phone: user.phone || '' });
                          }}
                          className="flex items-center gap-1 border border-gray-300 text-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-sm"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {saveMsg && (
                    <p
                      className={`text-xs sm:text-sm mb-4 px-3 py-2 rounded ${
                        saveMsg.includes('!')
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {saveMsg}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text' },
                      { label: 'Email Address', key: 'email', type: 'email', readonly: true },
                      { label: 'Mobile Number', key: 'phone', type: 'tel' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                        <input
                          type={f.type}
                          value={f.key === 'email' ? user.email : form[f.key]}
                          onChange={(e) =>
                            !f.readonly && setForm({ ...form, [f.key]: e.target.value })
                          }
                          readOnly={f.readonly || !editing}
                          className={`w-full border-b py-2 text-xs sm:text-sm outline-none transition-colors ${
                            editing && !f.readonly
                              ? 'border-[#2874f0] text-gray-800'
                              : 'border-gray-200 text-gray-700 bg-transparent cursor-default'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiShield className="text-[#2874f0]" />
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">
                      Account Security
                    </h2>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Password</p>
                      <p className="text-xs text-gray-400">Demo mode active</p>
                    </div>
                    <button className="text-gray-400 text-xs sm:text-sm font-semibold cursor-default">
                      Disabled
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        Account Type
                      </p>
                      <p className="text-xs text-gray-400">Default seeded user</p>
                    </div>
                    <button className="text-gray-400 text-xs sm:text-sm font-semibold cursor-default">
                      Demo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="space-y-3">
                <div className="bg-white rounded-sm shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-gray-800">My Orders</h2>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {ordersLoading ? (
                  <Spinner />
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-sm shadow-sm p-10 sm:p-16 text-center">
                    <FiPackage className="text-5xl sm:text-6xl text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">No orders placed yet</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-[#2874f0] text-white px-6 sm:px-8 py-2 font-semibold rounded-sm text-sm"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                      <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 sm:gap-6 text-xs text-gray-500 flex-wrap">
                          <div>
                            <p className="font-semibold text-gray-700 uppercase tracking-wide text-[10px] sm:text-xs">
                              Order Placed
                            </p>
                            <p className="text-xs">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
                              Total
                            </p>
                            <p>₹{Number(order.total_price).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
                              Payment
                            </p>
                            <p>{order.payment_method}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs flex-shrink-0">
                          <p className="text-gray-400 hidden sm:block">Order # {order.id}</p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {order.orderItems?.map((item) => {
                        const img = getImage(item.product?.images);
                        return (
                          <div
                            key={item.id}
                            className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 border-b border-gray-50 last:border-0"
                          >
                            <img
                              src={img || 'https://via.placeholder.com/80'}
                              alt={item.product?.name}
                              onClick={() => navigate(`/products/${item.product_id}`)}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-contain border border-gray-100 rounded cursor-pointer hover:border-blue-300 transition-colors flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                onClick={() => navigate(`/products/${item.product_id}`)}
                                className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#2874f0]"
                              >
                                {item.product?.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Qty: {item.quantity} × ₹
                                {Number(item.price_at_purchase).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-xs sm:text-sm">
                                ₹
                                {(
                                  Number(item.price_at_purchase) * Number(item.quantity)
                                ).toLocaleString('en-IN')}
                              </p>
                              <button
                                onClick={() => {
                                  dispatch(
                                    addToCart({ product_id: item.product_id, quantity: 1 })
                                  );
                                  navigate('/cart');
                                }}
                                className="text-xs text-[#2874f0] font-semibold mt-1 hover:underline"
                              >
                                Buy Again
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 flex gap-3 items-center">
                        <button
                          onClick={() => navigate(`/order-confirmation/${order.id}`)}
                          className="text-xs sm:text-sm text-[#2874f0] font-semibold hover:underline"
                        >
                          View Details
                        </button>
                        <span className="text-gray-200">|</span>
                        <p className="text-xs text-gray-400 self-center line-clamp-1">
                          Ships to: {order.shipping_address?.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'wishlist' && (
              <div>
                <div className="bg-white rounded-sm shadow-sm px-4 sm:px-6 py-3 sm:py-4 mb-3 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-gray-800">My Wishlist</h2>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-white rounded-sm shadow-sm p-10 sm:p-16 text-center">
                    <FiHeart className="text-5xl sm:text-6xl text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">
                      Your wishlist is empty
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-[#2874f0] text-white px-6 sm:px-8 py-2 font-semibold rounded-sm text-sm"
                    >
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
                        <div
                          key={item.id}
                          className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4"
                        >
                          <img
                            src={img || 'https://via.placeholder.com/80'}
                            alt={p?.name}
                            onClick={() => navigate(`/products/${p?.id}`)}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain border border-gray-100 rounded cursor-pointer hover:border-blue-300 transition-colors flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <p
                              onClick={() => navigate(`/products/${p?.id}`)}
                              className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#2874f0] mb-1"
                            >
                              {p?.name}
                            </p>

                            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                              <span className="font-bold text-gray-900 text-sm sm:text-base">
                                ₹{price.toLocaleString('en-IN')}
                              </span>
                              {Number(p?.discount || 0) > 0 && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{Number(p?.price).toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-xs text-green-600 font-semibold">
                                    {p?.discount}% off
                                  </span>
                                </>
                              )}
                            </div>

                            <p
                              className={`text-xs mt-0.5 font-semibold ${
                                Number(p?.stock) > 0 ? 'text-green-600' : 'text-red-500'
                              }`}
                            >
                              {Number(p?.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                dispatch(addToCart({ product_id: p?.id, quantity: 1 }));
                                navigate('/cart');
                              }}
                              className="flex items-center gap-1 sm:gap-1.5 bg-[#ff9f00] hover:bg-[#f0960a] text-white px-2 sm:px-4 py-2 text-xs font-bold rounded-sm transition-colors"
                            >
                              <FiShoppingCart className="text-xs" />
                              <span className="hidden sm:inline">Move to Cart</span>
                              <span className="sm:hidden">Cart</span>
                            </button>
                            <button
                              onClick={() => dispatch(toggleWishlist(p?.id))}
                              className="border border-gray-200 text-gray-600 px-2 sm:px-4 py-2 text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'addresses' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">
                      Manage Addresses
                    </h2>
                    <button
                      onClick={() => setAddingAddr(true)}
                      className="flex items-center gap-1 text-[#2874f0] text-xs sm:text-sm font-semibold border border-[#2874f0] px-2 sm:px-3 py-1.5 rounded-sm hover:bg-blue-50 transition-colors"
                    >
                      + Add New
                    </button>
                  </div>

                  {addingAddr && (
                    <div className="border border-dashed border-[#2874f0] rounded-sm p-3 sm:p-4 mb-4 bg-blue-50">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                        New Address
                      </p>
                      <textarea
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter full address (House No, Street, City, State, Pincode)"
                        rows={3}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#2874f0] bg-white mb-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (newAddress.trim()) {
                              setAddresses([...addresses, newAddress.trim()]);
                              setNewAddress('');
                              setAddingAddr(false);
                            }
                          }}
                          className="bg-[#2874f0] text-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-sm hover:bg-blue-700"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => {
                            setAddingAddr(false);
                            setNewAddress('');
                          }}
                          className="border border-gray-200 text-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {addresses.length === 0 && !addingAddr ? (
                    <div className="text-center py-8 sm:py-10">
                      <FiMapPin className="text-4xl sm:text-5xl text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-xs sm:text-sm">No saved addresses</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr, i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-sm p-3 sm:p-4 flex justify-between items-start"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                            <FiMapPin className="text-[#2874f0] mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                                HOME
                              </span>
                              <p className="text-xs sm:text-sm text-gray-700 mt-1">{addr}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setAddresses(addresses.filter((_, j) => j !== i))}
                            className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 ml-3"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'coupons' && (
              <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-5">
                  Gift Cards & Coupons
                </h2>
                <div className="text-center py-8 sm:py-10">
                  <FiGift className="text-4xl sm:text-5xl text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-xs sm:text-sm">
                    No active gift cards or coupons
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}