import { useState, useEffect } from "react"
import axios from "../../api/axios";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !user?._id) return

    const fetchRatings = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/ratings?to_user_id=${user._id}`)
        setRatings(res.data || [])
      } catch (error) {
        console.error("Failed to fetch ratings:", error)
        setRatings([])
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [isOpen, user?._id])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold">Thông tin người dùng</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.avatar_url || "/placeholder.svg"}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
            />
            <div>
              <h4 className="font-bold text-xl mb-1">{user?.name}</h4>
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-semibold">+{user?.rating_pos || 0} tích cực</span>
                <span className="text-red-600 font-semibold">-{user?.rating_neg || 0} tiêu cực</span>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-bold text-lg mb-4">Đánh giá ({ratings.length})</h4>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-3">
                {ratings.map((rating) => (
                  <div key={rating._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${rating.points > 0 ? "text-green-600" : "text-red-600"}`}>
                        {rating.points > 0 ? "+1" : "-1"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {rating.comment && <p className="text-sm text-gray-700">{rating.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal;