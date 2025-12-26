import { useEffect, useState } from "react";
import axios from "../../../api/axios";

const SubCategoryList = ({ id, color, setSelected }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/category/subcategories/${id}`);

        if (isMounted) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Error loading parentCategory", error);
        if (isMounted)
          setError(error.response?.message || "Unable to load parent category");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div>
      {loading && (
        <div
          className={`h-8 w-8 animate-spin rounded-full border-3 border-[#a2a2a2] border-t-transparent`}
        />
      )}
      {error && (
        <div className="text-red-500">
          Error loading subcategories: {error.message}
        </div>
      )}
      {!loading && !error && (
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((c, index) => (
            <button
              onClick={() => setSelected(c)}
              key={index}
              style={{ backgroundColor: color }}
              className="w-fit px-4 rounded-2xl cursor-pointer hover:brightness-90"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryList;
