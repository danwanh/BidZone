import cron from "node-cron";
import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import User from "../models/User.js";
import appEvent from "../events/appEvent.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  // Find auctions that should end
  const endedAuctions = await Product.find({
    status: "active",
    end_time: { $lte: now },
  });

  for (const product of endedAuctions) {
    // Mark product ended
    product.status = "ended";
    await product.save();

    // Get seller
    const seller = await User.findById(product.seller_id);

    // Get highest bid
    const winningBid = await Bid.findOne({
      product_id: product._id,
      status: true,
    })
      .sort({ price: -1 })
      .populate("bidder_id");

    const winner = winningBid?.bidder_id || null;

    // Get ALL bidders (distinct)
    const bids = await Bid.find({ product_id: product._id })
      .populate("bidder_id");

    const bidders = [
      ...new Map(
        bids.map(b => [b.bidder_id._id.toString(), b.bidder_id])
      ).values(),
    ];

    // Emit event
    appEvent.emit("AUCTION_ENDED", {
      product,
      seller,
      winner
    });
  }
});
