import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterPopup from "./FilterPopup";

import ProductRow from "./ProductRow";
import api from "../../../api/axios";

import ProductContextMenu from "./ProductContextMenu";
import ProductDelete from "./ProductDeleteNoti";
import ProductEdit from "./ProductEdit";

const ProductList = () => {
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "";
  const categoryParam = searchParams.get("category") || "";
  const sellerParam = searchParams.get("seller") || "";
  const [searchTerm, setSearchTerm] = useState(q);

  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, user: null });
  const [editingProduct, seteditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [isAdding, setIsAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Đặt thời gian dừng đánh phím để search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== q) {
        setSearchParams((prev) => {
          if (searchTerm) {
            prev.set("q", searchTerm);
          } else {
            prev.delete("q");
          }
          return prev;
        });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, setSearchParams, q]);

  const queryString = useMemo(() => {
    const qr = new URLSearchParams();
    if (q) qr.set("q", q);
    if (statusParam) qr.set("status", statusParam);
    if (categoryParam) qr.set("categoryId", categoryParam); // Backend thường dùng category_id hoặc category
    if (sellerParam) qr.set("seller", sellerParam);
    qr.set("per_page", 999999999);
    return qr.toString();
  }, [q, statusParam, categoryParam, sellerParam]);

  // Load data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(queryString);
        const res = await api.get(`/api/product?${queryString}`);
        if (isMounted) {
          setproducts(res.data.products);
        }
      } catch (error) {
        console.error("Error loading products", error.message);
        if (isMounted)
          setError(error.response?.message || "Unable to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [queryString, editingProduct]);

  const handleApplyFilter = (filterData) => {
    setSearchParams((prev) => {
      if (filterData.q) prev.set("q", filterData.q);
      else prev.delete("q");
      if (filterData.status) prev.set("status", filterData.status);
      else prev.delete("status");
      if (filterData.category) prev.set("category", filterData.category);
      else prev.delete("category");
      if (filterData.seller) prev.set("seller", filterData.seller);
      else prev.delete("seller");

      return prev;
    });
    setSearchTerm(filterData.q);
    setShowFilter(false);
  };

  const handleRowContextMenu = (e, user) => {
    e.preventDefault();

    const isLeft = e.clientX < window?.innerWidth / 2 + 450;
    const num = isLeft ? 0 : -215;
    setMenu({ visible: true, x: e.clientX + num, y: e.clientY, user: user });
  };

  // Tắt context menu
  useEffect(() => {
    const closeMenu = () => setMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu);
    };
  }, []);

  const handleOpenEdit = () => {
    seteditingProduct(menu.user);
    setMenu({ ...menu, visible: false });
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      console.log(updatedData);
      const res = await api.patch(
        `/api/product/${updatedData._id}`,
        updatedData
      );

      toast.success("Cập nhật thành công!");
      seteditingProduct(null);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật!");
    }
  };

  const handleOpenDelete = () => {
    setDeletingProduct(menu.user);
    setMenu({ ...menu, visible: false });
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      setIsDeleting(true);
      const productId = deletingProduct._id || deletingProduct.id;

      await api.delete(`/api/product/${productId}`);

      setproducts(
        products.filter((p) => p._id !== productId && p.id !== productId)
      );

      toast.success("Đã xóa sản phẩm!");
      setDeletingProduct(null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa sản phẩm này.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOnView = () => {
    if (menu.user) {
      navigate(`/products/${menu.user._id || menu.user.id}`);

      setMenu({ ...menu, visible: false });
    }
  };

  return (
    <div className="p-6 w-full bg-gradient-to-r from-[#ffffff80] to-[#B9C2E780]">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="flex-1 min-h-screen">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách sản phẩm
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilter(true)}
                className={`flex items-center justify-center p-2 rounded-lg border transition-colors cursor-pointer ${
                  statusParam || categoryParam || sellerParam
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700" // Highlight nếu đang có filter
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
                title="Bộ lọc nâng cao"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
              <div className="relative w-full md:w-70">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên, email..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {/* <button
                onClick={() => setIsAdding(true)}
                className="select-none hover:bg-indigo-500 top-6 right-6 cursor-pointer text-3xl text-bold bg-indigo-400 px-2.5 rounded-lg text-white"
                title="Thêm sản phẩm mới"
              >
                +
              </button> */}
            </div>
          </div>

          {/* --- Table Content --- */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-500 py-10">{error}</div>
          )}

          {!loading && !error && (
            <div className="h-115 overflow-y-scroll rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full">
                {/* --- FULL HEADER --- */}
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-center">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ảnh
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người bán
                    </th>

                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {products.length > 0 ? (
                    products.map((p, index) => (
                      <ProductRow
                        key={p.id || p._id || index}
                        product={p}
                        onContextMenu={handleRowContextMenu} // Truyền hàm mở menu xuống Row
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy sản phẩm nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showFilter && (
        <FilterPopup
          initialFilters={{
            q,
            status: statusParam,
            category: categoryParam,
            seller: sellerParam,
          }}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
        />
      )}

      <ProductContextMenu
        key={`${menu.x}-${menu.y}`}
        visible={menu.visible}
        x={menu.x}
        y={menu.y}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onView={handleOnView}
      />

      {editingProduct && (
        <ProductEdit
          product={editingProduct}
          onSave={handleUpdateUser}
          onCancel={() => seteditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <ProductDelete
          product={deletingProduct}
          isDeleting={isDeleting}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
