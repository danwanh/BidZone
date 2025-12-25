import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddUser from "./AddUser";

import UserRow from "./UserRow";
import api from "../../api/axios";

import AdminContextMenu from "./AdminContextMenu";
import AdminEdit from "./AdminEdit";
import AdminDelete from "./AdminDeleteNoti";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(q);

  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, user: null });
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
    return qr.toString();
  }, [q]);

  // Load data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/users?${queryString}`);
        if (isMounted) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error("Error loading users", error);
        if (isMounted)
          setError(error.response?.message || "Unable to load users");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [queryString]);

  const handleRowContextMenu = (e, user) => {
    e.preventDefault();

    const isLeft = e.clientX < window?.innerWidth / 2 + 450;
    const num = isLeft ? 0 : -160;
    setMenu({ visible: true, x: e.clientX + num, y: e.clientY, user: user });
  };

  const handleAddUser = async (newData) => {
    try {
      console.log(newData);
      const res = await api.post("/api/users", newData);

      setUsers([res.data, ...users]);

      toast.success("Tạo người dùng thành công!");
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi tạo người dùng!");
    }
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
    setEditingUser(menu.user);
    setMenu({ ...menu, visible: false });
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await api.put(`/api/users/${updatedData.id}`, updatedData);

      setUsers(
        users.map((u) =>
          u._id === updatedData.id || u.id === updatedData.id
            ? { ...u, ...updatedData }
            : u
        )
      );

      toast.success("Cập nhật thành công!");
      setEditingUser(null);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật!");
    }
  };

  const handleOpenDelete = () => {
    setDeletingUser(menu.user);
    setMenu({ ...menu, visible: false });
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      const userId = deletingUser._id || deletingUser.id;

      await api.delete(`/api/users/${userId}`);

      setUsers(users.filter((u) => u._id !== userId && u.id !== userId));

      toast.success("Đã xóa người dùng!");
      setDeletingUser(null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa người dùng này.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOnView = () => {
    if (menu.user) {
      navigate(`/profile?id=${menu.user._id || menu.user.id}`);

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
              Danh sách người dùng
            </h2>

            <div className="flex gap-2">
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
              <button
                onClick={() => setIsAdding(true)}
                className="select-none hover:bg-indigo-500 top-6 right-6 cursor-pointer text-3xl text-bold bg-indigo-400 px-2.5 rounded-lg text-white"
                title="Thêm người dùng mới"
              >
                +
              </button>
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
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày sinh
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <UserRow
                        key={user.id || user._id || index}
                        user={user}
                        onContextMenu={handleRowContextMenu} // Truyền hàm mở menu xuống Row
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy người dùng nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AdminContextMenu
        key={`${menu.x}-${menu.y}`}
        visible={menu.visible}
        x={menu.x}
        y={menu.y}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onView={handleOnView}
      />

      {editingUser && (
        <AdminEdit
          user={editingUser}
          onSave={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <AdminDelete
          user={deletingUser}
          isDeleting={isDeleting}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}

      {isAdding && (
        <AddUser onSave={handleAddUser} onCancel={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default UserList;
