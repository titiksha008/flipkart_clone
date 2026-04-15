import { useState } from 'react';

export default function ImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0);

  if (!images.length) return (
    <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
  );

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 w-16 flex-shrink-0">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            onClick={() => setActive(i)}
            className={`w-14 h-14 object-contain border-2 cursor-pointer rounded ${active === i ? 'border-[#2874f0]' : 'border-gray-200 hover:border-blue-300'}`}
          />
        ))}
      </div>
      {/* Main */}
      <div className="flex-1 flex items-center justify-center bg-white h-80 rounded">
        <img
          src={images[active]}
          alt="product"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}