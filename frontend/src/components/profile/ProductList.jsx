import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import BoughtProductCard from "./BoughtProductCard";
import { http } from "../libs/http";

const ProductList = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPage, setTotalPage] = useState(1);

//   const category = searchParams.get("categoryId") || "";
//   const sort = searchParams.get("sort") || "";
//   const page = searchParams.get("page") || 1;
//   const per_page = 3;
//   const q = searchParams.get("q") || "";

//   const queryString = useMemo(() => {
//     const p = new URLSearchParams();

//     p.set("_per_page", per_page);
//     p.set("_page", page);

//     if (category) p.set("categoryId", category);
//     if (sort) p.set("_sort", sort);
//     if (q) p.set("name", q);

//     return p.toString();
//   }, [category, sort, page, q]);

//   useEffect(() => {
//     let isMounted = true;
//     const loadProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await http.get(`/products?${queryString}`);

//         if (isMounted) {
//           setProducts(res.data.data);
//           setTotalPage(res.data.pages);
//         }
//       } catch (error) {
//         console.error("Error loading products", error);
//         if (isMounted) setError(error.message || "Unable to load products");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };
//     loadProducts();

//     return () => {
//       isMounted = false;
//     };
//   }, [queryString]);

//   const handleSort = (value) => {
//     const next = new URLSearchParams(searchParams);
//     if (!value) next.delete("sort");
//     else next.set("sort", value);
//     next.set("page", 1);
//     setSearchParams(next);
//   };

//   const handlePageChange = (page) => {
//     const next = new URLSearchParams(searchParams);
//     if (!page) next.delete("page");
//     else next.set("page", page);
//     setSearchParams(next);
//   };

  return (
    <div className="container mx-auto px-4 py-16 grid md:grid-cols-4 gap-8">
      <Navbar category={category} />
      <section className="md:col-span-3 space-y-6">
        {loading && <Spinner aria-label="Default status example" />}
        {error && (
          <div className="text-red-500">
            Error loading products: {error.message}{" "}
          </div>
        )}
        {!loading && !error && (
          <>
            <SortBar
              sort={sort}
              onSortChange={handleSort}
              page={page}
              totalPage={totalPage}
              onPageChange={handlePageChange}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};
export default ProductList;
