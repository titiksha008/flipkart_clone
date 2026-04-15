export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="bg-white rounded-sm shadow-sm p-4">
      <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Category</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="radio"
            name="category"
            checked={!selected}
            onChange={() => onSelect('')}
            className="accent-blue-600"
          />
          All Categories
        </label>
        {categories.map(cat => (
          <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="category"
              checked={selected === cat.slug}
              onChange={() => onSelect(cat.slug)}
              className="accent-blue-600"
            />
            {cat.name}
          </label>
        ))}
      </div>
    </div>
  );
}