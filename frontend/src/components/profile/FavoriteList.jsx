import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import ProductCard from "../ProductCard";
import { useLiked } from "../../context/LikedContext";
import Pagination from "./Pagination";

const FavoriteList = ({ userId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPage, setTotalPage] = useState(1);

  const { likedList } = useLiked();
  const page = searchParams.get("page") || 1;
  const per_page = 6;
  const q = searchParams.get("q") || "";

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", page);
    p.set("per_page", per_page);
    if (q) p.set("name", q);

    return p.toString();
  }, [page, q]);

  useEffect(() => {
    const p = new URLSearchParams(searchParams);
    p.set("page", 1);
    setSearchParams(p);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `/api/watchlist/user/${userId}?${queryString}`
        );
        setTotalPage(res.data?.total_page || 1);
        const data = res.data?.filtered;

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        const message = error.response?.data?.message;
        if (message === "No watchlist") {
          const body = {
            user_id: userId,
            product_id: [],
          };
          try {
            const res = await axios.post("/api/watchlist", body);
          } catch (err2) {
            console.log(err2.response?.data?.message || err2);
          }
        }
        console.log("Error loading products", message || error);
        if (isMounted)
          setError(error.response?.message || "Unable to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [queryString, likedList]);

  return (
    <section className="md:col-span-3 space-y-6">
      {loading && <div>Loading</div>}
      {error && (
        <div className="text-red-500">
          Error loading products: {error.message}{" "}
        </div>
      )}
      {!loading && !error && (
        <>
          {products.length > 0 ? (
            <div className="flex flex-col items-center gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mt-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination totalPage={totalPage} />
            </div>
          ) : (
            <div className="w-full text-[25px] text-bold flex justify-center  mt-5">
              NO ITEMS FOUND
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FavoriteList;
