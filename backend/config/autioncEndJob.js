import cron from "node-cron";
import Product from "../models/product.model.js";
import Bid from "../models/bid.model.js";
import AutoBid from "../models/autobid.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import appEvent from "../services/mailSystem/mailEvents.js";

const auctionCronJob = cron.schedule("* * * * *", async () => {
  try {
    console.log("Scan ended bid");
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
      let winningBid = await Bid.findOne({
        product_id: product._id,
        status: true,
      })
        .sort({ price: -1 })
        .populate("bidder_id");

      if (!winningBid) {
        winningBid = await AutoBid.findOne({
          product_id: product._id,
          status: true,
        })
          .sort({ max_price: -1 })
          .populate("bidder_id");
      }

      let winner = null;
      if (winningBid?.bidder_id)
        winner = await User.findById(winningBid.bidder_id);

      // console.log(product.name);
      // console.log(winningBid);

      // Create an order after auction ends
      const order = new Order({
        product_id: product._id,
        seller_id: product.seller_id,
        buyer_id: winner._id,
        status: "pending_payment", // Order status when auction ends
      });

      // Save the order
      await order.save();

      // Emit event
      appEvent.emit("AUCTION_ENDED", {
        product,
        seller,
        winner,
      });
    }
  } catch (error) {
    console.error("Error in cron job:", error); // In ra lỗi nếu có
  }
});
export default auctionCronJob;
