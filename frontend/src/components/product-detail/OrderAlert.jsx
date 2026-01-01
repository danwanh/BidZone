export const OrderAlert = ({ productStatus, isSellerOrBuyer, order, onOpenOrderModal }) => {
  return (
    <>
      {productStatus === "closed" && isSellerOrBuyer && order && (
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-yellow-800">Hoàn tất đơn hàng</h3>
              <p className="text-sm text-yellow-700">Phiên đấu giá đã kết thúc. Vui lòng hoàn tất giao dịch.</p>
            </div>
            <button
              onClick={onOpenOrderModal}
              className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
            >
              Mở quy trình
            </button>
          </div>
        </div>
      )}

      {productStatus === "closed" && !isSellerOrBuyer && (
        <div className="mb-6 bg-gray-100 border-2 border-gray-300 rounded-xl p-4">
          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-700">Sản phẩm đã kết thúc</h3>
            <p className="text-sm text-gray-600">Phiên đấu giá đã kết thúc và có người thắng cuộc.</p>
          </div>
        </div>
      )}
    </>
  )
}
