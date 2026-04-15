import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import Spinner from '../components/Spinner';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiZap } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, loading, error } = useSelector((s) => s.products);
  const { error: cartError } = useSelector((s) => s.cart);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  const images = useMemo(() => {
    const fallback = ['https://via.placeholder.com/600x600?text=Product'];

    if (!product?.images) return fallback;

    try {
      const parsed = Array.isArray(product.images)
        ? product.images
        : JSON.parse(product.images);

      return parsed?.length ? parsed : fallback;
    } catch {
      return fallback;
    }
  }, [product]);

  const currentImage = images[activeImageIndex] || images[0];

  const discountedPrice = product
    ? Math.round(Number(product.price) * (1 - Number(product.discount || 0) / 100))
    : 0;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setBuying(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
      navigate('/cart');
    } finally {
      setBuying(false);
    }
  };

  const renderSpecs = () => {
    const specs = [];

    if (product?.brand) specs.push(['Brand', product.brand]);
    if (product?.category?.name) specs.push(['Category', product.category.name]);
    if (product?.stock !== undefined) specs.push(['Stock', product.stock]);
    if (product?.rating !== undefined) specs.push(['Rating', product.rating]);
    if (product?.review_count !== undefined) specs.push(['Reviews', product.review_count]);

    return specs;
  };

  if (loading) return <Spinner />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] py-6 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-sm shadow-sm p-8 text-center">
          <p className="text-red-500 text-lg font-medium mb-4">
            {error || 'Product not found'}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* LEFT: IMAGE CAROUSEL */}
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Thumbnails */}
                <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`border rounded-sm w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-white ${
                        activeImageIndex === index
                          ? 'border-[#2874f0]'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="order-1 sm:order-2 flex-1">
                  <div className="relative border border-gray-200 rounded-sm bg-white h-[320px] sm:h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain p-4"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiChevronLeft className="text-lg" />
                        </button>

                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiChevronRight className="text-lg" />
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full ${
                            activeImageIndex === index ? 'bg-[#2874f0]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding || product.stock === 0}
                      className="bg-[#ff9f00] hover:bg-[#f39a00] text-white font-bold py-3 rounded-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <FiShoppingCart />
                      {adding ? 'ADDING...' : 'ADD TO CART'}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={buying || product.stock === 0}
                      className="bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 rounded-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <FiZap />
                      {buying ? 'PROCESSING...' : 'BUY NOW'}
                    </button>
                  </div>

                  {cartError && (
                    <p className="text-red-500 text-sm mt-3">{cartError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: PRODUCT DETAILS */}
            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-gray-800 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {product.rating ? (
                  <span className="bg-green-600 text-white text-sm font-semibold px-2 py-0.5 rounded">
                    {product.rating} ★
                  </span>
                ) : null}

                {product.review_count ? (
                  <span className="text-sm text-gray-500 font-medium">
                    {product.review_count.toLocaleString()} Ratings & Reviews
                  </span>
                ) : null}
              </div>

              <div className="mt-5">
                <p className="text-green-600 text-sm font-semibold">
                  Extra discount available
                </p>

                <div className="flex items-end gap-3 mt-1 flex-wrap">
                  <span className="text-3xl font-semibold text-gray-900">
                    ₹{discountedPrice.toLocaleString()}
                  </span>

                  {Number(product.discount) > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{Number(product.price).toLocaleString()}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                    Number(product.stock) > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {Number(product.stock) > 0
                    ? `In Stock (${product.stock} available)`
                    : 'Out of Stock'}
                </span>
              </div>

              {product.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h2>
                  <p className="text-sm text-gray-700 leading-6">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Specifications
                </h2>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  {renderSpecs().length > 0 ? (
                    renderSpecs().map(([label, value], idx) => (
                      <div
                        key={label}
                        className={`grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] text-sm ${
                          idx !== renderSpecs().length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <div className="bg-gray-50 px-4 py-3 text-gray-600 font-medium">
                          {label}
                        </div>
                        <div className="px-4 py-3 text-gray-800">{value}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No specifications available.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-sm p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Delivery:</span> Usually delivered in
                  3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}