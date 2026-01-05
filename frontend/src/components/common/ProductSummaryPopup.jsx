import React from "react";

const ProductSummaryPopup = ({ product, onClose }) => {
  if (!product) return null;
  console.log(product);
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get latest description (last item in history)
  const latestDescription =
    product.description_history && product.description_history.length > 0
      ? product.description_history[product.description_history.length - 1]
          .description
      : "Chưa có mô tả";

  // Get category name safely
  const categoryName =
    product.category_id?.name || product.category?.name || "Chưa phân loại";

  // Get seller name safely
  const sellerName =
    product.seller_id?.name || product.seller_id?.username || "Ẩn danh";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800 truncate pr-4">
            Thông tin sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto">
          {/* Image & Basic Info */}
          <div className="flex gap-4 mb-4">
            <img
              src={
                product.image_url?.[0] ||
                "https://res.cloudinary.com/onlineauctionproject/image/upload/v1763451369/unnamed_hqaokg.png"
              }
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2">
                {product.name}
              </h4>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium mb-1">
                {categoryName}
              </span>
              <p className="text-sm text-gray-500">
                Người bán:{" "}
                <span className="font-medium text-gray-700">{sellerName}</span>
              </p>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Giá hiện tại</p>
              <p className="font-bold text-orange-600 text-lg">
                {formatCurrency(product.current_price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Giá mua ngay</p>
              <p className="font-bold text-gray-700">
                {product.buy_now_price
                  ? formatCurrency(product.buy_now_price)
                  : "---"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Giá khởi điểm</p>
              <p className="font-medium text-gray-700">
                {formatCurrency(product.start_price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bước giá</p>
              <p className="font-medium text-gray-700">
                {product.bid_step ? formatCurrency(product.bid_step) : "---"}
              </p>
            </div>
          </div>

          {/* Times */}
          <div className="flex justify-between text-sm mb-4 border-b pb-4">
            <div>
              <p className="text-xs text-gray-500">Bắt đầu</p>
              <p>{new Date(product.start_time).toLocaleString("vi-VN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Kết thúc</p>
              <p>{new Date(product.end_time).toLocaleString("vi-VN")}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="font-bold text-gray-800 mb-1 text-sm">
              Mô tả chi tiết:
            </p>
            <div
              className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 max-h-40 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: latestDescription }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSummaryPopup;
