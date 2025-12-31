import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import OrderCompletionModal from "../components/order/OrderCompletionModal";
import { ProductHeader } from "../components/product-detail/ProductHeader";
import { ProductImages } from "../components/product-detail/ProductImages";
import { ProductInfo } from "../components/product-detail/ProductInfo";
import { SellerInfo } from "../components/product-detail/SellerInfo";
import { BidSection } from "../components/product-detail/BidSection";
import { BidHistory } from "../components/product-detail/BidHistory";
import { QASection } from "../components/product-detail/QASection";
import { RelatedProducts } from "../components/product-detail/RelatedProducts";
import { OrderAlert } from "../components/product-detail/OrderAlert";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { useLiked } from "../context/LikedContext";

export const ProductDetailPage = () => {
  const { user } = useAuth();
  const params = useParams();
  const [product, setProduct] = useState(null);
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
  const [userRole, setUserRole] = useState("bidder");
  const [currentUserId, setCurrentUserId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [answerText, setAnswerText] = useState({});
  const [showAnswerForm, setShowAnswerForm] = useState({});
  const [questionText, setQuestionText] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToLikedList, removeFromLikedList, likedIds } = useLiked();
  const [isLiked, setIsLiked] = useState(likedIds.has(product?._id) || false);
  useEffect(() => {
    if (product?._id) {
      setIsLiked(likedIds.has(product._id));
    }
  }, [product, likedIds]);

  const id = params?.id;

  const maskName = useCallback((name) => {
    if (!name) return "Ẩn danh";
    if (name.length <= 5) return name;
    const visible = name.slice(-5);
    const masked = "*".repeat(name.length - 5);
    return masked + visible;
  }, []);

  const formatRelativeTime = useCallback((date) => {
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
  }, []);

  const formatPostedTime = useCallback((date) => {
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
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      if (user) {
        setCurrentUser(user);

        setUserRole(user._id === product?.seller_id?._id ? "seller" : "bidder");
        setCurrentUserId(user._id);
        // console.log(user._id);
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      return null;
    }
  }, [product?.seller_id?._id, user]);

  const fetchBids = useCallback(
    async (productId) => {
      try {
        const res = await axios.get(`/api/bids/product/${productId}`);
        const data = res.data;
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

            setBuyer({
              _id: topBidData.bidder_id?._id,
              name: topBidData.bidder_id?.name,
              rating_pos: topBidData.bidder_id?.rating_pos || 0,
              rating_neg: topBidData.bidder_id?.rating_neg || 0,
              avatar_url:
                topBidData.bidder_id?.avatar_url ||
                "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    },
    [maskName]
  );

  const fetchAutoBid = useCallback(
    async (productId) => {
      try {
        const res = await axios.get(`/api/autobids/product/${productId}`);
        const data = res.data;
        const mapped = data
          .map((bid) => ({
            id: bid._id,
            user: maskName(bid.current_holder?.name),
            userId: bid.current_holder?._id,
            amount: bid.max_price,
            price: bid.price,
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

            setBuyer({
              _id: topBidData.current_holder?._id,
              name: topBidData.current_holder?.name,
              rating_pos: topBidData.current_holder?.rating_pos || 0,
              rating_neg: topBidData.current_holder?.rating_neg || 0,
              avatar_url:
                topBidData.current_holder?.avatar_url ||
                "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching auto bids:", error);
      }
    },
    [maskName]
  );

  const fetchQuestions = useCallback(async (productId) => {
    try {
      const res = await axios.get(`/api/questions/${productId}`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, []);

  const fetchRelatedProducts = useCallback(
    async (categoryId) => {
      try {
        const res = await axios.get(`/api/product/by-category/${categoryId}`);
        const data = res.data;
        setRelatedProducts(
          Array.isArray(data) ? data.filter((p) => p.id !== id) : []
        );
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    },
    [id]
  );

  const checkAndLoadOrder = useCallback(async () => {
    if (!product) return;
    if (product.status !== "ended") return;

    try {
      const res = await axios.get(`/api/orders/product/${id}`);
      const data = res.data;
      setOrder(data);

      if (
        currentUserId === data.seller_id._id ||
        currentUserId === data.buyer_id._id
      ) {
        setShowOrderModal(true);
      }
    } catch (error) {
      console.log("No order found");
    }
  }, [product, currentUserId, id]);

  const fetchProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/product/${productId}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      fetchCurrentUser();
    }
  }, [id, fetchProduct]);

  useEffect(() => {
    if (!product) return;

    setMainImage(product.image_url?.[0]);
    setThumbnails(product.image_url || []);
    setCurrentBid(
      product.current_price === 0 ? product.start_price : product.current_price
    );
    setTotalBids(product.total_bids);
    setBidStep(product.bid_step);
    setEndTime(product.end_time);
    setPostedTime(formatPostedTime(product.date));
    setDescriptionHistory(product.description_history || []);

    setSeller({
      _id: product.seller_id?._id,
      name: product.seller_id?.name,
      rating_pos: product.seller_id?.rating_pos || 0,
      rating_neg: product.seller_id?.rating_neg || 0,
      avatar_url:
        product.seller_id?.avatar_url ||
        "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
    });

    Promise.all([
      product.is_autobid ? fetchAutoBid(id) : fetchBids(id),
      fetchRelatedProducts(product.category_id),
      fetchQuestions(id),
    ]);

    if (user) {
      fetchCurrentUser();
    } else {
      setUserRole("guest");
      setCurrentUser(null);
    }

    checkAndLoadOrder();
  }, [
    product,
    id,
    formatPostedTime,
    fetchBids,
    fetchAutoBid,
    fetchQuestions,
    fetchRelatedProducts,
    fetchCurrentUser,
    checkAndLoadOrder,
  ]);

  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = new Date(endTime).getTime() - now;
      if (diff <= 0) {
        setCountdown("ENDED");
        setRelativeTime("Đã kết thúc");
        setProductStatus("closed");
        clearInterval(timer);
        checkAndLoadOrder();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
      setRelativeTime(formatRelativeTime(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, formatRelativeTime, checkAndLoadOrder]);

  const handleBid = useCallback(async () => {
    setBidError("");
    if (!bidInput) {
      setBidError("Vui lòng nhập giá đấu");
      return;
    }
    const newBid = Number.parseFloat(bidInput);
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
    console.log(bidderId);
    try {
      const body =
        product.is_autobid === true
          ? { product_id: id, bidder_id: bidderId, max_price: newBid }
          : { product_id: id, bidder_id: bidderId, price: newBid };

      const endpoint =
        product.is_autobid === true ? "/api/autobids" : "/api/bids";
      const response = await axios.post(endpoint, body);

      alert("Đặt giá thành công!");
      fetchProduct(id);
      setBidInput("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Không thể đặt giá";
      setBidError(errorMsg);
    }
  }, [bidInput, currentBid, bidStep, currentUserId, product, id, fetchProduct]);

  const handleLike = async () => {
    if (!isLiked) {
      try {
        setIsLiked(true);
        addToLikedList(product._id);
      } catch (error) {
        console.error("Failed to add to watchlist:", error.message);
      }
    } else if (isLiked) {
      try {
        setIsLiked(false);
        removeFromLikedList(product._id);
      } catch (error) {
        console.error("Failed to remove from watchlist:", error.message);
      }
    }
  };

  const handleAppendDescription = useCallback(async () => {
    if (!newDescription.trim()) {
      alert("Vui lòng nhập mô tả mới");
      return;
    }

    try {
      const response = await axios.patch(`/api/product/des-history/${id}`, {
        description: newDescription.trim(),
      });

      setDescriptionHistory(response.data.description_history);
      setNewDescription("");
      setIsEditMode(false);
      alert("Đã thêm mô tả thành công!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Không thể cập nhật mô tả";
      alert(errorMsg);
    }
  }, [newDescription, id]);

  const handleRejectBid = useCallback(
    async (bidId, bidderId) => {
      if (!window.confirm("Bạn chắc chắn muốn từ chối người đấu giá này?")) {
        return;
      }
      console.log(bidId, bidderId);
      try {
        const endpoint =
          product.is_autobid === true ? "/api/autobids" : "/api/bids";

        await axios.patch(`${endpoint}/${bidId}/reject`);

        await axios.patch(`/api/product/${id}`, { ban_bidder_id: bidderId });

        alert("Đã từ chối người đấu giá");

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
    },
    [product, id, fetchBids, fetchAutoBid, fetchProduct]
  );

  const handleBuyNow = useCallback(async () => {
    if (
      !window.confirm("Bạn chắc chắn muốn mua ngay? Sản phẩm sẽ được đóng lại.")
    ) {
      return;
    }
    const productId = id;
    const buyerId = currentUserId;
    const sellerId = product.seller_id;

    try {
      const response = await axios.patch(`/api/product/${productId}`, {
        end_time: new Date(),
        bidder_id: buyerId,
        status: "ended",
      });

      if (response.data) {
        await axios.post("/api/orders", {
          product_id: productId,
          seller_id: sellerId,
          buyer_id: buyerId,
        });

        alert("Mua ngay thành công! Order đã được tạo.");
        setProduct(response.data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error);
      alert("Có lỗi xảy ra khi mua ngay.");
    }
  }, [product, currentUserId, id]);

  const handleSubmitQuestion = useCallback(async () => {
    if (!questionText.trim()) {
      alert("Vui lòng nhập câu hỏi");
      return;
    }

    try {
      await axios.post("/api/questions", {
        product_id: id,
        seller_id: product.seller_id._id,
        bidder_id: currentUserId,
        question: questionText.trim(),
        answer: "",
      });

      alert("Đã gửi câu hỏi thành công!");
      setQuestionText("");
      setShowQuestionForm(false);
      fetchQuestions(id);
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Có lỗi xảy ra");
    }
  }, [questionText, product, currentUserId, id, fetchQuestions]);

  const handleAnswerQuestion = useCallback(
    async (questionId) => {
      const answer = answerText[questionId];
      if (!answer?.trim()) {
        alert("Vui lòng nhập câu trả lời");
        return;
      }

      try {
        await axios.patch(`/api/questions/${questionId}`, {
          answer: answer.trim(),
        });

        alert("Đã trả lời câu hỏi!");
        setAnswerText({ ...answerText, [questionId]: "" });
        setShowAnswerForm({ ...showAnswerForm, [questionId]: false });
        fetchQuestions(id);
      } catch (error) {
        console.error("Error answering question:", error);
        alert("Có lỗi xảy ra");
      }
    },
    [answerText, showAnswerForm, id, fetchQuestions]
  );

  const isSellerOrBuyer = useMemo(() => {
    return (
      order &&
      (currentUserId === order.seller_id || currentUserId === order.buyer_id)
    );
  }, [order, currentUserId]);

  const { canBid, bidBlockReason } = useMemo(() => {
    if (!currentUser || !product) {
      return { canBid: false, bidBlockReason: "Vui lòng đăng nhập để đấu giá" };
    }
    console.log(product.banned_bidders, currentUser._id);

    const userId = currentUser._id;
    if (
      Array.isArray(product.banned_bidders) &&
      product.banned_bidders.some((id) => id?.toString() === userId?.toString())
    ) {
      return {
        canBid: false,
        bidBlockReason:
          "Bạn đã bị người bán chặn, không thể tham gia đấu giá sản phẩm này",
      };
    }

    const pos = currentUser.rating_pos || 0;
    const neg = currentUser.rating_neg || 0;
    const total = pos + neg;

    if (total === 0) {
      if (product.allow_unrated_bidders) {
        return { canBid: true, bidBlockReason: "" };
      }
      return {
        canBid: false,
        bidBlockReason:
          "Người bán không cho phép người chưa có đánh giá tham gia đấu giá",
      };
    }

    const score = pos / total;

    if (score >= 0.8) {
      return { canBid: true, bidBlockReason: "" };
    }

    return {
      canBid: false,
      bidBlockReason: `Điểm uy tín của bạn là ${Math.round(
        score * 100
      )}%. Cần tối thiểu 80% để tham gia đấu giá`,
    };
  }, [currentUser, product]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* <ProductHeader /> */}

      <OrderAlert
        productStatus={productStatus}
        isSellerOrBuyer={isSellerOrBuyer}
        order={order}
        onOpenOrderModal={() => setShowOrderModal(true)}
      />

      {showOrderModal && order && (
        <OrderCompletionModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          order={order}
          currentUserId={currentUserId}
          product={product}
          seller={seller}
          buyer={buyer}
        />
      )}

      <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-2xl mb-6">
        <ProductImages
          mainImage={mainImage}
          setMainImage={setMainImage}
          thumbnails={thumbnails}
          product={product}
          isLiked={isLiked}
          watchlistLoading={watchlistLoading}
          onToggleWatchlist={handleLike}
          userRole={userRole}
        />

        <ProductInfo
          product={product}
          productStatus={productStatus}
          postedTime={postedTime}
          countdown={countdown}
          relativeTime={relativeTime}
          currentBid={currentBid}
          totalBids={totalBids}
          descriptionHistory={descriptionHistory}
          userRole={userRole}
          isEditMode={isEditMode}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          setIsEditMode={setIsEditMode}
          onAppendDescription={handleAppendDescription}
        />
      </div>

      <SellerInfo
        seller={seller}
        highestBidder={highestBidder}
        currentBid={currentBid}
      />

      {userRole === "guest" ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">Bạn cần đăng nhập để đấu giá.</p>
          <a
            href="/auth"
            className="inline-block mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Đăng nhập
          </a>
        </div>
      ) : canBid ? (
        <BidSection
          productStatus={productStatus}
          userRole={userRole}
          currentBid={currentBid}
          bidStep={bidStep}
          bidInput={bidInput}
          setBidInput={setBidInput}
          bidError={bidError}
          onBid={handleBid}
          product={product}
          onBuyNow={handleBuyNow}
        />
      ) : (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700 font-medium">
            Bạn không đủ điều kiện tham gia đấu giá
          </p>
          <p className="text-red-600 mt-1">{bidBlockReason}</p>
        </div>
      )}

      <QASection
        questions={questions}
        userRole={userRole}
        showQuestionForm={showQuestionForm}
        setShowQuestionForm={setShowQuestionForm}
        questionText={questionText}
        setQuestionText={setQuestionText}
        onSubmitQuestion={handleSubmitQuestion}
        answerText={answerText}
        setAnswerText={setAnswerText}
        showAnswerForm={showAnswerForm}
        setShowAnswerForm={setShowAnswerForm}
        onAnswerQuestion={handleAnswerQuestion}
        maskName={maskName}
      />

      <RelatedProducts relatedProducts={relatedProducts} />
    </div>
  );
};
export default ProductDetailPage;
