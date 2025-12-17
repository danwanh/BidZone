"use client"

import { useState, useEffect } from "react"

function ChatInterface({ orderId, currentUserId, sellerId, buyerId, seller, buyer }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (orderId) {
      loadMessages()
      const interval = setInterval(loadMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [orderId])

  const loadMessages = async () => {
    // TODO: Fetch messages
    // const response = await fetch(`/api/chats/order/${orderId}`);
    // const data = await response.json();
    // setMessages(data);
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setLoading(true)
    // TODO: Send message
    // await fetch("/api/chats", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     order_id: orderId,
    //     seller_id: sellerId,
    //     bidder_id: buyerId,
    //     sender_id: currentUserId,
    //     content: newMessage.trim()
    //   })
    // });
    setNewMessage("")
    setLoading(false)
    loadMessages()
  }

  const isSeller = currentUserId === sellerId
  const otherUser = isSeller ? buyer : seller

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
        <img
          src={otherUser?.avatar_url || "/placeholder.svg?height=40&width=40"}
          alt={otherUser?.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-bold">{otherUser?.name || "Người dùng"}</h4>
          <p className="text-xs text-gray-600">
            +{otherUser?.rating_pos || 0} / -{otherUser?.rating_neg || 0} điểm
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender_id === currentUserId
            return (
              <div key={idx} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    isOwn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderCompletionModal({ isOpen, onClose, order, currentUserId, product, seller, buyer }) {
  const [orderData, setOrderData] = useState(order)
  const [paymentInvoice, setPaymentInvoice] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [shippingInvoice, setShippingInvoice] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [userRating, setUserRating] = useState(null)
  const [ratingComment, setRatingComment] = useState("")
  const [activeTab, setActiveTab] = useState("process")
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const isSeller = currentUserId === orderData?.seller_id
  const isBuyer = currentUserId === orderData?.buyer_id

  useEffect(() => {
    if (isOpen && orderData) {
      loadOrderData()
      loadUserRating()
    }
  }, [isOpen, orderData])

  const loadOrderData = async () => {
    // TODO: Fetch order data từ API
    // const response = await fetch(`/api/orders/${orderData._id}`);
    // const data = await response.json();
    // setOrderData(data);
  }

  const loadUserRating = async () => {
    // TODO: Fetch rating của user hiện tại
    // const response = await fetch(`/api/ratings/order/${orderData._id}/user/${currentUserId}`);
    // const data = await response.json();
    // if (data) {
    //   setUserRating(data);
    //   setRatingComment(data.comment || "");
    // }
  }

  const handleSubmitPayment = async () => {
    if (!paymentInvoice.trim() || !deliveryAddress.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin")
      return
    }
    // TODO: Submit thông tin thanh toán
    // await fetch(`/api/orders/${orderData._id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     payment_invoice: paymentInvoice,
    //     delivery_address: deliveryAddress,
    //     status: "pending_shipping"
    //   })
    // });
    alert("Đã gửi thông tin thanh toán!")
    loadOrderData()
  }

  const handleConfirmPayment = async () => {
    if (!shippingInvoice.trim()) {
      alert("Vui lòng nhập mã vận đơn")
      return
    }
    // TODO: Xác nhận đã nhận tiền và gửi hóa đơn vận chuyển
    // await fetch(`/api/orders/${orderData._id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     shipping_invoice: shippingInvoice,
    //     status: "pending_delivery"
    //   })
    // });
    alert("Đã xác nhận và gửi hàng!")
    loadOrderData()
  }

  const handleConfirmDelivery = async () => {
    // TODO: Xác nhận đã nhận hàng
    // await fetch(`/api/orders/${orderData._id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     status: "completed"
    //   })
    // });
    alert("Đã xác nhận nhận hàng!")
    loadOrderData()
  }

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy")
      return
    }
    // TODO: Hủy đơn hàng và tự động tạo rating -1
    // await fetch(`/api/orders/${orderData._id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     status: "cancelled",
    //     cancelled_by: currentUserId,
    //     cancellation_reason: cancelReason
    //   })
    // });
    //
    // // Create automatic -1 rating for buyer
    // await fetch("/api/ratings", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     order_id: orderData._id,
    //     product_id: orderData.product_id,
    //     rater_id: currentUserId,
    //     rated_id: orderData.buyer_id,
    //     rating: -1,
    //     comment: "Giao dịch bị hủy bởi người bán",
    //     role: "seller"
    //   })
    // });
    alert("Đã hủy giao dịch và đánh giá -1 cho người mua")
    setShowCancelDialog(false)
    loadOrderData()
  }

  const handleSubmitRating = async (rating) => {
    // TODO: Submit hoặc update rating
    // const method = userRating ? "PATCH" : "POST";
    // const url = userRating ? `/api/ratings/${userRating._id}` : "/api/ratings";
    //
    // await fetch(url, {
    //   method,
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     order_id: orderData._id,
    //     product_id: orderData.product_id,
    //     rater_id: currentUserId,
    //     rated_id: isSeller ? orderData.buyer_id : orderData.seller_id,
    //     rating: rating,
    //     comment: ratingComment,
    //     role: isSeller ? "seller" : "buyer"
    //   })
    // });
    alert(`Đã đánh giá ${rating > 0 ? "+1" : "-1"}`)
    loadUserRating()
  }

  const getStatusBadge = () => {
    const statusMap = {
      pending_payment: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700" },
      pending_shipping: { label: "Chờ vận chuyển", color: "bg-blue-100 text-blue-700" },
      pending_delivery: { label: "Chờ nhận hàng", color: "bg-purple-100 text-purple-700" },
      completed: { label: "Hoàn tất", color: "bg-green-100 text-green-700" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    }
    const status = statusMap[orderData?.status] || statusMap.pending_payment
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>{status.label}</span>
  }

  const renderStepContent = () => {
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

    if (orderData?.status === "pending_payment" && isBuyer) {
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
                rows="3"
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
    }

    if (orderData?.status === "pending_shipping" && isSeller) {
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
              <p className="text-sm text-gray-700">{orderData.payment_invoice}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold mb-1">Địa chỉ giao hàng</label>
              <p className="text-sm text-gray-700">{orderData.delivery_address}</p>
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
    }

    if (orderData?.status === "pending_delivery" && isBuyer) {
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
              <p className="text-sm text-gray-700">{orderData.shipping_invoice}</p>
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
    }

    if (orderData?.status === "completed") {
      return (
        <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
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
              <label className="block text-sm font-semibold mb-3">Đánh giá của bạn</label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleSubmitRating(1)}
                  className={`flex-1 px-6 py-4 rounded-lg font-bold border-2 transition ${
                    userRating?.rating === 1
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-green-600 border-green-500 hover:bg-green-50"
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
                  onClick={() => handleSubmitRating(-1)}
                  className={`flex-1 px-6 py-4 rounded-lg font-bold border-2 transition ${
                    userRating?.rating === -1
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-red-600 border-red-500 hover:bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
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
                rows="4"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            {userRating && <p className="text-sm text-gray-600 italic">Bạn có thể thay đổi đánh giá bất kỳ lúc nào.</p>}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Đang chờ bên kia thực hiện</h3>
        <p className="text-sm text-gray-600">
          {isSeller ? "Đang chờ người mua thực hiện bước tiếp theo." : "Đang chờ người bán thực hiện bước tiếp theo."}
        </p>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold mb-2">Hoàn tất đơn hàng</h2>
              <p className="text-sm text-gray-600">
                Sản phẩm: <span className="font-semibold">{product?.name}</span> - Giá thắng:{" "}
                <span className="font-semibold text-green-600">{product?.current_price?.toLocaleString()} VNĐ</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
              currentUserId={currentUserId}
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
            <p className="text-sm text-gray-600 mb-4">
              Hành động này sẽ tự động đánh giá -1 điểm cho người mua và không thể hoàn tác.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Lý do hủy</label>
              <textarea
                placeholder="Nhập lý do hủy giao dịch"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows="3"
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
    </div>
  )
}
