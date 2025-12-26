import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../api/axios";
import * as z from "zod";

// Schema Validation
const userSchema = z.object({
  username: z.string().min(3, "Tối thiểu 3 ký tự").max(50),
  name: z.string().min(1, "Họ tên bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  gender: z.enum(["Nam", "Nữ", "Khác"], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính" }),
  }),
  address: z.string().optional(),
  dob: z.string().or(z.date()).optional(),
});

const AdminEdit = ({ user, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      gender: "Nam",
      address: "",
      dob: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Xử lý format ngày sinh để hiển thị đúng trong input type="date"
      let formattedDob = "";
      if (user.dob) {
        const dateObj = new Date(user.dob);
        if (!isNaN(dateObj.getTime())) {
          // Chuyển sang format YYYY-MM-DD
          formattedDob = dateObj.toISOString().split("T")[0];
        }
      }

      reset({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "Nam",
        address: user.address || "",
        dob: formattedDob, // Set giá trị cho input date
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await api.put(`/api/users/${user._id}`, data);
      toast.success("Sửa đổi thông tin người dùng thành công");
      onCancel();
    } catch (err) {
      toast.err("Can't update user.");
      console.log(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            Cập nhật: {user?.username}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-red-400 px-1.5 rounded-md hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body - Thêm overflow-y-auto để cuộn nếu form quá dài */}
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
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                errors.username
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* NAME & EMAIL ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
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

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
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

          {/* GENDER & DOB ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GENDER - DROPDOWN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                {...register("gender")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* DATE OF BIRTH - DATE PICKER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                {...register("dob")}
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ADDRESS - TEXTAREA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              {...register("address")}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Nhập địa chỉ..."
            ></textarea>
          </div>
        </form>

        {/* Footer Buttons (Fixed at bottom) */}
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
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEdit;
