import { useState } from "react";
import { UserProfilePopup } from "../common/UserProfilePopup";

export const SellerInfo = ({ seller, highestBidder, currentBid }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Thông tin người bán</h3>
          {seller && (
            <div className="flex items-center gap-4">
              <img
                src={
                  seller.avatar_url ||
                  "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"
                }
                alt={seller.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg mb-1">{seller.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-green-600">
                    {seller.rating_pos} /{" "}
                    {seller.rating_neg + seller.rating_pos} đánh giá tích cực
                  </span>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
                >
                  Xem hồ sơ
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border-2 border-green-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">
              Người đặt giá cao nhất hiện tại
            </h3>
          </div>
          {highestBidder ? (
            <div className="flex items-center gap-6 mb-4">
              <img
                src={
                  highestBidder.avatar ||
                  "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt="Người đấu giá"
                className="w-24 h-24 rounded-full object-cover border-3 border-green-400"
              />
              <div className="flex-1">
                <div className="font-bold text-2xl mb-2 text-green-700">
                  {highestBidder.name}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-green-600 font-semibold">
                    {highestBidder.rating} / {highestBidder.reviews} đánh
                    giá tích cực
                  </span>
                </div>
                {/* <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed text-sm font-semibold"
                >
                  Hồ sơ được ẩn
                </button> */}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">
                  Giá đặt cao nhất
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {currentBid?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">VNĐ</div>
              </div>
            </div>
          ) : (
            // Căn giữa
            <div className="flex justify-center items-center">
              <div className="text-gray-600 text-center">
                Chưa có người đặt giá nào.
              </div>
            </div>
          )}
        </div>
      </div>

      <UserProfilePopup
        user={seller}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
