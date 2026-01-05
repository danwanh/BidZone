import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      fromDate: searchParams.get("fromDate") || "",
      toDate: searchParams.get("toDate") || "",
    },
  });

  const fromDate = watch("fromDate");

  const onApply = (data) => {
    console.log(data);
    const next = new URLSearchParams(searchParams);

    Object.entries(data).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });

    next.set("page", 1);
    setSearchParams(next);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Bộ lọc ▼
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit(onApply)}
          className="absolute z-10 mt-2 p-4 bg-[#E8E8F8] border rounded-lg shadow-xl w-80 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Khoảng giá</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder="Giá thấp nhất"
                className="w-full border p-1 rounded"
                {...register("minPrice")}
              />
              <input
                type="number"
                min="1"
                placeholder="Giá cao nhất"
                className="w-full border p-1 rounded"
                {...register("maxPrice")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Khoảng thời gian hết hạn
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                placeholder="Từ"
                className="w-full border p-1 rounded"
                {...register("fromDate")}
              />
              <input
                type="date"
                placeholder="Đến"
                className="w-full border p-1 rounded"
                {...register("toDate", {
                  validate: (value) =>
                    !fromDate ||
                    value >= fromDate ||
                    "Ngày đến không được trước ngày từ",
                })}
              />
            </div>
            {errors.toDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.toDate.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-green-600"
          >
            Áp dụng
          </button>
        </form>
      )}
    </div>
  );
};

export default Filter;
