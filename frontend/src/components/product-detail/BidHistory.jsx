import { useState } from "react";
import { UserProfilePopup } from "../common/UserProfilePopup";
import {formatPostedTime} from "../../utils/TimeFormat.js"

export const BidHistory = ({
  bidHistory,
  userRole,
  onRejectBid,
  isAutobid,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingReject, setPendingReject] = useState(null);

  const handleOpenProfile = (bid) => {
    if (!bid?.userId) return;

    setSelectedUser({
      _id: bid.userId, 
      name: bid.user,
      rating_pos: bid.rating_pos,
      rating_neg: bid.rating_neg,
    });
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử đấu giá</h2>

        <div className="max-h-80 overflow-y-auto space-y-3">
          {bidHistory &&
            bidHistory.map((b, i) => (
              <div
                key={b.id || i}
                className={`flex justify-between items-center p-3 rounded-lg transition ${
                  b.status
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-red-50 opacity-60"
                }`}
              >
                <div className="flex-1">
                  <button
                    onClick={() => handleOpenProfile(b)}
                    className="font-semibold text-indigo-600 hover:underline text-left cursor-pointer"
                  >
                    {b.user}
                  </button>

                  {!b.status && (
                    <span className="text-red-500 text-xs ml-2">
                      (Đã bị từ chối)
                    </span>
                  )}

                  <div className="text-gray-500 text-xs">{formatPostedTime(b.time)}</div>
                </div>

                {isAutobid ? (
                  <div className="text-right mr-4">
                    <div className="text-gray-500 text-sm">Giá vào</div>
                    <div className="text-black font-bold text-lg">
                      {b.price?.toLocaleString()} VNĐ
                    </div>

                    {userRole === "seller" && (
                      <>
                        <div className="text-gray-500 text-sm mt-1">
                          Giá tối đa
                        </div>
                        <div className="text-black font-bold text-lg">
                          {b.amount?.toLocaleString()} VNĐ
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-black font-bold text-lg mr-4">
                    {b.amount?.toLocaleString()} VNĐ
                  </div>
                )}

                {b.status && userRole === "seller" && (
                  <button
                    onClick={() => {
                      setPendingReject({ bidId: b.id, bidderId: b.userId });
                      setShowRejectModal(true);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                  >
                    Từ chối
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      {showRejectModal && pendingReject && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Xác nhận từ chối
            </h2>

            <p className="text-gray-700 mb-6">
              Bạn chắc chắn muốn{" "}
              <span className="font-bold text-red-600">
                từ chối người đấu giá này
              </span>
              {" "}không?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setPendingReject(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  await onRejectBid(
                    pendingReject.bidId,
                    pendingReject.bidderId
                  );
                  setShowRejectModal(false);
                  setPendingReject(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <UserProfilePopup
        user={selectedUser}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
      />
    </>
  );
};

export default BidHistory;
