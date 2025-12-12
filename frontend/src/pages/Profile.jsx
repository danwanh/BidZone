import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SideBar from "../components/profile/SideBar";
import ProductList from "../components/profile/ProductList";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { user, loading, setUser } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div className="w-1/3">
        <SideBar />
      </div>

      <div className="flex-1">
        <ProductList user={user || {}} />
      </div>
    </>
  );
};
