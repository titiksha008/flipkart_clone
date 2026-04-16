import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchProductById,
  fetchRecommendations,
} from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import Spinner from '../components/Spinner';
import { FlipkartProductRow, FlipkartFBT } from './ProductCarousels';
import {
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiZap,
  FiHeart,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiTag,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

// ─── Rating Bar ───────────────────────────────────────────────────────────────
function RatingBar({ label, value, max = 5, count }) {
  const pct = Math.round((value / max) * 100);
  const color =
    value >= 4 ? '#388e3c' : value >= 3 ? '#ff9f00' : '#f44336';

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-gray-600 font-medium">{label}</span>
      <FiStar className="text-gray-400" size={12} />
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-right text-gray-500">
        {count?.toLocaleString?.() ?? ''}
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedProduct: product,
    loading,
    error,
    recommendations = { similar: [], alsoBought: [], fbtCompanions: [] },
    recommendationsLoading,
  } = useSelector((s) => s.products);

  const { error: cartError } = useSelector((s) => s.cart);
  const { items: wishlistItems = [], toggleLoading } = useSelector(
    (s) => s.wishlist
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [addingRowId, setAddingRowId] = useState(null);
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchRecommendations(id));
    dispatch(fetchWishlist());
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImageIndex(0);
    setShowFullDesc(false);
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
    ? Math.round(
        Number(product.price) * (1 - Number(product.discount || 0) / 100)
      )
    : 0;

  const isWishlisted = product
    ? wishlistItems.some(
        (item) => Number(item.product_id) === Number(product.id)
      )
    : false;

  const similarProducts = recommendations.similar ?? [];
  const customersAlsoBought = recommendations.alsoBought ?? [];
  const fbtCompanions = recommendations.fbtCompanions ?? [];

  const ratingDist = useMemo(() => {
    if (!product?.rating || !product?.review_count) return null;

    const total = Number(product.review_count);
    const avg = Number(product.rating);
    const weights = [0.05, 0.08, 0.12, 0.3, 0.45];

    const biased = weights.map((w, i) => {
      const star = i + 1;
      const dist = Math.abs(star - avg);
      return w * Math.exp(-0.4 * dist);
    });

    const sum = biased.reduce((a, b) => a + b, 0);

    return biased.map((w, i) => ({
      star: 5 - i,
      count: Math.round((w / sum) * total),
    }));
  }, [product]);

  const nextImage = () => setActiveImageIndex((p) => (p + 1) % images.length);

  const prevImage = () =>
    setActiveImageIndex((p) => (p - 1 + images.length) % images.length);

  const handleAddToCart = async () => {
    if (!product) return;

    setAdding(true);
    try {
      await dispatch(
        addToCart({ product_id: product.id, quantity: 1 })
      ).unwrap();
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setBuying(true);
    try {
      await dispatch(
        addToCart({ product_id: product.id, quantity: 1 })
      ).unwrap();
      navigate('/cart');
    } finally {
      setBuying(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    await dispatch(toggleWishlist(product.id));
  };

  const handleRowAddToCart = async (productId) => {
    setAddingRowId(productId);
    try {
      await dispatch(
        addToCart({ product_id: productId, quantity: 1 })
      ).unwrap();
    } finally {
      setAddingRowId(null);
    }
  };

  const handleRowProductClick = (productId) => {
    if (!productId) {
      navigate('/products');
      return;
    }

    navigate(`/products/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAllFBT = async () => {
    if (!product) return;

    const ids = [product.id, ...fbtCompanions.map((p) => p.id)];

    for (const pid of ids) {
      await dispatch(addToCart({ product_id: pid, quantity: 1 }));
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setPincodeMsg('Please enter a valid 6-digit pincode.');
      return;
    }

    setPincodeMsg(
      `Delivery available to ${pincode}. Expected in 3–5 business days.`
    );
  };

  const renderSpecs = () => {
    const specs = [];

    if (product?.brand) specs.push(['Brand', product.brand]);
    if (product?.category?.name)
      specs.push(['Category', product.category.name]);
    if (product?.stock !== undefined)
      specs.push(['In the Box', `${product.stock} units available`]);
    if (product?.rating !== undefined)
      specs.push(['Customer Rating', `${product.rating} / 5`]);
    if (product?.review_count !== undefined)
      specs.push(['Total Ratings', product.review_count.toLocaleString()]);

    return specs;
  };

  const offers = [
    {
      icon: '🏦',
      label: 'Bank Offer',
      detail: '10% off on SBI Credit Cards, up to ₹1500. T&C apply',
    },
    {
      icon: '💳',
      label: 'Bank Offer',
      detail: '5% Unlimited Cashback on Flipkart Axis Bank Credit Card',
    },
    {
      icon: '🎁',
      label: 'Special Price',
      detail: 'Get extra 18% off (price inclusive of cashback/coupon)',
    },
    {
      icon: '📦',
      label: 'No Cost EMI',
      detail: 'Avail No Cost EMI on select cards for orders above ₹3000',
    },
  ];

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

  const descWords = product.description?.split(' ') || [];
  const isLongDesc = descWords.length > 60;

  const displayedDesc =
    isLongDesc && !showFullDesc
      ? `${descWords.slice(0, 60).join(' ')}...`
      : product.description;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4">
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className="lg:sticky lg:top-4 self-start">
              <div className="flex flex-col sm:flex-row gap-3">
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
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                <div className="order-1 sm:order-2 flex-1">
                  <div className="relative border border-gray-200 rounded-sm bg-white h-[320px] sm:h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
                    {Number(product.discount) > 0 && (
                      <span className="absolute top-2 left-2 bg-[#388e3c] text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {product.discount}% OFF
                      </span>
                    )}

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
                            activeImageIndex === index
                              ? 'bg-[#2874f0]'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding || product.stock === 0}
                      className="bg-[#ff9f00] hover:bg-[#f39a00] text-white font-bold py-3 rounded-sm flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      <FiShoppingCart size={16} />
                      {adding ? 'ADDING...' : 'ADD TO CART'}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={buying || product.stock === 0}
                      className="bg-[#fb641b] hover:bg-[#f05b10] text-white font-bold py-3 rounded-sm flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      <FiZap size={16} />
                      {buying ? 'PROCESSING...' : 'BUY NOW'}
                    </button>

                    <button
                      onClick={handleToggleWishlist}
                      disabled={toggleLoading}
                      className={`font-bold py-3 rounded-sm flex items-center justify-center gap-2 border transition-colors disabled:opacity-60 text-sm ${
                        isWishlisted
                          ? 'border-red-400 bg-red-50 text-red-500 hover:bg-red-100'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FiHeart
                        size={16}
                        className={isWishlisted ? 'fill-red-500' : ''}
                      />
                      {isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
                    </button>
                  </div>

                  {cartError && (
                    <p className="text-red-500 text-sm mt-3">{cartError}</p>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-4 border-t pt-4">
                    {[
                      { icon: FiTruck, label: 'Free Delivery' },
                      { icon: FiRefreshCw, label: '7 Day Return' },
                      { icon: FiShield, label: '1 Year Warranty' },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1 text-center"
                      >
                        <Icon size={20} className="text-[#2874f0]" />
                        <span className="text-xs text-gray-600 font-medium">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-gray-800 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {product.rating ? (
                  <span className="bg-green-600 text-white text-sm font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                    {product.rating}{' '}
                    <FiStar size={12} className="fill-white" />
                  </span>
                ) : null}

                {product.review_count ? (
                  <span className="text-sm text-gray-500 font-medium">
                    {product.review_count.toLocaleString()} Ratings &amp; Reviews
                  </span>
                ) : null}
              </div>

              <div className="mt-5">
                <p className="text-green-600 text-sm font-semibold">
                  Special Price
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
                <p className="text-xs text-gray-500 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              <div className="mt-3">
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

              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiTag className="text-[#2874f0]" /> Available Offers
                </h2>
                <ul className="space-y-2">
                  {offers.map((offer, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-base leading-5">{offer.icon}</span>
                      <p>
                        <span className="font-semibold">{offer.label}:</span>{' '}
                        {offer.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiMapPin className="text-[#2874f0]" /> Delivery
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      setPincodeMsg('');
                    }}
                    className="border border-gray-300 rounded-sm px-3 py-2 text-sm w-36 focus:outline-none focus:border-[#2874f0]"
                  />
                  <button
                    onClick={handlePincodeCheck}
                    className="text-[#2874f0] text-sm font-semibold hover:underline"
                  >
                    Check
                  </button>
                </div>

                {pincodeMsg && (
                  <p
                    className={`text-xs mt-1 ${
                      pincodeMsg.includes('valid')
                        ? 'text-red-500'
                        : 'text-green-600'
                    }`}
                  >
                    {pincodeMsg}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  Usually delivered in 3–5 business days.
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-800 mb-3">
                  Specifications
                </h2>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  {renderSpecs().length > 0 ? (
                    renderSpecs().map(([label, value], idx) => (
                      <div
                        key={label}
                        className={`grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] text-sm ${
                          idx !== renderSpecs().length - 1
                            ? 'border-b border-gray-200'
                            : ''
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

              {product.description && (
                <div className="mt-6">
                  <h2 className="text-base font-semibold text-gray-800 mb-2">
                    Description
                  </h2>
                  <p className="text-sm text-gray-700 leading-6">
                    {displayedDesc}
                  </p>

                  {isLongDesc && (
                    <button
                      onClick={() => setShowFullDesc((v) => !v)}
                      className="text-[#2874f0] text-sm font-semibold mt-2 flex items-center gap-1 hover:underline"
                    >
                      {showFullDesc ? 'Read less' : 'Read more'}
                      {showFullDesc ? (
                        <FiChevronUp size={14} />
                      ) : (
                        <FiChevronDown size={14} />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {fbtCompanions.length >= 2 && (
          <FlipkartFBT
            mainProduct={product}
            companions={fbtCompanions}
            onAddAll={handleAddAllFBT}
          />
        )}

        {recommendationsLoading ? (
          <div className="bg-white rounded-sm shadow-sm p-6 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {customersAlsoBought.length > 0 && (
              <FlipkartProductRow
                title="Customers Also Bought"
                badge="TRENDING"
                products={customersAlsoBought}
                onProductClick={handleRowProductClick}
                onAddToCart={handleRowAddToCart}
                addingId={addingRowId}
                wishlistItems={wishlistItems}
                onWishlist={(rowProductId) =>
                  dispatch(toggleWishlist(rowProductId))
                }
              />
            )}

            {similarProducts.length > 0 && (
              <FlipkartProductRow
                title="Similar Products"
                products={similarProducts}
                onProductClick={handleRowProductClick}
                onAddToCart={handleRowAddToCart}
                addingId={addingRowId}
                wishlistItems={wishlistItems}
                onWishlist={(rowProductId) =>
                  dispatch(toggleWishlist(rowProductId))
                }
              />
            )}
          </>
        )}

        {product.rating && product.review_count ? (
          <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Ratings &amp; Reviews
            </h2>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center justify-center min-w-[120px] text-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-6">
                <p className="text-5xl font-bold text-gray-900">
                  {product.rating}
                </p>
                <div className="flex gap-0.5 mt-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar
                      key={s}
                      size={16}
                      className={
                        s <= Math.round(product.rating)
                          ? 'fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {Number(product.review_count).toLocaleString()} ratings
                </p>
              </div>

              {ratingDist && (
                <div className="flex-1 space-y-2">
                  {ratingDist.map(({ star, count }) => (
                    <RatingBar
                      key={star}
                      label={star}
                      value={star}
                      max={5}
                      count={count}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  user: 'Rahul M.',
                  rating: 5,
                  title: 'Excellent product!',
                  body: 'Really impressed with the quality. Packaging was great and delivery was on time.',
                  date: '2 days ago',
                },
                {
                  user: 'Priya S.',
                  rating: 4,
                  title: 'Good value for money',
                  body: 'Works as described. Minor issue with the packaging but overall satisfied with the purchase.',
                  date: '1 week ago',
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-sm p-4 text-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-white text-xs font-bold ${
                        review.rating >= 4
                          ? 'bg-green-600'
                          : review.rating >= 3
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {review.rating} ★
                    </span>
                    <span className="font-semibold text-gray-800">
                      {review.title}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-5">{review.body}</p>
                  <p className="text-gray-400 mt-2 text-xs">
                    {review.user} · {review.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}