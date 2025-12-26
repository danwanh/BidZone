import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import searchIcon from "../../assets/icons/search.svg";
import sellIcon from "../../assets/icons/gavel-solid-full.svg";
import adminIcon from "../../assets/icons/admin.svg";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { user } = useAuth();

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

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

  const handleSearch = () => {
    if (!searchText.trim()) return;

    navigate(`/products/?q=${encodeURIComponent(searchText.trim())}`);
    setIsOpen(false);
  };

  const activeCategory = hoveredCategory || selectedCategory;
  const activeSubcategories = activeCategory
    ? categories.filter((cat) => cat.category_id === activeCategory._id) || []
    : [];

  return (
    <nav className="bg-white shadow-sm relative Space text-md">
      <div className="px-[2%] py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            BidZone
          </Link>
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
                            to={`/products/?categoryId=${category._id}`}
                          >
                            {category.name}
                          </Link>
                        </div>
                      )
                  )}
                </div>

                {/* Subcategories */}
                {activeSubcategories.length > 0 && (
                  <div className="flex flex-col bg-white rounded-r-lg shadow-lg border border-l-0 border-gray-200 py-2 min-w-[200px]">
                    {activeSubcategories.map((subcategory) => (
                      <Link
                        key={subcategory.name}
                        className="w-full text-left px-6 py-3 hover:bg-gray-100 transition-colors text-gray-700"
                        to={`/products/?categoryId=${subcategory._id}`}
                      >
                        {subcategory.name}
                      </Link>
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <img src={searchIcon} alt="Search" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User action */}
        <div className="flex items-center gap-4 text-md">
          {!user && (
            <>
              <Link
                to="/auth"
                state={{ page: "REGISTER" }}
                className="text-gray-700 hover:underline"
              >
                Đăng ký
              </Link>
              <Link
                to="/auth"
                state={{ page: "LOGIN" }}
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Đăng nhập
              </Link>
            </>
          )}

          {user && (
            <div className="text-[18px] flex gap-2">
              {/* Yêu thích */}
              <Link
                to="/profile?tab=Yêu+thích&page=1"
                className="flex items-center text-[#1e0c4d] font-semibold rounded-xl px-4 hover:shadow"
                title="Yêu thích"
              >
                <span>Yêu thích</span>
              </Link>

              {/* Đã mua */}
              <Link
                to="/profile?tab=Đã+mua&page=1"
                className="flex items-center text-[#1e0c4d] font-semibold rounded-xl px-4 hover:shadow"
                title="Đã mua"
              >
                <span className="font-semibold">Đã mua</span>
              </Link>

              {/* Seller và Admin mới thấy nút Đăng sản phẩm */}
              {user.role === "seller" && (
                <Link
                  to="/products/new"
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  title="Đăng sản phẩm"
                >
                  <img src={sellIcon} alt="Sell" className="w-5 h-5" />
                  <span className="">Đăng sản phẩm</span>
                </Link>
              )}

              {/* Admin mới thấy nút Bảng admin */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  title="Bảng admin"
                >
                  <img
                    src={adminIcon}
                    alt="Admin_Dashboard"
                    className="w-5 h-5"
                  />
                  <span className="">Bảng Admin</span>
                </Link>
              )}

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center bg-[#f4955e] px-4 p-1 rounded-xl gap-1 hover:shadow-lg"
                title="Trang cá nhân"
              >
                <span className="text-white font-semibold">{user.name}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
