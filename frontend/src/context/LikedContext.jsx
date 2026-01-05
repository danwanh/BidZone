import { useContext, createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
const LikedContext = createContext();

export const useLiked = () => useContext(LikedContext);

export function LikedProvider({ children }) {
  const [likedList, setLikedList] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [change, setChange] = useState(true);
  const { user } = useAuth();

  const createWatchlist = async (initialProducts = []) => {
    if (!user || !user._id) return;
    try {
      const res = await api.post("/api/watchlist", {
        user_id: user._id,
        product_id: initialProducts,
      });

      if (initialProducts.length > 0) {
        setChange((prev) => !prev);
      } else {
        setLikedList([]);
        setLikedIds(new Set());
      }
    } catch (err) {
      console.error(
        "Lỗi khi tạo watchlist tự động:",
        err.response?.data?.message || err.message
      );
    }
  };

  const getLikedList = async () => {
    if (!user || !user._id) return;

    try {
      const response = await api.get(`/api/watchlist/user/${user._id}`);

      const list = response.data.watchlist?.product_id || [];

      setLikedList(list);
      setLikedIds(new Set(list.map((item) => item._id)));
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 400) &&
        err.response.data.message.includes("No watchlist found")
      ) {
        await createWatchlist([]);
      } else {
        console.log(err.response?.data?.message || err.message);
      }
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
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }
    try {
      const body = { product_id: id };
      const res = await api.patch(`/api/watchlist/${user._id}`, body);
      setChange((prev) => !prev); // Best practice: use callback for toggle
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 400) &&
        err.response.data.message.includes("No watchlist found")
      ) {
        await createWatchlist([]);
      } else {
        console.log(err.response?.data?.message || err.message);
        throw err;
      }
    }
  };

  const removeFromLikedList = async (product_id) => {
    if (!user) return;
    try {
      await api.delete(`/api/watchlist/${user._id}/${product_id}`);
      setChange((prev) => !prev);
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 400) &&
        err.response.data.message.includes("No watchlist found")
      ) {
        await createWatchlist([]);
      } else {
        console.log(err.response?.data?.message || err.message);
        throw err;
      }
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
