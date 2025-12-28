"use client"

export const BidSection = ({
  productStatus,
  userRole,
  currentBid,
  bidStep,
  bidInput,
  setBidInput,
  bidError,
  onBid,
  product,
  onBuyNow,
}) => {
  return (
    <>
      {productStatus === "active" && userRole === "bidder" && (
        <div className="bg-white p-8 rounded-xl shadow-2xl mb-6">
          <h2 className="text-3xl font-bold mb-6">Đặt giá</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-sm opacity-90 mb-1">Giá hiện tại</div>
              <div className="text-2xl font-bold">{currentBid?.toLocaleString()} VNĐ</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-sm opacity-90 mb-1">Bước giá</div>
              <div className="text-2xl font-bold">{bidStep?.toLocaleString()} VNĐ</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-sm opacity-90 mb-1">Giá tối thiểu cần đặt</div>
              <div className="text-2xl font-bold">{(currentBid + bidStep)?.toLocaleString()} VNĐ</div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="number"
              value={bidInput}
              onChange={(e) => setBidInput(e.target.value)}
              placeholder={`Nhập giá tối thiểu ${(currentBid + bidStep)?.toLocaleString()} VNĐ`}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 font-semibold outline"
            />
            <button
              onClick={onBid}
              className="px-8 py-3 bg-indigo-400 text-gray-800 font-bold rounded-lg hover:bg-indigo-500 transition"
            >
              Đặt giá
            </button>
          </div>

          {bidError && (
            <div className="bg-red-500/30 border border-red-300 text-white px-4 py-2 rounded-lg text-sm">
              ⚠ {bidError}
            </div>
          )}
        </div>
      )}

      {productStatus === "active" && product.buy_now_price && userRole === "bidder" && (
        <div className="bg-green-50 p-6 rounded-xl shadow-lg mb-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-1">Mua Ngay</h3>
              <p className="text-sm text-gray-600">Kết thúc phiên đấu giá ngay và mua sản phẩm</p>
            </div>
            <div className="text-right mr-4">
              <div className="text-sm text-gray-600 mb-1">Giá mua ngay</div>
              <div className="text-3xl font-bold text-green-600">{product.buy_now_price?.toLocaleString()} VNĐ</div>
            </div>
            <button
              onClick={onBuyNow}
              className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition text-lg"
            >
              Mua Ngay
            </button>
          </div>
        </div>
      )}
    </>
  )
}
