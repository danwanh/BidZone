import React from "react";
import ProductCard from "../components/ProductCard";
import SideBar from "../components/profile/SideBar";
import ProductList from "../components/profile/ProductList";

export const ProfilePage = () => {
  return (
    <>
      <div className="w-1/3">
        <SideBar />
      </div>

      <div className="flex-1">
        <ProductList />
      </div>
    </>
  );
};
