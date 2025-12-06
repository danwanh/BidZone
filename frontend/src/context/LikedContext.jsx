import { useContext, createContext, useState, useEffect } from "react";

const LikedContext = createContext();
export const useLiked = () => useContext(LikedContext);

export function LikedProvider({ children }) {
  const [likedList, setLikedList] = useState([]);

  const getLikedList = async () => {
    const response = await http.get(
      "/api/watchlist/user/69111e8a06251b39d3acd8f9"
    );
    setLikedList(response.data.product_id);
  };

  useEffect(() => {
    getLikedList();
  }, []);

  const addToLikedList = async ({ product_id }) => {
    await http.patch("/api/watchlist/69111e8a06251b39d3acd8f9", {
      product_id: product_id,
    });
  };

  const removeFromLikedList = async ({ product_id }) => {
    await http.delete(`/api/watchlist/69111e8a06251b39d3acd8f9/${product_id}`);
  };

  return (
    <LikedContext.Provider
      value={{ likedList, getLikedList, addToLikedList, removeFromLikedList }}
    >
      {children}
    </LikedContext.Provider>
  );
}
