import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiSearch, FiPackage } from 'react-icons/fi';
import { fetchCart } from '../store/slices/cartSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${search}`);
  };

  return (
    <nav className="bg-[#2874f0] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-white font-bold text-xl italic">Flipkart</span>
          <p className="text-[10px] text-yellow-300 -mt-1">Explore <span className="italic font-semibold">Plus</span> ✦</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="flex bg-white rounded-sm overflow-hidden">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for products, brands and more"
              className="flex-1 px-4 py-2 text-sm outline-none text-gray-700"
            />
            <button type="submit" className="px-4 bg-white text-[#2874f0] hover:bg-gray-50">
              <FiSearch className="text-xl" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-1 text-white text-sm font-semibold hover:text-yellow-200"
          >
            <FiPackage className="text-lg" /> Orders
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="relative flex items-center gap-1 text-white text-sm font-semibold hover:text-yellow-200"
          >
            <FiShoppingCart className="text-xl" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
            Cart
          </button>
        </div>
      </div>
    </nav>
  );
}