import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProductCard({ product, compact = false, listView = false }) {
  const navigate = useNavigate();

  const price = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const stock = Number(product?.stock || 0);

  const discountedPrice = Math.round(price * (1 - discount / 100));
  const savings = price - discountedPrice;

  const images = Array.isArray(product?.images)
    ? product.images
    : (() => {
        try {
          return JSON.parse(product?.images || '[]');
        } catch {
          return [];
        }
      })();

  const handleNavigate = () => {
    navigate(`/products/${product.id}`);
  };

  if (listView) {
    return (
      <div
        onClick={handleNavigate}
        className="flex gap-4 sm:gap-6 p-4 cursor-pointer group"
      >
        <div className="w-32 h-32 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
          <img
            src={images[0] || 'https://via.placeholder.com/200'}
            alt={product?.name || 'Product'}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="flex-1 py-1 min-w-0">
          <h3 className="text-sm sm:text-base text-gray-800 mb-1 group-hover:text-[#2874f0] transition-colors line-clamp-2">
            {product?.name}
          </h3>

          <StarRating rating={product?.rating} count={product?.review_count} />

          <div className="flex items-baseline gap-2 mt-3 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              ₹{discountedPrice.toLocaleString()}
            </span>

            {discount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 font-bold">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {savings > 0 && (
            <p className="text-green-600 text-xs mt-1">
              You save ₹{savings.toLocaleString()}
            </p>
          )}

          <div className="flex gap-4 mt-3 text-xs text-gray-500 flex-wrap">
            <span>✓ Free Delivery</span>
            {stock > 0 ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleNavigate}
      className={`bg-white cursor-pointer flex flex-col group border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-200 ${
        compact ? 'p-2' : 'p-3'
      }`}
    >
      <div className={`flex justify-center overflow-hidden mb-2 ${compact ? 'h-32' : 'h-44'}`}>
        <img
          src={images[0] || 'https://via.placeholder.com/200'}
          alt={product?.name || 'Product'}
          className="object-contain h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3
        className={`font-medium text-gray-800 line-clamp-2 mb-1 ${
          compact ? 'text-xs' : 'text-sm'
        }`}
      >
        {product?.name}
      </h3>

      {!compact && (
        <StarRating rating={product?.rating} count={product?.review_count} />
      )}

      <div
        className={`flex items-baseline gap-1.5 flex-wrap ${
          compact ? 'mt-1' : 'mt-2'
        }`}
      >
        <span className={`font-bold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
          ₹{discountedPrice.toLocaleString()}
        </span>

        {discount > 0 && (
          <>
            <span className="text-xs text-gray-400 line-through">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs text-green-600 font-semibold">
              {discount}% off
            </span>
          </>
        )}
      </div>
    </div>
  );
}