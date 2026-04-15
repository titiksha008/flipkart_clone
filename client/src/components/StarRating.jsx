export default function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
        {rating} ★
      </span>
      {count && <span className="text-xs text-gray-500">{count.toLocaleString()} ratings</span>}
    </div>
  );
}