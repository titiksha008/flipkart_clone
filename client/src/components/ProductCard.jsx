import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow cursor-pointer p-3 flex flex-col group"
    >
      <div className="flex justify-center mb-3 overflow-hidden h-44">
        <img
          src={images[0] || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
      <StarRating rating={product.rating} count={product.review_count} />
      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span className="text-base font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
        <span className="text-xs text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
        <span className="text-xs text-green-600 font-semibold">{product.discount}% off</span>
      </div>
    </div>
  );
}