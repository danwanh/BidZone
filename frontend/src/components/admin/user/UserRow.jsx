import React from "react";

const UserRow = ({ user, onContextMenu }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <tr
      // Gọi hàm từ Cha truyền xuống
      onContextMenu={(e) => onContextMenu(e, user)}
      className="border-b border-gray-300 w-full transition-colors hover:bg-gray-50 cursor-context-menu"
    >
      <td className="px-4 py-4 font-medium">{user.username}</td>
      <td className="px-4 py-4">{user.name}</td>
      <td className="px-4 py-4 text-gray-600">{user.email}</td>
      <td className="px-4 py-4">{user.gender}</td>
      <td className="px-4 py-4">{user.address}</td>
      <td className="px-4 py-4 text-gray-600">{formatDate(user.dob)}</td>
    </tr>
  );
};

export default UserRow;
