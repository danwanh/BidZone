"use client"

import { useState, useEffect } from "react"
import api from "../../api/axios.js"

export const UserProfilePopup = ({ user, isOpen, onClose }) => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen || !user?._id) return

    const fetchRatings = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await api.get(`/api/ratings/user/${user._id}`)
        setRatings(res.data || [])
      } catch (err) {
        console.error("Error fetching user ratings:", err)
        setError("Lỗi khi tải hồ sơ người dùng")
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [isOpen, user?._id])

  // reset khi đóng popup (tuỳ chọn)
  useEffect(() => {
    if (!isOpen) {
      setRatings([])
      setError(null)
      setLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            <img
              src={user?.avatar_url || "/placeholder.svg"}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>

              <div className="flex gap-6 mt-2">
                <div className="text-white">
                  <div className="text-sm opacity-90">Đánh giá tích cực</div>
                  <div className="text-2xl font-bold">{user?.rating_pos || 0}</div>
                </div>

                <div className="text-white">
                  <div className="text-sm opacity-90">Đánh giá tiêu cực</div>
                  <div className="text-2xl font-bold">{user?.rating_neg || 0}</div>
                </div>

                <div className="text-white">
                  <div className="text-sm opacity-90">Tỷ lệ tích cực</div>
                  <div className="text-2xl font-bold">
                    {user?.rating_pos + user?.rating_neg > 0
                      ? Math.round(
                          (user.rating_pos /
                            (user.rating_pos + user.rating_neg)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Đánh giá và nhận xét</h3>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="text-gray-500 mt-2">Đang tải...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && ratings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có đánh giá</p>
            </div>
          )}

          {!loading && !error && ratings.length > 0 && (
            <div className="space-y-4">
              {ratings.map((rating, idx) => (
                <div
                  key={rating._id || idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {rating.from_user_id.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(rating.point || 0)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700">{rating.comment}</p>

                  {rating.product_id.name && (
                    <div className="text-xs text-gray-500 mt-2">
                      Sản phẩm: {rating.product_id.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
