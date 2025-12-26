const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

const baseLayout = ({ title, message, product, extra }) => `
<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px">
  <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px">

    <h2 style="text-align:center; color:#2d3748">${title}</h2>

    <p style="color:#4a5568">${message}</p>

    <div style="border:1px solid #e2e8f0; border-radius:6px; padding:16px; margin:20px 0">
      <img 
        src="${product.image_url?.[0]}" 
        alt="${product.name}"
        style="width:100%; max-height:240px; object-fit:cover; border-radius:6px"
      />

      <h3 style="margin-top:12px; color:#2d3748">${product.name}</h3>

      <table style="width:100%; font-size:14px; color:#4a5568">
        <tr>
          <td>Mã sản phẩm:</td>
          <td><strong>${product._id}</strong></td>
        </tr>
        <tr>
          <td>Giá hiện tại:</td>
          <td style="color:#e53e3e; font-weight:bold">
            ${formatPrice(product.current_price)}
          </td>
        </tr>
        <tr>
          <td>Người giữ giá:</td>
          <td><strong>${product.bidder_id?.name || "—"}</strong></td>
        </tr>
        <tr>
          <td>Kết thúc lúc:</td>
          <td>${new Date(product.end_time).toLocaleString("vi-VN")}</td>
        </tr>
      </table>

      ${extra || ""}
    </div>

    <div style="text-align:center">
      <a href="https://bidzone.vn/product/${product.slug}"
         style="
           display:inline-block;
           padding:12px 20px;
           background:#3182ce;
           color:#fff;
           border-radius:6px;
           text-decoration:none;
           font-weight:bold
         ">
        Xem sản phẩm
      </a>
    </div>

    <hr style="margin:24px 0" />
    <p style="font-size:12px; color:#718096; text-align:center">
      © ${new Date().getFullYear()} BidZone. All rights reserved.
    </p>

  </div>
</div>
`;

export const bidSuccessTemplate = {
  // Gửi người bán
  toSeller: (product, bidder) =>
    baseLayout({
      title: "Sản phẩm của bạn vừa có giá mới",
      message: `Người dùng <strong>${bidder.name}</strong> vừa ra giá thành công cho sản phẩm của bạn.`,
      product,
    }),

  // Gửi người ra giá
  toBidder: (product) =>
    baseLayout({
      title: "Bạn đã ra giá thành công",
      message: "Bạn hiện đang là người giữ giá cao nhất cho sản phẩm sau:",
      product,
      extra: `
        <p style="margin-top:12px; color:#38a169; font-weight:bold">
          Bạn đang dẫn đầu phiên đấu giá
        </p>
      `,
    }),

  // Gửi người giữ giá trước
  toPrevBidder: (product) =>
    baseLayout({
      title: "Bạn đã bị vượt giá",
      message: "Một người dùng khác vừa ra giá cao hơn bạn cho sản phẩm sau:",
      product,
      extra: `
        <p style="margin-top:12px; color:#e53e3e; font-weight:bold">
          Hãy ra giá lại nếu bạn vẫn muốn sở hữu sản phẩm
        </p>
      `,
    }),
};

export const bidRejectedTemplate = (product, reason) => `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px">
  <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px">

    <h2 style="text-align:center; color:#e53e3e">
      Ra giá không thành công
    </h2>

    <p style="color:#4a5568">
      Rất tiếc, yêu cầu ra giá của bạn không thể thực hiện.
    </p>

    <div style="
      background:#fff5f5;
      border:1px solid #fed7d7;
      padding:12px;
      border-radius:6px;
      color:#c53030;
      font-weight:bold;
      margin:16px 0
    ">
      Lý do: ${reason}
    </div>

    <h3 style="margin-top:20px">Thông tin sản phẩm</h3>

    <img src="${product.image_url?.[0]}"
         style="width:100%; max-height:240px; object-fit:cover; border-radius:6px" />

    <table style="width:100%; margin-top:12px; font-size:14px">
      <tr><td>Tên sản phẩm:</td><td><strong>${product.name}</strong></td></tr>
      <tr><td>Mã sản phẩm:</td><td>${product._id}</td></tr>
      <tr><td>Giá hiện tại:</td><td style="color:#e53e3e;font-weight:bold">
        ${product.current_price.toLocaleString("vi-VN")} ₫
      </td></tr>
    </table>

    <div style="text-align:center; margin-top:20px">
      <a href="https://bidzone.vn/product/${product.slug}"
         style="padding:12px 20px; background:#3182ce; color:#fff;
         border-radius:6px; text-decoration:none; font-weight:bold">
        Xem sản phẩm
      </a>
    </div>

  </div>
</div>
`;

export const auctionEndedTemplate = {
  toSeller: (product, winner) => `
<div style="font-family:Arial; background:#f4f6f8; padding:20px">
  <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px">

    <h2 style="text-align:center; color:#2d3748">
      Đấu giá đã kết thúc
    </h2>

    <p>Sản phẩm của bạn đã kết thúc đấu giá.</p>

    <img src="${
      product.image_url?.[0]
    }" style="width:100%; border-radius:6px" />

    <table style="width:100%; margin-top:12px">
      <tr><td>Tên sản phẩm:</td><td><strong>${product.name}</strong></td></tr>
      <tr><td>Giá chốt:</td><td style="color:#e53e3e;font-weight:bold">
        ${product.current_price.toLocaleString("vi-VN")} ₫
      </td></tr>
      <tr>
        <td>Người thắng:</td>
        <td>
          ${winner ? winner.name : "Không có"}
        </td>
      </tr>
    </table>

  </div>
</div>
`,

  toWinner: (product) => `
<div style="font-family:Arial; background:#f4f6f8; padding:20px">
  <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px">

    <h2 style="text-align:center; color:#38a169">
      🎉 Bạn đã thắng đấu giá
    </h2>

    <p>Chúc mừng! Bạn là người chiến thắng cho sản phẩm sau:</p>

    <img src="${product.image_url?.[0]}" style="width:100%; border-radius:6px" />

    <table style="width:100%; margin-top:12px">
      <tr><td>Tên sản phẩm:</td><td><strong>${product.name}</strong></td></tr>
      <tr><td>Giá trúng:</td><td style="color:#e53e3e;font-weight:bold">
        ${product.current_price.toLocaleString("vi-VN")} ₫
      </td></tr>
    </table>

    <p style="margin-top:16px; color:#4a5568">
      Vui lòng liên hệ người bán để hoàn tất giao dịch.
    </p>

  </div>
</div>
`,
};

export const questionTemplate = (question) => `
<div style="font-family:Arial; background:#f4f6f8; padding:20px">
  <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px">

    <h2 style="color:#2d3748; text-align:center">
      Có câu hỏi mới cho sản phẩm
    </h2>

    <p><strong>Người hỏi:</strong> ${question.bidder_id?.name}</p>

    <div style="
      background:#edf2f7;
      padding:12px;
      border-radius:6px;
      margin:16px 0
    ">
      ${question.question}
    </div>

    <p style="font-size:14px; color:#718096">
      Vui lòng phản hồi sớm để tăng khả năng bán hàng.
    </p>

  </div>
</div>
`;

export const answerTemplate = (question) => `
<div style="font-family:Arial; background:#f4f6f8; padding:20px">
  <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px">

    <h2 style="text-align:center; color:#38a169">
      Câu hỏi của bạn đã được trả lời
    </h2>

    <p><strong>Câu hỏi của bạn:</strong></p>
    <div style="background:#edf2f7; padding:12px; border-radius:6px">
      ${question.question}
    </div>

    <p style="margin-top:16px"><strong>Trả lời từ người bán:</strong></p>
    <div style="
      background:#f0fff4;
      border:1px solid #c6f6d5;
      padding:12px;
      border-radius:6px
    ">
      ${question.answer}
    </div>

  </div>
</div>
`;
