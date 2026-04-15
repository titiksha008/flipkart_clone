import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiShoppingCart,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiPackage,
  FiHeart,
  FiHelpCircle,
  FiGift,
  FiSmartphone,
  FiTag,
  FiTrendingUp,
  FiBell,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { fetchCart } from '../store/slices/cartSlice';
import { fetchMe } from '../store/slices/authSlice';

const CATEGORIES = [
  { label: 'Grocery', emoji: '🛒', slug: 'grocery' },
  { label: 'Mobiles', emoji: '📱', slug: 'mobiles' },
  { label: 'Fashion', emoji: '👗', slug: 'clothing' },
  { label: 'Electronics', emoji: '🖥️', slug: 'electronics' },
  { label: 'Home & Furniture', emoji: '🛋️', slug: 'home-kitchen' },
  { label: 'Appliances', emoji: '🧊', slug: 'appliances' },
  { label: 'Travel', emoji: '✈️', slug: 'travel' },
  { label: 'Beauty', emoji: '💄', slug: 'beauty' },
  { label: 'Toys', emoji: '🧸', slug: 'toys' },
  { label: 'Sports', emoji: '⚽', slug: 'sports' },
  { label: 'Books', emoji: '📚', slug: 'books' },
];

const MORE_MENU = [
  { icon: <FiBell />, label: 'Notification Preferences' },
  { icon: <FiHelpCircle />, label: '24x7 Customer Care' },
  { icon: <FiTrendingUp />, label: 'Advertise' },
  { icon: <FiTag />, label: 'Download App' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const [search, setSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const userRef = useRef(null);
  const moreRef = useRef(null);
  const sellerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMoreDropdown(false);
      }
      if (sellerRef.current && !sellerRef.current.contains(e.target)) {
        setShowSellerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
    setShowUserDropdown(false);
    setShowMoreDropdown(false);
    setShowSellerDropdown(false);
  }, [location.pathname, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const cartCount = items.reduce((s, i) => s + (i.quantity || 1), 0);
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <>
      <nav className="bg-[#2874f0] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-4">
          <div
            className="flex-shrink-0 cursor-pointer min-w-[70px] sm:min-w-[90px]"
            onClick={() => navigate('/')}
          >
            <p className="text-white font-bold text-lg sm:text-xl leading-none italic">
              Flipkart
            </p>
            <p className="text-[9px] sm:text-[10px] text-yellow-300 leading-none mt-0.5 flex items-center gap-0.5">
              Explore <em className="font-semibold not-italic ml-0.5">Plus</em>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className="inline ml-0.5"
                fill="#ffe500"
              >
                <polygon points="5,0 6.2,3.8 10,3.8 7,6.2 8.2,10 5,7.8 1.8,10 3,6.2 0,3.8 3.8,3.8" />
              </svg>
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:block">
            <div className="flex bg-white rounded-sm overflow-hidden shadow-sm h-9">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for Products, Brands and More"
                className="flex-1 px-3 sm:px-4 py-2 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 bg-white text-[#2874f0] hover:bg-[#f5f5f5] flex items-center border-l border-gray-100"
              >
                <FiSearch className="text-xl text-[#2874f0] font-bold" />
              </button>
            </div>
          </form>

          <button
            className="sm:hidden text-white text-xl p-1 ml-auto"
            onClick={() => setShowMobileSearch((s) => !s)}
            aria-label="Search"
          >
            <FiSearch />
          </button>

          <div className="flex items-center gap-0 ml-auto sm:ml-0 flex-shrink-0">
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserDropdown((d) => !d)}
                className="flex items-center gap-1 sm:gap-1.5 text-white text-xs sm:text-sm font-semibold px-1 sm:px-3 py-1 hover:text-yellow-200 mx-0 sm:mx-1"
              >
                <FiUser className="text-base" />
                <span className="hidden xs:inline max-w-[60px] sm:max-w-[80px] truncate">
                  {firstName}
                </span>
                <FiChevronDown className="text-xs hidden sm:inline" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-11 bg-white shadow-2xl rounded-sm w-56 sm:w-60 py-0 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100 bg-[#fafafa]">
                    <p className="text-xs text-gray-400 mb-0.5">Hello,</p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user?.name || 'Default User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || 'user@flipkart.com'}
                    </p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: 'My Profile', path: '/profile', icon: <FiUser /> },
                      { label: 'My Orders', path: '/orders', icon: <FiPackage /> },
                      { label: 'My Wishlist', path: '/wishlist', icon: <FiHeart /> },
                      { label: 'My Rewards', path: '/profile', icon: <FiGift /> },
                      { label: 'Gift Cards', path: '/profile', icon: <FiGift /> },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.path);
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f5f5f5] flex items-center gap-3"
                      >
                        <span className="text-gray-400 text-sm">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden lg:block" ref={sellerRef}>
              <button
                onClick={() => setShowSellerDropdown((d) => !d)}
                className="flex items-center gap-0.5 text-white text-sm font-semibold px-3 hover:text-yellow-200 whitespace-nowrap"
              >
                Become a Seller
              </button>
              {showSellerDropdown && (
                <div className="absolute right-0 top-11 bg-white shadow-2xl rounded-sm w-64 z-50 border border-gray-100">
                  <div className="px-4 py-4 border-b border-gray-100 bg-[#fef9e7]">
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      Start Selling on Flipkart
                    </p>
                    <p className="text-xs text-gray-500">
                      Reach crores of customers across India
                    </p>
                  </div>
                  <div className="py-1">
                    {[
                      {
                        icon: <FiSmartphone />,
                        label: 'Register as a Seller',
                        sub: 'Create your seller account',
                      },
                      {
                        icon: <FiTag />,
                        label: 'Seller Hub',
                        sub: 'Manage your store & listings',
                      },
                      {
                        icon: <FiTrendingUp />,
                        label: 'Growth Tools',
                        sub: 'Boost your sales',
                      },
                      {
                        icon: <FiHelpCircle />,
                        label: 'Seller Support',
                        sub: '24x7 assistance',
                      },
                    ].map((item, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#f5f5f5] flex items-start gap-3"
                      >
                        <span className="text-[#2874f0] mt-0.5 text-sm">{item.icon}</span>
                        <span>
                          <p className="text-sm text-gray-700 font-medium">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.sub}</p>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden lg:block" ref={moreRef}>
              <button
                onClick={() => setShowMoreDropdown((d) => !d)}
                className="flex items-center gap-0.5 text-white text-sm font-semibold px-3 hover:text-yellow-200 whitespace-nowrap"
              >
                More <FiChevronDown className="text-xs ml-0.5" />
              </button>
              {showMoreDropdown && (
                <div className="absolute right-0 top-11 bg-white shadow-2xl rounded-sm w-52 py-1 z-50 border border-gray-100">
                  {MORE_MENU.map((item, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f5f5f5] flex items-center gap-3"
                    >
                      <span className="text-gray-400 text-sm">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="relative flex items-center gap-1 sm:gap-1.5 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 hover:text-yellow-200 ml-0 sm:ml-1"
            >
              <div className="relative">
                <FiShoppingCart className="text-lg sm:text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xs:inline">Cart</span>
            </button>

            <button
              className="lg:hidden text-white text-xl p-1 ml-1"
              onClick={() => setShowMobileMenu((s) => !s)}
              aria-label="Menu"
            >
              {showMobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {showMobileSearch && (
          <div className="sm:hidden bg-[#1a65de] px-3 pb-3">
            <form onSubmit={handleSearch}>
              <div className="flex bg-white rounded-sm overflow-hidden shadow-sm h-9">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for Products, Brands..."
                  autoFocus
                  className="flex-1 px-3 py-2 text-sm outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="px-3 bg-white text-[#2874f0] hover:bg-[#f5f5f5] flex items-center border-l border-gray-100"
                >
                  <FiSearch className="text-lg text-[#2874f0]" />
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border-b border-gray-200 hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center overflow-x-auto scrollbar-hide gap-0">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => navigate(`/products?category=${c.slug}`)}
                  className="flex flex-col items-center min-w-[72px] lg:min-w-[80px] py-2 sm:py-2.5 px-2 sm:px-3 hover:text-[#2874f0] group flex-shrink-0 border-b-2 border-transparent hover:border-[#2874f0] transition-all duration-150"
                >
                  <span className="text-xl sm:text-2xl mb-1">{c.emoji}</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-700 group-hover:text-[#2874f0] whitespace-nowrap text-center leading-tight">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="w-72 bg-white h-full overflow-y-auto shadow-2xl flex-shrink-0">
            <div className="bg-[#2874f0] px-4 py-4 flex items-center justify-between">
              <span className="text-white font-bold text-base">Browse Categories</span>
              <button onClick={() => setShowMobileMenu(false)} className="text-white">
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="py-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    navigate(`/products?category=${c.slug}`);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="font-medium">{c.label}</span>
                </button>
              ))}

              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => {
                    navigate('/orders');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiPackage className="text-gray-400" /> My Orders
                </button>
                <button
                  onClick={() => {
                    navigate('/wishlist');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiHeart className="text-gray-400" /> My Wishlist
                </button>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiUser className="text-gray-400" /> My Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}