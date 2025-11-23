import { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import NavBar from "./NavBar";
import http from "../../api/axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ tab, setTab ] = useState("Đang đấu giá");
  const [ likedList, setLikedList ] = useState([]);

  const labels = ["Đang đấu giá", "Yêu thích", "Đã mua"];
  
  const handleTab = async () => {
    try{
      if(tab == labels[0]){
        const res = await http.get("/api/product/");
        return res.data;
      }
      if(tab == labels[1]){
        const res = await http.get("/api/watchlist/user/69111e8a06251b39d3acd8f9/");
        const list = res.data.product_id;
        console.log(list);
        let data = [];
        for (const id of list) {
          const prod_res = await http.get(`/api/product/${id}/`);
          data.push(prod_res.data);
        }
        return data;
      }
  
      if(tab == labels[2]){
        const res = await http.get("/api/product/user/69111e8a06251b39d3acd8f9/");
        return res;
      }
      return [];
    } catch (error){
      console.error("Failed to get data for tabs:", error);
    }
    return [];
  };

  const getLikedList = async () => {
    try {
      const response = await http.get("/api/watchlist/user/69111e8a06251b39d3acd8f9");
      const list = response.data.product_id;
      setLikedList(list);
    } catch (error) {
      console.error("Failed to fetch liked list:", error);
    }
  }

  useEffect(() => {
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
    getLikedList();

    return () => {
      isMounted = false;
    };
  }, [tab]);

  useEffect

  return (
    <div className="w-full bg-white p-10 rounded-[15px] shadow-lg">
      <NavBar tab={tab} setTab={setTab} labels={labels}  />
      <section className="md:col-span-3 space-y-6">
        {loading && <div>Loading</div>}
        {error && (
          <div className="text-red-500">
            Error loading products: {error.message}{" "}
          </div>
        )}
        {!loading && !error && (
          <>
            {products.length > 0 ? 
              (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mt-5">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} likedList={likedList} setLikedList={setLikedList}/>
                  ))}
                </div>
              )
              :
              (
                <div className="w-full text-[25px] text-bold flex justify-center  mt-5">
                  NO ITEMS FOUND
                </div>
              )
            }
          </>
        )}
      </section>
    </div>
  );
};
export default ProductList;
