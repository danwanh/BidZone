import { useContext, createContext, useState, useEffect } from "react";
import http from "../api/axios";
import { useAuth } from "./AuthContext";

const LikedContext = createContext();
export const useLiked = () => useContext(LikedContext);

export function LikedProvider({ children }) {
  const [likedList, setLikedList] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [change, setChange] = useState(true);
  const { user } = useAuth();

  const getLikedList = async () => {
    try {
      const response = await http.get(`/api/watchlist/user/${user._id}`);
      const list = response.data.watchlist.product_id;
      setLikedList(list);
      setLikedIds(new Set(list.map((item) => item._id)));
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      throw err;
    }
  };

  useEffect(() => {
    getLikedList();
  }, [change]);

  const addToLikedList = async (product_id) => {
    try {
      console.log("add " + product_id);
      const res = await http.patch(`/api/watchlist/${user._id}`, {
        product_id: product_id,
      });
      setChange(!change);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const removeFromLikedList = async (product_id) => {
    try {
      console.log("remove " + product_id);
      const res = await http.delete(`/api/watchlist/${user._id}/${product_id}`);
      setChange(!change);
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
