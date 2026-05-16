"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import OrderCompletionModal from "../components/order/OrderCompletionModal";
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
import { toast } from "react-toastify";

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
  const [showBidModal, setShowBidModal] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState(null);

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
    let toggle = true;
    return name
      .split("")
      .map((char) => {
        if (char === " ") return char;
        if (toggle) {
          toggle = false;
          return char;
        } else {
          toggle = true;
          return "*";
        }
      })
      .join("");
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

  const setWinnerFromProduct = useCallback(
    (product) => {
      if (!product?.bidder_id) return;

      const u = product.bidder_id;
      setCurrentBid(product.current_price);
      setHighestBidder({
        name: maskName(u.name),
        rating_pos: u.rating_pos || 0,
        reviews: (u.rating_pos || 0) + (u.rating_neg || 0),
        avatar: u.avatar_url,
      });

      setBuyer({
        _id: u._id,
        name: u.name,
        rating_pos: u.rating_pos || 0,
        rating_neg: u.rating_neg || 0,
        avatar_url:
          u.avatar_url ||
          "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
      });
    },
    [maskName]
  );

  const fetchCurrentUser = useCallback(async () => {
    try {
      if (user) {
        setCurrentUser(user);

        setUserRole(user._id === product?.seller_id?._id ? "seller" : "bidder");
        setCurrentUserId(user._id);
        // console.log(user._id);
      } else {
        setUserRole("guest");
        setCurrentUserId("");
        setCurrentUser(null);
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
            rating_pos: bid.bidder_id?.rating_pos,
            rating_neg: bid.bidder_id?.rating_neg,
          }))
          .sort((a, b) => b.amount - a.amount);

        setBidHistory(mapped);

        if (product.status === "ended") {
          setWinnerFromProduct(product);
          return;
        }

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
    [maskName, product, setWinnerFromProduct]
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
            rating_pos: bid.current_holder?.rating_pos,
            rating_neg: bid.current_holder?.rating_neg,
          }))
          .sort((a, b) => b.price - a.price);

        setBidHistory(mapped);

        if (product.status === "ended") {
          setWinnerFromProduct(product);
          return;
        }

        const activeBids = mapped.filter((b) => b.status);
        if (activeBids.length > 0) {
          setCurrentBid(activeBids[0].price);
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
console.log(highestBidder);
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
    [maskName, product, setWinnerFromProduct]
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
    async (productId) => {
      try {
        const res = await axios.get(`/api/product/recommendation/${productId}`);
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

    product.is_autobid ? fetchAutoBid(id) : fetchBids(id);

    fetchRelatedProducts(product._id);
    fetchQuestions(id);

    fetchCurrentUser();
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

    setPendingBidAmount(newBid);
    setShowBidModal(true);
  }, [bidInput, currentBid, bidStep]);

  const handleConfirmBid = useCallback(async () => {
    setShowBidModal(false);
    const newBid = pendingBidAmount;

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

      toast.success("Đặt giá thành công!");
      fetchProduct(id);
      setBidInput("");
      setPendingBidAmount(null);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Không thể đặt giá";
      setBidError(errorMsg);
    }
  }, [pendingBidAmount, currentUserId, product, id, fetchProduct]);

  const handleCancelBid = useCallback(() => {
    setShowBidModal(false);
    setPendingBidAmount(null);
  }, []);

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
      toast.error("Vui lòng nhập mô tả mới");
      return;
    }

    try {
      const response = await axios.patch(`/api/product/des-history/${id}`, {
        description: newDescription.trim(),
      });

      setDescriptionHistory(response.data.description_history);
      setNewDescription("");
      setIsEditMode(false);
      toast.success("Đã thêm mô tả thành công!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Không thể cập nhật mô tả";
      toast.error(errorMsg);
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

        toast.success("Đã từ chối người đấu giá");

        if (product.is_autobid) {
          fetchAutoBid(id);
        } else {
          fetchBids(id);
        }
        fetchProduct(id);
      } catch (error) {
        console.error("Error rejecting bid:", error);
        toast.error("Có lỗi xảy ra");
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
    const sellerId = product.seller_id._id;

    try {
      const response = await axios.patch(`/api/product/${productId}`, {
        end_time: new Date(),
        bidder_id: buyerId,
        status: "ended",
        current_price: product.buy_now_price,
      });

      if (response.data) {
        await axios.post("/api/orders", {
          product_id: productId,
          seller_id: sellerId,
          buyer_id: buyerId,
        });

        toast.success("Mua ngay thành công! Order đã được tạo.");
        setProduct(response.data);
        window.location.reload();
      }
      setWinnerFromProduct(product);
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error);
      toast.error("Có lỗi xảy ra khi mua ngay.");
    }
  }, [product, currentUserId, id]);

  const handleSubmitQuestion = useCallback(async () => {
    if (!questionText.trim()) {
      toast.error("Vui lòng nhập câu hỏi");
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

      toast.success("Đã gửi câu hỏi thành công!");
      setQuestionText("");
      setShowQuestionForm(false);
      fetchQuestions(id);
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Có lỗi xảy ra");
    }
  }, [questionText, product, currentUserId, id, fetchQuestions]);

  const handleAnswerQuestion = useCallback(
    async (questionId) => {
      const answer = answerText[questionId];
      if (!answer?.trim()) {
        toast.error("Vui lòng nhập câu trả lời");
        return;
      }

      try {
        await axios.patch(`/api/questions/update/${questionId}`, {
          answer: answer.trim(),
        });

        toast.success("Đã trả lời câu hỏi!");
        setAnswerText({ ...answerText, [questionId]: "" });
        setShowAnswerForm({ ...showAnswerForm, [questionId]: false });
        fetchQuestions(id);
      } catch (error) {
        console.error("Error answering question:", error);
        toast.error("Có lỗi xảy ra");
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

  const isSeller = useMemo(() => {
    return currentUserId === product?.seller_id?._id;
  }, [currentUserId, product]);

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

      {showBidModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Xác nhận đặt giá</h2>
            <p className="text-gray-700 mb-6">
              Bạn chắc chắn muốn đặt giá{" "}
              <span className="font-bold text-blue-600">
                {pendingBidAmount?.toLocaleString()} VNĐ
              </span>{" "}
              không?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelBid}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmBid}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
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
      ) : ( !isSeller ) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700 font-medium">
            Bạn không đủ điều kiện tham gia đấu giá
          </p>
          <p className="text-red-600 mt-1">{bidBlockReason}</p>
        </div>
      )}
      { (
        <BidHistory
          bidHistory={bidHistory}
          userRole={userRole}
          onRejectBid={handleRejectBid}
          maskName={maskName}
          isAutobid={product.is_autobid}
        />
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
