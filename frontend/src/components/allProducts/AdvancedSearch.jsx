import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../api/axios";
import searchIcon from "../../assets/icons/search.svg";

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        const data = res.data;
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Lỗi khi lấy dữ liệu danh mục"
        );
      }
    };
    fetchCategories();
  }, []);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      q: searchParams.get("q") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      fromDate: searchParams.get("fromDate") || "",
      toDate: searchParams.get("toDate") || "",
    },
  });

  useEffect(() => {
    setValue("q", searchParams.get("q") || "");
  }, [searchParams, setValue]);

  const fromDate = watch("fromDate");

  const applyFilters = (data) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(data).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.set("page", 1);
    setSearchParams(next);
  };

  const updateSort = (sortBy, order) => {
    const next = new URLSearchParams(searchParams);
    if (sortBy) next.set("sortBy", sortBy);
    else next.delete("sortBy");
    if (order) next.set("order", order);
    else next.delete("order");
    setSearchParams(next);
  };

  const activeSubcategories = categories.filter(
    (cat) => cat.category_id === hoveredCategory?._id
  );

  return (
    <div className="w-full bg-white p-4 shadow-sm border rounded-xl space-y-4">
      {/*searchbar*/}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <input
            {...register("q")}
            type="text"
            placeholder="Bạn đang tìm gì..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(applyFilters)()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit(applyFilters)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
          >
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/*filters & sort*/}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/*categories & inputs */}
        <div className="flex flex-wrap items-center gap-4">
          {/* dropdown category */}
          <div className="relative group">
            <button
              className="px-3 py-1.5 border rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm"
              onMouseEnter={() => setIsCatOpen(true)}
              onClick={() => setIsCatOpen(!isCatOpen)}
            >
              Danh mục
              <span
                className={`transition-transform ${
                  isCatOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isCatOpen && (
              <div
                className="absolute top-full left-0 mt-1 flex z-50 shadow-xl"
                onMouseLeave={() => {
                  setIsCatOpen(false);
                  setHoveredCategory(null);
                }}
              >
                {/*parent category */}
                <div className="bg-white border rounded-l-md py-2 min-w-[150px]">
                  {categories
                    .filter((c) => !c.category_id)
                    .map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products/?categoryId=${cat._id}`}
                        className="block px-4 py-2 hover:bg-blue-50 text-sm"
                        onMouseEnter={() => setHoveredCategory(cat)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                </div>
                {/* sub category*/}
                {activeSubcategories.length > 0 && (
                  <div className="bg-gray-50 border border-l-0 rounded-r-md py-2 min-w-[150px]">
                    {activeSubcategories.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/products/?categoryId=${sub._id}`}
                        className="block px-4 py-2 hover:bg-white text-sm"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <input
              {...register("minPrice")}
              type="number"
              placeholder="Giá từ"
              className="w-24 border px-2 py-1 text-sm rounded-md"
            />
            <span className="text-gray-400">-</span>
            <input
              {...register("maxPrice")}
              type="number"
              placeholder="đến"
              className="w-24 border px-2 py-1 text-sm rounded-md"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 border-l pl-4">
            <span className="text-xs text-gray-500 uppercase font-bold">
              Hết hạn:
            </span>
            <input
              {...register("fromDate")}
              type="date"
              className="border px-2 py-1 text-sm rounded-md"
            />
            <span className="text-gray-400">-</span>
            <input
              {...register("toDate")}
              type="date"
              min={fromDate}
              className="border px-2 py-1 text-sm rounded-md"
            />
          </div>

          <button
            onClick={handleSubmit(applyFilters)}
            className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Xác nhận
          </button>
        </div>

        {/* RIGHT: Sorting */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sắp xếp:</label>
          <select
            value={searchParams.get("sortBy") || ""}
            onChange={(e) =>
              updateSort(e.target.value, searchParams.get("order") || "asc")
            }
            className="border px-2 py-1 text-sm rounded-md outline-none"
          >
            <option value="">Mặc định</option>
            <option value="price">Giá</option>
            <option value="endtime">Thời gian</option>
          </select>

          <select
            value={searchParams.get("order") || ""}
            onChange={(e) =>
              updateSort(searchParams.get("sortBy"), e.target.value)
            }
            className="border px-2 py-1 text-sm rounded-md outline-none"
            disabled={!searchParams.get("sortBy")}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
