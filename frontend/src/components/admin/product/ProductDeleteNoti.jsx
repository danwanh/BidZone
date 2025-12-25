import React from "react";

const ProductDelete = ({ product, onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center">
          {/* Icon cảnh báo */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900">
            Xác nhận xóa sản phẩm?
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Bạn có chắc chắn muốn xóa sản phẩm <b>{product?.name}</b>? Hành động
            này không thể hoàn tác.
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(product)}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none flex items-center cursor-pointer"
          >
            {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDelete;
