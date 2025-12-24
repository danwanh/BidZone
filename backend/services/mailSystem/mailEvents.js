// modules/mail/mail.events.js
import { appEvent } from "../../utils/eventEmitter.js";
import { sendMail } from "./mail.service.js";
import {
  bidSuccessTemplate,
  bidRejectedTemplate,
  auctionEndedTemplate,
  questionTemplate,
  answerTemplate,
} from "./mail.templates";

appEvent.on("BID_SUCCESS", async ({ auction, bidder, seller, prevBidder }) => {
  await Promise.all([
    // người bán
    sendMail({
      to: seller.email,
      subject: "Có giá mới cho sản phẩm của bạn",
      html: bidSuccessTemplate.toSeller(auction, bidder),
    }),

    // người ra giá
    sendMail({
      to: bidder.email,
      subject: "Bạn đã ra giá thành công",
      html: bidSuccessTemplate.toBidder(auction),
    }),

    // người giữ giá trước (nếu có)
    prevBidder &&
      sendMail({
        to: prevBidder.email,
        subject: "Bạn đã bị vượt giá",
        html: bidSuccessTemplate.toPrevBidder(auction),
      }),
  ]);
});

appEvent.on("BID_REJECTED", async ({ bidder, auction, reason }) => {
  await sendMail({
    to: bidder.email,
    subject: "Ra giá không thành công",
    html: bidRejectedTemplate(auction, reason),
  });
});

appEvent.on("BID_REJECTED", async ({ bidder, auction, reason }) => {
  await sendMail({
    to: bidder.email,
    subject: "Ra giá không thành công",
    html: bidRejectedTemplate(auction, reason),
  });
});

appEvent.on("AUCTION_ENDED", async ({ auction, seller, winner }) => {
  await Promise.all([
    sendMail({
      to: seller.email,
      subject: "Đấu giá kết thúc",
      html: auctionEndedTemplate.toSeller(auction, winner),
    }),
    winner &&
      sendMail({
        to: winner.email,
        subject: "Bạn đã thắng đấu giá",
        html: auctionEndedTemplate.toWinner(auction),
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
