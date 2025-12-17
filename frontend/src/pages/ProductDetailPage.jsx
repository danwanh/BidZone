import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const ProductDetailPage = () => {
  const [product, setProduct] = useState();
  const [currentBid, setCurrentBid] = useState(12500);
  const [totalBids, setTotalBids] = useState(24);
  const [bidStep, setBidStep] = useState(500);
  const [countdown, setCountdown] = useState("");
  const [relativeTime, setRelativeTime] = useState("");
  const [endTime, setEndTime] = useState();
  const [bidInput, setBidInput] = useState("");
  const [mainImage, setMainImage] = useState();
  const [questions, setQuestions] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [seller, setSeller] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [postedTime, setPostedTime] = useState("");
  const [productStatus, setProductStatus] = useState("active");
  const [bidError, setBidError] = useState("");
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [descriptionHistory, setDescriptionHistory] = useState([]);

  // New states for enhanced features
  const [userRole, setUserRole] = useState("bidder"); // "bidder" | "seller"
  const [currentUserId, setCurrentUserId] = useState(
    "69113d2a06251b39d3acfd0d"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [answerText, setAnswerText] = useState({});
  const [showAnswerForm, setShowAnswerForm] = useState({});
  const [questionText, setQuestionText] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;

      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể lấy thông tin user");

      const user = await res.json();

      if (user) {
        setCurrentUser(user);
        setUserRole(user._id === product?.seller_id?._id ? "seller" : "bidder");
        setCurrentUserId(user._id);
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      return null;
    }
  };

  const fetchProduct = async (id) => {
    const res = await fetch(`http://localhost:3000/api/product/${id}`);
    const data = await res.json();
    setProduct(data);
  };

  const maskName = (name) => {
    if (!name) return "Ẩn danh";
    if (name.length <= 5) return name;
    const visible = name.slice(-5);
    const masked = "*".repeat(name.length - 5);
    return masked + visible;
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = new Date(date) - now;
    if (diff <= 0) return "Đã kết thúc";
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} ngày nữa`;
    if (hours > 0) return `${hours} giờ nữa`;
    if (minutes > 0) return `${minutes} phút nữa`;
    return `${seconds} giây nữa`;
  };

  const formatPostedTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `vừa mới`;
  };

  useEffect(() => {
    fetchProduct(id);
    if (!product) return;
    setMainImage(product.image_url?.[0]);
    setThumbnails(product.image_url || []);
    setCurrentBid(
      product.current_price == 0 ? product.start_price : product.current_price
    );
    setTotalBids(product.total_bids);
    setBidStep(product.bid_step);
    setEndTime(product.end_time);
    setPostedTime(formatPostedTime(product.date));
    setEditDescription("");
    setDescriptionHistory(product.description_history || []);
    console.log(product.description_history);
    setSeller({
      name: product.seller_id?.name,
      rating_pos: product.seller_id?.rating_pos || 0,
      rating_neg: product.seller_id?.rating_neg || 0,
      avatar:
        product.seller_id?.avatar_url ||
        "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
    });

    if (product.is_autobid) {
      fetchAutoBid(id);
    } else {
      fetchBids(id);
    }

    fetchRelatedProducts(product.category_id);
    fetchQuestions(id);
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchCurrentUser();
    } else {
      setUserRole("bidder");
      setCurrentUser(null);
    }
  }, [product]);

  const fetchBids = async (id) => {
    const res = await fetch(`http://localhost:3000/api/bids/product/${id}`);
    const data = await res.json();
    const mapped = data
      .map((bid) => ({
        id: bid._id,
        user: maskName(bid.bidder_id?.name),
        userId: bid.bidder_id?._id,
        amount: bid.price,
        time: bid.createdAt,
        status: bid.status !== false,
      }))
      .sort((a, b) => b.amount - a.amount);

    setBidHistory(mapped);

    const activeBids = mapped.filter((b) => b.status);
    if (activeBids.length > 0) {
      setCurrentBid(activeBids[0].amount);
      setTotalBids(activeBids.length);

      const topBidData = data.find((b) => b._id === activeBids[0].id);
      if (topBidData) {
        setHighestBidder({
          name: maskName(topBidData.bidder_id?.name),
          rating_pos: topBidData.bidder_id?.rating_pos || 0,
          reviews:
            (topBidData.bidder_id?.rating_pos || 0) +
            (topBidData.bidder_id?.rating_neg || 0),
          avatar: topBidData.bidder_id?.avatar_url,
        });
      }
    }
  };

  const fetchAutoBid = async (id) => {
    const res = await fetch(`http://localhost:3000/api/autobids/product/${id}`);
    const data = await res.json();
    const mapped = data
      .map((bid) => ({
        id: bid._id,
        user: maskName(bid.current_holder?.name),
        userId: bid.current_holder?._id,
        amount: bid.price,
        time: bid.createdAt,
        status: bid.status !== false,
      }))
      .sort((a, b) => b.amount - a.amount);

    setBidHistory(mapped);

    const activeBids = mapped.filter((b) => b.status);
    if (activeBids.length > 0) {
      setCurrentBid(activeBids[0].amount);
      setTotalBids(activeBids.length);

      const topBidData = data.find((b) => b._id === activeBids[0].id);
      if (topBidData) {
        setHighestBidder({
          name: maskName(topBidData.current_holder?.name),
          rating: topBidData.current_holder?.rating_pos || 0,
          reviews:
            (topBidData.current_holder?.rating_neg || 0) +
            (topBidData.current_holder?.rating_pos || 0),
          avatar:
            topBidData.current_holder?.avatar_url ||
            "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
        });
      }
    }
  };

  const fetchQuestions = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/questions/${id}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/product/by-category/${categoryId}`
      );
      const data = await res.json();
      setRelatedProducts(data.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (endTime) {
        const now = Date.now();
        const diff = new Date(endTime).getTime() - now;
        if (diff <= 0) {
          setCountdown("ENDED");
          setRelativeTime("Đã kết thúc");
          setProductStatus("closed");
          clearInterval(timer);
          return;
        }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h}h ${m}m ${s}s`);
        setRelativeTime(formatRelativeTime(endTime));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  async function handleBid() {
    setBidError("");
    if (!bidInput) {
      setBidError("Vui lòng nhập giá đấu");
      return;
    }
    const newBid = parseFloat(bidInput);
    const minBid = currentBid + bidStep;
    if (newBid < minBid) {
      setBidError(
        `Giá đấu tối thiểu là ${minBid.toLocaleString()} VNĐ (giá hiện tại + ${bidStep.toLocaleString()} VNĐ)`
      );
      return;
    }
    if ((newBid - currentBid) % bidStep !== 0) {
      setBidError(
        `Giá đấu phải tăng theo bước ${bidStep.toLocaleString()} VNĐ`
      );
      return;
    }

    const bidderId = currentUserId;
    console.log("Bid placed:", newBid);

    try {
      let url;
      let body;
      if (product.is_autobid === true) {
        url = "http://localhost:3000/api/autobids";
        body = {
          product_id: product._id,
          bidder_id: bidderId,
          max_price: newBid,
        };
      } else {
        url = "http://localhost:3000/api/bids";
        body = { product_id: product._id, bidder_id: bidderId, price: newBid };
      }
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setBidError(data.message || data.error || "Không thể đặt giá");
        return;
      }
      alert("Đặt giá thành công!");
      fetchProduct(id);
      setBidInput("");
    } catch (error) {
      console.error("Bid error:", error);
      setBidError("Có lỗi xảy ra khi đặt giá");
    }
  }

  async function handleBuyNow() {
    if (
      !window.confirm("Bạn chắc chắn muốn mua ngay? Sản phẩm sẽ được đóng lại.")
    ) {
      return;
    }
    const productId = product._id;
    const buyerId = currentUserId;
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/${productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            end_time: new Date(),
            bidder_id: buyerId,
            status: "ended",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Không thể mua ngay sản phẩm");
      }
      const data = await response.json();
      console.log("Buy Now thành công:", data);
      alert("Mua ngay thành công! Sản phẩm đã kết thúc.");
      setProduct(data);
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error);
      alert("Có lỗi xảy ra khi mua ngay.");
    }
  }

  const handleToggleWatchlist = async () => {
    try {
      setWatchlistLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/watchlist/${currentUserId}`,
        {
          method: isWatchlisted ? "DELETE" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id }),
        }
      );
      if (response.ok) {
        setIsWatchlisted(!isWatchlisted);
        console.log("Watchlist toggled successfully");
      } else {
        console.error("Failed to toggle watchlist");
      }
    } catch (error) {
      console.error("Watchlist error:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleAppendDescription = async () => {
    if (!newDescription.trim()) {
      alert("Vui lòng nhập mô tả mới");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/product/des-history/${product._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: newDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("BACKEND ERROR:", data);
        alert(data.message || "Không thể cập nhật mô tả");
        return;
      }

      setDescriptionHistory(data.description_history);

      // reset UI
      setNewDescription("");
      setIsEditMode(false);

      alert("Đã thêm mô tả thành công!");
    } catch (error) {
      console.error("Error updating description:", error);
      alert("Có lỗi xảy ra");
    }
  };

  const handleRejectBid = async (bidId, bidderId) => {
    if (!window.confirm("Bạn chắc chắn muốn từ chối người đấu giá này?")) {
      return;
    }

    try {
      // Update bid status to false
      const bidUrl = product.is_autobid
        ? `http://localhost:3000/api/autobids/${bidId}`
        : `http://localhost:3000/api/bids/${bidId}`;

      await fetch(bidUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: false }),
      });

      // Add to banned_bidders
      console.log(bidderId);
      await fetch(`http://localhost:3000/api/product/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ban_bidder_id: bidderId,
        }),
      });

      alert("Đã từ chối người đấu giá");

      // Refresh bids
      if (product.is_autobid) {
        fetchAutoBid(id);
      } else {
        fetchBids(id);
      }
      fetchProduct(id);
    } catch (error) {
      console.error("Error rejecting bid:", error);
      alert("Có lỗi xảy ra");
    }
  };

  // const handleSubmitReview = async () => {
  //   if (!reviewText.trim()) {
  //     alert("Vui lòng nhập đánh giá");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:3000/api/reviews", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         product_id: product._id,
  //         seller_id: product.seller_id._id,
  //         reviewer_id: currentUserId,
  //         rating: reviewRating,
  //         comment: reviewText,
  //       }),
  //     });

  //     if (response.ok) {
  //       alert("Đã gửi đánh giá thành công!");
  //       setReviewText("");
  //       setReviewRating(5);
  //       setShowReviewForm(false);
  //     } else {
  //       alert("Không thể gửi đánh giá");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting review:", error);
  //     alert("Có lỗi xảy ra");
  //   }
  // };

  const handleAnswerQuestion = async (questionId) => {
    const answer = answerText[questionId];
    if (!answer?.trim()) {
      alert("Vui lòng nhập câu trả lời");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/questions/${questionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: answer.trim() }),
        }
      );

      if (response.ok) {
        alert("Đã trả lời câu hỏi!");
        setAnswerText({ ...answerText, [questionId]: "" });
        setShowAnswerForm({ ...showAnswerForm, [questionId]: false });
        fetchQuestions(id);
      } else {
        alert("Không thể trả lời câu hỏi");
      }
    } catch (error) {
      console.error("Error answering question:", error);
      alert("Có lỗi xảy ra");
    }
  };

  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) {
      alert("Vui lòng nhập câu hỏi");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product._id,
          seller_id: product.seller_id._id,
          bidder_id: currentUserId,
          question: questionText.trim(),
          answer: "",
        }),
      });

      if (response.ok) {
        alert("Đã gửi câu hỏi thành công!");
        setQuestionText("");
        setShowQuestionForm(false);
        fetchQuestions(id);
      } else {
        console.log(response.json());
        alert("Không thể gửi câu hỏi");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Có lỗi xảy ra");
    }
  };

  if (!product) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="min-h-screen p-6">
      <button
        onClick={() => window.history.back()}
        className="mb-4 inline-block px-4 py-2 border-2 border-indigo-500 text-indigo-500 rounded-full bg-white hover:bg-indigo-500 hover:text-white transition"
      >
        ← Quay lại
      </button>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-2xl mb-6">
        <div>
          <div className="relative mb-4">
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src={mainImage || "/placeholder.svg?height=480&width=480"}
                alt={product.name}
                className="w-full h-full aspect-square object-cover rounded-xl border-2 border-gray-200"
              />
              {userRole === "bidder" && (
                <button
                  onClick={handleToggleWatchlist}
                  disabled={watchlistLoading}
                  className="absolute top-4 left-2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition disabled:opacity-50"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isWatchlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transition ${
                      isWatchlisted
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {thumbnails.slice(0, 4).map((t, i) => (
              <button
                key={i}
                onClick={() => setMainImage(t)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                  mainImage === t
                    ? "border-indigo-500 ring-2 ring-indigo-300"
                    : "border-gray-300 hover:border-indigo-300"
                }`}
              >
                <img
                  src={t || "/placeholder.svg?height=120&width=120"}
                  alt={`${product.name} ${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span
                className={`text-sm inline-block px-4 py-1 rounded-full font-semibold ${
                  productStatus === "closed"
                    ? "bg-red-100 text-red-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {productStatus === "closed" ? "✓ Đã đóng" : "✓ Đang đấu giá"}
              </span>
              <span
                className={`text-sm inline-block px-4 py-1 rounded-full font-semibold ml-2 ${
                  product.is_autobid
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {product.is_autobid
                  ? "✓ Đấu giá tự động"
                  : "✓ Đấu giá thủ công"}
              </span>
            </div>

            { userRole === "seller" &&
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
              >
                {isEditMode ? "Xong" : "Chỉnh sửa"}
              </button>
            }
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-indigo-500 font-semibold mb-4">
            {product.category_id?.name}
          </div>

          <div
            className={`p-4 rounded-lg text-center mb-4 ${
              productStatus === "closed" ? "bg-red-100" : "bg-yellow-100"
            }`}
          >
            <div
              className={`text-sm font-bold mb-1 ${
                productStatus === "closed" ? "text-red-700" : "text-yellow-700"
              }`}
            >
              {productStatus === "closed" ? "ĐÃ KẾT THÚC" : "THỜI GIAN CÒN LẠI"}
            </div>
            <div
              className={`text-2xl font-bold mb-1 ${
                productStatus === "closed" ? "text-red-700" : "text-yellow-700"
              }`}
            >
              {countdown}
            </div>
            <div
              className={`text-sm ${
                productStatus === "closed" ? "text-red-600" : "text-yellow-600"
              }`}
            >
              {relativeTime}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-gray-600 text-sm">Giá hiện tại</div>
              <div className="text-black text-2xl font-bold">
                {currentBid?.toLocaleString()} VNĐ
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-gray-600 text-sm">Số người đấu giá</div>
              <div className="text-black text-2xl font-bold">{totalBids}</div>
            </div>
          </div>

          {product.buy_now_price && (
            <div className="bg-green-100 p-4 rounded-lg text-center mb-4">
              <div className="text-green-600 text-sm font-semibold mb-1">
                Giá Mua Ngay
              </div>
              <div className="text-green-700 text-2xl font-bold">
                {product.buy_now_price?.toLocaleString()} VNĐ
              </div>
            </div>
          )}

          <div className="text-gray-600 text-sm mb-4">
            Đăng bán: <span className="font-semibold">{postedTime}</span>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-lg font-bold mb-3">Mô tả chi tiết</div>

            {/* Lịch sử mô tả */}
            <div className="space-y-4">
              {[...descriptionHistory]
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md border border-gray-200"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(item.updated_at).toLocaleString("vi-VN")}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>

            {/* Form thêm mô tả */}
            {userRole == "seller" && isEditMode && (
              <div className="mt-6 pt-4 border-t border-gray-300">
                <div className="text-sm font-semibold mb-2 text-blue-600">
                  Bổ sung mô tả cho sản phẩm
                </div>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Nhập thông tin bổ sung..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-2 text-sm"
                  rows="4"
                />
                <button
                  onClick={handleAppendDescription}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                >
                  Thêm mô tả
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Thông tin người bán</h3>
          {seller && (
            <div className="flex items-center gap-4">
              <img
                src={seller.avatar}
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
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm">
                  Xem hồ sơ
                </button>
              </div>
            </div>
          )}

          {userRole === "bidder" && productStatus === "closed" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-semibold"
              >
                ⭐ Đánh giá người bán
              </button>

              {showReviewForm && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">
                      Đánh giá:
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) =>
                        setReviewRating(parseInt(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Rất tốt</option>
                      <option value="4">⭐⭐⭐⭐ Tốt</option>
                      <option value="3">⭐⭐⭐ Trung bình</option>
                      <option value="2">⭐⭐ Kém</option>
                      <option value="1">⭐ Rất kém</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">
                      Nhận xét:
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              )}
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
                  "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"
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
                    {highestBidder.rating_pos} / {highestBidder.reviews} đánh
                    giá tích cực
                  </span>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed text-sm font-semibold"
                >
                  Hồ sơ được ẩn
                </button>
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
            <div className="text-gray-600">Chưa có người đặt giá nào.</div>
          )}
        </div>
      </div>

      {productStatus === "active" && userRole === "bidder" && (
        <div className="bg-white p-8 rounded-xl shadow-2xl mb-6">
          <h2 className="text-3xl font-bold mb-6">Đặt giá</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-sm opacity-90 mb-1">Giá hiện tại</div>
              <div className="text-2xl font-bold">
                {currentBid?.toLocaleString()} VNĐ
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-sm opacity-90 mb-1">Bước giá</div>
              <div className="text-2xl font-bold">
                {bidStep?.toLocaleString()} VNĐ
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-sm opacity-90 mb-1">
                Giá tối thiểu cần đặt
              </div>
              <div className="text-2xl font-bold">
                {(currentBid + bidStep)?.toLocaleString()} VNĐ
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="number"
              value={bidInput}
              onChange={(e) => setBidInput(e.target.value)}
              placeholder={`Nhập giá tối thiểu ${(
                currentBid + bidStep
              )?.toLocaleString()} VNĐ`}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 font-semibold outline"
            />
            <button
              onClick={handleBid}
              className="px-8 py-3 bg-indigo-400 text-gray-800 font-bold rounded-lg hover:bg-indigo-500 transition"
            >
              Đặt giá
            </button>
          </div>

          {bidError && (
            <div className="bg-red-500/30 border border-red-300 text-white px-4 py-2 rounded-lg text-sm">
              ⚠ {bidError}
            </div>
          )}
        </div>
      )}

      {productStatus === "active" && product.buy_now_price && (
        <div className="bg-green-50 p-6 rounded-xl shadow-lg mb-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-1">
                Mua Ngay
              </h3>
              <p className="text-sm text-gray-600">
                Kết thúc phiên đấu giá ngay và mua sản phẩm
              </p>
            </div>
            <div className="text-right mr-4">
              <div className="text-sm text-gray-600 mb-1">Giá mua ngay</div>
              <div className="text-3xl font-bold text-green-600">
                {product.buy_now_price?.toLocaleString()} VNĐ
              </div>
            </div>
            <button
              onClick={handleBuyNow}
              className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition text-lg"
            >
              Mua Ngay
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
        <h2 className="text-2xl font-bold mb-4">Lịch sử đấu giá</h2>
        <div className="max-h-80 overflow-y-auto space-y-3">
          {bidHistory &&
            bidHistory.map((b, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-lg transition ${
                  b.status
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-red-50 opacity-60"
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold">
                    {b.user}{" "}
                    {!b.status && (
                      <span className="text-red-500 text-xs ml-2">
                        (Đã bị từ chối)
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs">{b.time}</div>
                </div>
                <div className="text-black font-bold text-lg mr-4">
                  {b.amount?.toLocaleString()} VNĐ
                </div>

                {userRole == "seller" && b.status && (
                  <button
                    onClick={() => handleRejectBid(b.id, b.userId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                  >
                    Từ chối
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Hỏi đáp ({questions.length})</h2>

          {userRole === "bidder" && (
            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm font-semibold"
            >
              {showQuestionForm ? "Đóng" : "Đặt câu hỏi"}
            </button>
          )}
        </div>

        {userRole === "bidder" && showQuestionForm && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <label className="text-sm font-semibold mb-2 block text-indigo-700">
              Câu hỏi của bạn:
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập câu hỏi về sản phẩm..."
              className="w-full p-3 border border-indigo-300 rounded-lg text-sm mb-3"
              rows="3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitQuestion}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm font-semibold"
              >
                Gửi câu hỏi
              </button>
              <button
                onClick={() => {
                  setShowQuestionForm(false);
                  setQuestionText("");
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto space-y-4">
          {questions.length > 0 ? (
            questions.map((q, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4 py-2">
                <div className="font-semibold text-sm text-gray-700 mb-1">
                  {maskName(q.asker_name)}
                </div>
                <div className="text-gray-800 mb-2">{q.question}</div>

                {q.answer && (
                  <div className="bg-gray-50 p-3 rounded ml-2 border-l-2 border-green-500">
                    <div className="font-semibold text-sm text-green-700 mb-1">
                      Trả lời từ người bán:
                    </div>
                    <div className="text-gray-700 text-sm">{q.answer}</div>
                  </div>
                )}

                {userRole === "seller" && !q.answer && (
                  <div className="mt-3 ml-2">
                    {!showAnswerForm[q._id] ? (
                      <button
                        onClick={() =>
                          setShowAnswerForm({
                            ...showAnswerForm,
                            [q._id]: true,
                          })
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        Trả lời câu hỏi
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          value={answerText[q._id] || ""}
                          onChange={(e) =>
                            setAnswerText({
                              ...answerText,
                              [q._id]: e.target.value,
                            })
                          }
                          placeholder="Nhập câu trả lời..."
                          className="w-full p-3 border border-gray-300 rounded text-sm"
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnswerQuestion(q._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                          >
                            Gửi trả lời
                          </button>
                          <button
                            onClick={() =>
                              setShowAnswerForm({
                                ...showAnswerForm,
                                [q._id]: false,
                              })
                            }
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition text-sm"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">{q.created_at}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              Chưa có câu hỏi nào
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          Sản phẩm khác cùng chuyên mục
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {relatedProducts.slice(0, 5).map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={p.image_url?.[0] || "/placeholder.svg"}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-sm mb-1 truncate">{p.name}</h3>
              <p className="text-indigo-600 font-bold">
                {p.current_price?.toLocaleString()} VNĐ
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
