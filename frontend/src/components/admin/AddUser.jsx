import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema Validation (Bao gồm cả password và confirm_password)
const addUserSchema = z
  .object({
    username: z.string().min(3, "Tối thiểu 3 ký tự").max(50),
    name: z.string().min(1, "Họ tên bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    gender: z.enum(["Nam", "Nữ", "Khác"]),
    address: z.string().optional(),
    dob: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirm_password"],
  });

const AddUser = ({ onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      gender: "Nam",
      address: "",
      dob: "",
    },
  });

  const onSubmit = async (data) => {
    // Loại bỏ confirm_password trước khi gửi lên API (nếu Backend không cần)
    const { confirm_password, ...submitData } = data;
    await onSave(submitData);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            Thêm người dùng mới
          </h3>
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
          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              {...register("username")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.username
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* NAME & EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* PASSWORD & CONFIRM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                {...register("password")}
                type="password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                {...register("confirm_password")}
                type="password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.confirm_password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.confirm_password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>

          {/* GENDER & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                {...register("gender")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                {...register("dob")}
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              {...register("address")}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            ></textarea>
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-md shadow-blue-200 cursor-pointer"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo người dùng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
