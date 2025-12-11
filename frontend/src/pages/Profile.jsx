import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SideBar from "../components/profile/SideBar";
import ProductList from "../components/profile/ProductList";
import axios from "../api/axios";

export const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("aasdasd");
    const load_user = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data);
        // console.log(res.data);
        console.log("aasdasd");
      } catch (err) {
        console.error(err?.message || err);
      }
    };
    load_user();
  }, []);
  return (
    <>
      <div className="w-1/3">{/* <SideBar user={user} /> */}</div>

      <div className="flex-1">{/* <ProductList /> */}</div>
    </>
  );
};
