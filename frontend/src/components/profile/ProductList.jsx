import { useState, useEffect, useMemo } from "react";
import ProductCard from "../ProductCard";
import NavBar from "./NavBar";
import http from "../../api/axios";
import { useLiked } from "../../context/LikedContext";
import { redirect, useSearchParams } from "react-router-dom";
import BiddingList from "./BiddingList";
import FavoriteList from "./FavoriteList";
import BoughtList from "./BoughtList";
import SellingList from "./SellingList";

const ProductList = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const labels = ["Đang đấu giá", "Yêu thích", "Đã mua"];
  if (user.role == "seller") {
    labels.push("Đang bán");
    labels.push("Đã bán");
  }

  return (
    <div className="w-full bg-white p-10 rounded-[15px] shadow-lg flex flex-col gap-4">
      <NavBar labels={labels} />
      {tab == "Đang đấu giá" && <BiddingList userId={user._id} />}
      {tab == "Yêu thích" && <FavoriteList userId={user._id} />}
      {tab == "Đã mua" && <BoughtList userId={user._id} />}
      {tab == "Đang bán" && <SellingList status="active" userId={user._id} />}
      {tab == "Đã bán" && <SellingList status="ended" userId={user._id} />}
    </div>
  );
};
export default ProductList;
