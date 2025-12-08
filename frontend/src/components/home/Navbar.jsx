import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        const data = res.data;
        setCategories(data);
      } catch (error) {
        console.log(error);
        console.error(error.response.data?.message || error.message);
      }
    };

    fetchCategories();
  }, []);

  const activeCategory = hoveredCategory || selectedCategory;
  const activeSubcategories = activeCategory
    ? categories.filter((cat) => cat.category_id === activeCategory._id) || []
    : [];

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="px-[6%] py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-purple-600">BidZone</div>
          <div className="relative">
            <button
              className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsOpen(true)}
            >
              Category
              <span
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div
                className="absolute top-full left-0 mt-2 flex gap-0 z-50"
                onMouseLeave={() => {
                  setIsOpen(false);
                  setHoveredCategory(null);
                  setSelectedCategory(null);
                }}
              >
                {/* Main categories */}
                <div className="flex flex-col bg-white rounded-l-lg shadow-lg border border-gray-200 py-2 min-w-[100px] shrink-0">
                  {categories.map(
                    (category) =>
                      !category.category_id && (
                        <div className="hover:bg-gray-100 py-2">
                          <Link
                            key={category.name}
                            className={`w-full text-left px-6 transition-colors ${
                              activeCategory === category.id
                                ? "bg-gray-100"
                                : ""
                            }`}
                            onMouseEnter={() => setHoveredCategory(category)}
                            onClick={() => setSelectedCategory(category)}
                            to={`?categoryId=${category._id}`}
                          >
                            {category.name}
                          </Link>
                        </div>
                      )
                  )}
                </div>

                {/* Subcategories */}
                {activeSubcategories.length > 0 && (
                  <div className="bg-white rounded-r-lg shadow-lg border border-l-0 border-gray-200 py-2 min-w-[200px]">
                    {activeSubcategories.map((subcategory) => (
                      <button
                        key={subcategory.name}
                        className="w-full text-left px-6 py-3 hover:bg-gray-100 transition-colors text-gray-700"
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-700">Đăng kí</span>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
            Đăng nhập
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
