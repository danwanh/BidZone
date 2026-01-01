import api from "../../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpgradeRow = ({ upgrade, updateList, status, onAccept, onReject }) => {
  return (
    <tr className="border-b border-gray-300 w-full transition-colors hover:bg-gray-50 cursor-context-menu">
      <td className="px-4 py-4 font-medium">
        {upgrade?.user_id?.username || "Không có tên tài khoản"}
      </td>

      <td className="px-4 py-4 font-medium text-center">
        {upgrade?.user_id?.name
          ? upgrade.user_id.name
          : "Không có tên người dùng"}
      </td>

      <td className="px-4 py-4 text-gray-600 text-center">
        {upgrade?.user_id?.email || "Không có email"}
      </td>

      {status === "" && (
        <td
          className={`px-4 py-4 text-gray-600 text-center ${
            upgrade.status === "accepted"
              ? "text-green-600"
              : upgrade.status === "rejected"
              ? "text-red-600"
              : "text-yellow-600"
          } `}
        >
          {upgrade?.status || "Không có trạng thái"}
        </td>
      )}

      <td className="py-4 ">
        <div className="flex gap-4 justify-center text-sm">
          {/* <button className="px-4 ring ring-blue-400 rounded-md py-2 text-blue-400 hover:-translate-y-0.5 cursor-pointer transition ease-in-out hover:shadow-md">
            Xem chi tiết
          </button> */}
          <button
            onClick={() => onAccept(upgrade)}
            disabled={status !== "pending"}
            className="px-4 bg-green-400 rounded-md py-2 text-white hover:-translate-y-0.5 cursor-pointer transition ease-in-out hover:shadow-md"
          >
            Duyệt
          </button>
          <button
            onClick={() => onReject(upgrade._id)}
            disabled={status !== "pending"}
            className="px-4 bg-red-400 rounded-md py-2 text-white hover:-translate-y-0.5 cursor-pointer transition ease-in-out hover:shadow-md"
          >
            Loại
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UpgradeRow;
