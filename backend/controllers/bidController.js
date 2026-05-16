import * as bidService from "../services/bidService.js";

export const getBidById = async (req, res) => {
  try {
    const bid = await bidService.getBidById(req.validated.params.id);
    res.status(200).json(bid);
  } catch (error) {
    console.error("Error getting bid:", error);
    res.status(error.message === "No bid found" ? 400 : 500).json({ message: error.message || "Can't get bid" });
  }
};

export const createBid = async (req, res) => {
  try {
    const bid = await bidService.createBid(req.validated.body);
    res.status(201).json(bid);
  } catch (error) {
    console.error("Create bid error:", error);
    const status = error.message === "Product not found" || error.message === "Bidder not found" ? 404 : 
                 error.message.includes("Bạn đã bị người bán chặn") || error.message.includes("không cho phép") || error.message.includes("Điểm uy tín") ? 403 : 
                 400;
    res.status(status).json({ message: error.message || "Internal server error" });
  }
};

export const getBidsByProduct = async (req, res) => {
  try {
    const bids = await bidService.getBidsByProduct(req.validated.params.product_id);
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBidByUser = async (req, res) => {
  try {
    const result = await bidService.getBidByUser(req.validated.params.id, req.validated.query);
    res.status(200).json({
      message: "Got bids by user id successfully!",
      products: result.products,
      total_page: result.total_page,
    });
  } catch (err) {
    console.log("error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBiddingByUser = async (req, res) => {
  try {
    const result = await bidService.getBiddingByUser(req.validated.params.id, req.query);
    res.status(200).json({
      message: "Got combined bids by user id successfully!",
      products: result.products,
      total_page: result.total_page,
    });
  } catch (err) {
    console.error("error fetching combined bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBids = async (req, res) => {
  try {
    const bids = await bidService.getAllBids();
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBidStatus = async (req, res) => {
  try {
    const bid = await bidService.updateBidStatus(req.validated.params.id, req.validated.body.status);
    res.json(bid);
  } catch (error) {
    res.status(error.message === "Bid not found" ? 404 : 500).json({ message: error.message });
  }
};

export const deleteBid = async (req, res) => {
  try {
    await bidService.deleteBid(req.validated.params.id);
    res.json({ message: "Bid deleted" });
  } catch (error) {
    res.status(error.message === "Bid not found" ? 404 : 500).json({ message: error.message });
  }
};

export const rejectBid = async (req, res) => {
  try {
    const result = await bidService.rejectBid(req.validated.params.id);
    res.json({
      message: "Đã từ chối tất cả bid của user & cập nhật giá",
      current_price: result.newPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(error.message === "Bid không tồn tại" ? 404 : 500).json({ message: error.message || "Lỗi server" });
  }
};
