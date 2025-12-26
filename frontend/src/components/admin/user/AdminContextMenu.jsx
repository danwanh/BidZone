import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const AdminContextMenu = ({ visible, x, y, onEdit, onDelete, onView }) => {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({ top: y, left: x });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Logic lật ngược menu nếu tràn màn hình
  useLayoutEffect(() => {
    if (visible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newTop = y;
      let newLeft = x;

      if (x + rect.width > window.innerWidth) newLeft = x - rect.width;
      if (y + rect.height > window.innerHeight) newTop = y - rect.height;

      setStyle({ top: newTop, left: newLeft });
    }
  }, [visible, x, y]);

  if (!mounted || typeof document === "undefined" || !visible) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[5] bg-white border border-gray-200 shadow-xl rounded-md py-1 min-w-[160px] zoom-in duration-100"
      style={{ top: `${style.top}px`, left: `${style.left}px` }}
      onContextMenu={(e) => e.preventDefault()} // Chặn menu chuột phải mặc định đè lên
    >
      <button
        onClick={onEdit}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      >
        Cập nhật
      </button>
      <button
        onClick={onDelete}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Xóa
      </button>
      <div className="border-t border-gray-100 my-1"></div>
      <button
        onClick={onView}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Xem trang cá nhân
      </button>
    </div>,
    document.body
  );
};

export default AdminContextMenu;
