import React from "react";

const AdminResetPassword = ({ user, onConfirm, onCancel, isResetting }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center">
          {/* Icon Key/Lock */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900">
            Cấp lại mật khẩu?
          </h3>

          <div className="mt-2 text-sm text-gray-500">
            <p className="mb-2">
              Bạn có chắc chắn muốn reset mật khẩu cho tài khoản:
            </p>
            <p className="font-bold text-gray-800 text-base mb-2">
              {user?.name || user?.username}
            </p>
            <p className="italic text-xs">
              (Hệ thống sẽ tạo một mật khẩu ngẫu nhiên và gửi tới email của
              người dùng này).
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={isResetting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(user)}
            disabled={isResetting}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none flex items-center gap-2 cursor-pointer transition-colors disabled:bg-yellow-400"
          >
            {isResetting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              "Xác nhận cấp lại"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
