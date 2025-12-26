import { useContext, createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const LikedContext = createContext();

export const useLiked = () => useContext(LikedContext);

export function LikedProvider({ children }) {
  const [likedList, setLikedList] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [change, setChange] = useState(true);
  const { user } = useAuth();

  const getLikedList = async () => {
    if (!user || !user._id) return;

    try {
      console.log(user.data);
      const response = await api.get(`/api/watchlist/user/${user._id}`);

      const list = response.data.watchlist?.product_id || [];

      setLikedList(list);
      setLikedIds(new Set(list.map((item) => item._id)));
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      getLikedList();
    } else {
      setLikedList([]);
      setLikedIds(new Set());
    }
  }, [change, user]);

  const addToLikedList = async (id) => {
    if (!user) {
      alert("Please login first");
      return;
    }
    try {
      const body = { product_id: id };
      console.log("abc" + body);
      const res = await api.patch(`/api/watchlist/${user._id}`, body);
      setChange((prev) => !prev); // Best practice: use callback for toggle
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const removeFromLikedList = async (product_id) => {
    if (!user) return;
    try {
      console;
      await api.delete(`/api/watchlist/${user._id}/${product_id}`);
      setChange((prev) => !prev);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      throw err;
    }
  };

  return (
    <LikedContext.Provider
      value={{
        likedList,
        getLikedList,
        addToLikedList,
        removeFromLikedList,
        likedIds,
      }}
    >
      {children}
    </LikedContext.Provider>
  );
}
