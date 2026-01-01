import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api/axios";
import UpgradeRow from "./UpgradeRow";
import { ToastContainer, toast } from "react-toastify";

const UpgradeList = () => {
  const [upgrades, setUpgrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(0);
  const updateList = () => {
    setAction(action + 1);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(q);
  const [status, setStatus] = useState("pending");

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("status", status);
    return p.toString();
  }, [q, status]);

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

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/upgrade?${queryString}`);

        if (isMounted) {
          setUpgrades(res.data);
        }
      } catch (error) {
        console.error("Error loading upgrades", error);
        if (isMounted)
          setError(error.response?.message || "Unable to load upgrades");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCategories();
  }, [queryString, , status, action]);

  const handleReject = async (upgradeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;

    try {
      await api.put(`/api/upgrade/${upgradeId}/review`, {
        user_id: upgradeId,
        status: "rejected",
      });
      toast.success("Đã từ chối request");
      updateList();
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      toast.error("Không thể từ chối request");
    }
  };

  const handleAccept = async (upgrade) => {
    if (!window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?")) return;

    try {
      await api.put(`/api/upgrade/${upgrade._id}/review`, {
        status: "accepted",
      });

      toast.success("Đã duyệt request thành công");
      updateList();
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      toast.error("Lỗi khi duyệt request");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-r from-[#ffffff80] to-[#B9C2E780] p-6 ">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <div className="">
        <div className="">
          {error && (
            <div className="text-red-500">
              Error loading Upgrades: {error.message}{" "}
            </div>
          )}

          <div className="flex-1 min-h-screen w-full">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Danh sách nâng cấp
                </h2>
                <div className="flex gap-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Chưa kiểm duyệt</option>
                    <option value="">Tất cả trạng thái</option>
                    <option value="rejected">Đã từ chối</option>
                    <option value="accepted">Đã duyệt</option>
                  </select>

                  <div className="relative w-fit">
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
                      className="block max-w-75 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                  </div>

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
                          Tên tài khoản
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        {status === "" && (
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        )}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {upgrades.length > 0 ? (
                        upgrades.map((upgrade, index) => (
                          <UpgradeRow
                            key={upgrade.id || upgrade._id || index}
                            upgrade={upgrade}
                            updateList={updateList}
                            status={status}
                            onAccept={handleAccept}
                            onReject={handleReject}
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
        </div>
      </div>
    </div>
  );
};

export default UpgradeList;