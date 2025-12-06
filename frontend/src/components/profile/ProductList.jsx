import { useState, useEffect, useMemo } from "react";
import ProductCard from "../ProductCard";
import NavBar from "./NavBar";
import http from "../../api/axios";
import { useLiked } from "../../context/LikedContext";
import { useSearchParams } from "react-router-dom";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("Đang đấu giá");
  const { likedList } = useLiked();
  const [role, setRole] = useState("user");

  const labels = ["Đang đấu giá", "Yêu thích", "Đã mua"];
  if (role == "seller") {
    labels.push("Đang bán");
    labels.push("Đã bán");
  }

  const page = searchParams.get("page") || 1;
  const per_page = 6;
  const q = searchParams.get("q") || "";

  const queryString = useMemo(() => {
    const p = new URLSearchParams();

    p.set("per_page", per_page);
    p.set("page", page);

    if (q) p.set("name", q);

    return p.toString();
  }, [page, q]);

  const handleTab = async () => {
    try {
      if (tab == labels[0]) {
        const res = await http.get(`/api/product?${queryString}`);
        return res.data.products;
      }
      if (tab == labels[1]) {
        const res = await http.get(
          "/api/watchlist/user/69111e8a06251b39d3acd8f9/"
        );
        const list = res.data.product_id;
        console.log(list);
        let data = [];
        for (const id of list) {
          const prod_res = await http.get(`/api/product/${id}/`);
          data.push(prod_res.data);
        }
        return data;
      }

      if (tab == labels[2]) {
        return likedList;
      }

      if (labels.length > 3 && tab == labels[3]) {
        const res = await http.get(
          "/api/product/seller/6912e02b70323bdb4045f327/"
        );
        console.log(res);
        let data = [];
        for (const product of res.data) {
          if (product.status == "active") {
            data.push(product);
          }
        }
        console.log(data);
        return data;
      }

      if (labels.length > 4 && tab == labels[4]) {
        const res = await http.get(
          "/api/product/seller/6912e02b70323bdb4045f327/"
        );
        let data = [];
        for (const product of res.data) {
          if (product.status == "ended") {
            data.push(product);
          }
        }
        return data;
      }
      return [];
    } catch (error) {
      console.error("Failed to get data for tabs:", error);
    }
    return [];
  };

  const handlePageChange = (page) => {
    const next = new URLSearchParams(searchParams);
    if (!page) next.delete("page");
    else next.set("page", page);
    setSearchParams(next);
  };

  useEffect(
    () => {
      let isMounted = true;
      const loadProducts = async () => {
        try {
          setLoading(true);
          setError(null);

          const data = await handleTab();

          if (isMounted) {
            setProducts(data);
          }
        } catch (error) {
          console.error("Error loading products", error);
          if (isMounted) setError(error.message || "Unable to load products");
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      loadProducts();

      return () => {
        isMounted = false;
      };
    },
    [tab],
    [queryString]
  );

  return (
    <div className="w-full bg-white p-10 rounded-[15px] shadow-lg">
      <NavBar tab={tab} setTab={setTab} labels={labels} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mt-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="w-full text-[25px] text-bold flex justify-center  mt-5">
                NO ITEMS FOUND
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
export default ProductList;
