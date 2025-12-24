import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // State local để lưu giá trị trước khi Apply
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortPrice, setSortPrice] = useState(
    searchParams.get("sortPrice") || ""
  );
  const [sortTime, setSortTime] = useState(searchParams.get("sortTime") || "");

  const handleApply = () => {
    const next = new URLSearchParams(searchParams);

    // Cập nhật params, nếu trống thì xóa để URL sạch
    if (minPrice) next.set("minPrice", minPrice);
    else next.delete("minPrice");
    if (maxPrice) next.set("maxPrice", maxPrice);
    else next.delete("maxPrice");
    if (sortPrice) next.set("sortPrice", sortPrice);
    else next.delete("sortPrice");
    if (sortTime) next.set("sortTime", sortTime);
    else next.delete("sortTime");

    next.set("page", 1); // Reset về trang 1 khi lọc
    setSearchParams(next);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Bộ lọc {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-4 bg-[#E8E8F8] border rounded-lg shadow-xl w-72 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Khoảng giá</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full border p-1 rounded"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full border p-1 rounded"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giá sản phẩm
            </label>
            <select
              className="w-full border p-1 rounded"
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
            >
              <option value="">Mặc định</option>
              <option value="asc">Giá thấp đến cao</option>
              <option value="desc">Giá cao đến thấp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Thời gian kết thúc
            </label>
            <select
              className="w-full border p-1 rounded"
              value={sortTime}
              onChange={(e) => setSortTime(e.target.value)}
            >
              <option value="">Mặc định</option>
              <option value="end_soon">Kết thúc sớm nhất</option>
              <option value="end_late">Kết thúc muộn nhất</option>
            </select>
          </div>

          <button
            onClick={handleApply}
            className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-green-600"
          >
            Áp dụng
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;
