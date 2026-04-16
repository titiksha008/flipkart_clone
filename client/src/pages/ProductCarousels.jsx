import { useEffect, useRef, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiStar,
  FiHeart,
} from 'react-icons/fi';

function getImage(product) {
  try {
    const parsed = Array.isArray(product.images)
      ? product.images
      : JSON.parse(product.images);
    if (parsed?.length) return parsed[0];
  } catch {
    // ignore parse error
  }

  return 'https://via.placeholder.com/200x200?text=Product';
}

function discountedPrice(product) {
  return Math.round(
    Number(product.price) * (1 - Number(product.discount || 0) / 100)
  );
}

export function FlipkartProductCard({
  product,
  onClick,
  onAddToCart,
  addingId,
  onWishlist,
  wishlisted,
}) {
  const price = discountedPrice(product);
  const img = getImage(product);
  const isAdding = addingId === product.id;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col border border-gray-200 rounded bg-white cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        width: '185px',
        flexShrink: 0,
        boxShadow: hovered
          ? '0 4px 20px rgba(0,0,0,0.13)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
        borderRadius: '4px',
        background: '#fff',
      }}
    >
      {Number(product.discount) > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            background: '#388e3c',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '2px',
          }}
        >
          {product.discount}% off
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onWishlist?.(product.id);
        }}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: hovered || wishlisted ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <FiHeart
          size={14}
          style={{
            fill: wishlisted ? '#ff3d57' : 'none',
            color: wishlisted ? '#ff3d57' : '#888',
          }}
        />
      </button>

      <div
        style={{
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          overflow: 'hidden',
          background: '#fafafa',
        }}
      >
        <img
          src={img}
          alt={product.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      <div style={{ padding: '10px 12px 4px' }}>
        <p
          style={{
            fontSize: '13px',
            color: '#212121',
            fontWeight: 400,
            lineHeight: '18px',
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </p>

        {product.rating ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                background: '#388e3c',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              {product.rating}
              <FiStar size={9} style={{ fill: '#fff' }} />
            </span>

            {product.review_count ? (
              <span style={{ fontSize: '11px', color: '#878787' }}>
                ({Number(product.review_count).toLocaleString()})
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{ fontSize: '15px', fontWeight: 700, color: '#212121' }}
          >
            ₹{price.toLocaleString()}
          </span>

          {Number(product.discount) > 0 && (
            <>
              <span
                style={{
                  fontSize: '12px',
                  color: '#878787',
                  textDecoration: 'line-through',
                }}
              >
                ₹{Number(product.price).toLocaleString()}
              </span>
              <span
                style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600 }}
              >
                {product.discount}% off
              </span>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '8px 12px 12px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product.id);
          }}
          disabled={isAdding}
          style={{
            width: '100%',
            padding: '8px 0',
            background: isAdding ? '#e0e0e0' : '#fff',
            border: '1px solid #2874f0',
            color: '#2874f0',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '3px',
            cursor: isAdding ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isAdding) {
              e.currentTarget.style.background = '#2874f0';
              e.currentTarget.style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAdding) {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#2874f0';
            }
          }}
        >
          <FiShoppingCart size={13} />
          {isAdding ? 'Adding…' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}

function ArrowBtn({ direction, onClick, visible }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: '-18px',
        zIndex: 10,
        width: '36px',
        height: '36px',
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        cursor: 'pointer',
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {direction === 'left' ? (
        <FiChevronLeft size={18} color="#212121" />
      ) : (
        <FiChevronRight size={18} color="#212121" />
      )}
    </button>
  );
}

export function FlipkartProductRow({
  title,
  badge,
  viewAllLabel = 'VIEW ALL',
  products,
  onProductClick,
  onAddToCart,
  addingId,
  onWishlist,
  wishlistItems = [],
  accentColor = '#2874f0',
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 4;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(
      hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    );
  }, [products]);

  if (!products || !products.length) return null;

  const CARD_WIDTH = 197;

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = CARD_WIDTH * 4;
    el.scrollBy({
      left: dir === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 4;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(
      hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    );
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        padding: '16px 24px 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {badge && (
            <span
              style={{
                background: accentColor,
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '3px',
                letterSpacing: '0.5px',
              }}
            >
              {badge}
            </span>
          )}
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#212121',
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onProductClick(null)}
          style={{
            background: accentColor,
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            fontSize: '13px',
            fontWeight: 700,
            padding: '8px 20px',
            cursor: 'pointer',
          }}
        >
          {viewAllLabel}
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <ArrowBtn
          direction="left"
          onClick={() => scroll('left')}
          visible={canScrollLeft}
        />

        <div
          ref={scrollRef}
          onScroll={onScroll}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '4px',
          }}
        >
          {products.map((p) => (
            <FlipkartProductCard
              key={p.id}
              product={p}
              onClick={() => onProductClick(p.id)}
              onAddToCart={onAddToCart}
              addingId={addingId}
              onWishlist={onWishlist}
              wishlisted={wishlistItems.some(
                (w) => Number(w.product_id) === Number(p.id)
              )}
            />
          ))}
        </div>

        <ArrowBtn
          direction="right"
          onClick={() => scroll('right')}
          visible={canScrollRight}
        />
      </div>
    </div>
  );
}

export function FlipkartFBT({ mainProduct, companions, onAddAll }) {
  const all = [mainProduct, ...companions];
  const total = all.reduce((sum, p) => sum + discountedPrice(p), 0);
  const savings = all.reduce(
    (sum, p) => sum + (Number(p.price) - discountedPrice(p)),
    0
  );

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        padding: '20px 24px',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#212121',
          marginBottom: '20px',
        }}
      >
        Frequently Bought Together
      </h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {all.map((p, idx) => {
          const img = getImage(p);
          const price = discountedPrice(p);
          const isMain = idx === 0;

          return (
            <div
              key={p.id}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div
                style={{
                  border: `2px solid ${isMain ? '#2874f0' : '#e0e0e0'}`,
                  borderRadius: '6px',
                  padding: '12px',
                  width: '130px',
                  background: isMain ? '#f0f4ff' : '#fafafa',
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                {isMain && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#2874f0',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    This item
                  </span>
                )}

                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={img}
                    alt={p.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: '11px',
                    color: '#212121',
                    lineHeight: '15px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '4px',
                  }}
                >
                  {p.name}
                </p>

                <p
                  style={{ fontSize: '13px', fontWeight: 700, color: '#212121' }}
                >
                  ₹{price.toLocaleString()}
                </p>

                {Number(p.discount) > 0 && (
                  <p style={{ fontSize: '10px', color: '#388e3c' }}>
                    {p.discount}% off
                  </p>
                )}
              </div>

              {idx < all.length - 1 && (
                <span
                  style={{
                    fontSize: '24px',
                    color: '#bbb',
                    fontWeight: 300,
                    userSelect: 'none',
                  }}
                >
                  +
                </span>
              )}
            </div>
          );
        })}

        <div
          style={{
            marginLeft: 'auto',
            borderLeft: '1px solid #e0e0e0',
            paddingLeft: '24px',
            minWidth: '200px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#878787', marginBottom: '4px' }}>
            Total Price:
          </p>
          <p
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#212121',
              marginBottom: '4px',
            }}
          >
            ₹{total.toLocaleString()}
          </p>

          {savings > 0 && (
            <p
              style={{
                fontSize: '13px',
                color: '#388e3c',
                fontWeight: 600,
                marginBottom: '12px',
              }}
            >
              You save: ₹{savings.toLocaleString()}
            </p>
          )}

          <button
            type="button"
            onClick={onAddAll}
            style={{
              background: '#ff9f00',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              fontSize: '14px',
              fontWeight: 700,
              padding: '10px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FiShoppingCart size={16} />
            Add All to Cart
          </button>

          <p style={{ fontSize: '11px', color: '#878787', marginTop: '6px' }}>
            {all.length} items
          </p>
        </div>
      </div>
    </div>
  );
}