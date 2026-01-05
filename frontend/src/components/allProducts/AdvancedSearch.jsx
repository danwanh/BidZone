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

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      q: searchParams.get("q") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      fromDate: searchParams.get("fromDate") || "",
      toDate: searchParams.get("toDate") || "",
      categoryId: searchParams.get("categoryId") || "",
      sortBy: searchParams.get("sortBy") || "",
      order: searchParams.get("order") || "asc",
      justPosted: searchParams.get("justPosted") === "true" || false,
    },
  });

  const selectedCategoryId = watch("categoryId");
  const currentSortBy = watch("sortBy");
  const fromDate = watch("fromDate");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        setCategories(res.data);
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu danh mục");
      }
    };
    fetchCategories();
  }, []);

  const onApply = (data) => {
    const next = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });

    next.set("page", 1);
    setSearchParams(next);
    setIsCatOpen(false);
  };

  const onReset = () => {
    reset({
      q: "",
      minPrice: "",
      maxPrice: "",
      fromDate: "",
      toDate: "",
      categoryId: "",
      sortBy: "",
      order: "asc",
    });
    setSearchParams({});
  };

  const activeSubcategories = categories.filter(
    (cat) => cat.category_id === hoveredCategory?._id
  );

  const currentCatName =
    categories.find((c) => c._id === selectedCategoryId)?.name || "Danh mục";

  return (
    <div className="w-full bg-white p-4 shadow-sm border rounded-xl space-y-4">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <input
            {...register("q")}
            type="text"
            placeholder="Bạn đang tìm gì..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit(onApply)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              src={searchIcon}
              alt="Search"
              className="w-5 h-5 opacity-50 hover:opacity-100"
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Dropdown Category*/}
          <div className="relative group">
            <button
              type="button"
              className={`px-3 py-1.5 border rounded-md flex items-center gap-2 text-sm transition-colors ${
                selectedCategoryId
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setIsCatOpen(!isCatOpen)}
            >
              {currentCatName}
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
                className="absolute top-full left-0 mt-1 flex z-50 shadow-xl border rounded-md overflow-hidden"
                onMouseLeave={() => setIsCatOpen(false)}
              >
                <div className="bg-white py-2 min-w-[150px] border-r">
                  {categories
                    .filter((c) => !c.category_id)
                    .map((cat) => (
                      <div
                        key={cat._id}
                        className={`px-4 py-2 hover:bg-blue-50 text-sm cursor-pointer ${
                          selectedCategoryId === cat._id
                            ? "bg-blue-100 font-bold"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onClick={() => {
                          setValue("categoryId", cat._id);
                          if (
                            !categories.some(
                              (sub) => sub.category_id === cat._id
                            )
                          )
                            setIsCatOpen(false);
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                </div>
                {activeSubcategories.length > 0 && (
                  <div className="bg-gray-50 py-2 min-w-[150px]">
                    {activeSubcategories.map((sub) => (
                      <div
                        key={sub._id}
                        className={`px-4 py-2 hover:bg-white text-sm cursor-pointer ${
                          selectedCategoryId === sub._id
                            ? "bg-blue-100 font-bold"
                            : ""
                        }`}
                        onClick={() => {
                          setValue("categoryId", sub._id);
                          setIsCatOpen(false);
                        }}
                      >
                        {sub.name}
                      </div>
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
            <input
              {...register("toDate")}
              type="date"
              min={fromDate}
              className="border px-2 py-1 text-sm rounded-md"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sắp xếp:</label>
          <select
            {...register("sortBy")}
            className="border px-2 py-1 text-sm rounded-md outline-none"
          >
            <option value="">Mặc định</option>
            <option value="price">Giá</option>
            <option value="endtime">Thời gian</option>
          </select>
          <select
            {...register("order")}
            disabled={!currentSortBy}
            className="border px-2 py-1 text-sm rounded-md outline-none"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>

        <div className="flex items-center gap-2 border-l pl-4">
          <input
            {...register("justPosted")}
            type="checkbox"
            id="justPosted"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="justPosted"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Mới đăng (2 giờ qua)
          </label>
        </div>
      </div>

      {/* Confirm button */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-1.5 font-bold text-gray-600 hover:text-red-600 transition-colors"
        >
          Đặt lại bộ lọc
        </button>
        <button
          onClick={handleSubmit(onApply)}
          className="bg-blue-600 text-white px-8 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          XÁC NHẬN
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
