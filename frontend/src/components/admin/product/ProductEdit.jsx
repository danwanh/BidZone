import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../api/axios";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm bắt buộc"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Vui lòng chọn danh mục"),

  start_price: z.coerce.number().min(0, "Giá không hợp lệ"),
  bid_step: z.coerce.number().min(0, "Bước giá không hợp lệ"),
  buy_now_price: z.coerce.number().min(0, "Giá mua ngay không hợp lệ"),
  current_price: z.coerce.number().min(0, "Giá hiện tại không hợp lệ"),

  status: z.string(),

  allow_unrated_bidders: z.string(),
  is_autobid: z.string(),

  start_time: z.string(),
  end_time: z.string(),

  image_url: z.string().optional(),
});

const ProductEdit = ({ product, onSave, onCancel }) => {
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
      start_price: 0,
      bid_step: 0,
      buy_now_price: 0,
      current_price: 0,
      status: "active",
      allow_unrated_bidders: "true",
      is_autobid: "false",
      start_time: "",
      end_time: "",
      image_url: "",
    },
  });

  // 1. Fetch Categories for Dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        // Adjust depending on your API structure (res.data or res.data.categories)
        setCategories(res.data.categories || res.data || []);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      const formatDateTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().slice(0, 16);
      };

      const imagesString = Array.isArray(product.image_url)
        ? product.image_url.join("\n")
        : product.image_url || "";

      reset({
        name: product.name || "",
        description: product.description || "",
        category_id: product.category_id?._id || product.category_id || "", // Handle if category is populated object or just ID
        start_price: product.start_price || 0,
        bid_step: product.bid_step || 0,
        buy_now_price: product.buy_now_price || 0,
        current_price: product.current_price || 0,
        status: product.status || "active",
        allow_unrated_bidders: product.allow_unrated_bidders ? "true" : "false",
        is_autobid: product.is_autobid ? "true" : "false",
        start_time: formatDateTime(product.start_time),
        end_time: formatDateTime(product.end_time),
        image_url: imagesString,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      // Prepare data for API
      const formattedData = {
        ...data,
        // Convert "true"/"false" strings back to booleans
        allow_unrated_bidders: data.allow_unrated_bidders === "true",
        is_autobid: data.is_autobid === "true",
        // Convert textarea string back to array
        image_url: data.image_url
          .split("\n")
          .map((url) => url.trim())
          .filter((url) => url !== ""),
      };

      // Call the API patch method as requested
      const res = await api.patch(`/api/product/${product._id}`, formattedData);

      // Notify parent to update list
      if (onSave) onSave(res.data);
      else toast.success("Cập nhật sản phẩm thành công!");

      onCancel();
    } catch (err) {
      toast.error("Không thể cập nhật sản phẩm.");
      console.log(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">Cập nhật sản phẩm</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-red-400 px-1.5 rounded-md hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div className="flex justify-between gap-5">
            <div className="w-full">
              {/* PRODUCT NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  {...register("description")}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>
            <img
              className="w-[200px] h-[150px] object-cover mt-7 object-center rounded-2xl overflow-hidden ring ring-blue-900 ring-2 shadow-2xl"
              src={
                product.image_url != null && product.image_url.length > 0
                  ? product.image_url[0]
                  : "https://res.cloudinary.com/onlineauctionproject/image/upload/v1763451369/unnamed_hqaokg.png"
              }
              alt="Product"
            />
          </div>

          {/* CATEGORY & STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category_id")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
              >
                <option value="active">Đang diễn ra (active)</option>
                <option value="ended">Đã kết thúc (ended)</option>
                <option value="sold">Đã bán (sold)</option>
                <option value="inactive">Tạm ngưng (inactive)</option>
              </select>
            </div>
          </div>

          {/* MONEY FIELDS ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá khởi điểm
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  {...register("start_price")}
                  type="number"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bước giá
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  {...register("bid_step")}
                  type="number"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* MONEY FIELDS ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá mua ngay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  {...register("buy_now_price")}
                  type="number"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá hiện tại
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  {...register("current_price")}
                  type="number"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* TIME FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian bắt đầu
              </label>
              <input
                {...register("start_time")}
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian kết thúc
              </label>
              <input
                {...register("end_time")}
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* BOOLEAN DROPDOWNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cho phép chưa đánh giá
              </label>
              <select
                {...register("allow_unrated_bidders")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
              >
                <option value="true">Có (Yes)</option>
                <option value="false">Không (No)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tự động đấu giá (Auto Bid)
              </label>
              <select
                {...register("is_autobid")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
              >
                <option value="true">Có (Yes)</option>
                <option value="false">Không (No)</option>
              </select>
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link ảnh (Mỗi dòng 1 link)
            </label>
            <textarea
              {...register("image_url")}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none font-mono text-xs"
              placeholder="https://example.com/image1.jpg"
            ></textarea>
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center shadow-md shadow-blue-200"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
