import React, { useState, useEffect } from "react";
import api from "../../../api/axios"; // Đường dẫn tới file axios của bạn

const FilterPopup = ({ initialFilters, onClose, onApply }) => {
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    name: initialFilters.q || "",
    status: initialFilters.status || "",
    categoryIds: initialFilters.category
      ? initialFilters.category.split(",")
      : [],
    sellers: initialFilters.seller ? initialFilters.seller.split(",") : [],
  });

  const [sellerInput, setSellerInput] = useState("");

  // Load danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        const rawCategories = res.data.categories || res.data || [];

        const sortedCategories = rawCategories.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(res.data.categories || res.data || []);
      } catch (err) {
        console.error("Lỗi load danh mục filter", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle Multi-select Category
  const toggleCategory = (catId) => {
    setLocalFilters((prev) => {
      const exists = prev.categoryIds.includes(catId);
      if (exists) {
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((id) => id !== catId),
        };
      }
      return { ...prev, categoryIds: [...prev.categoryIds, catId] };
    });
  };

  // Handle Seller Tags (Enter to add)
  const handleSellerKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = sellerInput.trim();
      if (val && !localFilters.sellers.includes(val)) {
        setLocalFilters((prev) => ({
          ...prev,
          sellers: [...prev.sellers, val],
        }));
        setSellerInput("");
      }
    }
  };

  const removeSeller = (sellerName) => {
    setLocalFilters((prev) => ({
      ...prev,
      sellers: prev.sellers.filter((s) => s !== sellerName),
    }));
  };

  const handleApply = () => {
    onApply({
      q: localFilters.name,
      status: localFilters.status,
      category: localFilters.categoryIds.join(","),
      seller: localFilters.sellers.join(","),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Bộ lọc sản phẩm</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* 1. Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={localFilters.name}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, name: e.target.value })
              }
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          {/* 2. Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={localFilters.status}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, status: e.target.value })
              }
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="ended">Đã kết thúc</option>
            </select>
          </div>

          {/* 3. Người bán (Tags Input) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người bán (Nhập tên & Enter)
            </label>
            <div className="border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 flex flex-wrap gap-2">
              {localFilters.sellers.map((seller) => (
                <span
                  key={seller}
                  className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {seller}
                  <button
                    onClick={() => removeSeller(seller)}
                    className="hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="flex-1 min-w-[100px] outline-none"
                value={sellerInput}
                onChange={(e) => setSellerInput(e.target.value)}
                onKeyDown={handleSellerKeyDown}
                placeholder={
                  localFilters.sellers.length === 0
                    ? "Nhập tên người bán..."
                    : ""
                }
              />
            </div>
          </div>

          {/* 4. Danh mục (Multi-select Checkbox) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <label
                    key={cat._id || cat.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.categoryIds.includes(
                        cat._id || cat.id
                      )}
                      onChange={() => toggleCategory(cat._id || cat.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Đang tải danh mục...</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
