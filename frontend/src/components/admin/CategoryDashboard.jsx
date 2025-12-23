import { useEffect, useState } from "react";
import CategoryList from "./CategoryList";
import CategoryDetail from "./CategoryDetail";
import TotalCategory from "./TotalCategory";
import TotalSubCategory from "./TotalSubCategory";
import api from "../../api/axios";

const CategoryDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [totalCat, setTotalCat] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState();

  const updateAction = () => {
    setAction(action + 1);
  };

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/api/category`);

        if (isMounted) {
          setCategories(res.data);
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
  }, [action]);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-r from-[#ffffff80] to-[#B9C2E780] p-6 ">
      <div className="flex flex-col lg:grid lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7 space-y-6 ">
          {loading && (
            <div className="flex justify-center items-center bg-white/80 h-140 backdrop-blur rounded-2xl p-6 shadow-lg">
              <p className="text-2xl font-bold">Loading</p>
            </div>
          )}
          {error && (
            <div className="text-red-500">
              Error loading parentCategory: {error.message}{" "}
            </div>
          )}
          {!loading && !error && (
            <CategoryList
              setSelected={setSelectedCategory}
              categories={categories || []}
              updateAction={updateAction}
            />
          )}
        </div>

        <div className="col-span-3 space-y-6">
          <CategoryDetail
            category={selectedCategory || {}}
            updateAction={updateAction}
            categories={categories}
          />
          <div className="grid grid-cols-2 gap-4">
            <TotalCategory total={categories.length} />
            <TotalSubCategory totalCat={totalCat || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDashboard;
