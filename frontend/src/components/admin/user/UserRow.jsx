import React from "react";

const UserRow = ({ user, onContextMenu }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (user.is_deleted) {
    return (
      <tr className="border-b border-gray-300 w-full bg-gray-200 cursor-not-allowed whitespace-nowrap">
        <td className="px-4 py-4 font-medium">Người dùng đã bị xóa</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }

  return (
    <tr
      // Gọi hàm từ Cha truyền xuống
      onContextMenu={(e) => onContextMenu(e, user)}
      className="border-b border-gray-300 w-full transition-colors hover:bg-gray-50 cursor-context-menu"
    >
      <td
        className={`px-4 py-4 font-medium ${
          user?.username ? "" : "italic !text-gray-400 text-[14px]"
        }`}
      >
        {user.username || "Chưa cập nhật"}
      </td>
      <td
        className={`px-4 py-4 ${
          user?.name ? "" : "italic !text-gray-400 text-[14px]"
        }`}
      >
        {user.name || "Chưa cập nhật"}
      </td>
      <td
        className={`px-4 py-4 text-gray-600 ${
          user?.email ? "" : "italic !text-gray-400 text-[14px]"
        }`}
      >
        {user.email || "Chưa cập nhật"}
      </td>
      <td
        className={`px-4 py-4 ${
          user?.gender ? "" : "italic !text-gray-400 text-[14px]"
        }`}
      >
        {user.gender || "***"}
      </td>
      <td
        className={`px-4 py-4 ${
          user?.address ? "" : "italic !text-gray-400 text-[14px]"
        }`}
      >
        {user.address || "***"}
      </td>
      <td
        className={`px-4 py-4 text-gray-600 ${
          user?.dob ? "" : "italic !text-gray-400 text-[14px]"
        }`}
      >
        {formatDate(user?.dob) || "***"}
      </td>
    </tr>
  );
};

export default UserRow;
