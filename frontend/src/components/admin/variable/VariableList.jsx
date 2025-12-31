import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Trash2, Edit, Plus, X, Save } from "lucide-react";
import { toast } from "react-toastify";

const VariableList = () => {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
  });

  // 1. Lấy danh sách biến
  const loadVariables = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/config`);

      // Nếu API trả về { success: true, data: [...] }
      setVariables(res.data.data || res.data);
    } catch (err) {
      console.error("Error loading configs", err);
      setError("Không thể tải danh sách cấu hình.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVariables();
  }, []);

  // 2. Mở Modal (Tạo mới hoặc Sửa)
  const openModal = (variable = null) => {
    if (variable) {
      setIsEditing(true);
      setFormData({
        key: variable.key,
        value: variable.value,
        description: variable.description || "",
      });
    } else {
      setIsEditing(false);
      setFormData({ key: "", value: "", description: "" });
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Lưu (Tạo hoặc Update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // API Update: PUT /api/config/:key
        await api.put(`/api/config/${formData.key}`, {
          value: formData.value,
          description: formData.description,
        });
      } else {
        // API Create: POST /api/config
        await api.post(`/api/config`, formData);
      }

      // Load lại danh sách và đóng modal
      loadVariables();
      setIsModalOpen(false);
    } catch (err) {
      toast(err.response?.data?.message || "Có lỗi xảy ra khi lưu.");
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (key) => {
    if (!window.confirm(`Bạn có chắc muốn xóa biến "${key}" không?`)) return;

    try {
      // API Delete: DELETE /api/config/:key
      await api.delete(`/api/config/${key}`);
      // Xóa item khỏi state để đỡ phải gọi lại API (tối ưu UI)
      setVariables(variables.filter((v) => v.key !== key));
    } catch (err) {
      toast.error("Không thể xóa biến này.");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-r from-[#ffffff80] to-[#B9C2E780] p-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Cấu Hình Hệ Thống
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <Plus size={20} /> Thêm Biến Mới
          </button>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="flex justify-center p-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Table List */}
        {!loading && !error && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-center">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key (Mã)
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value (Giá trị)
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm font-light text-center">
                  {variables.map((item) => (
                    <tr
                      key={item._id || item.key}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-blue-600">
                        {item.key}
                      </td>
                      <td
                        className="py-4 px-6 max-w-xs truncate"
                        title={item.value}
                      >
                        {String(item.value)}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {item.description || "---"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex item-center justify-center gap-3">
                          <button
                            onClick={() => openModal(item)}
                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.key)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {variables.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-slate-400"
                      >
                        Chưa có biến cấu hình nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditing ? "Chỉnh sửa biến" : "Tạo biến mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Input Key */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Key (Mã định danh)
                </label>
                <input
                  type="text"
                  required
                  disabled={isEditing} // Không cho sửa Key khi đang Edit
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      key: e.target.value.toUpperCase(),
                    })
                  } // Key nên viết hoa
                  placeholder="VD: PHI_SAN"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    isEditing ? "bg-slate-100 text-slate-500" : ""
                  }`}
                />
                {!isEditing && (
                  <p className="text-xs text-slate-400 mt-1">
                    Key nên viết hoa, không dấu, không khoảng trắng.
                  </p>
                )}
              </div>

              {/* Input Value */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Value (Giá trị)
                </label>
                <input
                  type="text"
                  required
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder="VD: 10"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Input Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả (Tùy chọn)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Biến này dùng để làm gì..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md flex justify-center items-center gap-2"
                >
                  <Save size={18} />
                  {isEditing ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableList;
