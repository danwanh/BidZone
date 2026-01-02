"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../ProductCard";
import Pagination from "../profile/Pagination";
import { useLiked } from "../../context/LikedContext";

const ProfileProductList = ({ baseURL, xtra, user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const { createWatchlist } = useLiked();

  const page = searchParams.get("page") || 1;
  const per_page = 6;
  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const apiURL = baseURL || `/api/products/seller/${user?._id}`;

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", page);
    p.set("per_page", per_page);
    if (q) p.set("name", q);
    if (categoryId) p.set("categoryId", categoryId);
    if (xtra) return p.toString() + "&" + xtra;
    return p.toString();
  }, [page, q, categoryId]);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`${apiURL}?${queryString}`);

        setTotalPage(res.data.total_page);

        if (isMounted) {
          setProducts(res.data.products || res.data.filtered);
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        if (message.includes("No watchlist found")) {
          await createWatchlist();
          setProducts([]);
          return;
        }
        console.error("Error loading products", message);
        if (isMounted) setError(error.message || "Unable to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [queryString, apiURL]);

  return (
    <section className="h-full flex flex-col min-h-[600px]">
      {loading && (
        <div className="flex w-full justify-center py-8">
          <div className="w-10 h-10 border border-[#5f27ce] border-3 border-b-transparent animate-spin rounded-full"></div>
        </div>
      )}
      {error && (
        <div className="text-red-500 p-4">Error loading products: {error}</div>
      )}
      {!loading && !error && (
        <>
          {products.length > 0 ? (
            <div className="flex flex-col items-center gap-6 sm:gap-8 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full auto-rows-fr">
                {products.map((p) =>
                  p.product_id?._id ? (
                    <ProductCard key={p._id} product={p.product_id} />
                  ) : (
                    <ProductCard key={p._id} product={p} />
                  )
                )}
              </div>
              <Pagination totalPage={totalPage} />
            </div>
          ) : (
            <div className="w-full text-center py-8 text-lg font-semibold text-gray-500">
              Danh sách đang trống
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProfileProductList;
