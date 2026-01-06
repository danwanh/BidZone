"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  description: z.string().min(1, "Vui lòng nhập mô tả sản phẩm"),
  start_price: z.coerce
    .number()
    .min(0, "Giá khởi điểm phải >= 0")
    .refine((val) => val % 1000 === 0, {
      message: "Giá khởi điểm phải là bội số của 1.000",
    }),
  bid_step: z.coerce
    .number()
    .min(0, "Bước giá phải >= 0")
    .refine((val) => val % 1000 === 0, {
      message: "Giá khởi điểm phải là bội số của 1.000",
    }),
  buy_now_price: z.coerce
    .number()
    .min(0, "Giá mua ngay phải >= 0")
    .optional()
    .refine((val) => val % 1000 === 0, {
      message: "Giá khởi điểm phải là bội số của 1.000",
    }),
  end_time: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  is_autobid: z.boolean().default(false),
  allow_unrated_bidders: z.boolean().default(false),
});

export default function UploadProductPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      start_price: "",
      bid_step: "",
      buy_now_price: "",
      end_time: "",
      is_autobid: false,
      allow_unrated_bidders: false,
      category: "",
    },
  });

  // Watch để cập nhật description từ TinyMCE
  const descriptionValue = watch("description");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/category");
      const data = await response.data;

      setCategories(data);

      const map = {};
      data.forEach((cat) => {
        map[cat._id] = cat;
      });
      setCategoryMap(map);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const buildCategoryPath = (categoryId) => {
    const path = [];
    let current = categoryMap[categoryId];

    while (current) {
      path.unshift(current.name);
      current = current.category_id ? categoryMap[current.category_id] : null;
    }

    return path.join(" > ");
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setImages([...images, ...uploadedUrls]);
    setUploadingImages(false);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit_Form = async (formData) => {
    if (images.length < 3) {
      toast.error("Vui lòng tải lên ít nhất 3 ảnh sản phẩm");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/product", {
        name: formData.name,
        description: formData.description,
        image_url: images,
        start_price: Number.parseFloat(formData.start_price),
        bid_step: Number.parseFloat(formData.bid_step),
        buy_now_price: formData.buy_now_price
          ? Number.parseFloat(formData.buy_now_price)
          : undefined,
        category_id: formData.category,
        start_time: new Date(),
        end_time: formData.end_time,
        is_autobid: formData.is_autobid,
        allow_unrated_bidders: formData.allow_unrated_bidders,
        seller_id: user._id || "",
        current_price: Number.parseFloat(formData.start_price),
        status: "active",
      });

      if (response) {
        toast.success("Đăng sản phẩm thành công!");
        console.log(response);
        navigate(`/`);
      } else {
        toast.error("Có lỗi xảy ra khi đăng sản phẩm");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng sản phẩm đấu giá
          </h1>
          <p className="text-gray-600 mt-2">
            Nhập đầy đủ thông tin sản phẩm để bắt đầu đấu giá
          </p>
        </div>

        <div className="p-6">
          <form
            onSubmit={handleSubmit(handleSubmit_Form)}
            noValidate
            className="space-y-6"
          >
            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block font-bold text-gray-700">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Nhập tên sản phẩm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Images Upload - Cloudinary */}
            <div className="space-y-2">
              <label htmlFor="images" className="block font-bold text-gray-700">
                Hình ảnh sản phẩm (tối thiểu 3 ảnh)
                <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer block">
                  <div className="text-gray-600 mb-2">
                    {uploadingImages
                      ? "Đang tải lên..."
                      : "Nhấn để chọn ảnh hoặc kéo thả ảnh vào đây"}
                  </div>
                  <p className="text-sm text-gray-500">
                    Đã tải: {images.length} ảnh
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="start_price"
                  className="block font-bold text-gray-700"
                >
                  Giá khởi điểm (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  id="start_price"
                  type="number"
                  min="0"
                  step="1000"
                  {...register("start_price")}
                  placeholder="Ví dụ: 100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.start_price && (
                  <p className="text-red-500 text-sm">
                    {errors.start_price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bid_step"
                  className="block font-bold text-gray-700"
                >
                  Bước giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  id="bid_step"
                  type="number"
                  min="0"
                  step="1000"
                  {...register("bid_step")}
                  placeholder="Ví dụ: 5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.bid_step && (
                  <p className="text-red-500 text-sm">
                    {errors.bid_step.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buy_now_price"
                className="block font-bold text-gray-700"
              >
                Giá mua ngay (VNĐ){" "}
                <span className="text-gray-500">(tùy chọn)</span>
              </label>
              <input
                id="buy_now_price"
                type="number"
                min="0"
                step="1000"
                {...register("buy_now_price")}
                placeholder="Ví dụ: 500000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.buy_now_price && (
                <p className="text-red-500 text-sm">
                  {errors.buy_now_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block font-bold text-gray-700"
              >
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                {...register("category")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {buildCategoryPath(cat._id)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Chọn danh mục con phù hợp với sản phẩm
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="end_time"
                  className="block font-bold text-gray-700"
                >
                  Thời gian kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  id="end_time"
                  type="datetime-local"
                  {...register("end_time")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.end_time && (
                  <p className="text-red-500 text-sm">
                    {errors.end_time.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_autobid")}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Cho phép đấu giá tự động
                    </span>
                    <p className="text-xs text-gray-500">
                      Người mua có thể đặt giá tối đa và hệ thống tự động đấu
                      giá
                    </p>
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("allow_unrated_bidders")}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Cho phép bidder chưa được đánh giá
                    </span>
                    <p className="text-xs text-gray-500">
                      Người dùng mới có thể tham gia đấu giá sản phẩm này
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block font-bold text-gray-700"
              >
                Mô tả sản phẩm <span className="text-red-500">*</span>
              </label>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={descriptionValue}
                onEditorChange={(content) => setValue("description", content)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: ["lists", "link", "preview", "code", "autolink"],
                  toolbar:
                    "undo redo | bold italic underline | bullist numlist | link | removeformat",
                  branding: false,
                }}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || uploadingImages || images.length < 3}
            >
              {loading ? "Đang đăng..." : "Đăng sản phẩm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
