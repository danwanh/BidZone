// modules/mail/mail.events.js
import { appEvent } from "../../utils/eventEmitter.js";
import { sendMail } from "../mailServices.js";
import {
  bidSuccessTemplate,
  bidRejectedTemplate,
  auctionEndedTemplate,
  questionTemplate,
  answerTemplate,
} from "./mailTemplates.js";

appEvent.on("BID_SUCCESS", async ({ product, bidder, seller, prevBidder }) => {
  await Promise.all([
    // người bán
    sendMail({
      to: seller.email,
      subject: "Có giá mới cho sản phẩm của bạn",
      html: bidSuccessTemplate.toSeller(product, bidder),
    }),

    // người ra giá
    sendMail({
      to: bidder.email,
      subject: "Bạn đã ra giá thành công",
      html: bidSuccessTemplate.toBidder(product),
    }),

    // người giữ giá trước (nếu có)
    prevBidder &&
      sendMail({
        to: prevBidder.email,
        subject: "Bạn đã bị vượt giá",
        html: bidSuccessTemplate.toPrevBidder(product),
      }),
  ]);
});

appEvent.on("BID_REJECTED", async ({ bidder, product, reason }) => {
  await sendMail({
    to: bidder.email,
    subject: "Ra giá không thành công",
    html: bidRejectedTemplate(product, reason),
  });
});

appEvent.on("AUCTION_ENDED", async ({ product, seller, winner }) => {
  await Promise.all([
    sendMail({
      to: seller.email,
      subject: "Đấu giá kết thúc",
      html: auctionEndedTemplate.toSeller(product, winner),
    }),
    winner &&
      sendMail({
        to: winner.email,
        subject: "Bạn đã thắng đấu giá",
        html: auctionEndedTemplate.toWinner(product),
      }),
  ]);
});

appEvent.on("QUESTION_ASKED", async ({ seller, question }) => {
  await sendMail({
    to: seller.email,
    subject: "Có câu hỏi mới cho sản phẩm",
    html: questionTemplate(question),
  });
});

appEvent.on("QUESTION_ANSWERED", async ({ buyers, answer }) => {
  await Promise.all(
    buyers.map((buyer) =>
      sendMail({
        to: buyer.email,
        subject: "Câu hỏi đã được trả lời",
        html: answerTemplate(answer),
      })
    )
  );
});
