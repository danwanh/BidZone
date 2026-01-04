// services/mailSystem/mailEvents.js
import appEvent from "../../utils/eventEmiiter.js";
import { sendEmail } from "../mailServices.js";
import {
  bidSuccessTemplate,
  bidRejectedTemplate,
  auctionEndedTemplate,
  questionTemplate,
  answerTemplate,
  descriptionChangeTemplate,
} from "./mailTemplates.js";

appEvent.on("BID_SUCCESS", async ({ product, bidder, seller, prevBidder }) => {
  await Promise.all([
    // người bán
    sendEmail(
      seller.email,
      "Có giá mới cho sản phẩm của bạn",
      bidSuccessTemplate.toSeller(product, bidder)
    ),

    // người ra giá
    sendEmail(
      bidder.email,
      "Bạn đã ra giá thành công",
      bidSuccessTemplate.toBidder(product)
    ),

    // người giữ giá trước (nếu có)
    prevBidder &&
      sendEmail(
        prevBidder.email,
        "Bạn đã bị vượt giá",
        bidSuccessTemplate.toPrevBidder(product)
      ),
  ]);
});

appEvent.on("BID_REJECTED", async ({ bidder, product, reason }) => {
  await sendEmail(
    bidder.email,
    "Ra giá không thành công",
    bidRejectedTemplate(product, reason)
  );
});

appEvent.on("AUCTION_ENDED", async ({ product, seller, winner }) => {
  await Promise.all([
    sendEmail(
      seller.email,
      "Đấu giá kết thúc",
      auctionEndedTemplate.toSeller(product, winner)
    ),
    winner &&
      sendEmail(
        winner.email,
        "Bạn đã thắng đấu giá",
        auctionEndedTemplate.toWinner(product)
      ),
  ]);
});

appEvent.on("QUESTION_ASKED", async ({ seller, question, product }) => {
  await sendEmail(
    seller.email,
    "Có câu hỏi mới cho sản phẩm",
    questionTemplate(question, product)
  );
});

appEvent.on("QUESTION_ANSWERED", async ({ buyer, question, product }) => {
  await sendEmail(
    buyer.email,
    "Câu hỏi đã được trả lời",
    answerTemplate(question, product)
  );
});

appEvent.on("DESCRIPTION_CHANGE", async ({ bidders, product, description }) => {
  const subject = `Sản phẩm "${product.name}" có cập nhật mô tả mới`;

  await Promise.all(
    bidders.map((bidder) =>
      sendEmail(
        bidder.email,
        subject,
        descriptionChangeTemplate(product, description)
      )
    )
  );
});

export default appEvent;
