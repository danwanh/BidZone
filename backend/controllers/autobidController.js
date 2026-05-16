import * as autobidService from "../services/autobidService.js";

export const createAutoBid = async (req, res) => {
  try {
    const data = await autobidService.createAutoBid(req.validated.body);
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (err) {
    console.error("Create autobid error:", err);
    const status = err.message.includes("not found") ? 404 : err.message.includes(" chặn ") || err.message.includes("không cho phép") || err.message.includes("Điểm uy tín") ? 403 : 400;
    res.status(status).json({ error: err.message || "Error while creating autobid" });
  }
};

export const getAutoBidsByProduct = async (req, res) => {
  try {
    const bids = await autobidService.getAutoBidsByProduct(req.validated.params.product_id);
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAutoBids = async (req, res) => {
  try {
    const bids = await autobidService.getAllAutoBids();
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAutoBid = async (req, res) => {
  try {
    await autobidService.deleteAutoBid(req.validated.params.id);
    res.json({ message: "AutoBid deleted" });
  } catch (error) {
    res.status(error.message === "AutoBid not found" ? 404 : 500).json({ message: error.message });
  }
};

export const getAutoBidById = async (req, res) => {
  try {
    const bid = await autobidService.getAutoBidById(req.validated.params.id);
    res.status(200).json(bid);
  } catch (error) {
    console.error("Error getting bid: ", error);
    res.status(error.message === "No bid found" ? 400 : 500).json({ message: error.message || "Can't get bid" });
  }
};

export const updateBidStatus = async (req, res) => {
  try {
    const bid = await autobidService.updateBidStatus(req.validated.params.id, req.validated.body.status);
    res.json(bid);
  } catch (error) {
    res.status(error.message === "AutoBid not found" ? 404 : 500).json({ message: error.message });
  }
};

export const rejectAutoBid = async (req, res) => {

  try {
    const result = await autobidService.rejectAutoBid(req.validated.params.id);
    res.json({
      message: "Đã từ chối tất cả bid của user & cập nhật giá",
      currentPrice: result.newPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(error.message === "Bid không tồn tại" ? 404 : 500).json({ message: error.message || "Lỗi server" });
  }
};
