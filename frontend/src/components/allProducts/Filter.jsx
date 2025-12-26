import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    },
  });

  const onApply = (data) => {
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
          className="absolute z-10 mt-2 p-4 bg-[#E8E8F8] border rounded-lg shadow-xl w-72 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Khoảng giá
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Giá thấp nhất"
                className="w-full border p-1 rounded"
                {...register("minPrice")}
              />
              <input
                type="number"
                placeholder="Giá cao nhất"
                className="w-full border p-1 rounded"
                {...register("maxPrice")}
              />
            </div>
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
