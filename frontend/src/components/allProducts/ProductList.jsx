import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../ProductCard";
import Pagination from "../profile/Pagination";
import Filter from "./Filter";
import Sortbar from "./Sorbar";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPage, setTotalPage] = useState(1);

  const page = searchParams.get("page") || 1;
  const per_page = 30;
  const q = searchParams.get("q") || "";

  const categoryId = searchParams.get("categoryId") || "";

  // Lấy thêm các params mới từ URL
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", page);
    p.set("per_page", per_page);
    p.set("q", q);
    if (categoryId) p.set("categoryId", categoryId);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (sortBy) p.set("sortBy", sortBy); // price/endtime
    if (order) p.set("order", order); // asc/desc
    return p.toString();
  }, [page, q, categoryId, minPrice, maxPrice, sortBy, order]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (!page) next.delete("page");
    else next.set("page", 1);
    setSearchParams(next);
  }, [q, categoryId, minPrice, maxPrice, sortBy, order]);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/api/product/?${queryString}`);

        setTotalPage(res.data.total_page);
        console.log(res.data);

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
  }, [queryString]);

  return (
    <>
      <div className="flex gap-7">
        <Filter />
        <Sortbar />
      </div>
      {loading && <div>Loading</div>}
      {error && (
        <div className="text-red-500">
          Error loading products:{" "}
          {error.response?.data?.message || error.message}{" "}
        </div>
      )}
      {!loading && !error && (
        <>
          {products?.length > 0 ? (
            <div className="flex flex-col items-center gap-10">
              <div className="grid grid-cols-2 gap-12 md:grid-cols-2 xl:grid-cols-5 gap-12 mt-5">
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
              Danh sách đang trống
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductList;
