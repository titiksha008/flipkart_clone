import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useSelector } from 'react-redux';
import ImageCarousel from '../components/ImageCarousel';
import StarRating from '../components/StarRating';
import Spinner from '../components/Spinner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: product, loading } = useSelector(s => s.products);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => { dispatch(fetchProductById(id)); }, [dispatch, id]);

  if (loading || !product) return <Spinner />;

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
  const savings = Math.round(product.price - discountedPrice);

  const handleAddToCart = async () => {
    await dispatch(addToCart({ product_id: product.id, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    await dispatch(addToCart({ product_id: product.id, quantity: qty }));
    navigate('/cart');
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-sm shadow-sm p-6 flex flex-col lg:flex-row gap-8">
          {/* Images */}
          <div className="lg:w-2/5">
            <ImageCarousel images={images} />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 font-bold rounded-sm text-sm transition ${added ? 'bg-green-600 text-white' : 'bg-[#ff9f00] hover:bg-[#f0960a] text-white'}`}
              >
                {added ? '✓ Added to Cart' : '🛒 ADD TO CART'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#fb641b] hover:bg-[#f05b10] text-white py-3 font-bold rounded-sm text-sm"
              >
                ⚡ BUY NOW
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
            <h1 className="text-xl font-semibold text-gray-800 mb-3">{product.name}</h1>
            <StarRating rating={product.rating} count={product.review_count} />

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
              <span className="text-lg text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
              <span className="text-lg text-green-600 font-bold">{product.discount}% off</span>
            </div>
            <p className="text-green-600 text-sm mt-1">You save ₹{savings.toLocaleString()}</p>

            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded-full">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-full">−</button>
                <span className="px-3 font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 flex items-center justify-center font-bold text-blue-600 hover:bg-blue-50 rounded-full">+</button>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm font-semibold text-gray-700 mb-2">Highlights:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Brand: {product.brand}</li>
                <li>Category: {product.category?.name}</li>
                <li>Rating: {product.rating}/5 ({product.review_count?.toLocaleString()} reviews)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}