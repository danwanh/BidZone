import AutoBid from "../models/autobid.model.js";
import Product from "../models/product.model.js";

export const createAutoBid = async (req, res) => {
  try {
    const { product_id, bidder_id, max_price } = req.validated.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.status !== "active") return res.status(400).json({ error: "Autobid out of date" });
    if (product.is_autobid !== true) return res.status(400).json({ error: "Product is not auto-bidded" });

    const bidStep = product.bid_step || 0;
    // Kiểm tra xem bidder này đã từng đặt chưa
    let userBid = await AutoBid.findOne({ product_id, bidder_id });

    if (userBid) {
      // Cập nhật giá tối đa
      if (userBid.max_price >= max_price)
        return res.status(400).json({ error: "Max price need to be larger" });
      userBid.max_price = max_price;
      await userBid.save();
    } else {
      // Nếu chưa có tạo mới
      const startPrice = product.current_price || product.start_price;
      userBid = await AutoBid.create({
        product_id,
        bidder_id,
        price: startPrice,
        max_price,
        current_holder: bidder_id,
      });
    }
    let allBids = await AutoBid.find({ product_id }).sort({
      max_price: -1,
      date: 1,
    });

    const topBid = allBids[0];
    const secondBid = allBids[1];

    let newPrice = product.current_price || product.start_price;
    let newHolder = topBid.bidder_id;

    if (!secondBid) {
      // chỉ có 1 người
      newPrice = product.start_price;
    } else {
      // Giá vào = min(top.max, second.max + bước)
      newPrice = Math.min(topBid.max_price, secondBid.max_price + bidStep);
      newHolder = topBid.bidder_id;
    }

    userBid.current_holder = newHolder;
    userBid.price = newPrice;
    await userBid.save();
    // Cập nhật product
    product.current_price = newPrice;
    product.bidder_id = newHolder;
    await product.save();

    // Cập nhật tất cả bản ghi AutoBid của sản phẩm
    // await AutoBid.updateMany(
    //   { product_id },
    //   { $set: { price: newPrice, current_holder: newHolder } }
    // );

    res.status(200).json({
      message: "Success",
      data: {
        product_id,
        current_price: newPrice,
        current_holder: newHolder,
        total_bidders: allBids.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while creating autobid" });
  }
};

export const getAutoBidsByProduct = async (req, res) => {
  try {
    const { product_id } = req.validated.params;
    const bids = await AutoBid.find({ product_id }).populate(
      "bidder_id current_holder",
      "name"
    );
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAutoBids = async (req, res) => {
  const bids = await AutoBid.find().populate("product_id bidder_id");
  res.json(bids);
};

export const deleteAutoBid = async (req, res) => {
  const bid = await AutoBid.findByIdAndDelete(req.validated.params.id);
  if (!bid) return res.status(404).json({ message: "AutoBid not found" });
  res.json({ message: "AutoBid deleted" });
};

export const getAutoBidById = async (req, res) => {
  try {
    const { id: bid_id } = req.validated.params;

    const bid = await Product.findById(bid_id);

    if (!bid) return res.status(400).json({ message: "No bid found" });
    else return res.status(200).json(bid);
  } catch (error) {
    console.error("Error getting bid: ", error);
    res.status(500).json({ message: "Can't get bid" });
  }
};

export const updateBidStatus = async (req, res) => {
  const { status } = req.validated.body;
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = status;
  await bid.save();
  res.json(bid);
};

export const rejectAutoBid = async (req, res) => {
  try {
    const { id } = req.validated.params;

    const bid = await AutoBid.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!bid) {
      return res.status(404).json({ message: "Bid không tồn tại" });
    }

    const highestValidBid = await AutoBid.findOne({
      product_id: bid.product_id,
      status: true,
    }).sort({ price: -1 });

    const newPrice = highestValidBid ? highestValidBid.price : 0;

    await Product.findByIdAndUpdate(bid.product_id, {
      currentPrice: newPrice,
    });

    res.json({
      message: "Đã từ chối bid & cập nhật giá",
      currentPrice: newPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
