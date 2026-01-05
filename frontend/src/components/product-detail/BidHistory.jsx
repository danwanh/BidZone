"use client";

import { useState } from "react";
import { UserProfilePopup } from "../common/UserProfilePopup";

export const BidHistory = ({
  bidHistory,
  userRole,
  onRejectBid,
  isAutobid,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleOpenProfile = (bid) => {
    if (!bid?.userId) return;

    setSelectedUser({
      _id: bid.userId, // QUAN TRỌNG: popup fetch theo _id
      name: bid.user,
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
                {/* USER INFO */}
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

                  <div className="text-gray-500 text-xs">{b.time}</div>
                </div>

                {/* PRICE INFO */}
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

                {/* ACTION */}
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

      {/* USER PROFILE POPUP */}
      <UserProfilePopup
        user={selectedUser}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
      />
    </>
  );
};

export default BidHistory;
