"use client"

export const BidHistory = ({ bidHistory, userRole, onRejectBid, isAutobid }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
      <h2 className="text-2xl font-bold mb-4">Lịch sử đấu giá</h2>
      <div className="max-h-80 overflow-y-auto space-y-3">
        {bidHistory &&
          bidHistory.map((b, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-3 rounded-lg transition ${
                b.status ? "bg-gray-100 hover:bg-gray-200" : "bg-red-50 opacity-60"
              }`}
            >
              <div className="flex-1">
                <div className="font-semibold">
                  {b.user} {!b.status && <span className="text-red-500 text-xs ml-2">(Đã bị từ chối)</span>}
                </div>
                <div className="text-gray-500 text-xs">{b.time}</div>
              </div>
              {
                isAutobid && userRole === "seller" && (
                  <div>
                    <div className="text-gray-500 text-sm mr-4">Giá vào</div>
                    <div className="text-black font-bold text-lg mr-4">{b.price?.toLocaleString()} VNĐ</div>
                  </div>
                )
              }
              <div>
                  <div className="text-gray-500 text-sm mr-4">Giá tối đa</div>
              <div className="text-black font-bold text-lg mr-4">{b.amount?.toLocaleString()} VNĐ</div>
              </div>
              {b.status && userRole === "seller" && (
                <button
                  onClick={() => onRejectBid(b.id, b.userId)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                >
                  Từ chối
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
