import { useEffect, useState } from "react";
import api from "../../../api/axios";

const TotalSubCategory = ({ totalCat, refreshTrigger }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        if (totalCat === 0) return;
        const parent_res = await api.get("/api/category/top");
        console.log(totalCat);
        if (isMounted) {
          setTotal(totalCat - parent_res.data.categories.length);
        }
      } catch (error) {
        console.error("Error loading Category", error);
        if (isMounted)
          setError(error.response?.message || "Unable to load category");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, totalCat]);

  return (
    <>
      {loading && <div>Loading</div>}
      {error && <div className="text-red-500">Error</div>}
      {!loading && !error && (
        <div className="bg-white/80 rounded-xl px-4 py-2 w-full-1 h-full flex flex-col">
          <p className="text-[24px] font-bold">{total}</p>
          <p className="text-[14px] text-[#404040]">Tổng số danh mục con</p>
        </div>
      )}
    </>
  );
};

export default TotalSubCategory;
