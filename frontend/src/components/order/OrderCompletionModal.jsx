import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import ChatInterface from "./ChatInterface";
import UserProfileModal from "./UserProfileModal";

export default function OrderCompletionModal({ isOpen, onClose, order, currentUserId, product, seller, buyer }) {
  const [orderData, setOrderData] = useState(order)
  const [paymentInvoice, setPaymentInvoice] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [shippingInvoice, setShippingInvoice] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [pendingRating, setPendingRating] = useState(null)
  const [userRating, setUserRating] = useState(null)
  const [ratingComment, setRatingComment] = useState("")
  const [activeTab, setActiveTab] = useState("process")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)

  const isSeller = useMemo(() => currentUserId === orderData?.seller_id._id, [currentUserId, orderData?.seller_id._id])
  const isBuyer = useMemo(() => currentUserId === orderData?.buyer_id._id, [currentUserId, orderData?.buyer_id._id])

  const loadOrderData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/orders/${order._id}`)
      setOrderData(response.data)
      console.log("Reloaded order data:", response.data)
    } catch (err) {
      console.error("Failed to load order data:", err)
    }
  }, [order._id])

  useEffect(() => {
    if (isOpen && order?._id) {
      loadOrderData()
    }
  }, [isOpen, order?._id, loadOrderData])

  const handleSubmitPayment = useCallback(async () => {
    if (!paymentInvoice.trim() || !deliveryAddress.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin")
      return
    }

    try {
      await axios.put(`/api/orders/${orderData._id}`, {
        invoice_info: paymentInvoice,
        address: deliveryAddress,
        status: "pending_shipping",
      })

      toast.success("Đã gửi thông tin thanh toán!")
      setPaymentInvoice("")
      setDeliveryAddress("")
      loadOrderData()
    } catch (err) {
      console.error("Payment submission failed:", err)
      toast.error(err.response?.data?.message || "Lỗi khi gửi thông tin thanh toán")
    }
  }, [paymentInvoice, deliveryAddress, orderData._id, loadOrderData])

  const handleConfirmPayment = useCallback(async () => {
    if (!shippingInvoice.trim()) {
      toast.error("Vui lòng nhập mã vận đơn")
      return
    }

    try {
      await axios.put(`/api/orders/${orderData._id}`, {
        delivery_info: shippingInvoice,
        status: "pending_delivery",
      })

      toast.success("Đã xác nhận và gửi hàng!")
      setShippingInvoice("")
      loadOrderData()
    } catch (err) {
      console.error("Confirm payment failed:", err)
      toast.error(err.response?.data?.message || "Lỗi khi xác nhận thanh toán")
    }
  }, [shippingInvoice, orderData._id, loadOrderData])

  const handleConfirmDelivery = useCallback(async () => {
    try {
      await axios.put(`/api/orders/${orderData._id}`, {
        status: "completed",
      })

      toast.success("Đã xác nhận nhận hàng!")
      loadOrderData()
    } catch (err) {
      console.error("Confirm delivery failed:", err)
      toast.error(err.response?.data?.message || "Lỗi khi xác nhận nhận hàng")
    }
  }, [orderData._id, loadOrderData])

  const handleCancelOrder = useCallback(async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy")
      return
    }

    try {
      await axios.put(`/api/orders/${orderData._id}`, {
        status: "cancelled",
        cancelled_by: currentUserId,
        cancellation_reason: cancelReason,
      })

      toast.success("Đã hủy giao dịch")
      setCancelReason("")
      setShowCancelDialog(false)
      loadOrderData()
    } catch (err) {
      console.error("Cancel order failed:", err)
      toast.error(err.response?.data?.message || "Lỗi khi hủy giao dịch")
    }
  }, [cancelReason, orderData._id, currentUserId, loadOrderData])

  const handleSubmitRating = useCallback(
    async (points) => {
      try {
        const res = await axios.patch("/api/ratings", {
          product_id: product._id,
          from_user_id: currentUserId,
          to_user_id: isBuyer ? orderData.seller_id._id : orderData.buyer_id._id,
          points,
          comment: ratingComment,
        })

        setUserRating(res.data)
        setPendingRating(null)
        setRatingComment("")

        await axios.put(`/api/orders/${orderData._id}`, {
          status: "completed",
        })

        toast.success("Đánh giá thành công!")
        loadOrderData()
      } catch (err) {
        console.error("Submit rating failed:", err)
        toast.error(err.response?.data?.message || "Lỗi khi gửi đánh giá")
      }
    },
    [userRating, ratingComment, isBuyer, orderData, product._id, currentUserId, loadOrderData],
  )

  const handleUpdateRating = useCallback(
    async (points) => {
      if (!userRating?._id) {
        toast.error("Không tìm thấy đánh giá để cập nhật")
        return
      }

      try {
        const res = await axios.patch(`/api/ratings/${userRating._id}`, {
          product_id: product._id,
          from_user_id: currentUserId,
          to_user_id: isBuyer ? orderData.seller_id._id : orderData.buyer_id._id,
          points,
          comment: ratingComment,
        })

        setUserRating(res.data)
        setPendingRating(null)
        setRatingComment("")
        toast.success("Cập nhật đánh giá thành công!")
        loadOrderData()
      } catch (err) {
        console.error("Update rating failed:", err)
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật đánh giá")
      }
    },
    [userRating, ratingComment, isBuyer, orderData, product._id, currentUserId, loadOrderData],
  )

  const loadUserRating = useCallback(async () => {
    try {
      if (!product?._id) return

      const toUserId = isBuyer ? orderData?.seller_id?._id : orderData?.buyer_id?._id
      if (!toUserId) return

      const res = await axios.get(
        `/api/ratings?product_id=${product._id}&from_user_id=${currentUserId}&to_user_id=${toUserId}`,
      )

      if (res.data && res.data.length > 0) {
        setUserRating(res.data[0])
        setRatingComment(res.data[0].comment || "")
      }
    } catch (err) {
      console.error("Failed to load user rating:", err)
    }
  }, [product._id, currentUserId, orderData, isBuyer])

  useEffect(() => {
    if (orderData?.status === "completed") {
      loadUserRating()
    }
  }, [orderData?.status, loadUserRating])

  const getCurrentStep = useCallback(() => {
    const statusMap = {
      pending_payment: 1,
      pending_shipping: 2,
      pending_delivery: 3,
      completed: 4,
      cancelled: 0,
    }
    return statusMap[orderData?.status] || 1
  }, [orderData?.status])

  const getStatusDisplay = useCallback(() => {
    const statusMap = {
      pending_payment: {
        label: "Chờ thanh toán",
        color: "bg-yellow-100 text-yellow-700",
        step: 1,
      },
      pending_shipping: {
        label: "Chờ vận chuyển",
        color: "bg-blue-100 text-blue-700",
        step: 2,
      },
      pending_delivery: {
        label: "Chờ nhận hàng",
        color: "bg-purple-100 text-purple-700",
        step: 3,
      },
      completed: {
        label: "Hoàn tất",
        color: "bg-green-100 text-green-700",
        step: 4,
      },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", step: 0 },
    }
    return statusMap[orderData?.status] || statusMap.pending_payment
  }, [orderData?.status])

  const renderStepContent = useCallback(() => {
    if (orderData?.status === "cancelled") {
      return (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div>
              <h3 className="font-bold text-red-700 mb-2">Đơn hàng đã bị hủy</h3>
              <p className="text-sm text-red-600">Lý do: {orderData.cancellation_reason || "Không có lý do"}</p>
            </div>
          </div>
        </div>
      )
    }

    if (orderData?.status === "pending_payment") {
      if (isBuyer) {
        return (
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Bước 1: Cung cấp thông tin thanh toán</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Hóa đơn thanh toán</label>
                <input
                  type="text"
                  placeholder="Nhập mã giao dịch hoặc link hóa đơn"
                  value={paymentInvoice}
                  onChange={(e) => setPaymentInvoice(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Địa chỉ giao hàng</label>
                <textarea
                  placeholder="Nhập địa chỉ đầy đủ"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSubmitPayment}
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        )
      } else if (isSeller) {
        return (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-yellow-700 mb-1">Đợi người mua</h3>
                <p className="text-sm text-yellow-600">
                  Đang chờ người mua cung cấp thông tin thanh toán và địa chỉ giao hàng
                </p>
              </div>
            </div>
          </div>
        )
      }
    }

    if (orderData?.status === "pending_shipping") {
      if (isSeller) {
        return (
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Bước 2: Xác nhận và gửi hàng</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold mb-1">Thông tin thanh toán từ người mua</label>
                <p className="text-sm text-gray-700">{orderData?.invoice_info || "Chưa cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold mb-1">Địa chỉ giao hàng</label>
                <p className="text-sm text-gray-700">{orderData?.address || "Chưa cập nhật"}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Hóa đơn vận chuyển</label>
                <input
                  type="text"
                  placeholder="Nhập mã vận đơn"
                  value={shippingInvoice}
                  onChange={(e) => setShippingInvoice(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleConfirmPayment}
                className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Xác nhận đã nhận tiền và gửi hàng
              </button>
            </div>
          </div>
        )
      } else if (isBuyer) {
        return (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-blue-700 mb-1">Đợi người bán</h3>
                <p className="text-sm text-blue-600">Đang chờ người bán xác nhận thanh toán và gửi hàng</p>
              </div>
            </div>
          </div>
        )
      }
    }

    if (orderData?.status === "pending_delivery") {
      if (isBuyer) {
        return (
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Bước 3: Xác nhận đã nhận hàng</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold mb-1">Mã vận đơn</label>
                <p className="text-sm text-gray-700">{orderData?.delivery_info || "Chưa cập nhật"}</p>
              </div>
              <button
                onClick={handleConfirmDelivery}
                className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
              >
                Xác nhận đã nhận hàng
              </button>
            </div>
          </div>
        )
      } else if (isSeller) {
        return (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-purple-700 mb-1">Đợi người mua</h3>
                <p className="text-sm text-purple-600">Đang chờ người mua xác nhận đã nhận hàng</p>
              </div>
            </div>
          </div>
        )
      }
    }

    if (orderData?.status === "completed") {
      if (userRating) {
        return (
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Bước 4: Đánh giá giao dịch</h3>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-green-700">Đánh giá của bạn:</p>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-white ${
                    userRating.points > 0 ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {userRating.points > 0 ? "+1 Tích cực" : "-1 Tiêu cực"}
                </span>
              </div>
              {userRating.comment && <p className="text-sm text-green-700 mb-3">Nhận xét: {userRating.comment}</p>}
              {!userRating.comment && <p className="text-sm text-gray-600 mb-3 italic">Không có nhận xét</p>}
              <p className="text-xs text-green-600">
                Gửi vào: {new Date(userRating.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <button
              onClick={() => setPendingRating(userRating.points)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Chỉnh sửa đánh giá
            </button>

            {pendingRating !== null && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-4">Chỉnh sửa đánh giá</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Điểm đánh giá</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPendingRating(1)}
                        className={`flex-1 px-6 py-4 rounded-lg font-bold border-2 transition ${
                          pendingRating === 1
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-green-600 border-green-300 hover:bg-green-50 hover:border-green-500"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          Tích cực (+1)
                        </div>
                      </button>
                      <button
                        onClick={() => setPendingRating(-1)}
                        className={`flex-1 px-6 py-4 rounded-lg font-bold border-2 transition ${
                          pendingRating === -1
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                          </svg>
                          Tiêu cực (-1)
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Nhận xét (tùy chọn)</label>
                    <textarea
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      rows={4}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setPendingRating(null)
                        setRatingComment(userRating.comment || "")
                      }}
                      className="flex-1 px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleUpdateRating(pendingRating)}
                      className="flex-1 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }

      return (
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Bước 4: Đánh giá giao dịch</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Chọn đánh giá của bạn</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPendingRating(1)}
                  className={`flex-1 px-6 py-4 rounded-lg font-bold border-2 transition ${
                    pendingRating === 1
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-green-600 border-green-300 hover:bg-green-50 hover:border-green-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    Tích cực (+1)
                  </div>
                </button>
                <button
                  onClick={() => setPendingRating(-1)}
                  className={`flex-1 px-6 py-4 rounded-lg font-bold border-2 transition ${
                    pendingRating === -1
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                    Tiêu cực (-1)
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Nhận xét (tùy chọn)</label>
              <textarea
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={4}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {pendingRating !== null && (
              <button
                onClick={() => handleSubmitRating(pendingRating)}
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Gửi đánh giá
              </button>
            )}
          </div>
        </div>
      )
    }

    return null
  }, [
    orderData,
    isBuyer,
    isSeller,
    paymentInvoice,
    deliveryAddress,
    shippingInvoice,
    userRating,
    ratingComment,
    pendingRating,
    handleSubmitPayment,
    handleConfirmPayment,
    handleConfirmDelivery,
    handleSubmitRating,
    handleUpdateRating,
  ])

  const handleShowUserProfile = useCallback((user) => {
    setSelectedUser(user)
    setShowUserProfile(true)
  }, [])

  if (!isOpen) return null

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="font-semibold">Quy trình đơn hàng</span>
          <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            {getCurrentStep()}
          </span>
        </button>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay()
  const currentStep = getCurrentStep()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Hoàn tất đơn hàng</h2>
            <span className={`px-3 py-1 rounded-full font-bold text-xs ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {orderData?.status !== "cancelled" && orderData?.status !== "completed" && (
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => {
                      console.log("Step", step)
                    }}
                    className={`w-8 h-8 rounded-full font-bold transition ${
                      step === currentStep
                        ? "bg-blue-600 text-white"
                        : step < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step < currentStep ? "✓" : step}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("process")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "process"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Quy trình
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "chat" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Chat
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "process" ? (
            <div className="space-y-6">
              {renderStepContent()}

              {isSeller && orderData?.status !== "cancelled" && orderData?.status !== "completed" && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                >
                  Hủy giao dịch
                </button>
              )}
            </div>
          ) : (
            <ChatInterface
              orderId={orderData?._id}
              sellerId={orderData?.seller_id}
              buyerId={orderData?.buyer_id}
              seller={seller}
              buyer={buyer}
            />
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCancelDialog(false)}
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">Bạn có chắc muốn hủy giao dịch?</h3>
            <p className="text-sm text-gray-600 mb-4">Hành động này sẽ hủy đơn hàng và không thể hoàn tác.</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Lý do hủy</label>
              <textarea
                placeholder="Nhập lý do hủy giao dịch"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <UserProfileModal isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} user={selectedUser} />
    </div>
  )
}
