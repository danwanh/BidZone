import { useState, useRef, useCallback, useEffect } from "react"
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ChatInterface = ({ orderId, sellerId, buyerId, seller, buyer }) => {
  const { user, loading: authLoading } = useAuth()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const loadMessages = useCallback(async () => {
    if (!orderId) return

    try {
      const res = await axios.get(`/api/orders/${orderId}/messages`)
      setMessages(res.data || [])
    } catch (err) {
      console.error("Load messages failed:", err)
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId || authLoading || !user?._id) return

    loadMessages()
    const interval = setInterval(loadMessages, 3000)

    return () => clearInterval(interval)
  }, [orderId, user?._id, authLoading, loadMessages])

  const handleSendMessage = useCallback(async () => {
  if (!newMessage.trim() || !orderId || sending) return;

  const messageContent = newMessage.trim();
  const tempId = `temp-${Date.now()}`;
  setSending(true);

  // optimistic UI
  const optimisticMessage = {
    _id: tempId,
    sender: {
      _id: user?._id,
      name: user?.name,
    },
    content: messageContent,
    createdAt: new Date().toISOString(),
    optimistic: true,
  };

  setMessages((prev) => [...prev, optimisticMessage]);
  setNewMessage("");

  try {
    const res = await axios.post(
      `/api/orders/${orderId}/messages`,
      { content: messageContent }
    );

    const serverMessage = res.data?.data;

    if (serverMessage) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? serverMessage : msg
        )
      );
    }
  } catch (err) {
    console.error("Send message failed:", err);

    // rollback optimistic message
    setMessages((prev) =>
      prev.filter((msg) => msg._id !== tempId)
    );

    toast.error(
      "Gửi tin nhắn thất bại: " +
        (err.response?.data?.message || err.message)
    );
  } finally {
    setSending(false);
  }
}, [newMessage, orderId, user?._id, user?.name, sending]);


  if (authLoading) return null

  const currentUserId = user?._id
  const isSeller = currentUserId === sellerId
  const otherUser = isSeller ? buyer : seller

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <button
        className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition text-left"
        onClick={() => console.log("Show user profile:", otherUser)}
      >
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
      </button>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender?._id
            const isOwn = senderId === currentUserId

            return (
              <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[70%]">
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      isOwn ? "text-right text-blue-600" : "text-left text-gray-600"
                    }`}
                  >
                    {isOwn ? "Bạn" : otherUser?.name || "Người dùng"}
                  </p>

                  <div
                    className={`px-4 py-2 rounded-lg ${isOwn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}
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
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {sending ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface;