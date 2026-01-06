import React from "react";

const UpgradeConfirmNoti = ({
  upgrade,
  onConfirm,
  onCancel,
  isLoading,
  isRejectMode,
}) => {
  if (!upgrade) return null;

  const config = {
    title: isRejectMode ? "Từ chối yêu cầu?" : "Xác nhận nâng cấp?",
    content: isRejectMode
      ? "Bạn có chắc chắn muốn từ chối yêu cầu nâng cấp của tài khoản"
      : "Bạn có đồng ý nâng cấp quyền hạn cho tài khoản",
    btnText: isRejectMode ? "Từ chối ngay" : "Xác nhận duyệt",
    themeColor: isRejectMode ? "red" : "blue",
    icon: isRejectMode ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    ),
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        <div className="text-center">
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              isRejectMode ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            <svg
              className={`h-6 w-6 ${
                isRejectMode ? "text-red-600" : "text-blue-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {config.icon}
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            {config.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {config.content} <br />
            <span className="font-bold text-gray-800">
              {upgrade?.user_id?.username || upgrade?.user_id?.email}
            </span>
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => onConfirm(upgrade)}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex justify-center items-center disabled:opacity-50 cursor-pointer ${
              isRejectMode
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
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
                Đang xử lý...
              </span>
            ) : (
              config.btnText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeConfirmNoti;
