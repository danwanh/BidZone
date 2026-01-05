import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import searchIcon from "../../assets/icons/search.svg";
import sellIcon from "../../assets/icons/gavel-solid-full.svg";
import adminIcon from "../../assets/icons/admin.svg";
import { useAuth } from "../../context/AuthContext";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { user, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        const data = res.data;
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Lỗi khi lấy dữ liệu danh mục"
        );
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    // if (!searchText.trim()) return;

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    searchParams.set("q", searchText.trim());
    navigate(`/products/?${searchParams.toString()}`);
    setIsOpen(false);
  };

  const activeCategory = hoveredCategory || selectedCategory;
  const activeSubcategories = activeCategory
    ? categories.filter((cat) => cat.category_id === activeCategory._id) || []
    : [];

  if (loading)
    return (
      <div className="w-full h-[60px] flex justify-center items-center">
        <ClipLoader loading={loading} size={50} />
      </div>
    );

  return (
    <nav className="bg-white shadow-sm relative Space text-md">
      <div className="px-[2%] py-2 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-8">
          {/* Logo   */}
          <Link to="/" className="flex items-center">
            <img
              src="/bidzone_logo.png"
              alt="BidZone Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="relative">
            <button
              className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsOpen(true)}
            >
              Danh mục
              <span
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div
                className="absolute top-full left-0 mt-2 flex gap-0 z-50"
                onMouseEnter={() => setIsOpen(true)}
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
              onClick={() => handleSearch()}
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
            <div className="relative z-40">
              {/* MOBILE TRIGGER: Visible only on small screens */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="md:hidden flex items-center gap-2 bg-[#f4955e] px-4 py-1 rounded-xl text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                <span>{user.name}</span>
                <span
                  className={`text-xs transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* MENU CONTAINER: Absolute Dropdown on Mobile / Flex Row on Desktop */}
              <div
                className={`gap-2 ${
                  isUserMenuOpen
                    ? "absolute top-full right-0 mt-2 flex flex-col bg-white shadow-xl border border-gray-100 rounded-xl p-3 min-w-[200px]"
                    : "hidden"
                } md:flex md:flex-row md:items-center md:static md:bg-transparent md:shadow-none md:border-none md:p-0 md:w-auto`}
              >
                {/* Yêu thích */}
                <Link
                  to={`/profile?tab=Yêu+thích&page=1&id=${user._id}`}
                  className="flex items-center text-[#1e0c4d] font-semibold rounded-xl px-4 py-2 md:py-0 hover:bg-gray-100 md:hover:bg-transparent md:hover:shadow transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                  title="Yêu thích"
                >
                  <span>Yêu thích</span>
                </Link>

                {/* Đã mua */}
                <Link
                  to={`/profile?tab=Đã+mua&page=1&id=${user._id}`}
                  className="flex items-center text-[#1e0c4d] font-semibold rounded-xl px-4 py-2 md:py-0 hover:bg-gray-100 md:hover:bg-transparent md:hover:shadow transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                  title="Đã mua"
                >
                  <span className="font-semibold">Đã mua</span>
                </Link>

                {/* Seller Button */}
                {user.role === "seller" && (
                  <Link
                    to="/products/new"
                    className="flex items-center gap-1 text-white font-semibold rounded-xl px-4 py-2 md:py-1 hover:shadow bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                    title="Đăng sản phẩm"
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.519027 7.79705C0.354478 7.96156 0.223948 8.15687 0.134893 8.37183C0.0458368 8.58679 0 8.81719 0 9.04987C0 9.28255 0.0458368 9.51295 0.134893 9.72791C0.223948 9.94288 0.354478 10.1382 0.519027 10.3027L2.52366 12.3066C2.81145 12.5944 3.18956 12.7744 3.59441 12.8162C3.99925 12.8579 4.40614 12.7591 4.74665 12.5361C5.08716 12.3132 5.34053 11.9798 5.46414 11.592C5.58775 11.2042 5.57406 10.7857 5.42539 10.4069L5.9859 9.84635L10.5259 15.0844C10.704 15.2896 10.9224 15.456 11.1675 15.5732C11.4126 15.6903 11.6793 15.7557 11.9508 15.7654C12.2223 15.775 12.4929 15.7286 12.7458 15.6291C12.9986 15.5296 13.2282 15.379 13.4203 15.1869C13.6124 14.9948 13.763 14.7652 13.8625 14.5124C13.962 14.2595 14.0084 13.9889 13.9988 13.7174C13.9891 13.4459 13.9237 13.1792 13.8066 12.9341C13.6894 12.6889 13.523 12.4705 13.3178 12.2925L8.07982 7.75241L8.64032 7.1926C9.01932 7.34164 9.43809 7.35554 9.82614 7.23197C10.2142 7.1084 10.5478 6.8549 10.7708 6.51415C10.9939 6.1734 11.0927 5.76621 11.0507 5.36114C11.0086 4.95606 10.8283 4.57784 10.5401 4.29013L8.53616 2.28547C8.24837 1.99768 7.87026 1.81776 7.46541 1.77597C7.06057 1.73418 6.65368 1.83306 6.31317 2.056C5.97266 2.27893 5.71929 2.61232 5.59568 3.0001C5.47207 3.38787 5.48576 3.80639 5.63443 4.18526L2.4195 7.40023C2.09848 7.2742 1.74765 7.24462 1.41006 7.31511C1.07247 7.3856 0.762796 7.55309 0.519027 7.79705Z"
                        fill="white"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2222 0.666667C13.2222 0.489856 13.2886 0.320286 13.4066 0.195262C13.5247 0.0702379 13.6849 0 13.8519 0H14.4815C14.6485 0 14.8086 0.0702379 14.9267 0.195262C15.0448 0.320286 15.1111 0.489856 15.1111 0.666667V2H16.3704C16.5374 2 16.6975 2.07024 16.8156 2.19526C16.9337 2.32029 17 2.48986 17 2.66667V3.33333C17 3.51014 16.9337 3.67971 16.8156 3.80474C16.6975 3.92976 16.5374 4 16.3704 4H15.1111V5.33333C15.1111 5.51014 15.0448 5.67971 14.9267 5.80474C14.8086 5.92976 14.6485 6 14.4815 6H13.8519C13.6849 6 13.5247 5.92976 13.4066 5.80474C13.2886 5.67971 13.2222 5.51014 13.2222 5.33333V4H11.963C11.796 4 11.6358 3.92976 11.5178 3.80474C11.3997 3.67971 11.3333 3.51014 11.3333 3.33333V2.66667C11.3333 2.48986 11.3997 2.32029 11.5178 2.19526C11.6358 2.07024 11.796 2 11.963 2H13.2222V0.666667Z"
                        fill="white"
                      />
                    </svg>
                    <span className="">Đăng</span>
                  </Link>
                )}

                {/* Admin Button */}
                {user.role === "admin" && (
                  <Link
                    to="/admin?tab=Danh+mục"
                    className="flex items-center gap-1 bg-red-400 text-white px-3 py-1 md:py-1 rounded-xl hover:bg-red-600 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
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

                <Link
                  to={`/profile?tab=Đang+đấu+giá&page=1&id=${user._id}`}
                  className="flex md:hidden items-center !text-[#f4955e] px-4 p-1 rounded-xl gap-1 hover:bg-[#8b4e2a1d] transition-colors"
                  title="Trang cá nhân"
                >
                  <span className="font-semibold">Trang cá nhân</span>
                </Link>

                {/* Profile Link (Desktop Only) */}
                <Link
                  to={`/profile?tab=Đang+đấu+giá&page=1&id=${user._id}`}
                  className="hidden md:flex items-center bg-[#f4955e] px-4 p-1 rounded-xl gap-1 hover:bg-orange-600 transition-colors"
                  title="Trang cá nhân"
                >
                  <span className="text-white font-semibold">{user.name}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
