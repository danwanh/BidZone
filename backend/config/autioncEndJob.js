import cron from "node-cron";
import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import User from "../models/User.js";
import appEvent from "../services/mailSystem/mailEvents.js";

cron.schedule("* * * * *", async () => {
  console.log("Ended bid");
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

    let winner = null;
    if (winningBid.bidder_id)
      winner = await User.findById(winningBid.bidder_id);
    
    // Emit event
    appEvent.emit("AUCTION_ENDED", {
      product,
      seller,
      winner
    });
  }
});
