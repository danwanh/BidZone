import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../ProductCard";
import Pagination from "../profile/Pagination";

const ProductList = ({ title, baseURL, disablePagination = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPage, setTotalPage] = useState(1);

  const page = disablePagination ? 1 : searchParams.get("page") || 1;
  // const page = searchParams.get("page") || 1;
  const per_page = 6;
  const q = searchParams.get("q") || "";

  const categoryId = searchParams.get("categoryId") || "";

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", page);
    p.set("per_page", per_page);
    if (q) p.set("name", q);
    if (categoryId) p.set("categoryId", categoryId);
    return p.toString();
  }, [page, q, categoryId]);

  useEffect(() => {
    if (!disablePagination) {
      const next = new URLSearchParams(searchParams);
      if (!searchParams.get("page")) next.delete("page");
      // setSearchParams(next);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`${baseURL}?${queryString}`);

        setTotalPage(res.data.total_page);

        if (isMounted) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error(
          "Error loading products",
          error.response?.data?.message || error.message
        );
        if (isMounted) setError(error.message || "Unable to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [queryString, baseURL]);

  return (
    <>
      {title && (
        <h3 className="font-semibold text-orange-600 -mb-1 text-xl">{title}</h3>
      )}
      {loading && (
        <div className="rounded-full border border-red-400 w-12 h-12 animate-spin border-t-transparent border-5 "></div>
      )}
      {error && (
        <div className="text-red-500">
          Error loading products:{" "}
          {error.response?.data?.message || error.message}{" "}
        </div>
      )}
      {!loading && !error && (
        <>
          {products?.length > 0 ? (
            <div className="flex flex-col items-center gap-10 -ml-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 xl:grid-cols-5 gap-12 mt-5">
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
            <div className="w-full text-[25px] text-bold flex justify-center  mt-5">
              NO ITEMS FOUND
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductList;
