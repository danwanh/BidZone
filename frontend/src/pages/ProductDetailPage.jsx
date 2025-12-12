import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

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

  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const fetchProduct = async (id) => {
    const res = await fetch(`http://localhost:3000/api/product/${id}`);
    const data = await res.json();
    setProduct(data);
  };

  const maskName = (name) => {
    if (!name) return "Ẩn danh";
    if (name.length <= 5) return name;

    const visible = name.slice(-5); // Lấy 5 ký tự cuối
    const masked = "*".repeat(name.length - 5); // Che phần còn lại

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
    if (!product) return;

    setMainImage(product.image_url?.[0]);
    setThumbnails(product.image_url || []);
    setCurrentBid(
      product.current_price == 0 ? product.start_price : product.current_price
    );
    setTotalBids(product.total_bids);
    setBidStep(product.bid_step);
    setEndTime(product.end_time);
    setPostedTime(formatPostedTime(product.date)); // set posted time
    setSeller({
      // set seller info
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

    fetchRelatedProducts(product.category_id); // fetch related products
    fetchQuestions(id); // fetch Q&A
  }, [product]);

  const fetchBids = async (id) => {
    const res = await fetch(`http://localhost:3000/api/bids/${id}`);
    const data = await res.json();

    const mapped = data
      .map((bid) => ({
        user: maskName(bid.bidder_id?.name),
        amount: bid.price,
        time: bid.createdAt,
      }))
      .sort((a, b) => b.amount - a.amount);

    setBidHistory(mapped);
    setCurrentBid(mapped[0].amount);
    setTotalBids(mapped.length);

    if (mapped.length > 0) {
      const topBid = data[data.length - 1];
      setHighestBidder({
        name: maskName(topBid.bidder_id?.name),
        rating_pos: topBid.bidder_id?.rating_pos || 0,
        reviews:
          (topBid.bidder_id?.rating_pos || 0) +
          (topBid.bidder_id?.rating_neg || 0),
        avatar: topBid.bidder_id?.avatar_url,
      });
    }
  };

  const fetchAutoBid = async (id) => {
    const res = await fetch(`http://localhost:3000/api/autobids/${id}`);
    const data = await res.json();

    const mapped = data
      .map((bid) => ({
        user: maskName(bid.current_holder?.name),
        amount: bid.price,
        time: bid.createdAt,
      }))
      .sort((a, b) => b.amount - a.amount);

    setBidHistory(mapped);
    setCurrentBid(mapped[0].price);
    setTotalBids(mapped.length);

    if (mapped.length > 0) {
      const topBid = data[data.length - 1];
      setHighestBidder({
        name: maskName(topBid.current_holder?.name),
        rating: topBid.current_holder?.rating_pos || 0,
        reviews:
          topBid.current_holder?.rating_neg +
            topBid.current_holder?.rating_pos || 0,
        avatar:
          topBid.current_holder?.avatar_url ||
          "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
      });
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
          setProductStatus("closed"); // Update product status to closed
          clearInterval(timer);
          return;
        }

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h}h ${m}m ${s}s`);
        setRelativeTime(formatRelativeTime(endTime)); // update relative time
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

    // Kiểm tra giá tối thiểu
    if (newBid < minBid) {
      setBidError(
        `Giá đấu tối thiểu là ${minBid.toLocaleString()} VNĐ (giá hiện tại + ${bidStep.toLocaleString()} VNĐ)`
      );
      return;
    }

    // Kiểm tra bước giá
    if ((newBid - currentBid) % bidStep !== 0) {
      setBidError(
        `Giá đấu phải tăng theo bước ${bidStep.toLocaleString()} VNĐ`
      );
      return;
    }

    // --- LẤY USER ID TỪ LOCAL STORAGE ---
    // const user = JSON.parse(localStorage.getItem("user"));
    // if (!user?._id) {
    //   setBidError("Bạn chưa đăng nhập!");
    //   return;
    // }
    // const bidderId = user._id;
    const bidderId = "69113d2a06251b39d3acfd0d";

    console.log("Bid placed:", newBid);

    try {
      let url;
      let body;

      if (product.is_autobid === true) {
        // AUTO BID
        url = "http://localhost:3000/api/autobids";
        body = {
          product_id: product._id,
          bidder_id: bidderId,
          max_price: newBid,
        };
      } else {
        // NORMAL BID
        url = "http://localhost:3000/api/bids";
        body = {
          product_id: product._id,
          bidder_id: bidderId,
          price: newBid,
        };
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
    const buyerId = "69113d2a06251b39d3acfd0d";

    try {
      const response = await fetch(
        `http://localhost:3000/api/product/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
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
      const response = await fetch("http://localhost:3000/api/watchlist", {
        method: isWatchlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      });

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

  if (!product) return <p>Đang tải...</p>;

  return (
    <div>
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
                  src={
                    mainImage ||
                    "/placeholder.svg?height=480&width=480&query=product-main"
                  }
                  alt={product.name}
                  className="w-full h-full aspect-square object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  onClick={handleToggleWatchlist}
                  disabled={watchlistLoading}
                  className="absolute top-4 left-2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition disabled:opacity-50"
                  title={
                    isWatchlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                  }
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
                    src={
                      t ||
                      "/placeholder.svg?height=120&width=120&query=product-thumb"
                    }
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span
              className={`text-sm inline-block px-4 py-1 rounded-full font-semibold mb-3 ${
                productStatus === "closed"
                  ? "bg-red-100 text-red-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {productStatus === "closed" ? "✓ Đã đóng" : "✓ Đang đấu giá"}
            </span>

            <span
              className={`text-sm inline-block px-4 py-1 rounded-full font-semibold mb-3 ml-2 ${
                product.is_autobid
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {product.is_autobid ? "✓ Đấu giá tự động" : "✓ Đấu giá thủ công"}
            </span>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-indigo-500 font-semibold mb-4">
              {product.category_id?.name}
            </div>

            {/* Countdown */}
            <div
              className={`p-4 rounded-lg text-center mb-4 ${
                productStatus === "closed" ? "bg-red-100" : "bg-yellow-100"
              }`}
            >
              <div
                className={`text-sm font-bold mb-1 ${
                  productStatus === "closed"
                    ? "text-red-700"
                    : "text-yellow-700"
                }`}
              >
                {productStatus === "closed"
                  ? "ĐÃ KẾT THÚC"
                  : "THỜI GIAN CÒN LẠI"}
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  productStatus === "closed"
                    ? "text-red-700"
                    : "text-yellow-700"
                }`}
              >
                {countdown}
              </div>
              <div
                className={`text-sm ${
                  productStatus === "closed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {relativeTime}
              </div>
            </div>

            {/* Price Info */}
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

            {/* Description */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-lg font-bold mb-2">Mô tả chi tiết</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Seller Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Thông tin người bán</h3>
            {seller && (
              <div className="flex items-center gap-4">
                <img
                  src={
                    seller.avatar ||
                    "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"
                  }
                  alt={seller.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">
                    {seller.name}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {/* <span className="text-yellow-400">★★★★★</span> */}
                    <span className="text-sm text-green-600">
                      {seller.rating_pos}/{" "}
                      {seller.rating_neg + seller.rating_pos} đánh giá tích cực
                    </span>
                  </div>
                  {/* Làm sau */}
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm">
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Highest Bidder Info */}
          <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border-2 border-green-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">
                Người đặt giá cao nhất hiện tại
              </h3>
            </div>
            {highestBidder && (
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
                    {/* <span className="text-yellow-400">★★★★★</span> */}
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
            )}
          </div>
        </div>

        {/* Bidding Form */}
        {productStatus === "active" && (
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

        {/* Buy Now Button */}
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

        {/* Bid History */}
        <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
          <h2 className="text-2xl font-bold mb-4">Lịch sử đấu giá</h2>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {bidHistory &&
              bidHistory.map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
                >
                  <div>
                    <div className="font-semibold">{b.user}</div>
                    <div className="text-gray-500 text-xs">{b.time}</div>
                  </div>
                  <div className="text-black font-bold text-lg">
                    {b.amount?.toLocaleString()} VNĐ
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Hỏi đáp ({questions.length})
          </h2>
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
                  <div className="text-xs text-gray-400 mt-2">
                    {q.created_at}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Chưa có câu hỏi nào
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            Sản phẩm khác cùng chuyên mục
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map((p) => (
              <ProductCard product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
