"use client"

export const ProductInfo = ({
  product,
  productStatus,
  postedTime,
  countdown,
  relativeTime,
  currentBid,
  totalBids,
  descriptionHistory,
  userRole,
  isEditMode,
  newDescription,
  setNewDescription,
  setIsEditMode,
  onAppendDescription,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span
            className={`text-sm inline-block px-4 py-1 rounded-full font-semibold ${
              productStatus === "closed" ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {productStatus === "closed" ? "✓ Đã đóng" : "✓ Đang đấu giá"}
          </span>
          <span
            className={`text-sm inline-block px-4 py-1 rounded-full font-semibold ml-2 ${
              product.is_autobid ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}
          >
            {product.is_autobid ? "✓ Đấu giá tự động" : "✓ Đấu giá thủ công"}
          </span>
        </div>

        {userRole === "seller" && (
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
          >
            {isEditMode ? "Xong" : "Chỉnh sửa"}
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <div className="text-indigo-500 font-semibold mb-4">{product.category_id?.name}</div>

      <div className={`p-4 rounded-lg text-center mb-4 ${productStatus === "closed" ? "bg-red-100" : "bg-yellow-100"}`}>
        <div className={`text-sm font-bold mb-1 ${productStatus === "closed" ? "text-red-700" : "text-yellow-700"}`}>
          {productStatus === "closed" ? "ĐÃ KẾT THÚC" : "THỜI GIAN CÒN LẠI"}
        </div>
        <div className={`text-2xl font-bold mb-1 ${productStatus === "closed" ? "text-red-700" : "text-yellow-700"}`}>
          {countdown}
        </div>
        <div className={`text-sm ${productStatus === "closed" ? "text-red-600" : "text-yellow-600"}`}>
          {relativeTime}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-gray-600 text-sm">Giá hiện tại</div>
          <div className="text-black text-2xl font-bold">{currentBid?.toLocaleString()} VNĐ</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-gray-600 text-sm">Số lượt đấu giá</div>
          <div className="text-black text-2xl font-bold">{totalBids || 0}</div>
        </div>
      </div>

      {product.buy_now_price && (
        <div className="bg-green-100 p-4 rounded-lg text-center mb-4">
          <div className="text-green-600 text-sm font-semibold mb-1">Giá Mua Ngay</div>
          <div className="text-green-700 text-2xl font-bold">{product.buy_now_price?.toLocaleString()} VNĐ</div>
        </div>
      )}

      <div className="text-gray-600 text-sm mb-4">
        Đăng bán: <span className="font-semibold">{postedTime}</span>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-lg font-bold mb-3">Mô tả chi tiết</div>

        <div className="space-y-4">
          {[...descriptionHistory]
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">{new Date(item.updated_at).toLocaleString("vi-VN")}</div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            ))}
        </div>

        {isEditMode && (
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="text-sm font-semibold mb-2 text-blue-600">Bổ sung mô tả cho sản phẩm</div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Nhập thông tin bổ sung..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2 text-sm"
              rows="4"
            />
            <button
              onClick={onAppendDescription}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
            >
              Thêm mô tả
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
