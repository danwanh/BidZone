import React from "react";

const ProductRow = ({ product, onContextMenu }) => {
  return (
    <tr
      onContextMenu={(e) => onContextMenu(e, product)}
      className="border-b border-gray-300 w-full transition-colors hover:bg-gray-50 cursor-context-menu text-center"
    >
      <td className="pl-4 py-4 font-medium w-[135px]">
        <img
          className="w-[120px] h-[100px] object-cover object-center rounded-2xl overflow-hidden ring ring-blue-900 ring-2 shadow-lg"
          src={
            product.image_url != null && product.image_url.length > 0
              ? product.image_url[0]
              : "https://res.cloudinary.com/onlineauctionproject/image/upload/v1763451369/unnamed_hqaokg.png"
          }
          alt="Product"
        />
      </td>
      <td className="px-4 py-4">{product.name}</td>
      <td
        className={`px-4 py-4 ${
          product?.category_id?.name ? "text-gray-600" : "text-red-400"
        }`}
      >
        {product?.category_id?.name || "Không có"}
      </td>
      <td className="px-4 py-4">
        {product?.seller_id?.username || "Không có"}
      </td>
      <td
        className={`px-4 py-4 text-[14px] font-bold ${
          product.status === "ended" ? "text-red-400" : "text-green-400"
        }`}
      >
        {product.status}
      </td>
    </tr>
  );
};

export default ProductRow;
